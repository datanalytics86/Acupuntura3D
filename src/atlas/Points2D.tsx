import { useMemo } from "react";
import { loadAcupoints } from "@/data";
import { instancesOnView } from "@/atlas/mapCoords";
import { CX, Y } from "@/atlas/figure/landmarks";
import { CINNABAR, INK } from "@/lib/colors";
import { useViewerStore } from "@/state/viewerStore";

const LABEL = 12;

/** Head on the plate. A label here covers the face. */
const HEAD = { l: CX - 70, r: CX + 70, t: Y.vertex + 6, b: Y.chin + 2 };

type Anchor = "start" | "middle" | "end";

function textWidth(label: string, size: number): number {
  let w = 0;
  for (const ch of label) {
    if (ch === " ") w += 0.33;
    else if (ch.charCodeAt(0) > 255) w += 1;
    else w += 0.56;
  }
  return w * size;
}

/** Shift just clear of the face. Hide when the plate is not the face. */
function placeLabel(
  x: number,
  y: number,
  label: string,
  anchor: Anchor,
  shift: boolean,
): { x: number; y: number } | null {
  const w = textWidth(label, LABEL);
  const left = anchor === "start" ? x : anchor === "end" ? x - w : x - w / 2;
  const top = y - LABEL * 0.82;
  const bottom = y + LABEL * 0.22;
  const right = left + w;
  const hits = right > HEAD.l && left < HEAD.r && bottom > HEAD.t && top < HEAD.b;
  if (!hits) return { x, y };
  if (!shift) return null;
  const moves = [
    { dx: HEAD.l - 4 - right, dy: 0 },
    { dx: HEAD.r + 4 - left, dy: 0 },
    { dx: 0, dy: HEAD.t - 4 - bottom },
    { dx: 0, dy: HEAD.b + 4 - top },
  ];
  let best = moves[0]!;
  for (const move of moves) {
    if (Math.abs(move.dx) + Math.abs(move.dy) < Math.abs(best.dx) + Math.abs(best.dy)) best = move;
  }
  return { x: x + best.dx, y: y + best.dy };
}

export function Points2D() {
  const points = useMemo(() => loadAcupoints(), []);
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
  if (!visible) return null;

  const items = points.flatMap((p) => instancesOnView(p, view, both));
  const focus = items.find((it) => it.point.id === (hovered ?? selected));
  const halfW = 400 / zoom;
  const halfH = 800 / zoom;
  const inFrame = (x: number, y: number) =>
    Math.abs(x - pan.x) < halfW * 0.9 && Math.abs(y - pan.y) < halfH * 0.86;
  const detail = region !== "body";
  const onFace = region === "face";
  const lead = 16;
  const focusText = focus ? `${focus.point.code} ${focus.point.names.zh}` : "";
  const focusAt =
    focus && !detail ? placeLabel(focus.position.x, focus.position.y - 16, focusText, "middle", false) : null;

  return (
    <g>
      {items.map((it, i) => {
        const isSel = selected === it.point.id;
        const isHov = hovered === it.point.id;
        const tone = isSel ? "active" : isHov ? "hover" : "idle";
        const core = tone === "active" ? 3.05 : tone === "hover" ? 2.75 : 2.45;
        const halo = tone === "active" ? 4.35 : tone === "hover" ? 4.05 : 3.7;
        const rim = tone === "active" ? 1.25 : tone === "hover" ? 0.9 : 0.6;
        const mark = tone === "idle" ? INK : CINNABAR;
        const callout = detail && inFrame(it.position.x, it.position.y);
        const dir = onFace ? (it.position.x <= CX ? -1 : 1) : it.position.x <= pan.x ? 1 : -1;
        const anchor: Anchor = dir > 0 ? "start" : "end";
        const text = `${it.point.code} ${it.point.names.zh}`;
        const at = callout
          ? placeLabel(
              it.position.x + dir * (lead + 2),
              it.position.y - lead * 0.45,
              text,
              anchor,
              onFace,
            )
          : null;
        return (
          <g
            key={`${it.point.id}-${it.side}-${i}`}
            data-atlas-hit=""
            transform={`translate(${it.position.x} ${it.position.y})`}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(it.point.id);
            }}
            onPointerOut={() => setHovered(null)}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(it.point.id);
              setActive(it.point.meridianId);
            }}
            style={{ cursor: "pointer" }}
          >
            <circle r={16} fill="transparent" />
            <circle r={halo} fill="var(--color-paper)" stroke={mark} strokeWidth={rim} />
            <circle r={core} fill={mark} />
            {at ? (
              <g>
                <line
                  x1={0}
                  y1={0}
                  x2={at.x - it.position.x}
                  y2={at.y - it.position.y}
                  stroke={INK}
                  strokeWidth={1.1}
                />
                <text
                  x={at.x - it.position.x}
                  y={at.y - it.position.y}
                  textAnchor={anchor}
                  fill={INK}
                  stroke="var(--color-paper)"
                  strokeWidth={1.1}
                  paintOrder="stroke"
                  fontSize={LABEL}
                  fontFamily="Cormorant Garamond, Times New Roman, serif"
                >
                  {text}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
      {focusAt ? (
        <g transform={`translate(${focusAt.x} ${focusAt.y})`} pointerEvents="none">
          <text
            textAnchor="middle"
            fill={INK}
            stroke="var(--color-paper)"
            strokeWidth={1.1}
            paintOrder="stroke"
            fontSize={LABEL}
            fontFamily="Cormorant Garamond, Times New Roman, serif"
          >
            {focusText}
          </text>
        </g>
      ) : null}
    </g>
  );
}
