import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, ContactShadows, Grid, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { Vector3 } from "three";
import { loadAcupoints, loadMeridians } from "@/data";
import { canvasDpr } from "@/lib/quality";
import { useViewerStore } from "@/state/viewerStore";
import { ProceduralBody } from "./body/ProceduralBody";
import { MeridianTubes } from "./meridians/MeridianTubes";
import { AcupointInstances } from "./points/AcupointInstances";
import { QiParticles } from "./qi/QiParticles";
import { Starfield } from "./atmosphere/Starfield";
import { buildPointInstances, type PointInstance } from "./picking";

type OrbitHandle = { target: Vector3 };

function CameraRig({ controlsRef }: { controlsRef: MutableRefObject<OrbitHandle | null> }) {
  const selected = useViewerStore((s) => s.selectedPointId);
  const meridians = useMemo(() => loadMeridians(), []);
  const points = useMemo(() => loadAcupoints(), []);
  const instances = useMemo(() => buildPointInstances(points, meridians), [points, meridians]);
  const byId = useMemo(() => {
    const map = new Map<string, PointInstance>();
    for (const it of instances) {
      if (!map.has(it.point.id)) map.set(it.point.id, it);
    }
    return map;
  }, [instances]);
  const { camera } = useThree();
  const target = useRef(new Vector3(0, 0.22, 0));

  useFrame((_, dt) => {
    const controls = controlsRef.current;
    if (!selected || !controls) return;
    const inst = byId.get(selected);
    if (!inst) return;
    const dest = new Vector3(...inst.position);
    target.current.lerp(dest, 1 - Math.pow(0.001, dt));
    controls.target.lerp(target.current, 0.1);
    const desired = dest.clone().add(new Vector3(0.48, 0.18, 0.62));
    camera.position.lerp(desired, 0.055);
  });
  return null;
}

export function CanvasRoot() {
  const meridians = useMemo(() => loadMeridians(), []);
  const points = useMemo(() => loadAcupoints(), []);
  const setSelected = useViewerStore((s) => s.setSelected);
  const tier = useViewerStore((s) => s.qualityTier);
  const controlsRef = useRef<OrbitHandle | null>(null);

  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [1.85, 0.52, 2.45], fov: 38, near: 0.05, far: 50 }}
      dpr={canvasDpr(tier)}
      gl={{
        antialias: tier !== "low",
        alpha: false,
        powerPreference: tier === "low" ? "low-power" : "high-performance",
      }}
      onPointerMissed={() => setSelected(null)}
    >
      <AdaptiveDpr />
      <AdaptiveEvents />
      <color attach="background" args={["#07090d"]} />
      <fog attach="fog" args={["#07090d", 4.2, 14]} />
      <Starfield />
      <hemisphereLight args={["#c9d4e2", "#1a140f", 0.55]} />
      <ambientLight intensity={0.28} />
      <directionalLight position={[2.4, 3.6, 2.1]} intensity={1.15} color="#fff4e5" />
      <directionalLight position={[-2.4, 1.2, -1.4]} intensity={0.35} color="#7f93c4" />
      <pointLight position={[0, 1.1, 0.4]} intensity={0.35} color="#e8c98a" distance={3.2} />
      <OrbitControls
        makeDefault
        ref={(node) => {
          controlsRef.current = node;
        }}
        enableDamping
        dampingFactor={0.08}
        minDistance={0.55}
        maxDistance={5.5}
        maxPolarAngle={Math.PI * 0.86}
        target={[0, 0.22, 0]}
      />
      <Grid
        infiniteGrid
        fadeDistance={7}
        fadeStrength={1.8}
        sectionSize={0.5}
        cellSize={0.1}
        sectionColor="#3d4a3c"
        cellColor="#1c241f"
        position={[0, -0.92, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.921, 0]} raycast={() => undefined}>
        <ringGeometry args={[0.42, 0.428, 64]} />
        <meshBasicMaterial color="#e8c98a" transparent opacity={0.28} />
      </mesh>
      {import.meta.env.DEV ? <axesHelper args={[0.16]} /> : null}
      {tier === "high" ? (
        <ContactShadows position={[0, -0.918, 0]} opacity={0.38} scale={5} blur={2.6} far={2.2} />
      ) : null}
      <ProceduralBody />
      <MeridianTubes meridians={meridians} />
      <AcupointInstances points={points} meridians={meridians} />
      <QiParticles meridians={meridians} />
      <CameraRig controlsRef={controlsRef} />
    </Canvas>
  );
}
