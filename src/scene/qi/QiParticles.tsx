import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { InstancedMesh, Object3D } from "three";
import type { Meridian } from "@/types";
import { anchorsToCurve } from "@/lib/curves";
import { mirrorX } from "@/lib/bodyMetrics";
import { useViewerStore } from "@/state/viewerStore";

const dummy = new Object3D();

function Flow({
  anchors,
  hex,
  count,
  boosted,
}: {
  anchors: { x: number; y: number; z: number }[];
  hex: string;
  count: number;
  boosted: boolean;
}) {
  const mesh = useRef<InstancedMesh>(null);
  const curve = useMemo(() => anchorsToCurve(anchors), [anchors]);
  const playing = useViewerStore((s) => s.qiPlaying);
  const speed = useViewerStore((s) => s.qiSpeed);

  useFrame((state) => {
    if (!mesh.current || !curve) return;
    if (!playing) return;
    const t0 = state.clock.elapsedTime * speed * 0.05;
    const size = boosted ? 0.01 * 1.4 : 0.008;
    for (let i = 0; i < count; i += 1) {
      const t = (t0 + i / count) % 1;
      const p = curve.getPoint(t);
      dummy.position.copy(p);
      dummy.scale.setScalar(size);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  if (!curve) return null;
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} raycast={() => undefined}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color={hex}
        emissive={hex}
        emissiveIntensity={boosted ? 1.3 : 0.9}
        transparent
        opacity={0.95}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

function isBoosted(m: Meridian, hour: number): boolean {
  if (m.clockHour === undefined) return false;
  const start = m.clockHour;
  const end = (start + 2) % 24;
  if (start < end) return hour >= start && hour < end;
  return hour >= start || hour < end;
}

export function QiParticles({ meridians }: { meridians: Meridian[] }) {
  const visible = useViewerStore((s) => s.visibleLayers.qi);
  const quality = useViewerStore((s) => s.qualityTier);
  const active = useViewerStore((s) => s.activeMeridianId);
  const hour = useViewerStore((s) => s.clockHour);
  if (!visible || quality === "low") return null;

  const count = quality === "high" ? 28 : 12;
  const list = active ? meridians.filter((m) => m.id === active) : meridians.slice(0, 4);

  return (
    <group>
      {list.map((m) => {
        const boosted = isBoosted(m, hour);
        const sides =
          m.laterality === "bilateral"
            ? [m.pathAnchors, m.pathAnchors.map(mirrorX)]
            : [m.pathAnchors];
        return sides.map((anchors, i) => (
          <Flow
            key={`${m.id}-qi-${i}`}
            anchors={anchors}
            hex={m.color}
            count={count}
            boosted={boosted}
          />
        ));
      })}
    </group>
  );
}
