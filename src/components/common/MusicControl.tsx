import React from 'react';
import { ExternalLink, Music, Volume2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AMBIENT_THEMES } from '../../utils/ambientThemes';
import type { AmbientPlayer } from '../../utils/ambientPlayer';
import { ACT_EVENT } from '../../utils/actMusicBus';

const KEY = 'd2r_music';
const STEAM_OST = 'https://store.steampowered.com/app/4523200';

interface Saved { act: number; vol: number; auto: boolean }

const loadSaved = (): Saved => {
  try {
    const j = JSON.parse(window.localStorage.getItem(KEY) ?? 'null') as Partial<Saved> | null;
    const act = Number(j?.act); const vol = Number(j?.vol);
    return { act: act >= 1 && act <= 5 ? act : 1, vol: vol >= 0 && vol <= 1 ? vol : 0.35, auto: j?.auto === true };
  } catch { return { act: 1, vol: 0.35, auto: false }; }
};

/** 氛圍音樂開關與選單：預設關閉、不自動播放；按下開關才載入合成引擎。記住上次選的章節與音量。 */
export const MusicControl: React.FC = () => {
  const { t } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const [on, setOn] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [{ act, vol, auto }, setSaved] = React.useState<Saved>(loadSaved);
  const live = React.useRef({ act, vol, auto, on });
  live.current = { act, vol, auto, on };
  const playerRef = React.useRef<AmbientPlayer | null>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);

  const save = (next: Saved) => {
    setSaved(next);
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* 無痕或封鎖時略過 */ }
  };

  const play = async (nextAct: number, nextVol: number) => {
    try {
      if (!playerRef.current) playerRef.current = (await import('../../utils/ambientPlayer')).createAmbientPlayer();
      await playerRef.current.start(nextAct, nextVol);
      setError(false); setOn(true);
    } catch { setError(true); setOn(false); }
  };

  const stop = () => { playerRef.current?.stop(); playerRef.current = null; setOn(false); };

  // 場景／任務頁選了某一章：開了「依章節自動切換」而且音樂正在播，就跟著換
  React.useEffect(() => {
    const onAct = (e: Event) => {
      const a = Number((e as CustomEvent<number>).detail);
      const cur = live.current;
      if (!cur.auto || !cur.on || !(a >= 1 && a <= 5) || a === cur.act) return;
      save({ act: a, vol: cur.vol, auto: cur.auto });
      void play(a, cur.vol);
    };
    window.addEventListener(ACT_EVENT, onAct);
    return () => window.removeEventListener(ACT_EVENT, onAct);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 離開頁面時停止；分頁被切到背景時暫停，回來再繼續
  React.useEffect(() => {
    const onVis = () => { if (document.hidden) playerRef.current?.suspend(); else playerRef.current?.resume(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { document.removeEventListener('visibilitychange', onVis); playerRef.current?.stop(); };
  }, []);

  // 點面板外面或按 Esc 收起面板
  React.useEffect(() => {
    if (!open) return undefined;
    const onDown = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t('音樂', 'Music')}
        title={t('背景音樂', 'Background music')}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-850 border text-xs transition-all duration-200 ${on ? 'border-d2-unique/60 text-d2-unique' : 'border-sanctuary-750 text-sanctuary-300 hover:text-sanctuary-100'}`}
      >
        <Music className={`w-3.5 h-3.5 ${on ? 'text-d2-unique' : 'text-sanctuary-400'}`} />
        <span className="hidden sm:inline">{t('音樂', 'Music')}</span>
      </button>
      {open && (
        <div role="dialog" aria-label={t('背景音樂設定', 'Background music settings')} className="absolute right-0 top-full mt-2 w-72 z-50 rounded-xl border border-sanctuary-700 bg-sanctuary-950 shadow-2xl p-3 space-y-3 text-xs text-sanctuary-200">
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold text-sanctuary-100">{t('背景音樂', 'Background music')}</span>
            <button
              type="button"
              role="switch"
              aria-checked={on}
              aria-label={t('播放背景音樂', 'Play background music')}
              onClick={() => (on ? stop() : void play(act, vol))}
              className={`relative w-10 h-5 rounded-full border transition-colors ${on ? 'bg-d2-unique/70 border-d2-unique' : 'bg-sanctuary-800 border-sanctuary-600'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-sanctuary-50 transition-all ${on ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
          <div role="radiogroup" aria-label={t('選擇章節', 'Choose act')} className="space-y-1">
            {AMBIENT_THEMES.map((th) => (
              <button
                key={th.act}
                type="button"
                role="radio"
                aria-checked={act === th.act}
                onClick={() => { save({ act: th.act, vol, auto }); if (on) void play(th.act, vol); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg border transition-colors ${act === th.act ? 'border-d2-unique/60 bg-d2-unique/10 text-d2-unique' : 'border-sanctuary-800 hover:border-sanctuary-600 text-sanctuary-300'}`}
              >
                {t(th.zh, th.en)}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-sanctuary-400 shrink-0" />
            <input
              type="range" min={0} max={1} step={0.05} value={vol}
              aria-label={t('音量', 'Volume')}
              onChange={(e) => { const v = Number(e.target.value); save({ act, vol: v, auto }); playerRef.current?.setVolume(v); }}
              className="w-full accent-amber-500"
            />
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={auto} onChange={(e) => save({ act, vol, auto: e.target.checked })} className="accent-amber-500" />
            <span>{t('瀏覽場景或任務時，自動切換到該章的音樂', 'Follow the act you browse in Areas and Quests')}</span>
          </label>
          {error && <p role="alert" className="text-red-400">{t('這個瀏覽器無法播放音樂。', 'This browser cannot play audio.')}</p>}
          <p className="text-[11px] leading-relaxed text-sanctuary-400">
            {t('氛圍音樂由程式即時合成，是原創的，不是遊戲原聲帶；預設關閉，不會自動播放。', 'Ambient music is synthesized live in your browser. It is original, not the game soundtrack. Off by default, never autoplays.')}
          </p>
          <a href={STEAM_OST} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-d2-unique hover:underline">
            <ExternalLink className="w-3 h-3" />
            {t('官方原聲帶（Steam，付費）', 'Official soundtrack (Steam, paid)')}
          </a>
        </div>
      )}
    </div>
  );
};
