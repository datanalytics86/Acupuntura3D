import { Stars } from "@react-three/drei";
import { useViewerStore } from "@/state/viewerStore";

export function Starfield() {
  const quality = useViewerStore((s) => s.qualityTier);
  if (quality === "low") return null;
  const count = quality === "medium" ? 400 : 900;
  return (
    <Stars
      radius={18}
      depth={28}
      count={count}
      factor={2.4}
      saturation={0.2}
      fade
      speed={quality === "high" ? 0.25 : 0.1}
    />
  );
}
