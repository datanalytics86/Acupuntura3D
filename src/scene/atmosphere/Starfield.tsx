import { Stars } from "@react-three/drei";

export function Starfield() {
  return (
    <Stars
      radius={18}
      depth={28}
      count={1400}
      factor={2.4}
      saturation={0.2}
      fade
      speed={0.25}
    />
  );
}
