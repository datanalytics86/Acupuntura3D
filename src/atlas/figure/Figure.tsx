import {
  ANTERIOR_ARM_L_D,
  ANTERIOR_ARM_R_D,
  ANTERIOR_TRUNK_D,
} from "./anteriorSilhouette";
import {
  POSTERIOR_ARM_L_D,
  POSTERIOR_ARM_R_D,
  POSTERIOR_TRUNK_D,
} from "./posteriorSilhouette";
import {
  EAR_L,
  EAR_R,
  GLUTEAL_FOLD,
  HAIR_CAP,
  POPLITEAL,
  SPINE_LINE,
  STERNAL_LINE,
  interiorPaths,
} from "./interiorShading";
import { CX, Y } from "./landmarks";
import { useViewerStore } from "@/state/viewerStore";

export function Figure() {
  const view = useViewerStore((s) => s.atlasView);
  const showBody = useViewerStore((s) => s.visibleLayers.body);
  if (!showBody) return null;
  const trunk = view === "anterior" ? ANTERIOR_TRUNK_D : POSTERIOR_TRUNK_D;
  const armL = view === "anterior" ? ANTERIOR_ARM_L_D : POSTERIOR_ARM_L_D;
  const armR = view === "anterior" ? ANTERIOR_ARM_R_D : POSTERIOR_ARM_R_D;
  const shade = interiorPaths(view);
  const clip = view === "anterior" ? "url(#clipAnterior)" : "url(#clipPosterior)";

  return (
    <g>
      <defs>
        <clipPath id="clipAnterior">
          <path d={ANTERIOR_TRUNK_D} />
          <path d={ANTERIOR_ARM_L_D} />
          <path d={ANTERIOR_ARM_R_D} />
        </clipPath>
        <clipPath id="clipPosterior">
          <path d={POSTERIOR_TRUNK_D} />
          <path d={POSTERIOR_ARM_L_D} />
          <path d={POSTERIOR_ARM_R_D} />
        </clipPath>
        <linearGradient id="sideShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5c4638" stopOpacity="0.2" />
          <stop offset="42%" stopColor="#5c4638" stopOpacity="0" />
          <stop offset="100%" stopColor="#5c4638" stopOpacity="0.07" />
        </linearGradient>
      </defs>
      <ellipse cx={CX} cy={820} rx={250} ry={680} fill="#cbb7a0" opacity={0.06} />
      <path d={trunk} fill="url(#skinWash)" />
      <path d={armL} fill="url(#skinWash)" />
      <path d={armR} fill="url(#skinWash)" />
      <g clipPath={clip}>
        <rect x={210} y={40} width={190} height={1460} fill="url(#sideShade)" />
        {shade.map((p, i) => (
          <path key={`${view}-sh-${i}`} d={p} fill="#6a5344" opacity={0.14} />
        ))}
        {view === "anterior" ? (
          <>
            <path d={HAIR_CAP} fill="#3f322c" opacity={0.32} />
            <path d={EAR_L} fill="#b89a82" />
            <path d={EAR_R} fill="#b89a82" />
            <path d={STERNAL_LINE} stroke="#6a5344" strokeWidth={0.9} opacity={0.28} fill="none" />
            <path
              d={`M 310 276 Q 358 266 ${CX} 260 Q 442 266 490 276`}
              stroke="#6a5344"
              strokeWidth={1.15}
              fill="none"
              opacity={0.3}
            />
            <ellipse cx={370} cy={Y.eyes} rx={10} ry={4.2} fill="#3f322c" opacity={0.38} />
            <ellipse cx={430} cy={Y.eyes} rx={10} ry={4.2} fill="#3f322c" opacity={0.38} />
            <path
              d={`M ${CX} 130 Q ${CX + 3} 150 ${CX} ${Y.nose}`}
              stroke="#6a5344"
              strokeWidth={1.35}
              fill="none"
              opacity={0.42}
            />
            <path
              d={`M ${CX - 13} ${Y.mouth} Q ${CX} ${Y.mouth + 6} ${CX + 13} ${Y.mouth}`}
              stroke="#6a5344"
              strokeWidth={1.15}
              fill="none"
              opacity={0.34}
            />
          </>
        ) : (
          <>
            <path d={HAIR_CAP} fill="#3f322c" opacity={0.36} />
            <path d={SPINE_LINE} stroke="#6a5344" strokeWidth={1.35} opacity={0.32} fill="none" />
            <path d={GLUTEAL_FOLD} stroke="#6a5344" strokeWidth={1.45} fill="none" opacity={0.36} />
            <path d={POPLITEAL(336)} stroke="#6a5344" strokeWidth={1.15} fill="none" opacity={0.32} />
            <path d={POPLITEAL(464)} stroke="#6a5344" strokeWidth={1.15} fill="none" opacity={0.32} />
          </>
        )}
      </g>
      <path d={trunk} fill="none" stroke="#1a140f" strokeWidth={1.35} />
      <path d={armL} fill="none" stroke="#1a140f" strokeWidth={1.35} />
      <path d={armR} fill="none" stroke="#1a140f" strokeWidth={1.35} />
    </g>
  );
}
