/**
 * 五幕氛圍音樂的參數。音樂是程式即時合成的原創氛圍音（不是遊戲原聲帶，沒有任何錄音檔），
 * 每一幕用不同的音階、和弦、音色與環境雜訊營造場景感；播放引擎在 ambientPlayer.ts（按下開關才載入）。
 */
export type ActNumber = 1 | 2 | 3 | 4 | 5;

export interface AmbientTheme {
  act: ActNumber;
  zh: string;
  en: string;
  /** 根音（MIDI 音高） */
  root: number;
  /** 音階（距根音的半音數），用來隨機挑點綴音 */
  scale: readonly number[];
  /** 底層鋪墊的和弦（距根音的半音數），一次最多三個音，輪流換 */
  chords: readonly (readonly number[])[];
  padWave: OscillatorType;
  padCutoff: number;
  padGain: number;
  /** 點綴的單音（撥弦／鐘聲）：音色、八度偏移、間隔秒數範圍、衰減秒數、音量 */
  pluck: { wave: OscillatorType; octaves: readonly number[]; every: readonly [number, number]; decay: number; gain: number };
  /** 環境雜訊：風、蟲鳴、低頻轟鳴 */
  noise: { kind: 'wind' | 'insects' | 'rumble'; cutoff: number; gain: number };
}

export const AMBIENT_THEMES: readonly AmbientTheme[] = [
  {
    act: 1, zh: '第一章・荒野與營地', en: 'Act I · Wilderness',
    root: 50, scale: [0, 2, 3, 5, 7, 9, 10], chords: [[0, 7, 12], [-2, 5, 10], [3, 10, 15]],
    padWave: 'triangle', padCutoff: 900, padGain: 0.05,
    pluck: { wave: 'triangle', octaves: [12, 24], every: [4, 9], decay: 2.4, gain: 0.08 },
    noise: { kind: 'wind', cutoff: 600, gain: 0.02 },
  },
  {
    act: 2, zh: '第二章・沙漠', en: 'Act II · Desert',
    root: 50, scale: [0, 1, 4, 5, 7, 8, 10], chords: [[0, 7, 12], [0, 5, 12]],
    padWave: 'sawtooth', padCutoff: 650, padGain: 0.04,
    pluck: { wave: 'triangle', octaves: [12, 24], every: [3, 6], decay: 1.3, gain: 0.09 },
    noise: { kind: 'wind', cutoff: 1100, gain: 0.015 },
  },
  {
    act: 3, zh: '第三章・叢林', en: 'Act III · Jungle',
    root: 52, scale: [0, 3, 5, 7, 10], chords: [[0, 7, 12], [-2, 5, 10]],
    padWave: 'sine', padCutoff: 1200, padGain: 0.05,
    pluck: { wave: 'sine', octaves: [12, 24, 36], every: [1.2, 3], decay: 0.55, gain: 0.1 },
    noise: { kind: 'insects', cutoff: 4200, gain: 0.015 },
  },
  {
    act: 4, zh: '第四章・地獄要塞', en: 'Act IV · Pandemonium',
    root: 36, scale: [0, 1, 3, 5, 7, 8, 10], chords: [[0, 1, 7], [0, 6, 13]],
    padWave: 'sawtooth', padCutoff: 320, padGain: 0.05,
    pluck: { wave: 'sine', octaves: [12, 24], every: [6, 12], decay: 3.2, gain: 0.09 },
    noise: { kind: 'rumble', cutoff: 130, gain: 0.07 },
  },
  {
    act: 5, zh: '第五章・哈洛加斯', en: 'Act V · Harrogath',
    root: 57, scale: [0, 2, 3, 5, 7, 8, 10], chords: [[0, 7, 14], [-5, 2, 9]],
    padWave: 'triangle', padCutoff: 1500, padGain: 0.045,
    pluck: { wave: 'sine', octaves: [12, 24, 36], every: [3, 7], decay: 3.6, gain: 0.08 },
    noise: { kind: 'wind', cutoff: 1800, gain: 0.03 },
  },
];

export const noteFreq = (midi: number): number => 440 * Math.pow(2, (midi - 69) / 12);

export const themeOfAct = (act: number): AmbientTheme => AMBIENT_THEMES.find((t) => t.act === act) ?? AMBIENT_THEMES[0];
