import { useMemo } from "react";
import { loadAcupoints } from "@/data";
import { instancesOnView } from "@/atlas/mapCoords";
import { getMeridianColor } from "@/lib/colors";
import { useViewerStore } from "@/state/viewerStore";

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
  const lead = 46 / zoom;
  const labelSize = detail ? 30 / zoom : 15;

  return (
    <g>
      {items.map((it, i) => {
        const isSel = selected === it.point.id;
        const isHov = hovered === it.point.id;
        const color = getMeridianColor(it.point.meridianId);
        const callout = detail && inFrame(it.position.x, it.position.y);
        const dir = it.position.x <= pan.x ? 1 : -1;
        return (
          <g
            key={`${it.point.id}-${it.side}-${i}`}
            transform={`translate(${it.position.x} ${it.position.y})`}
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
            {isSel || isHov ? <circle r={12} fill={color} opacity={0.16} /> : null}
            <circle r={4.2} fill="var(--color-paper)" />
            <circle r={3.2} fill="var(--color-jade-ink)" />
            {callout ? (
              <g>
                <line
                  x1={0}
                  y1={0}
                  x2={dir * lead}
                  y2={-lead * 0.55}
                  stroke="var(--color-ink)"
                  strokeWidth={0.75}
                />
                <text
                  x={dir * (lead + 2)}
                  y={-lead * 0.55}
                  textAnchor={dir > 0 ? "start" : "end"}
                  fill="var(--color-ink)"
                  stroke="var(--color-paper)"
                  strokeWidth={1.15}
                  paintOrder="stroke"
                  fontSize={labelSize}
                  fontFamily="Cormorant Garamond, Times New Roman, serif"
                >
                  {it.point.code} {it.point.names.zh}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
      {focus && !detail ? (
        <g transform={`translate(${focus.position.x} ${focus.position.y - 18})`}>
          <text
            textAnchor="middle"
            fill="var(--color-ink)"
            stroke="var(--color-paper)"
            strokeWidth={4}
            paintOrder="stroke"
            fontSize={15}
            fontFamily="Cormorant Garamond, Times New Roman, serif"
          >
            {focus.point.code} {focus.point.names.zh}
          </text>
        </g>
      ) : null}
    </g>
  );
}
