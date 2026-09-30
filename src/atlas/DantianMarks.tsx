import { useMemo, useRef, useState } from "react";
import { useMuteCovered } from "@/atlas/censusHit";
import { useCoarsePointer } from "@/atlas/PointTooltip";
import {
  CENTERS,
  dantianProbeRadiusPx,
  dantianRingRadiusPx,
  placeDantianSeal,
  type EnergyCenter,
} from "@/atlas/centers";
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
  zoom,
  coarse,
  name,
  quiet,
  onSelect,
}: {
  center: EnergyCenter;
  pos: Point2D;
  selected: boolean;
  spots: Point2D[];
  k: number;
  zoom: number;
  coarse: boolean;
  name: string;
  quiet: boolean;
  onSelect: (id: EnergyCenter["id"]) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [hot, setHot] = useState(false);
  const ringPx = dantianRingRadiusPx(zoom);
  const placed = placeDantianSeal(pos, spots, k, dantianProbeRadiusPx(zoom));
  const draw = placed.draw;
  const r = ringPx * k;
  const near = nearest(draw, spots);
  const shrink = near != null && near.d < 20 * k;
  const label = labelPlace(draw, r, k, shrink, spots, center.zh, center.pinyin);
  const showLabel = zoom > 1.6 || hot || focused || selected;
  const activate = () => onSelect(center.id);
  return (
    <>
    <g
      data-atlas-hit=""
      data-testid={`dantian-${center.id}`}
      data-hit-key={center.id}
      transform={`translate(${draw.x} ${draw.y})`}
      className={selected ? "center-live" : undefined}
      role={quiet ? undefined : "button"}
      tabIndex={quiet ? undefined : 0}
      aria-label={quiet ? undefined : `${center.zh} ${center.pinyin}, ${name}`}
      aria-pressed={quiet ? undefined : selected}
      style={{ cursor: "pointer", outline: "none" }}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => setHot(false)}
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
      {placed.shifted ? (
        <line
          x1={pos.x - draw.x}
          y1={pos.y - draw.y}
          x2={0}
          y2={0}
          stroke="var(--color-ink-2)"
          strokeWidth={k}
          strokeDasharray={`${k} ${2.4 * k}`}
          strokeLinecap="round"
          pointerEvents="none"
        />
      ) : null}
      <circle
        r={r}
        fill="var(--color-paper)"
        fillOpacity={0.92}
        stroke="var(--color-ink-2)"
        strokeWidth={k}
      />
      <circle r={Math.max(r, (coarse ? 22 : 12) * k)} fill="transparent" pointerEvents="none" />
      <text aria-hidden="true" fontSize={0} fill="transparent">
        {center.zh}
      </text>
      <circle r={1.5 * k} fill="var(--color-ink-2)" pointerEvents="none" />
      {focused ? (
        <circle r={r + 3 * k} fill="none" stroke={CINNABAR} strokeWidth={2 * k} pointerEvents="none" />
      ) : null}
    </g>
    {showLabel ? (
      <g transform={`translate(${draw.x} ${draw.y})`} pointerEvents="none" aria-hidden="true">
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
        opacity={showLabel ? 1 : 0}
        aria-hidden
        pointerEvents="none"
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
        opacity={showLabel ? 1 : 0}
        aria-hidden
        pointerEvents="none"
      >
        {center.pinyin}
      </text>
      </g>
      ) : null}
    </>
  );
}

export function DantianMarks() {
  const view = useViewerStore((s) => s.atlasView);
  const region = useViewerStore((s) => s.atlasRegion);
  const locale = useViewerStore((s) => s.locale);
  const visible = useViewerStore((s) => s.visibleLayers.centers);
  const selected = useViewerStore((s) => s.selectedCenterId);
  const focus = useViewerStore((s) => s.focusCenter);
  const zoom = useViewerStore((s) => s.atlasZoom);
  const k = useUnitsPerPx();
  const coarse = useCoarsePointer();
  const rootRef = useRef<SVGGElement>(null);
  const muted = useMuteCovered(rootRef);
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
    <g ref={rootRef} role="group" aria-label="Dantian">
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
          pointerEvents="none"
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
          zoom={zoom}
          coarse={coarse}
          name={locale === "en" ? center.en : center.es}
          quiet={muted.has(center.id)}
          onSelect={focus}
        />
      ))}
    </g>
  );
}
