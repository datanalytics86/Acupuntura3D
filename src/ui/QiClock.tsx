import { useMemo } from "react";
import { loadMeridians } from "@/data";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

export function QiClock() {
  const meridians = useMemo(() => loadMeridians(), []);
  const locale = useViewerStore((s) => s.locale);
  const playing = useViewerStore((s) => s.qiPlaying);
  const setPlaying = useViewerStore((s) => s.setQiPlaying);
  const speed = useViewerStore((s) => s.qiSpeed);
  const setSpeed = useViewerStore((s) => s.setQiSpeed);
  const hour = useViewerStore((s) => s.clockHour);
  const setHour = useViewerStore((s) => s.setClockHour);

  const blocks = meridians.filter((m) => m.clockHour !== undefined);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center px-3 md:bottom-11">
      <div className="pointer-events-auto flex w-full max-w-4xl flex-col gap-2 border border-brass-line bg-paper px-3 py-2 md:flex-row md:items-center">
        <button type="button" aria-pressed={playing} onClick={() => setPlaying(!playing)} className="stamp-btn">
          {playing ? t(locale, "pause") : t(locale, "play")}
        </button>
        <label className="flex items-center gap-2 text-[11px] tracking-[0.12em] text-ink uppercase">
          {t(locale, "speed")}
          <input
            type="range"
            min={0.25}
            max={4}
            step={0.25}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24"
          />
          <span className="w-8 font-mono normal-case">{speed.toFixed(2)}</span>
        </label>
        <div className="flex flex-1 flex-wrap justify-center gap-1">
          {blocks.map((m) => {
            const start = m.clockHour ?? 0;
            const end = (start + 2) % 24;
            const on = start < end ? hour >= start && hour < end : hour >= start || hour < end;
            return (
              <button
                key={m.id}
                type="button"
                title={`${String(start).padStart(2, "0")}:00–${String(end).padStart(2, "0")}:00`}
                onClick={() => setHour(start)}
                className={`clock-mark ${on ? "is-on" : ""}`}
              >
                <span className="block font-semibold">{m.id}</span>
                <span className="block text-[8px] opacity-70">{String(start).padStart(2, "0")}h</span>
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2 text-[11px] tracking-[0.12em] text-ink uppercase">
          {t(locale, "clock")}
          <input
            type="range"
            min={0}
            max={23}
            step={1}
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className="w-28"
          />
          <span className="w-12 font-mono text-brass normal-case">{String(hour).padStart(2, "0")}:00</span>
        </label>
      </div>
    </div>
  );
}
