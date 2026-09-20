import { BODY } from "@/lib/bodyMetrics";
import { useViewerStore } from "@/state/viewerStore";

const SKIN = "#d5c6b4";

function Skin() {
  return (
    <meshPhysicalMaterial
      color={SKIN}
      transparent
      opacity={0.46}
      roughness={0.42}
      metalness={0.04}
      sheen={0.55}
      sheenColor="#f0e2d2"
      clearcoat={0.12}
      clearcoatRoughness={0.7}
      depthWrite={false}
    />
  );
}

function Capsule({
  position,
  rotation,
  args,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  args: [number, number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} raycast={() => undefined}>
      <capsuleGeometry args={args} />
      <Skin />
    </mesh>
  );
}

export function ProceduralBody() {
  const visible = useViewerStore((s) => s.visibleLayers.body);
  if (!visible) return null;

  return (
    <group>
      <mesh position={[0, BODY.vertex - 0.1, 0.01]} raycast={() => undefined}>
        <sphereGeometry args={[0.092, 32, 24]} />
        <Skin />
      </mesh>
      <Capsule position={[0, 0.64, 0]} args={[0.036, 0.08, 6, 14]} />
      <Capsule position={[0, 0.28, 0]} args={[0.122, 0.42, 8, 18]} />
      <Capsule position={[0, -0.02, 0]} args={[0.132, 0.08, 6, 14]} />
      {([-1, 1] as const).map((side) => (
        <group key={side}>
          <Capsule
            position={[side * BODY.shoulderX, BODY.shoulderY, 0.01]}
            args={[0.046, 0.02, 6, 12]}
          />
          <Capsule
            position={[side * (BODY.shoulderX + 0.1), BODY.shoulderY - 0.09, 0.02]}
            rotation={[0, 0, side * -0.7]}
            args={[0.04, 0.28, 6, 12]}
          />
          <Capsule
            position={[side * 0.38, 0.28, 0.025]}
            rotation={[0, 0, side * -0.85]}
            args={[0.032, 0.26, 6, 12]}
          />
          <Capsule position={[side * BODY.hipX, -0.04, 0.01]} args={[0.055, 0.04, 6, 12]} />
          <Capsule position={[side * 0.105, -0.22, 0.015]} args={[0.05, 0.38, 6, 14]} />
          <Capsule position={[side * 0.11, -0.6, 0.02]} args={[0.04, 0.36, 6, 12]} />
          <mesh position={[side * 0.11, BODY.footY, 0.05]} raycast={() => undefined}>
            <boxGeometry args={[0.06, 0.035, 0.14]} />
            <Skin />
          </mesh>
        </group>
      ))}
    </group>
  );
}
