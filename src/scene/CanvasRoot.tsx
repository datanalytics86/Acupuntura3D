import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Grid, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { Vector3 } from "three";
import { loadAcupoints, loadMeridians } from "@/data";
import { useViewerStore } from "@/state/viewerStore";
import { ProceduralBody } from "./body/ProceduralBody";
import { MeridianTubes } from "./meridians/MeridianTubes";
import { AcupointInstances } from "./points/AcupointInstances";
import { QiParticles } from "./qi/QiParticles";
import { Starfield } from "./atmosphere/Starfield";
import { buildPointInstances } from "./picking";

function CameraRig() {
  const selected = useViewerStore((s) => s.selectedPointId);
  const meridians = useMemo(() => loadMeridians(), []);
  const points = useMemo(() => loadAcupoints(), []);
  const instances = useMemo(() => buildPointInstances(points, meridians), [points, meridians]);
  const { camera } = useThree();
  const controls = useThree((s) => s.controls) as { target: Vector3 } | null;
  const target = useRef(new Vector3(0, 0.22, 0));

  useFrame((_, dt) => {
    if (!selected || !controls) return;
    const inst = instances.find((i) => i.point.id === selected);
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

  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [1.85, 0.52, 2.45], fov: 38, near: 0.05, far: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      onPointerMissed={() => setSelected(null)}
    >
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
      <axesHelper args={[0.16]} />
      <ContactShadows position={[0, -0.918, 0]} opacity={0.38} scale={5} blur={2.6} far={2.2} />
      <ProceduralBody />
      <MeridianTubes meridians={meridians} />
      <AcupointInstances points={points} meridians={meridians} />
      <QiParticles meridians={meridians} />
      <CameraRig />
    </Canvas>
  );
}
