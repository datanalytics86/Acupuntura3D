import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { Vector3 } from "three";
import { loadAcupoints, loadMeridians } from "@/data";
import { useViewerStore } from "@/state/viewerStore";
import { ProceduralBody } from "./body/ProceduralBody";
import { MeridianTubes } from "./meridians/MeridianTubes";
import { AcupointInstances } from "./points/AcupointInstances";
import { QiParticles } from "./qi/QiParticles";
import { buildPointInstances } from "./picking";

function CameraRig() {
  const selected = useViewerStore((s) => s.selectedPointId);
  const meridians = useMemo(() => loadMeridians(), []);
  const points = useMemo(() => loadAcupoints(), []);
  const instances = useMemo(() => buildPointInstances(points, meridians), [points, meridians]);
  const { camera } = useThree();
  const controls = useThree((s) => s.controls) as { target: Vector3 } | null;
  const target = useRef(new Vector3(0, 0.2, 0));

  useFrame((_, dt) => {
    if (!selected || !controls) return;
    const inst = instances.find((i) => i.point.id === selected);
    if (!inst) return;
    const dest = new Vector3(...inst.position);
    target.current.lerp(dest, 1 - Math.pow(0.001, dt));
    controls.target.lerp(target.current, 0.12);
    const desired = dest.clone().add(new Vector3(0.55, 0.15, 0.7));
    camera.position.lerp(desired, 0.06);
    camera.lookAt(controls.target);
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
      camera={{ position: [1.7, 0.45, 2.3], fov: 42, near: 0.05, far: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      onPointerMissed={() => setSelected(null)}
    >
      <color attach="background" args={["#07090c"]} />
      <hemisphereLight args={["#b8c4d4", "#1a120c", 0.7]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[2.2, 3.4, 2]} intensity={1.1} />
      <directionalLight position={[-2, 1, -1]} intensity={0.25} color="#88a" />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={0.6}
        maxDistance={6}
        target={[0, 0.2, 0]}
      />
      <Grid
        infiniteGrid
        fadeDistance={8}
        fadeStrength={1.4}
        sectionSize={0.5}
        cellSize={0.1}
        sectionColor="#334155"
        cellColor="#1e293b"
        position={[0, -0.92, 0]}
      />
      <axesHelper args={[0.35]} />
      <ProceduralBody />
      <MeridianTubes meridians={meridians} />
      <AcupointInstances points={points} meridians={meridians} />
      <QiParticles meridians={meridians} />
      <CameraRig />
    </Canvas>
  );
}
