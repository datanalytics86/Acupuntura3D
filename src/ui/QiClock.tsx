import { useMemo } from "react";
import { loadMeridians } from "@/data";
import { t } from "@/i18n";
import { prefersReducedMotion } from "@/lib/quality";
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
    <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center px-3">
      <div className="pointer-events-auto flex w-full max-w-5xl flex-nowrap items-center gap-3 overflow-x-auto border-t border-brass-line px-3 py-1">
        <button
          type="button"
          aria-pressed={playing}
          disabled={prefersReducedMotion()}
          title={prefersReducedMotion() ? (locale === "en" ? "Reduced motion is on" : "Movimiento reducido activo") : undefined}
          onClick={() => setPlaying(!playing)}
          className="stamp-btn shrink-0 disabled:opacity-50"
          style={{ minWidth: 44, minHeight: 44 }}
        >
          {playing ? t(locale, "pause") : t(locale, "play")}
        </button>
        <div className="flex shrink-0 items-center">
          {blocks.map((m) => {
            const start = m.clockHour ?? 0;
            const end = (start + 2) % 24;
            const on = start < end ? hour >= start && hour < end : hour >= start || hour < end;
            return (
              <button
                key={m.id}
                type="button"
                title={`${m.id} ${String(start).padStart(2, "0")}:00–${String(end).padStart(2, "0")}:00`}
                onClick={() => setHour(start)}
                className={`clock-mark shrink-0 ${on ? "is-on" : ""}`}
                style={{ minWidth: 44, minHeight: 44 }}
              >
                {m.id}
              </button>
            );
          })}
        </div>
        <label className="ml-auto flex shrink-0 items-center gap-2 text-[11px] tracking-[0.12em] text-ink uppercase">
          {t(locale, "clock")}
          <input
            type="range"
            min={0}
            max={23}
            step={1}
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className="w-24"
          />
          <span className="w-12 font-sans text-ink normal-case tabular-nums">{String(hour).padStart(2, "0")}:00</span>
        </label>
        <label className="flex shrink-0 items-center gap-2 text-[11px] tracking-[0.12em] text-ink uppercase">
          {t(locale, "speed")}
          <input
            type="range"
            min={0.25}
            max={4}
            step={0.25}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-16"
          />
        </label>
      </div>
    </div>
  );
}
