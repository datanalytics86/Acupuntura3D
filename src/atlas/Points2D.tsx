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
  if (!visible) return null;

  const items = points.flatMap((p) => instancesOnView(p, view, both));
  const focus = items.find((it) => it.point.id === (hovered ?? selected));

  return (
    <g>
      {items.map((it, i) => {
        const isSel = selected === it.point.id;
        const isHov = hovered === it.point.id;
        const color = getMeridianColor(it.point.meridianId);
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
          </g>
        );
      })}
      {focus ? (
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
