import { BODY } from "@/lib/bodyMetrics";
import { useViewerStore } from "@/state/viewerStore";

const SKIN = "#c4b8a8";

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
      <meshPhysicalMaterial
        color={SKIN}
        transparent
        opacity={0.48}
        roughness={0.58}
        metalness={0.06}
        depthWrite={false}
      />
    </mesh>
  );
}

export function ProceduralBody() {
  const visible = useViewerStore((s) => s.visibleLayers.body);
  if (!visible) return null;

  const armOut = 0.22;
  const armLen = 0.28;
  const forearmLen = 0.26;
  const thighLen = 0.38;
  const shinLen = 0.36;

  return (
    <group>
      <mesh position={[0, BODY.vertex - 0.1, 0.01]} raycast={() => undefined}>
        <sphereGeometry args={[0.09, 24, 18]} />
        <meshPhysicalMaterial
          color={SKIN}
          transparent
          opacity={0.5}
          roughness={0.5}
          metalness={0.05}
          depthWrite={false}
        />
      </mesh>
      <Capsule position={[0, 0.64, 0]} args={[0.035, 0.08, 4, 10]} />
      <Capsule position={[0, 0.28, 0]} args={[0.12, 0.42, 6, 14]} />
      <Capsule position={[0, -0.02, 0]} args={[0.13, 0.08, 4, 12]} />
      {([-1, 1] as const).map((side) => (
        <group key={side}>
          <Capsule
            position={[side * BODY.shoulderX, BODY.shoulderY, 0.01]}
            args={[0.045, 0.02, 4, 10]}
          />
          <Capsule
            position={[side * (BODY.shoulderX + armOut * 0.45), BODY.shoulderY - 0.09, 0.02]}
            rotation={[0, 0, side * -0.7]}
            args={[0.04, armLen, 4, 10]}
          />
          <Capsule
            position={[side * 0.38, 0.28, 0.025]}
            rotation={[0, 0, side * -0.85]}
            args={[0.032, forearmLen, 4, 10]}
          />
          <Capsule
            position={[side * BODY.hipX, -0.04, 0.01]}
            args={[0.055, 0.04, 4, 10]}
          />
          <Capsule
            position={[side * 0.105, -0.22, 0.015]}
            args={[0.05, thighLen, 4, 12]}
          />
          <Capsule
            position={[side * 0.11, -0.6, 0.02]}
            args={[0.04, shinLen, 4, 10]}
          />
          <mesh position={[side * 0.11, BODY.footY, 0.05]} raycast={() => undefined}>
            <boxGeometry args={[0.06, 0.04, 0.14]} />
            <meshPhysicalMaterial
              color={SKIN}
              transparent
              opacity={0.48}
              roughness={0.6}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
