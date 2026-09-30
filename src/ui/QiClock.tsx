import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { loadMeridians } from "@/data";
import { meridianAtHour } from "@/atlas/qiTime";
import { t } from "@/i18n";
import { mediaMatches, prefersReducedMotion, watchMedia } from "@/lib/quality";
import { meridianPigment } from "@/lib/tokens";
import { useViewerStore } from "@/state/viewerStore";
import type { Meridian } from "@/types";
import { IconPause, IconPlay } from "./icons";
import "./clock.css";

const NARROW = "(max-width: 1023px)";
const SPEEDS = [0.5, 1, 2, 4] as const;
const CX = 66;
const CY = 66;
const R_RING = 64;
const R_OUT = 63;
const R_IN = 24;
const R_LABEL = 45;

/** Degrees clockwise from 12 o'clock. One organ-clock hour is 15°. */
export function sectorAngle(hour: number): number {
  return hour * 15;
}

function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(() => mediaMatches(NARROW));
  useEffect(() => watchMedia(NARROW, setNarrow), []);
  return narrow;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function hasClock(m: Meridian): m is Meridian & { clockHour: number } {
  return m.clockHour !== undefined;
}

export function sectorPaint(hour: number, meridians: Meridian[]) {
  const activeId = meridianAtHour(hour, meridians);
  return meridians
    .filter(hasClock)
    .slice()
    .sort((a, b) => a.clockHour - b.clockHour)
    .map((meridian) => {
      const on = meridian.id === activeId;
      return {
        meridian,
        on,
        fill: on ? meridianPigment(meridian) : "none",
        fillOpacity: on ? 0.85 : undefined,
      };
    });
}

function polar(radius: number, degrees: number): [number, number] {
  const rad = ((degrees - 90) * Math.PI) / 180;
  return [CX + radius * Math.cos(rad), CY + radius * Math.sin(rad)];
}

function fmt(n: number): string {
  return n.toFixed(2);
}

function sectorPath(start: number): string {
  const a0 = sectorAngle(start);
  const a1 = sectorAngle(start + 2);
  const [ox0, oy0] = polar(R_OUT, a0);
  const [ox1, oy1] = polar(R_OUT, a1);
  const [ix1, iy1] = polar(R_IN, a1);
  const [ix0, iy0] = polar(R_IN, a0);
  return `M ${fmt(ox0)} ${fmt(oy0)} A ${R_OUT} ${R_OUT} 0 0 1 ${fmt(ox1)} ${fmt(oy1)} L ${fmt(ix1)} ${fmt(iy1)} A ${R_IN} ${R_IN} 0 0 0 ${fmt(ix0)} ${fmt(iy0)} Z`;
}

function rangeLabel(start: number): string {
  return `${pad2(start)}:00\u2013${pad2((start + 2) % 24)}:00`;
}

function speedMark(value: (typeof SPEEDS)[number]): string {
  if (value === 0.5) return "\u00bd\u00d7";
  return `${value}\u00d7`;
}

const HOUR_TICKS = Array.from({ length: 24 }, (_, hour) => {
  const long = hour % 3 === 0;
  const inner = R_RING - (long ? 9 : 4);
  const [x1, y1] = polar(R_RING, sectorAngle(hour));
  const [x2, y2] = polar(inner, sectorAngle(hour));
  return { hour, x1, y1, x2, y2, long };
});

function DialGlyph({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} aria-hidden="true">
      {playing ? (
        <>
          <rect x="5" y="4" width="3.25" height="12" fill="currentColor" />
          <rect x="11.75" y="4" width="3.25" height="12" fill="currentColor" />
        </>
      ) : (
        <path d="M7.25 4.25 15 10l-7.75 5.75V4.25Z" fill="currentColor" />
      )}
    </svg>
  );
}

function OrganDial() {
  const meridians = useMemo(() => loadMeridians(), []);
  const locale = useViewerStore((s) => s.locale);
  const playing = useViewerStore((s) => s.qiPlaying);
  const setPlaying = useViewerStore((s) => s.setQiPlaying);
  const speed = useViewerStore((s) => s.qiSpeed);
  const setSpeed = useViewerStore((s) => s.setQiSpeed);
  const hour = useViewerStore((s) => s.clockHour);
  const setHour = useViewerStore((s) => s.setClockHour);
  const sectors = useMemo(() => sectorPaint(hour, meridians), [hour, meridians]);
  const reduced = prefersReducedMotion();
  const activeId = meridianAtHour(hour, meridians);
  const current = meridians.find((m) => m.id === activeId);
  const start = current?.clockHour ?? hour;
  const name = current ? (locale === "en" ? current.names.en : current.names.es) : "";
  const needle = sectorAngle(hour);
  const [nx1, ny1] = polar(R_IN + 2, needle);
  const [nx2, ny2] = polar(R_OUT - 1.5, needle);
  // QiFlow.useOrganClock advances clockHour while qiPlaying; speed scales that tick.
  const onPlay = () => setPlaying(!playing);

  const onDialKey = (e: KeyboardEvent<SVGSVGElement>) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (dir === 0 || sectors.length === 0) return;
    e.preventDefault();
    e.stopPropagation();
    const idx = Math.max(0, sectors.findIndex((sector) => sector.meridian.id === activeId));
    const next = sectors[(idx + dir + sectors.length) % sectors.length];
    if (!next) return;
    setHour(next.meridian.clockHour);
    document.getElementById(`clock-sector-${next.meridian.id}`)?.focus();
  };

  return (
    <div className="qi-face">
      <div className="qi-dial">
        <svg
          viewBox="0 0 132 132"
          data-testid="clock-dial"
          role="radiogroup"
          aria-label={t(locale, "clock")}
          onKeyDown={onDialKey}
        >
          {sectors.map((sector) => {
            const m = sector.meridian;
            const sectorName = `${m.code} ${pad2(m.clockHour)}\u2013${pad2((m.clockHour + 2) % 24)} ${
              locale === "en" ? m.names.en : m.names.es
            }`;
            return (
              <path
                key={m.id}
                id={`clock-sector-${m.id}`}
                className="qi-sector"
                role="radio"
                aria-checked={sector.on}
                aria-label={sectorName}
                tabIndex={sector.on ? 0 : -1}
                data-sector={m.id}
                data-on={sector.on ? "true" : "false"}
                d={sectorPath(m.clockHour)}
                fill={sector.fill}
                fillOpacity={sector.fillOpacity}
                stroke="none"
                pointerEvents="visibleFill"
                onClick={() => setHour(m.clockHour)}
              />
            );
          })}
          <circle className="qi-ring" cx={CX} cy={CY} r={R_RING} />
          {HOUR_TICKS.map((tick) => (
            <line
              key={tick.hour}
              className={tick.long ? "qi-tick qi-tick-long" : "qi-tick"}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
            />
          ))}
          <line className="qi-needle" x1={nx1} y1={ny1} x2={nx2} y2={ny2} />
          {sectors.map((sector) => {
            const m = sector.meridian;
            const [lx, ly] = polar(R_LABEL, sectorAngle(m.clockHour + 1));
            return (
              <text
                key={`label-${m.id}`}
                className={sector.on ? "code is-on" : "code"}
                x={lx}
                y={ly}
                fontFamily='"Outfit", sans-serif'
                fontSize={11}
                fontWeight={600}
                textAnchor="middle"
                dominantBaseline="central"
                pointerEvents="none"
                aria-hidden="true"
              >
                {m.code}
              </text>
            );
          })}
        </svg>
        <button
          type="button"
          className="qi-play"
          data-testid="clock-play"
          aria-pressed={playing}
          aria-label={playing ? t(locale, "pause") : t(locale, "play")}
          title={reduced ? t(locale, "reducedMotion") : undefined}
          disabled={reduced}
          onClick={onPlay}
        >
          <DialGlyph playing={playing} />
        </button>
      </div>
      <p className="qi-caption">
        {rangeLabel(start)}
        {current ? ` \u00b7 ${current.code} ${name}` : ""}
      </p>
      <div className="qi-speeds" role="group" aria-label={t(locale, "speed")}>
        {SPEEDS.map((value) => (
          <button key={value} type="button" aria-pressed={speed === value} onClick={() => setSpeed(value)}>
            {speedMark(value)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function QiClock({ variant = "dial" }: { variant?: "dial" | "chip" }) {
  const narrow = useNarrow();
  const chip = variant === "chip" || narrow;
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const meridians = useMemo(() => loadMeridians(), []);
  const locale = useViewerStore((s) => s.locale);
  const playing = useViewerStore((s) => s.qiPlaying);
  const setPlaying = useViewerStore((s) => s.setQiPlaying);
  const hour = useViewerStore((s) => s.clockHour);
  const activeId = meridianAtHour(hour, meridians);
  const current = meridians.find((m) => m.id === activeId);
  const start = current?.clockHour ?? hour;

  useEffect(() => {
    if (prefersReducedMotion() && playing) setPlaying(false);
  }, [playing, setPlaying]);

  useEffect(() => {
    if (!chip) setOpen(false);
  }, [chip]);

  useEffect(() => {
    if (!chip || !open) return;
    const prev = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const checked = popRef.current?.querySelector<SVGElement>('[role="radio"][aria-checked="true"]');
    checked?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (document.getElementById("legal-gate")) return;
      if (document.getElementById("command-palette")) return;
      if (document.querySelector("[data-testid='help-dialog']")) return;
      if (document.querySelector(".rail-overlay")) return;
      const s = useViewerStore.getState();
      if (s.paletteOpen || s.helpOpen || s.selectedPointId || s.selectedCenterId) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      const root = wrapRef.current;
      if (!root || !(e.target instanceof Node) || root.contains(e.target)) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onPointer);
      prev?.focus();
    };
  }, [chip, open]);

  if (chip) {
    const label = `${t(locale, "clock")} ${pad2(start)}${activeId ? ` ${activeId}` : ""}`;
    return (
      <div className="qi-clock qi-chip-wrap" data-testid="plate-clock" ref={wrapRef}>
        <button
          type="button"
          className="qi-chip"
          aria-expanded={open}
          aria-controls="qi-clock-pop"
          aria-label={label}
          onClick={() => setOpen((value) => !value)}
        >
          {playing ? <IconPause /> : <IconPlay />}
          <span className="code">{pad2(start)}</span>
          {activeId ? <span className="code">{activeId}</span> : null}
        </button>
        {open ? (
          <div id="qi-clock-pop" className="qi-pop" ref={popRef} role="dialog" aria-label={t(locale, "clock")}>
            <OrganDial />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="qi-clock" data-testid="plate-clock">
      <OrganDial />
    </div>
  );
}
