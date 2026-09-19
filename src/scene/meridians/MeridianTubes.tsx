import { useMemo } from "react";
import type { Meridian } from "@/types";
import { anchorsToCurve } from "@/lib/curves";
import { mirrorX } from "@/lib/bodyMetrics";
import { useViewerStore } from "@/state/viewerStore";

function Tube({
  meridian,
  anchors,
  dimmed,
  active,
}: {
  meridian: Meridian;
  anchors: { x: number; y: number; z: number }[];
  dimmed: boolean;
  active: boolean;
}) {
  const curve = useMemo(() => anchorsToCurve(anchors), [anchors]);
  const quality = useViewerStore((s) => s.qualityTier);
  if (!curve) return null;
  const tubular = quality === "low" ? 32 : 72;
  return (
    <group>
      {active && quality !== "low" ? (
        <mesh raycast={() => undefined}>
          <tubeGeometry args={[curve, tubular, 0.011, 10, false]} />
          <meshBasicMaterial
            color={meridian.color}
            transparent
            opacity={0.14}
            depthWrite={false}
          />
        </mesh>
      ) : null}
      <mesh raycast={() => undefined}>
        <tubeGeometry args={[curve, tubular, dimmed ? 0.0032 : active ? 0.0062 : 0.0048, 8, false]} />
        <meshStandardMaterial
          color={meridian.color}
          emissive={meridian.color}
          emissiveIntensity={dimmed ? 0.12 : active ? 0.85 : 0.42}
          transparent
          opacity={dimmed ? 0.18 : 0.92}
          roughness={0.28}
          metalness={0.18}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function MeridianTubes({ meridians }: { meridians: Meridian[] }) {
  const visible = useViewerStore((s) => s.visibleLayers.meridians);
  const active = useViewerStore((s) => s.activeMeridianId);
  const quality = useViewerStore((s) => s.qualityTier);
  if (!visible) return null;

  return (
    <group>
      {meridians.map((m) => {
        const isActive = active === m.id;
        const dimmed = Boolean(active) && !isActive;
        if (quality === "low" && dimmed) return null;
        const sides =
          m.laterality === "bilateral"
            ? [m.pathAnchors, m.pathAnchors.map(mirrorX)]
            : [m.pathAnchors];
        return sides.map((anchors, i) => (
          <Tube
            key={`${m.id}-${i}`}
            meridian={m}
            anchors={anchors}
            dimmed={dimmed}
            active={isActive}
          />
        ));
      })}
    </group>
  );
}
