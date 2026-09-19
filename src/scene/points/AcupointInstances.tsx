import { Html, Instance, Instances } from "@react-three/drei";
import { useMemo } from "react";
import type { Acupoint, Meridian } from "@/types";
import { getMeridianColor } from "@/lib/colors";
import { useViewerStore } from "@/state/viewerStore";
import { buildPointInstances } from "@/scene/picking";

export function AcupointInstances({
  points,
  meridians,
}: {
  points: Acupoint[];
  meridians: Meridian[];
}) {
  const visible = useViewerStore((s) => s.visibleLayers.points);
  const selected = useViewerStore((s) => s.selectedPointId);
  const hovered = useViewerStore((s) => s.hoveredPointId);
  const active = useViewerStore((s) => s.activeMeridianId);
  const labels = useViewerStore((s) => s.visibleLayers.labels);
  const setSelected = useViewerStore((s) => s.setSelected);
  const setHovered = useViewerStore((s) => s.setHovered);
  const setActive = useViewerStore((s) => s.setActiveMeridian);

  const items = useMemo(() => buildPointInstances(points, meridians), [points, meridians]);

  if (!visible) return null;

  const focus = items.find((it) => it.point.id === (hovered ?? selected));

  return (
    <>
      <Instances limit={items.length || 1} range={items.length}>
        <sphereGeometry args={[0.012, 16, 12]} />
        <meshStandardMaterial roughness={0.3} metalness={0.2} />
        {items.map((it, i) => {
          const isSel = selected === it.point.id;
          const isHov = hovered === it.point.id;
          const dim = Boolean(active) && active !== it.point.meridianId && !isSel;
          const color = getMeridianColor(it.point.meridianId);
          const scale = isSel ? 1.7 : isHov ? 1.35 : dim ? 0.7 : 1;
          return (
            <Instance
              key={`${it.point.id}-${it.side}-${i}`}
              position={it.position}
              scale={scale}
              color={isSel ? "#fde68a" : color}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(it.point.id);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setHovered(null);
                document.body.style.cursor = "auto";
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(it.point.id);
                setActive(it.point.meridianId);
              }}
            />
          );
        })}
      </Instances>
      {labels && focus ? (
        <Html position={focus.position} center distanceFactor={2.4} style={{ pointerEvents: "none" }}>
          <div className="rounded bg-black/70 px-2 py-1 text-[11px] text-amber-100 whitespace-nowrap">
            {focus.point.code} {focus.point.names.pinyin}
          </div>
        </Html>
      ) : null}
    </>
  );
}
