import { useMemo } from "react";
import type { Meridian } from "@/types";
import { anchorsToCurve } from "@/lib/curves";
import { mirrorX } from "@/lib/bodyMetrics";
import { useViewerStore } from "@/state/viewerStore";

function Tube({
  meridian,
  anchors,
  dimmed,
}: {
  meridian: Meridian;
  anchors: { x: number; y: number; z: number }[];
  dimmed: boolean;
}) {
  const curve = useMemo(() => anchorsToCurve(anchors), [anchors]);
  if (!curve) return null;
  const quality = useViewerStore((s) => s.qualityTier);
  const tubular = quality === "low" ? 32 : 64;
  return (
    <mesh raycast={() => undefined}>
      <tubeGeometry args={[curve, tubular, dimmed ? 0.0035 : 0.0055, 8, false]} />
      <meshStandardMaterial
        color={meridian.color}
        emissive={meridian.color}
        emissiveIntensity={dimmed ? 0.15 : 0.55}
        transparent
        opacity={dimmed ? 0.22 : 0.85}
        roughness={0.35}
        metalness={0.1}
        depthWrite={false}
      />
    </mesh>
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
        const dimmed = Boolean(active) && active !== m.id;
        if (quality === "low" && dimmed) return null;
        const sides =
          m.laterality === "bilateral"
            ? [m.pathAnchors, m.pathAnchors.map(mirrorX)]
            : [m.pathAnchors];
        return sides.map((anchors, i) => (
          <Tube key={`${m.id}-${i}`} meridian={m} anchors={anchors} dimmed={dimmed} />
        ));
      })}
    </group>
  );
}
