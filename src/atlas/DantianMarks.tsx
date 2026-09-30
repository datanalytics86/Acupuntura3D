import { useMemo, useState } from "react";
import { CENTERS, type EnergyCenter } from "@/atlas/centers";
import { instancesOnView } from "@/atlas/mapCoords";
import { loadAcupoints } from "@/data";
import { CINNABAR, INK } from "@/lib/colors";
import { inRegionFrame } from "@/atlas/regionFrames";
import { useUnitsPerPx } from "@/atlas/screen";
import { useViewerStore } from "@/state/viewerStore";
import type { Point2D } from "@/types";

function nearest(pos: Point2D, pts: Point2D[]): { d: number; p: Point2D } | null {
  let best: { d: number; p: Point2D } | null = null;
  for (const p of pts) {
    const d = Math.hypot(p.x - pos.x, p.y - pos.y);
    if (!best || d < best.d) best = { d, p };
  }
  return best;
}

/**
 * Move the seal off any point it would cover.
 * A block that sits above or below is cleared sideways, so the seal does not
 * climb the midline into the next point.
 */
function clearSeal(pos: Point2D, guard: number, pts: Point2D[]): Point2D {
  let x = pos.x;
  let y = pos.y;
  for (let n = 0; n < 8; n += 1) {
    let blocker: Point2D | null = null;
    let best = guard;
    for (const p of pts) {
      const d = Math.hypot(x - p.x, y - p.y);
      if (d < best) {
        best = d;
        blocker = p;
      }
    }
    if (!blocker) return { x, y };
    const dx = x - blocker.x;
    const dy = y - blocker.y;
    if (best < 1e-6 || Math.abs(dy) >= Math.abs(dx)) {
      const room = guard * guard - dy * dy;
      const horiz = room > 0 ? Math.sqrt(room) : guard;
      const sign = dx < -1e-6 ? -1 : 1;
      x = blocker.x + sign * horiz * 1.02;
    } else {
      const push = (guard - best) * 1.02;
      x += (dx / best) * push;
      y += (dy / best) * push;
    }
  }
  return { x, y };
}

function labelPlace(
  draw: Point2D,
  r: number,
  k: number,
  shrink: boolean,
  pts: Point2D[],
  zh: string,
  pinyin: string,
): { x: number; anchor: "start" | "end" } {
  const near = nearest(draw, pts);
  let dir: 1 | -1 = 1;
  if (shrink && near && draw.x < near.p.x - k) dir = -1;
  const wPx = Math.max(zh.length * 13, pinyin.length * 6.4);
  let gap = (shrink ? 10 : 6) * k;
  for (let n = 0; n < 8; n += 1) {
    const x = dir * (r + gap);
    const w = wPx * k;
    const left = dir > 0 ? draw.x + x : draw.x + x - w;
    const right = left + w;
    const top = draw.y - 14 * k;
    const bot = draw.y + 14 * k;
    const hit = pts.some(
      (p) => p.x > left - 6 * k && p.x < right + 6 * k && p.y > top - 6 * k && p.y < bot + 6 * k,
    );
    if (!hit) return { x, anchor: dir > 0 ? "start" : "end" };
    if (n === 3) dir = dir === 1 ? -1 : 1;
    gap += 14 * k;
  }
  const x = dir * (r + gap);
  return { x, anchor: dir > 0 ? "start" : "end" };
}

function Seal({
  center,
  pos,
  selected,
  spots,
  k,
  regionDetail,
  name,
  onSelect,
}: {
  center: EnergyCenter;
  pos: Point2D;
  selected: boolean;
  spots: Point2D[];
  k: number;
  regionDetail: boolean;
  name: string;
  onSelect: (id: EnergyCenter["id"]) => void;
}) {
  const [focused, setFocused] = useState(false);
  const near = nearest(pos, spots);
  const shrink = near != null && near.d < 20 * k;
  const diameter = (regionDetail ? 32 : 26) * (shrink ? 0.7 : 1);
  const r = (diameter / 2) * k;
  const hitR = r;
  const draw = clearSeal(pos, r + 6 * k + k, spots);
  const label = labelPlace(draw, r, k, shrink, spots, center.zh, center.pinyin);
  const ink = selected ? CINNABAR : INK;
  const activate = () => onSelect(center.id);
  return (
    <g
      data-atlas-hit=""
      transform={`translate(${draw.x} ${draw.y})`}
      className={selected ? "center-live" : undefined}
      role="button"
      tabIndex={0}
      aria-label={`${center.zh} ${center.pinyin}, ${name}`}
      aria-pressed={selected}
      style={{ cursor: "pointer", outline: "none" }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        activate();
      }}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        e.stopPropagation();
        activate();
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <circle r={hitR} fill="transparent" />
      <circle r={r} fill="var(--color-paper)" fillOpacity={0.92} stroke={ink} strokeWidth={(selected ? 1.5 : 1.1) * k} />
      <circle r={r * (15 / 22)} fill="none" stroke={ink} strokeWidth={0.7 * k} />
      <circle r={Math.max(1.5 * k, r * (2.4 / 22))} fill={ink} />
      {focused ? (
        <circle r={hitR + 3 * k} fill="none" stroke={CINNABAR} strokeWidth={2 * k} pointerEvents="none" />
      ) : null}
      <text
        className="hanzi"
        x={label.x}
        y={-2 * k}
        textAnchor={label.anchor}
        fill={INK}
        fontSize={13 * k}
        stroke="var(--color-paper)"
        strokeWidth={3 * k}
        paintOrder="stroke"
      >
        {center.zh}
      </text>
      <text
        className="pinyin"
        x={label.x}
        y={12 * k}
        textAnchor={label.anchor}
        fill={INK}
        fontSize={11 * k}
        stroke="var(--color-paper)"
        strokeWidth={3 * k}
        paintOrder="stroke"
      >
        {center.pinyin}
      </text>
    </g>
  );
}

export function DantianMarks() {
  const view = useViewerStore((s) => s.atlasView);
  const region = useViewerStore((s) => s.atlasRegion);
  const locale = useViewerStore((s) => s.locale);
  const visible = useViewerStore((s) => s.visibleLayers.centers);
  const selected = useViewerStore((s) => s.selectedCenterId);
  const focus = useViewerStore((s) => s.focusCenter);
  const k = useUnitsPerPx();
  const points = useMemo(() => loadAcupoints(), []);
  const spots = useMemo(() => {
    const out: Point2D[] = [];
    for (const point of points) {
      for (const inst of instancesOnView(point, view, true)) out.push(inst.position);
    }
    return out;
  }, [points, view]);
  if (!visible) return null;

  const placed = CENTERS.flatMap((center) => {
    const pos = view === "posterior" ? center.posterior : center.anterior;
    if (!pos || !inRegionFrame(region, view, pos)) return [];
    return [{ center, pos }];
  });
  if (placed.length === 0) return null;

  const axis =
    region === "body" && view === "anterior"
      ? placed.filter((p) => p.center.anterior).map((p) => p.pos)
      : [];

  return (
    <g aria-label="Dantian">
      {axis.length >= 2 ? (
        <line
          x1={400}
          y1={Math.min(...axis.map((p) => p.y))}
          x2={400}
          y2={Math.max(...axis.map((p) => p.y))}
          stroke={INK}
          strokeWidth={k}
          strokeDasharray={`${2 * k} ${6 * k}`}
          opacity={0.4}
        />
      ) : null}
      {placed.map(({ center, pos }) => (
        <Seal
          key={center.id}
          center={center}
          pos={pos}
          selected={selected === center.id}
          spots={spots}
          k={k}
          regionDetail={region !== "body"}
          name={locale === "en" ? center.en : center.es}
          onSelect={focus}
        />
      ))}
    </g>
  );
}
