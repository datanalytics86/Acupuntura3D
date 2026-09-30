import { memo, useMemo } from "react";
import { loadAcupoints, loadMeridians, STAR_CODES } from "@/data";
import { anchorsToPath, samplePath } from "@/atlas/catmullRom";
import { estimateLabelPx, layoutMarginCallouts, type CalloutInput } from "@/atlas/callouts";
import { CENTERS } from "@/atlas/centers";
import { MERIDIAN_ANCHORS_2D } from "@/atlas/meridianAnchors";
import { instancesOnView } from "@/atlas/mapCoords";
import { meridianAtHour } from "@/atlas/qiTime";
import { inRegionFrame, REGION_FOCUS } from "@/atlas/regionFrames";
import { unitsPerPx, usePlateBox, useUnitsPerPx, visibleRect } from "@/atlas/screen";
import { VIEW_H, VIEW_W } from "@/atlas/figure/landmarks";
import { meridianPigment } from "@/lib/tokens";
import { useViewerStore } from "@/state/viewerStore";
import type { Acupoint, AtlasRegion, AtlasView, Point2D } from "@/types";

const PAPER_CASING = "rgba(251,247,238,.6)";
const BODY_FIGURE = { l: 97.6, r: 702.4 };
const CODE_W = estimateLabelPx("LU", 11);
const STAR = new Set<string>(STAR_CODES);

const pathByKey = new Map<string, string>();

interface Block {
  l: number;
  t: number;
  r: number;
  b: number;
}

interface Spot {
  x: number;
  y: number;
  anchor: "start" | "end";
}

interface Scored {
  spot: Spot;
  box: Block;
  score: number;
}

type InkLabel = "none" | "one" | "side";

interface Ink {
  stroke: number;
  opacity: number;
  casing: number;
  tint: boolean;
  chevrons: boolean;
  label: InkLabel;
}

const REST: Ink = { stroke: 1.25, opacity: 0.7, casing: 0, tint: false, chevrons: false, label: "none" };
const HOUR: Ink = { stroke: 1.5, opacity: 0.9, casing: 3, tint: true, chevrons: false, label: "one" };
const HOVER: Ink = { stroke: 2, opacity: 1, casing: 4, tint: false, chevrons: true, label: "side" };
const ACTIVE: Ink = { stroke: 2.25, opacity: 1, casing: 5, tint: false, chevrons: true, label: "side" };
const DIM: Ink = { stroke: 1, opacity: 0.28, casing: 0, tint: false, chevrons: false, label: "none" };
const DETAIL: Ink = { stroke: 1.75, opacity: 0.95, casing: 3, tint: false, chevrons: true, label: "side" };

function inkFor(
  id: string,
  active: string | null,
  hovered: string | null,
  hourId: string | null,
  detail: boolean,
): Ink {
  if (active !== null) return active === id ? ACTIVE : DIM;
  if (hovered === id) return HOVER;
  if (detail) return DETAIL;
  if (hourId === id) return HOUR;
  return REST;
}

function sides(anchors: Point2D[], both: boolean): Point2D[][] {
  const out = [anchors];
  if (both && anchors.some((p) => Math.abs(p.x - 400) > 6)) {
    out.push(anchors.map((p) => ({ x: 800 - p.x, y: p.y })));
  }
  return out;
}

function memoPath(id: string, view: string, side: string, pts: Point2D[]): string {
  const key = `${id}|${view}|${side}`;
  const hit = pathByKey.get(key);
  if (hit) return hit;
  const d = anchorsToPath(pts);
  pathByKey.set(key, d);
  return d;
}

function casingColor(pigment: string, tint: boolean): string {
  if (!tint || !/^#[0-9A-Fa-f]{6}$/.test(pigment)) return PAPER_CASING;
  const r = Number.parseInt(pigment.slice(1, 3), 16);
  const g = Number.parseInt(pigment.slice(3, 5), 16);
  const b = Number.parseInt(pigment.slice(5, 7), 16);
  const mix = (paper: number, ink: number) => Math.round(paper * 0.88 + ink * 0.12);
  return `rgba(${mix(251, r)},${mix(247, g)},${mix(238, b)},.6)`;
}

function chevronD(k: number): string {
  const len = 5 * k;
  const wing = 2.2 * k;
  return `M ${-len} ${-wing} L 0 0 L ${-len} ${wing}`;
}

function overlaps(a: Block, b: Block): boolean {
  return a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
}

function labelBox(x: number, y: number, anchor: "start" | "end", k: number): Block {
  const w = CODE_W * k;
  const h = 11 * k;
  const pad = 3 * k;
  const l = anchor === "start" ? x : x - w;
  return { l: l - pad, t: y - h / 2 - pad, r: l + w + pad, b: y + h / 2 + pad };
}

function inPlate(p: Point2D, rect: Block): boolean {
  return p.x >= rect.l && p.x <= rect.r && p.y >= rect.t && p.y <= rect.b;
}

/** One spot beside the path. Nothing free among marks, margin callouts, and seals → null. */
function bestOnPath(pts: Point2D[], k: number, blocks: Block[], sourceSide: boolean, frame: Block | null): Scored | null {
  const samples = samplePath(pts, 20 * k);
  const last = samples[samples.length - 1];
  if (!last) return null;
  const span = last.s || 1;
  let best: Scored | null = null;
  for (const s of samples) {
    const rad = (s.angle * Math.PI) / 180;
    let nx = -Math.sin(rad);
    let ny = Math.cos(rad);
    const mid = s.x - 400;
    if (mid * nx < 0 || (Math.abs(mid) <= 6 && nx < 0)) {
      nx = -nx;
      ny = -ny;
    }
    const dirs = [
      { x: nx, y: ny, out: true },
      { x: -nx, y: -ny, out: false },
    ];
    for (const dir of dirs) {
      for (const gapPx of [14, 22, 32, 46]) {
        const x = s.x + dir.x * gapPx * k;
        const y = s.y + dir.y * gapPx * k;
        const anchor: "start" | "end" = dir.x >= 0 ? "start" : "end";
        const box = labelBox(x, y, anchor, k);
        if (blocks.some((b) => overlaps(box, b))) continue;
        const u = s.s / span;
        let score = (0.5 - Math.abs(u - 0.42)) * 30 - gapPx * 0.35;
        if (dir.out) score += 40;
        if (sourceSide) score += 6;
        if (frame && box.l >= frame.l && box.r <= frame.r && box.t >= frame.t && box.b <= frame.b) score += 25;
        if (!best || score > best.score) best = { spot: { x, y, anchor }, box, score };
      }
    }
  }
  return best;
}

function starsInRegion(region: AtlasRegion, view: AtlasView, both: boolean, points: readonly Acupoint[]): Set<string> {
  const ids = new Set<string>();
  if (region === "body") return ids;
  for (const point of points) {
    if (!STAR.has(point.code)) continue;
    for (const inst of instancesOnView(point, view, both)) {
      if (!inRegionFrame(region, view, inst.position)) continue;
      ids.add(point.meridianId);
      break;
    }
  }
  return ids;
}

function enterMeridian(id: string): void {
  const store = useViewerStore.getState();
  if (store.hoveredMeridianId !== id) store.setHoveredMeridian(id);
}

function leaveMeridian(id: string, next: EventTarget | null): void {
  if (next instanceof Element && next.closest(`[data-meridian="${id}"]`) !== null) return;
  const store = useViewerStore.getState();
  if (store.hoveredMeridianId === id) store.setHoveredMeridian(null);
}

interface Trace {
  key: string;
  id: string;
  code: string;
  d: string;
  pts: Point2D[];
  pigment: string;
  yang: boolean;
}

export const MeridianPaths = memo(function MeridianPaths() {
  const k = useUnitsPerPx();
  const box = usePlateBox();
  const view = useViewerStore((s) => s.atlasView);
  const region = useViewerStore((s) => s.atlasRegion);
  const visible = useViewerStore((s) => s.visibleLayers.meridians);
  const pointsOn = useViewerStore((s) => s.visibleLayers.points);
  const centersOn = useViewerStore((s) => s.visibleLayers.centers);
  const active = useViewerStore((s) => s.activeMeridianId);
  const hovered = useViewerStore((s) => s.hoveredMeridianId);
  const both = useViewerStore((s) => s.bothSides);
  const hour = useViewerStore((s) => s.clockHour);
  const zoom = useViewerStore((s) => s.atlasZoom);
  const pan = useViewerStore((s) => s.atlasPan);
  const labelsMode = useViewerStore((s) => s.labelsMode);
  const meridians = useMemo(() => loadMeridians(), []);
  const points = useMemo(() => loadAcupoints(), []);

  const traces = useMemo(() => {
    const out: Trace[] = [];
    for (const m of meridians) {
      const pack = m.anchors2d ?? MERIDIAN_ANCHORS_2D[m.id];
      const anchors = pack?.[view];
      if (!anchors || anchors.length < 2) continue;
      const mirrored = sides(anchors, both && m.laterality === "bilateral");
      mirrored.forEach((pts, i) => {
        const side = i === 0 ? "src" : "mir";
        out.push({
          key: `${m.id}|${view}|${side}`,
          id: m.id,
          code: m.code,
          d: memoPath(m.id, view, side, pts),
          pts,
          pigment: meridianPigment(m),
          yang: m.polaridad === "yang",
        });
      });
    }
    return out;
  }, [meridians, view, both]);

  const detail = useMemo(() => starsInRegion(region, view, both, points), [region, view, both, points]);
  const hourId = meridianAtHour(hour, meridians);
  const panX = Math.round(pan.x / 4) * 4;
  const panY = Math.round(pan.y / 4) * 4;
  const zoomKey = Math.round(zoom * 20) / 20;

  const chevrons = useMemo(() => {
    const out = new Map<string, ReturnType<typeof samplePath>>();
    const step = 120 * k;
    for (const t of traces) {
      if (!inkFor(t.id, active, hovered, hourId, detail.has(t.id)).chevrons) continue;
      out.set(t.key, samplePath(t.pts, step));
    }
    return out;
  }, [traces, k, active, hovered, hourId, detail]);

  const labels = useMemo(() => {
    const blocks: Block[] = [];
    const measured = box.w > 0 && box.h > 0;
    const z = zoomKey > 0 ? zoomKey : 1;
    const kLay = measured ? unitsPerPx(VIEW_W / z, VIEW_H / z, { w: box.w, h: box.h }) : k;
    const frame = measured ? visibleRect({ x: panX, y: panY }, kLay, { w: box.w, h: box.h }) : null;
    if (pointsOn) {
      for (const point of points) {
        for (const inst of instancesOnView(point, view, both)) {
          if (frame && !inPlate(inst.position, frame)) continue;
          if (!inRegionFrame(region, view, inst.position)) continue;
          const rad = 8 * k;
          blocks.push({
            l: inst.position.x - rad,
            t: inst.position.y - rad,
            r: inst.position.x + rad,
            b: inst.position.y + rad,
          });
        }
      }
    }
    const allowColumns =
      labelsMode === "all" || (labelsMode !== "none" && (region !== "body" || zoom <= 1.6));
    if (pointsOn && allowColumns && frame) {
      const focus = REGION_FOCUS[region];
      const figure = focus ? { l: focus.cx - focus.rx, r: focus.cx + focus.rx } : BODY_FIGURE;
      const byId = new Map<string, CalloutInput>();
      for (const point of points) {
        for (const inst of instancesOnView(point, view, both)) {
          if (!inPlate(inst.position, frame) || !inRegionFrame(region, view, inst.position)) continue;
          const text = `${point.code} ${point.names.zh}`;
          const row = byId.get(point.id) ?? {
            key: point.id,
            text,
            anchors: [],
            widthPx: estimateLabelPx(text, 12),
          };
          row.anchors.push(inst.position);
          byId.set(point.id, row);
        }
      }
      const margin = byId.size === 0 ? null : layoutMarginCallouts([...byId.values()], { view: frame, figure, k: kLay });
      if (margin) {
        const pad = 3 * k;
        for (const c of margin) {
          blocks.push({ l: c.box.l - pad, t: c.box.t - pad, r: c.box.r + pad, b: c.box.b + pad });
        }
      }
    }
    if (centersOn) {
      for (const center of CENTERS) {
        const pos = view === "posterior" ? center.posterior : center.anterior;
        if (!pos || !inRegionFrame(region, view, pos)) continue;
        const seal = ((region === "body" ? 26 : 32) / 2) * k;
        const labelW = Math.max(center.zh.length * 13, center.pinyin.length * 6.4) * k;
        const reach = seal + 12 * k + labelW;
        blocks.push({ l: pos.x - reach, t: pos.y - 20 * k, r: pos.x + reach, b: pos.y + 20 * k });
      }
    }

    const out = new Map<string, Spot>();
    const wantOne: string[] = [];
    const wantSide: Trace[] = [];
    const seenOne = new Set<string>();
    for (const t of traces) {
      const mode = inkFor(t.id, active, hovered, hourId, detail.has(t.id)).label;
      if (mode === "one") {
        if (!seenOne.has(t.id)) {
          seenOne.add(t.id);
          wantOne.push(t.id);
        }
      } else if (mode === "side") wantSide.push(t);
    }
    for (const id of wantOne) {
      let pick: { key: string; scored: Scored } | null = null;
      for (const t of traces) {
        if (t.id !== id) continue;
        const scored = bestOnPath(t.pts, k, blocks, t.key.endsWith("|src"), frame);
        if (scored && (!pick || scored.score > pick.scored.score)) pick = { key: t.key, scored };
      }
      if (!pick) continue;
      out.set(pick.key, pick.scored.spot);
      blocks.push(pick.scored.box);
    }
    for (const t of wantSide) {
      const scored = bestOnPath(t.pts, k, blocks, t.key.endsWith("|src"), frame);
      if (!scored) continue;
      out.set(t.key, scored.spot);
      blocks.push(scored.box);
    }
    return out;
  }, [
    traces,
    k,
    box.w,
    box.h,
    view,
    region,
    both,
    points,
    pointsOn,
    centersOn,
    labelsMode,
    zoom,
    zoomKey,
    panX,
    panY,
    active,
    hovered,
    hourId,
    detail,
  ]);

  if (!visible) return null;

  const glyph = chevronD(k);
  return (
    <g mask="url(#region-focus)" pointerEvents="none">
      {traces.map((t) => {
        const ink = inkFor(t.id, active, hovered, hourId, detail.has(t.id));
        const place = labels.get(t.key) ?? null;
        const samples = chevrons.get(t.key) ?? [];
        const dash = t.yang ? `${7 * k} ${2.5 * k}` : undefined;
        return (
          <g key={t.key} opacity={ink.opacity} data-meridian={t.id} data-hour={hourId === t.id ? "on" : "off"}>
            {ink.casing > 0 ? (
              <path
                d={t.d}
                fill="none"
                stroke={casingColor(t.pigment, ink.tint)}
                strokeWidth={ink.casing * k}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={dash}
                pointerEvents="none"
              />
            ) : null}
            <path
              d={t.d}
              fill="none"
              stroke={t.pigment}
              strokeWidth={ink.stroke * k}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={dash}
              pointerEvents="none"
            />
            <path
              d={t.d}
              fill="none"
              stroke="#000"
              strokeOpacity={0}
              strokeWidth={16 * k}
              strokeLinecap="round"
              pointerEvents="stroke"
              style={{ pointerEvents: "stroke", cursor: "pointer" }}
              onPointerEnter={() => enterMeridian(t.id)}
              onPointerLeave={(event) => leaveMeridian(t.id, event.relatedTarget)}
            />
            {samples.map((s, i) => (
              <path
                key={`${t.key}-chev-${i}`}
                data-chevron=""
                d={glyph}
                transform={`translate(${s.x} ${s.y}) rotate(${s.angle})`}
                fill="none"
                stroke={t.pigment}
                strokeWidth={1.25 * k}
                strokeLinecap="round"
                strokeLinejoin="round"
                pointerEvents="none"
              />
            ))}
            {place ? (
              <text
                className="code"
                x={place.x}
                y={place.y}
                fontSize={11 * k}
                fill={t.pigment}
                stroke="#FBF7EE"
                strokeWidth={3 * k}
                paintOrder="stroke"
                strokeLinejoin="round"
                textAnchor={place.anchor}
                dominantBaseline="middle"
                pointerEvents="none"
              >
                {t.code}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
});
