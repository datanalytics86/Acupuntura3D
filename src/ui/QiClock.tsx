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
  const active = useViewerStore((s) => s.activeMeridianId);

  const blocks = meridians.filter((m) => m.clockHour !== undefined);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center px-3 md:bottom-12">
      <div className="pointer-events-auto flex w-full max-w-4xl flex-col gap-2 rounded-lg border border-white/10 bg-black/55 p-2 backdrop-blur-md md:flex-row md:items-center">
        <button
          type="button"
          onClick={() => setPlaying(!playing)}
          className="rounded bg-amber-400/20 px-3 py-1 text-xs text-amber-100"
        >
          {playing ? t(locale, "pause") : t(locale, "play")}
        </button>
        <label className="flex items-center gap-2 text-[11px] text-zinc-400">
          {t(locale, "speed")}
          <input
            type="range"
            min={0.25}
            max={4}
            step={0.25}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
          <span className="w-8 text-zinc-200">{speed.toFixed(2)}</span>
        </label>
        <div className="flex flex-1 flex-wrap gap-1">
          {blocks.map((m) => {
            const start = m.clockHour ?? 0;
            const end = (start + 2) % 24;
            const on = start < end ? hour >= start && hour < end : hour >= start || hour < end;
            return (
              <button
                key={m.id}
                type="button"
                title={`${String(start).padStart(2, "0")}:00`}
                onClick={() => setHour(start)}
                className={`rounded px-1.5 py-0.5 text-[10px] ${
                  on || active === m.id ? "text-zinc-100" : "text-zinc-500"
                }`}
                style={{ background: on ? `${m.color}55` : "transparent" }}
              >
                {m.id}
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2 text-[11px] text-zinc-400">
          {t(locale, "clock")}
          <input
            type="range"
            min={0}
            max={23}
            step={1}
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
          />
          <span className="w-10 font-mono text-zinc-200">{String(hour).padStart(2, "0")}:00</span>
        </label>
      </div>
    </div>
  );
}
