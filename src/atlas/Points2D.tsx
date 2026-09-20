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
            <circle r={14} fill="transparent" />
            {(isSel || isHov) && (
              <circle r={isSel ? 16 : 13} fill={color} opacity={0.18} />
            )}
            <circle r={7.5} fill="none" stroke="#e8c98a" strokeWidth={1.4} />
            <circle r={4.2} fill="#7d9b78" />
            {isSel ? <circle r={2} fill="#fff8e7" /> : null}
          </g>
        );
      })}
      {focus ? (
        <g transform={`translate(${focus.position.x} ${focus.position.y - 22})`}>
          <rect x={-46} y={-12} width={92} height={20} rx={10} fill="#F7F1E4" stroke="#1E3A5F" strokeWidth={1} />
          <text
            textAnchor="middle"
            y={3}
            fill="#1E3A5F"
            fontSize={11}
            fontFamily="Outfit, sans-serif"
          >
            {focus.point.code} {focus.point.names.zh}
          </text>
        </g>
      ) : null}
    </g>
  );
}
