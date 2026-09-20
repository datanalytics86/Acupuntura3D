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
    <div className="pointer-events-none absolute inset-x-0 bottom-11 z-20 flex justify-center px-3 md:bottom-12">
      <div className="panel pointer-events-auto flex w-full max-w-4xl flex-col gap-2 rounded-2xl p-2.5 md:flex-row md:items-center">
        <button
          type="button"
          aria-pressed={playing}
          onClick={() => setPlaying(!playing)}
          className="rounded-full bg-[#8A6A3B] px-4 py-1.5 text-xs tracking-wide text-[#F7F1E4]"
        >
          {playing ? t(locale, "pause") : t(locale, "play")}
        </button>
        <label className="flex items-center gap-2 text-[11px] text-[#2A2118]">
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
          <span className="w-8 font-mono text-[#2A2118]">{speed.toFixed(2)}</span>
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
                className={`min-w-9 rounded-full px-2 py-1 text-[10px] transition ${
                  on ? "text-[#2A2118]" : active === m.id ? "text-[#2A2118]" : "text-[#8A6A3B]"
                }`}
                style={{
                  background: on ? `${m.color}33` : "rgba(138,106,59,0.08)",
                  boxShadow: on ? `inset 0 0 0 1px ${m.color}` : undefined,
                }}
              >
                <span className="block font-semibold">{m.id}</span>
                <span className="block text-[8px] opacity-70">{String(start).padStart(2, "0")}h</span>
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2 text-[11px] text-[#2A2118]">
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
          <span className="w-12 font-mono text-[#8A6A3B]">{String(hour).padStart(2, "0")}:00</span>
        </label>
      </div>
    </div>
  );
}
