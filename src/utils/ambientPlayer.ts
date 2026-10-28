import { noteFreq, themeOfAct, type AmbientTheme } from './ambientThemes';

/**
 * 氛圍音樂播放引擎（Web Audio 即時合成）。只在使用者按下音樂開關後才動態載入；沒有任何音訊檔、沒有外部請求。
 * 一次只播一幕：切換時舊的淡出、新的淡入。
 */
export interface AmbientPlayer {
  start: (act: number, volume: number) => Promise<void>;
  setVolume: (volume: number) => void;
  suspend: () => void;
  resume: () => void;
  stop: () => void;
}

const FADE = 1.6;

function makeReverb(ctx: AudioContext, seconds = 3.2): ConvolverNode {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4);
  }
  const conv = ctx.createConvolver();
  conv.buffer = buf;
  return conv;
}

function makeNoise(ctx: AudioContext): AudioBufferSourceNode {
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5 + w * 0.15; }
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  return src;
}

export function createAmbientPlayer(): AmbientPlayer {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let reverb: ConvolverNode | null = null;
  let scene: { stop: () => void } | null = null;

  const ensure = (): AudioContext => {
    if (ctx) return ctx;
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    reverb = makeReverb(ctx);
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    reverb.connect(wet); wet.connect(master); master.connect(ctx.destination);
    return ctx;
  };

  const buildScene = (c: AudioContext, theme: AmbientTheme): { stop: () => void } => {
    const out = c.createGain();
    out.gain.value = 0;
    out.connect(master as GainNode); out.connect(reverb as ConvolverNode);
    out.gain.setTargetAtTime(1, c.currentTime, FADE / 3);
    const nodes: (AudioScheduledSourceNode)[] = [];
    const timers: number[] = [];

    // 鋪墊：三個音、每個音兩條微微失諧的振盪器，濾波截止頻率慢慢起伏；每 18～26 秒滑到下一個和弦
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = theme.padCutoff; filter.Q.value = 0.7;
    const padGain = c.createGain(); padGain.gain.value = theme.padGain;
    filter.connect(padGain); padGain.connect(out);
    const lfo = c.createOscillator(); lfo.frequency.value = 0.07;
    const lfoDepth = c.createGain(); lfoDepth.gain.value = theme.padCutoff * 0.35;
    lfo.connect(lfoDepth); lfoDepth.connect(filter.frequency); lfo.start(); nodes.push(lfo);
    const voices: OscillatorNode[] = [];
    for (let v = 0; v < 3; v++) for (const detune of [-6, 6]) {
      const o = c.createOscillator(); o.type = theme.padWave; o.detune.value = detune;
      o.frequency.value = noteFreq(theme.root + theme.chords[0][v % theme.chords[0].length]);
      o.connect(filter); o.start(); voices.push(o); nodes.push(o);
    }
    let chordIdx = 0;
    const nextChord = () => {
      chordIdx = (chordIdx + 1) % theme.chords.length;
      const chord = theme.chords[chordIdx];
      voices.forEach((o, i) => o.frequency.setTargetAtTime(noteFreq(theme.root + chord[Math.floor(i / 2) % chord.length]), c.currentTime, 3));
      timers.push(window.setTimeout(nextChord, (18 + Math.random() * 8) * 1000));
    };
    timers.push(window.setTimeout(nextChord, 20000));

    // 環境雜訊
    const noise = makeNoise(c);
    const nf = c.createBiquadFilter();
    nf.type = theme.noise.kind === 'insects' ? 'highpass' : 'lowpass';
    nf.frequency.value = theme.noise.cutoff;
    const ng = c.createGain(); ng.gain.value = theme.noise.gain;
    noise.connect(nf); nf.connect(ng); ng.connect(out); noise.start(); nodes.push(noise);
    const nlfo = c.createOscillator();
    nlfo.frequency.value = theme.noise.kind === 'insects' ? 8.5 : 0.11;
    const nlfoDepth = c.createGain(); nlfoDepth.gain.value = theme.noise.gain * (theme.noise.kind === 'insects' ? 0.9 : 0.6);
    nlfo.connect(nlfoDepth); nlfoDepth.connect(ng.gain); nlfo.start(); nodes.push(nlfo);

    // 點綴音：從音階隨機挑音，撥弦／鐘聲式的快起慢落
    const pluck = () => {
      const p = theme.pluck;
      const midi = theme.root + theme.scale[Math.floor(Math.random() * theme.scale.length)] + p.octaves[Math.floor(Math.random() * p.octaves.length)];
      const o = c.createOscillator(); o.type = p.wave; o.frequency.value = noteFreq(midi);
      const g = c.createGain(); const t0 = c.currentTime;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(p.gain, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + p.decay);
      o.connect(g); g.connect(out); o.start(t0); o.stop(t0 + p.decay + 0.1);
      timers.push(window.setTimeout(pluck, (p.every[0] + Math.random() * (p.every[1] - p.every[0])) * 1000));
    };
    timers.push(window.setTimeout(pluck, 1500));

    return {
      stop: () => {
        timers.forEach((id) => window.clearTimeout(id));
        const t = c.currentTime;
        out.gain.cancelScheduledValues(t);
        out.gain.setTargetAtTime(0, t, FADE / 3);
        window.setTimeout(() => { nodes.forEach((n) => { try { n.stop(); } catch { /* 已停止 */ } }); out.disconnect(); }, FADE * 1000 + 300);
      },
    };
  };

  return {
    start: async (act, volume) => {
      const c = ensure();
      if (c.state === 'suspended') await c.resume();
      scene?.stop();
      scene = buildScene(c, themeOfAct(act));
      (master as GainNode).gain.setTargetAtTime(volume, c.currentTime, 0.2);
    },
    setVolume: (volume) => { if (ctx && master) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.1); },
    suspend: () => { void ctx?.suspend(); },
    resume: () => { void ctx?.resume(); },
    stop: () => {
      scene?.stop(); scene = null;
      const c = ctx;
      if (c) window.setTimeout(() => { void c.close(); }, FADE * 1000 + 400);
      ctx = null; master = null; reverb = null;
    },
  };
}
