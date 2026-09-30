import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { loadAcupoints, loadMeridians } from "@/data";
import { instancesOnView } from "@/atlas/mapCoords";
import { CX, VIEW_H, VIEW_W, Y } from "@/atlas/figure/landmarks";
import { CINNABAR, INK } from "@/lib/colors";
import { meridianPigment } from "@/lib/tokens";
import { prefersReducedMotion } from "@/lib/quality";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";
import { inRegionFrame, regionFrame, REGION_FOCUS } from "@/atlas/regionFrames";
import { unitsPerPx, usePlateBox, useUnitsPerPx, visibleRect } from "@/atlas/screen";
import { estimateLabelPx, layoutMarginCallouts, type Callout, type CalloutInput } from "@/atlas/callouts";
import { PointTooltip, useCoarsePointer } from "@/atlas/PointTooltip";
import type { Acupoint, AtlasView, Meridian, Point2D } from "@/types";

const LABEL = 12;
const BODY_FIGURE = { l: 97.6, r: 702.4 };

/** Head on the plate. A label here covers the face. */
const HEAD = { l: CX - 78, r: CX + 78, t: Y.vertex + 6, b: Y.chin + 12 };

type Anchor = "start" | "middle" | "end";
type Box = { l: number; t: number; r: number; b: number };
type PlatePoint = { point: Acupoint; position: Point2D; side: "L" | "R" | "C" };
type Rect = { l: number; t: number; r: number; b: number };

export type CalloutSeed = { key: string; x: number; y: number; anchor: Anchor; text: string };

function labelBox(x: number, y: number, label: string, anchor: Anchor): Box {
  const w = textWidth(label, LABEL);
  const l = anchor === "start" ? x : anchor === "end" ? x - w : x - w / 2;
  const t = y - LABEL * 0.82;
  return { l, t, r: l + w, b: y + LABEL * 0.22 };
}

function overlaps(a: Box, b: Box): boolean {
  const gap = 4;
  return a.r + gap > b.l && a.l < b.r + gap && a.b + gap > b.t && a.t < b.b + gap;
}

function coversHead(box: Box): boolean {
  return box.r > HEAD.l && box.l < HEAD.r && box.b > HEAD.t && box.t < HEAD.b;
}

export function layoutCallouts(
  seeds: CalloutSeed[],
): Map<string, { x: number; y: number; anchor: Anchor; box: Box }> {
  const occupied: Box[] = [];
  const placed = new Map<string, { x: number; y: number; anchor: Anchor; box: Box }>();
  const ordered = [...seeds].sort((a, b) => Math.abs(b.x - CX) - Math.abs(a.x - CX));
  for (const seed of ordered) {
    const outward = seed.x < CX - 8 ? -1 : seed.x > CX + 8 ? 1 : 0;
    const candidates: { x: number; y: number }[] = [];
    for (let i = 0; i <= 12; i++) {
      candidates.push({ x: seed.x + outward * i * 8, y: seed.y });
      candidates.push({ x: seed.x + outward * i * 8, y: seed.y - i * 8 });
      candidates.push({ x: seed.x, y: seed.y - i * 10 });
      candidates.push({ x: seed.x + outward * i * 8, y: seed.y + i * 8 });
    }
    let chosen = { x: seed.x, y: seed.y };
    let box = labelBox(seed.x, seed.y, seed.text, seed.anchor);
    for (const cand of candidates) {
      const next = labelBox(cand.x, cand.y, seed.text, seed.anchor);
      if (coversHead(next)) continue;
      if (occupied.some((o) => overlaps(next, o))) continue;
      chosen = cand;
      box = next;
      break;
    }
    occupied.push(box);
    placed.set(seed.key, { ...chosen, anchor: seed.anchor, box });
  }
  return placed;
}

function textWidth(label: string, size: number): number {
  let w = 0;
  for (const ch of label) {
    if (ch === " ") w += 0.33;
    else if (ch.charCodeAt(0) > 255) w += 1;
    else w += 0.56;
  }
  return w * size;
}

function clusterItems(items: PlatePoint[], thresh: number): PlatePoint[][] {
  const n = items.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (i: number): number => {
    const p = parent[i];
    if (p === undefined || p === i) return i;
    const root = find(p);
    parent[i] = root;
    return root;
  };
  const unite = (a: number, b: number) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };
  if (thresh > 0) {
    for (let i = 0; i < n; i += 1) {
      const pi = items[i]!.position;
      for (let j = i + 1; j < n; j += 1) {
        const pj = items[j]!.position;
        if (Math.hypot(pi.x - pj.x, pi.y - pj.y) < thresh) unite(i, j);
      }
    }
  }
  const buckets = new Map<number, PlatePoint[]>();
  for (let i = 0; i < n; i += 1) {
    const root = find(i);
    const item = items[i]!;
    const list = buckets.get(root);
    if (list) list.push(item);
    else buckets.set(root, [item]);
  }
  return [...buckets.values()];
}

function frameContains(region: "face" | "hand" | "foot", view: AtlasView, p: Point2D): boolean {
  const frame = regionFrame(region, view);
  const hw = VIEW_W / frame.zoom / 2;
  const hh = VIEW_H / frame.zoom / 2;
  return Math.abs(p.x - frame.pan.x) <= hw && Math.abs(p.y - frame.pan.y) <= hh;
}

function clusterRegion(members: PlatePoint[], view: AtlasView): "face" | "hand" | "foot" | null {
  const options = (["hand", "foot", "face"] as const).filter((r) =>
    members.every((m) => frameContains(r, view, m.position)),
  );
  const first = options[0];
  if (!first) return null;
  let best: "face" | "hand" | "foot" = first;
  for (const r of options) {
    if (regionFrame(r, view).zoom > regionFrame(best, view).zoom) best = r;
  }
  return best;
}

function inView(p: Point2D, rect: Rect, pad: number): boolean {
  return p.x >= rect.l - pad && p.x <= rect.r + pad && p.y >= rect.t - pad && p.y <= rect.b + pad;
}

function pigmentFor(point: Acupoint, byId: Map<string, Meridian>): string {
  const meridian = byId.get(point.meridianId);
  return meridianPigment(meridian ?? { id: point.meridianId, element: point.element });
}

function pointAria(point: Acupoint, locale: "es" | "en", meridianName: string | null): string {
  const name = locale === "en" ? point.names.en : point.names.es;
  const kind = meridianName ? `${t(locale, "pointMeridian")} ${meridianName}` : t(locale, "extraPoint");
  return `${point.code} ${point.names.pinyin}, ${name}, ${kind}`;
}

function centroidOf(members: PlatePoint[]): Point2D {
  let x = 0;
  let y = 0;
  for (const m of members) {
    x += m.position.x;
    y += m.position.y;
  }
  return { x: x / members.length, y: y / members.length };
}

/** The mark farther up the plate, or farther from the midline when they share a row. */
function rearMarkKeys(items: PlatePoint[], k: number): Set<string> {
  const rear = new Set<string>();
  const limit = 10 * k;
  for (let i = 0; i < items.length; i += 1) {
    const a = items[i]!;
    for (let j = 0; j < items.length; j += 1) {
      if (i === j) continue;
      const b = items[j]!;
      if (Math.hypot(a.position.x - b.position.x, a.position.y - b.position.y) >= limit) continue;
      const behind =
        a.position.y < b.position.y - 0.5 ||
        (Math.abs(a.position.y - b.position.y) <= 0.5 &&
          Math.abs(a.position.x - CX) > Math.abs(b.position.x - CX) + 0.5);
      if (behind) {
        rear.add(`${a.point.id}-${a.side}`);
        break;
      }
    }
  }
  return rear;
}

type ProxLabel = { code: string; zh: string; x: number; y: number; anchor: Anchor; hot: boolean };

function proximityLabels(shown: PlatePoint[], hotId: string | null, selectedId: string | null): ProxLabel[] {
  const seeds: CalloutSeed[] = [];
  const meta = new Map<string, { code: string; zh: string; id: string }>();
  for (const it of shown) {
    if (it.side === "R") continue;
    const anchor: Anchor = it.position.x < CX - 8 ? "end" : it.position.x > CX + 8 ? "start" : "middle";
    seeds.push({
      key: it.point.code,
      x: it.position.x,
      y: it.position.y,
      anchor,
      text: `${it.point.code} ${it.point.names.zh}`,
    });
    meta.set(it.point.code, { code: it.point.code, zh: it.point.names.zh, id: it.point.id });
  }
  const placed = layoutCallouts(seeds);
  const out: ProxLabel[] = [];
  for (const [key, place] of placed) {
    const row = meta.get(key);
    if (!row) continue;
    out.push({
      code: row.code,
      zh: row.zh,
      x: place.x,
      y: place.y,
      anchor: place.anchor,
      hot: row.id === hotId || row.id === selectedId,
    });
  }
  return out;
}

/** 24–40px outside the figure box, pulled in only when the window cannot hold 32. */
function plateSideX(edge: number, outward: -1 | 1, k: number, rect: Rect): number {
  const glyph = 14 * k;
  const pad = 6 * k;
  const room = outward < 0 ? edge - (rect.l + pad + glyph) : rect.r - pad - glyph - edge;
  const prefer = 32 * k;
  const near = 24 * k;
  const far = 40 * k;
  let gap = prefer;
  if (room < prefer) gap = room >= near ? room : Math.max(room, 0);
  if (gap > far) gap = far;
  return edge + outward * gap;
}

function PlateSideMarks({
  view,
  k,
  rect,
  locale,
}: {
  view: AtlasView;
  k: number;
  rect: Rect;
  locale: "es" | "en";
}) {
  const y = Y.fingertips;
  const leftX = plateSideX(BODY_FIGURE.l, -1, k, rect);
  const rightX = plateSideX(BODY_FIGURE.r, 1, k, rect);
  const anterior = view === "anterior";
  const ink = {
    y,
    fill: "var(--color-ink-2)",
    stroke: "var(--color-paper)",
    strokeWidth: 3 * k,
    paintOrder: "stroke" as const,
    fontSize: 16 * k,
    fontFamily: "var(--font-serif)",
    fontWeight: 500,
    dominantBaseline: "middle" as const,
    pointerEvents: "none" as const,
  };
  return (
    <g pointerEvents="none">
      <text
        data-testid="plate-side-left"
        x={leftX}
        textAnchor="end"
        aria-label={t(locale, anterior ? "plateSideRight" : "plateSideLeft")}
        {...ink}
      >
        {anterior ? "D" : "I"}
      </text>
      <text
        data-testid="plate-side-right"
        x={rightX}
        textAnchor="start"
        aria-label={t(locale, anterior ? "plateSideLeft" : "plateSideRight")}
        {...ink}
      >
        {anterior ? "I" : "D"}
      </text>
    </g>
  );
}

function Registration({
  k,
  halo,
  ring,
  ringW,
  selected,
  focused,
  pulse,
  number,
  testId,
}: {
  k: number;
  halo: number;
  ring: string;
  ringW: number;
  selected: boolean;
  focused: boolean;
  pulse: boolean;
  number?: number;
  testId?: string;
}) {
  const tick0 = halo + 1.5 * k;
  const tick1 = tick0 + 4 * k;
  const ringR = Math.max(halo - ringW / 2, ringW / 2);
  return (
    <>
      <circle data-testid={testId} r={halo} fill="var(--color-paper)" />
      <circle r={ringR} fill="none" stroke={ring} strokeWidth={ringW} pointerEvents="none" />
      {number == null ? (
        <circle r={Math.min(2.5 * k, halo * 0.45)} fill={INK} pointerEvents="none" />
      ) : (
        <text
          className="code"
          x={0}
          y={0}
          dy="0.35em"
          textAnchor="middle"
          fontSize={11 * k}
          fill={INK}
          pointerEvents="none"
        >
          {number}
        </text>
      )}
      {selected ? (
        <g stroke={CINNABAR} strokeWidth={k} fill="none" pointerEvents="none">
          <line x1={0} y1={-tick1} x2={0} y2={-tick0} />
          <line x1={0} y1={tick0} x2={0} y2={tick1} />
          <line x1={-tick1} y1={0} x2={-tick0} y2={0} />
          <line x1={tick0} y1={0} x2={tick1} y2={0} />
        </g>
      ) : null}
      {pulse ? (
        <circle r={halo} fill="none" stroke={CINNABAR} strokeWidth={2 * k} opacity={0.85} pointerEvents="none">
          <animate attributeName="opacity" values="0.85;0" dur="600ms" fill="freeze" />
          <animate attributeName="r" values={`${halo};${halo + 8 * k}`} dur="600ms" fill="freeze" />
        </circle>
      ) : null}
      {focused ? (
        <circle r={halo + 8 * k} fill="none" stroke={CINNABAR} strokeWidth={2 * k} pointerEvents="none" />
      ) : null}
    </>
  );
}

function onActivateKey(e: KeyboardEvent<SVGGElement>, run: () => void) {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  e.stopPropagation();
  run();
}

export function Points2D() {
  const points = useMemo(() => loadAcupoints(), []);
  const meridians = useMemo(() => loadMeridians(), []);
  const view = useViewerStore((s) => s.atlasView);
  const visible = useViewerStore((s) => s.visibleLayers.points);
  const selected = useViewerStore((s) => s.selectedPointId);
  const hovered = useViewerStore((s) => s.hoveredPointId);
  const both = useViewerStore((s) => s.bothSides);
  const setSelected = useViewerStore((s) => s.setSelected);
  const setHovered = useViewerStore((s) => s.setHovered);
  const setActive = useViewerStore((s) => s.setActiveMeridian);
  const region = useViewerStore((s) => s.atlasRegion);
  const zoom = useViewerStore((s) => s.atlasZoom);
  const pan = useViewerStore((s) => s.atlasPan);
  const labelsMode = useViewerStore((s) => s.labelsMode);
  const locale = useViewerStore((s) => s.locale);
  const setAtlasRegion = useViewerStore((s) => s.setAtlasRegion);
  const flyTo = useViewerStore((s) => s.flyTo);
  const k = useUnitsPerPx();
  const box = usePlateBox();
  const coarse = useCoarsePointer();
  const rootRef = useRef<SVGGElement>(null);
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const [tip, setTip] = useState<{ id: string; at: Point2D } | null>(null);

  const meridianById = useMemo(() => new Map(meridians.map((m) => [m.id, m])), [meridians]);
  const pointById = useMemo(() => new Map(points.map((p) => [p.id, p])), [points]);
  const items = useMemo(
    () => points.flatMap((p) => instancesOnView(p, view, both)),
    [points, view, both],
  );
  const wantMargin = labelsMode !== "none" && zoom <= 1.6;
  const wantProximity = labelsMode !== "none" && zoom > 1.6;
  const zoomKey = Math.round(zoom * 20) / 20;
  // Column layout reads visibleRect, so pan is part of the key, but snapped so a drag does not redo it per pixel.
  const panX = Math.round(pan.x / 4) * 4;
  const panY = Math.round(pan.y / 4) * 4;
  const pointIds = items.map((it) => `${it.point.id}:${it.side}`).join("|");

  const margin = useMemo(() => {
    if (!wantMargin || box.w <= 0 || box.h <= 0) return null;
    const z = zoomKey > 0 ? zoomKey : 1;
    const plate = { w: box.w, h: box.h };
    const kLay = unitsPerPx(VIEW_W / z, VIEW_H / z, plate);
    const viewRect = visibleRect({ x: panX, y: panY }, kLay, plate);
    const focus = REGION_FOCUS[region];
    const figure = focus ? { l: focus.cx - focus.rx, r: focus.cx + focus.rx } : BODY_FIGURE;
    const byId = new Map<string, CalloutInput>();
    for (const it of items) {
      if (!inView(it.position, viewRect, 0) || !inRegionFrame(region, view, it.position)) continue;
      const text = `${it.point.code} ${it.point.names.zh}`;
      const row = byId.get(it.point.id) ?? {
        key: it.point.id,
        text,
        anchors: [],
        widthPx: estimateLabelPx(text, 12),
      };
      row.anchors.push(it.position);
      byId.set(it.point.id, row);
    }
    if (byId.size === 0) return [];
    return layoutMarginCallouts([...byId.values()], { view: viewRect, figure, k: kLay });
  }, [wantMargin, view, region, zoomKey, box.w, box.h, pointIds, panX, panY, items]);

  const measured = box.w > 0 && box.h > 0;
  const viewRect = measured ? visibleRect(pan, k, box) : null;
  const sideMarks =
    region === "body" && zoom <= 1.3 && viewRect ? (
      <PlateSideMarks view={view} k={k} rect={viewRect} locale={locale} />
    ) : null;

  if (!visible) return <g ref={rootRef}>{sideMarks}</g>;

  const shown = (viewRect ? items.filter((it) => inView(it.position, viewRect, 48 * k)) : items).filter((it) =>
    inRegionFrame(region, view, it.position),
  );
  const marginFailed = wantMargin && measured && margin === null;
  const cluster = marginFailed && coarse;
  const groups = clusterItems(shown, cluster ? 14 * k : 0);
  const rear = cluster ? new Set<string>() : rearMarkKeys(shown, k);
  const proximity = wantProximity ? proximityLabels(shown, hovered, selected) : [];
  const calloutById = new Map<string, Callout>((margin ?? []).map((c) => [c.key, c]));
  const hidden = new Set<string>();
  for (const group of groups) {
    if (group.length < 2) continue;
    for (const m of group) hidden.add(`${m.point.id}-${m.side}`);
  }
  const reduce = prefersReducedMotion();
  const hit = (coarse ? 22 : 12) * k;
  const svg = rootRef.current?.ownerSVGElement ?? null;
  const tipPoint = tip ? pointById.get(tip.id) : undefined;

  const select = (point: Acupoint) => {
    setSelected(point.id);
    setActive(point.meridianId);
  };
  const clearTip = (id: string) => {
    setTip((cur) => (cur?.id === id ? null : cur));
  };

  return (
    <g ref={rootRef}>
      {sideMarks}
      {groups.map((members) => {
        if (members.length > 1) {
          const at = centroidOf(members);
          const key = members
            .map((m) => `${m.point.id}-${m.side}`)
            .sort()
            .join("|");
          const head = members[0]!;
          const same = members.every((m) => m.point.meridianId === head.point.meridianId);
          const pigment = same ? pigmentFor(head.point, meridianById) : INK;
          const memberHot = members.some((m) => m.point.id === hovered);
          const memberSel = members.some((m) => m.point.id === selected);
          const halo = memberHot ? 7 * k : 6 * k;
          const open = () => {
            const dest = clusterRegion(members, view);
            if (dest && dest !== region) {
              setAtlasRegion(dest);
              return;
            }
            const next = zoom < 2.5 ? 2.5 : Math.min(6, zoom * 2.5);
            flyTo({ pan: at, zoom: next });
          };
          return (
            <g key={key} transform={`translate(${at.x} ${at.y})`}>
              <g
                data-atlas-hit=""
                role="button"
                tabIndex={0}
                aria-label={`${members.length} ${t(locale, "clusterPoints")}. ${t(locale, "clusterZoom")}`}
                style={{ cursor: "pointer", outline: "none" }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
                onKeyDown={(e) => onActivateKey(e, open)}
                onFocus={() => setFocusKey(key)}
                onBlur={() => setFocusKey((cur) => (cur === key ? null : cur))}
              >
                <circle r={hit} fill="transparent" />
                <Registration
                  k={k}
                  halo={halo}
                  ring={memberSel || memberHot ? CINNABAR : pigment}
                  ringW={memberSel ? 2 * k : memberHot ? 1.6 * k : 1.25 * k}
                  selected={memberSel}
                  focused={focusKey === key}
                  pulse={memberSel && !reduce}
                  number={members.length}
                />
              </g>
            </g>
          );
        }
        const it = members[0]!;
        const key = `${it.point.id}-${it.side}`;
        const primary = it.side !== "R";
        const isSel = selected === it.point.id;
        const isHov = hovered === it.point.id;
        const basePx = rear.has(key) ? 4 : 6;
        const halo = (isHov ? basePx + 1 : basePx) * k;
        const meridian = meridianById.get(it.point.meridianId);
        const meridianName = meridian ? (locale === "en" ? meridian.names.en : meridian.names.es) : null;
        const showLocal =
          labelsMode !== "none" &&
          primary &&
          !wantProximity &&
          !calloutById.has(it.point.id) &&
          (isHov || isSel);
        const dir = it.position.x < CX ? -1 : 1;
        return (
          <g key={key} transform={`translate(${it.position.x} ${it.position.y})`}>
            <g
              data-atlas-hit=""
              role={primary ? "button" : undefined}
              tabIndex={primary ? 0 : -1}
              aria-hidden={primary ? undefined : true}
              aria-label={primary ? pointAria(it.point, locale, meridianName) : undefined}
              aria-pressed={primary ? isSel : undefined}
              style={{ cursor: "pointer", outline: "none" }}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerEnter={() => {
                setHovered(it.point.id);
                if (!coarse) setTip({ id: it.point.id, at: it.position });
              }}
              onPointerLeave={() => {
                if (useViewerStore.getState().hoveredPointId === it.point.id) setHovered(null);
                clearTip(it.point.id);
              }}
              onClick={(e) => {
                e.stopPropagation();
                select(it.point);
              }}
              onFocus={() => {
                setFocusKey(key);
                if (!coarse) setTip({ id: it.point.id, at: it.position });
              }}
              onBlur={() => {
                setFocusKey((cur) => (cur === key ? null : cur));
                if (useViewerStore.getState().hoveredPointId !== it.point.id) clearTip(it.point.id);
              }}
              onKeyDown={(e) => onActivateKey(e, () => select(it.point))}
            >
              <circle r={hit} fill="transparent" />
              <Registration
                k={k}
                halo={halo}
                ring={isSel || isHov ? CINNABAR : pigmentFor(it.point, meridianById)}
                ringW={isSel ? 2 * k : isHov ? 1.6 * k : 1.25 * k}
                selected={isSel}
                focused={focusKey === key}
                pulse={isSel && !reduce}
                testId={primary ? `point-${it.point.code}` : undefined}
              />
              {showLocal ? (
                <g data-testid={`callout-${it.point.code}`} pointerEvents="none">
                  <line
                    x1={0}
                    y1={0}
                    x2={dir * 18 * k}
                    y2={-8 * k}
                    stroke={INK}
                    strokeOpacity={0.55}
                    strokeWidth={0.75 * k}
                  />
                  <circle cx={dir * 18 * k} cy={-8 * k} r={1.3 * k} fill={INK} />
                  <text
                    x={dir * 22 * k}
                    y={-4 * k}
                    textAnchor={dir < 0 ? "end" : "start"}
                    fontSize={12 * k}
                    fill={INK}
                  >
                    <tspan className="code">{it.point.code}</tspan>
                    <tspan className="hanzi" dx={4 * k} fontSize={12.5 * k}>
                      {it.point.names.zh}
                    </tspan>
                  </text>
                </g>
              ) : null}
            </g>
          </g>
        );
      })}
      {(margin ?? []).map((c) => {
        const point = pointById.get(c.key);
        if (!point) return null;
        const hot = hovered === point.id || selected === point.id;
        const sole = hidden.has(`${point.id}-L`) || hidden.has(`${point.id}-C`) || !shown.some((it) => it.point.id === point.id && it.side !== "R");
        const meridian = meridianById.get(point.meridianId);
        const meridianName = meridian ? (locale === "en" ? meridian.names.en : meridian.names.es) : null;
        return (
          <g
            key={c.key}
            data-atlas-hit=""
            data-testid={`callout-${point.code}`}
            role={sole ? "button" : undefined}
            tabIndex={sole ? 0 : undefined}
            aria-hidden={sole ? undefined : true}
            aria-label={sole ? pointAria(point, locale, meridianName) : undefined}
            style={{ cursor: "pointer", outline: "none" }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerEnter={() => {
              setHovered(point.id);
              if (!coarse) setTip({ id: point.id, at: c.from });
            }}
            onPointerLeave={() => {
              if (useViewerStore.getState().hoveredPointId === point.id) setHovered(null);
              clearTip(point.id);
            }}
            onClick={(e) => {
              e.stopPropagation();
              select(point);
            }}
            onFocus={() => {
              setFocusKey(`callout-${c.key}`);
              if (!coarse) setTip({ id: point.id, at: c.from });
            }}
            onBlur={() => {
              setFocusKey((cur) => (cur === `callout-${c.key}` ? null : cur));
              if (useViewerStore.getState().hoveredPointId !== point.id) clearTip(point.id);
            }}
            onKeyDown={(e) => onActivateKey(e, () => select(point))}
          >
            <polyline
              points={`${c.from.x},${c.from.y} ${c.bend.x},${c.bend.y} ${c.to.x},${c.to.y}`}
              fill="none"
              stroke={hot ? CINNABAR : INK}
              strokeOpacity={hot ? 1 : 0.55}
              strokeWidth={0.75 * k}
              pointerEvents="none"
            />
            <circle cx={c.to.x} cy={c.to.y} r={1.3 * k} fill={hot ? CINNABAR : INK} pointerEvents="none" />
            <rect
              x={Math.min(c.box.l, c.to.x) - 2 * k}
              y={c.box.t - 2 * k}
              width={c.box.r - c.box.l + 4 * k}
              height={c.box.b - c.box.t + 4 * k}
              fill="transparent"
            />
            <text
              x={c.to.x + (c.side === "left" ? -5 : 5) * k}
              y={c.to.y + 4 * k}
              textAnchor={c.side === "left" ? "end" : "start"}
              fontSize={12 * k}
              fill={hot ? CINNABAR : INK}
              pointerEvents="none"
            >
              <tspan className="code">{point.code}</tspan>
              <tspan className="hanzi" dx={4 * k} fontSize={12.5 * k}>
                {point.names.zh}
              </tspan>
            </text>
            {focusKey === `callout-${c.key}` ? (
              <rect
                x={c.box.l - 2 * k}
                y={c.box.t - 2 * k}
                width={c.box.r - c.box.l + 4 * k}
                height={c.box.b - c.box.t + 4 * k}
                fill="none"
                stroke={CINNABAR}
                strokeWidth={2 * k}
                pointerEvents="none"
              />
            ) : null}
          </g>
        );
      })}
      {proximity.map((lab) => (
        <text
          key={lab.code}
          data-testid={`label-${lab.code}`}
          x={lab.x}
          y={lab.y}
          textAnchor={lab.anchor}
          fontSize={12 * k}
          fill={lab.hot ? CINNABAR : INK}
          pointerEvents="none"
        >
          <tspan className="code">{lab.code}</tspan>
          <tspan className="hanzi" dx={4 * k} fontSize={12.5 * k}>
            {lab.zh}
          </tspan>
        </text>
      ))}
      {tip && tipPoint && !coarse ? (
        <PointTooltip
          open
          anchor={tip.at}
          code={tipPoint.code}
          hanzi={tipPoint.names.zh}
          pinyin={tipPoint.names.pinyin}
          name={locale === "en" ? tipPoint.names.en : tipPoint.names.es}
          svg={svg}
        />
      ) : null}
    </g>
  );
}
