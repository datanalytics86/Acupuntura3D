import { Html, Instance, Instances } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Mesh } from "three";
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
  const setSelected = useViewerStore((s) => s.setSelected);
  const setHovered = useViewerStore((s) => s.setHovered);
  const setActive = useViewerStore((s) => s.setActiveMeridian);
  const halo = useRef<Mesh>(null);
  const hovering = useRef(false);

  const items = useMemo(() => buildPointInstances(points, meridians), [points, meridians]);
  const focus = items.find((it) => it.point.id === (hovered ?? selected));
  const selectedInst = items.find((it) => it.point.id === selected && it.side !== "R");

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  useFrame((state) => {
    if (!halo.current || !selectedInst) return;
    const s = 1.15 + Math.sin(state.clock.elapsedTime * 2.4) * 0.18;
    halo.current.scale.setScalar(s);
  });

  if (!visible) return null;

  return (
    <>
      <Instances limit={items.length || 1} range={items.length}>
        <sphereGeometry args={[0.011, 18, 14]} />
        <meshStandardMaterial roughness={0.22} metalness={0.28} emissive="#111" emissiveIntensity={0.2} />
        {items.map((it, i) => {
          const isSel = selected === it.point.id;
          const isHov = hovered === it.point.id;
          const dim = Boolean(active) && active !== it.point.meridianId && !isSel;
          const color = getMeridianColor(it.point.meridianId);
          const scale = isSel ? 1.85 : isHov ? 1.4 : dim ? 0.65 : 1;
          return (
            <Instance
              key={`${it.point.id}-${it.side}-${i}`}
              position={it.position}
              scale={scale}
              color={isSel ? "#ffe9b0" : color}
              onPointerOver={(e) => {
                e.stopPropagation();
                hovering.current = true;
                setHovered(it.point.id);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                hovering.current = false;
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
      {selectedInst ? (
        <mesh ref={halo} position={selectedInst.position} raycast={() => undefined}>
          <sphereGeometry args={[0.022, 20, 16]} />
          <meshBasicMaterial color="#ffe9b0" transparent opacity={0.22} depthWrite={false} />
        </mesh>
      ) : null}
      {focus ? (
        <Html position={focus.position} center distanceFactor={2.2} style={{ pointerEvents: "none" }}>
          <div className="panel rounded-full px-2.5 py-1 text-[11px] tracking-wide text-amber-100 whitespace-nowrap">
            <span className="font-medium">{focus.point.code}</span>
            <span className="mx-1 text-white/30">·</span>
            <span>{focus.point.names.pinyin}</span>
          </div>
        </Html>
      ) : null}
    </>
  );
}
