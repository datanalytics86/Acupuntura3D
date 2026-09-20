import { ANTERIOR_D } from "./anteriorSilhouette";
import { POSTERIOR_D } from "./posteriorSilhouette";
import { GLUTEAL_FOLD, POPLITEAL, SPINE_LINE, STERNAL_LINE, interiorPaths } from "./interiorShading";
import { CX } from "./landmarks";
import type { AtlasView } from "@/types";
import { useViewerStore } from "@/state/viewerStore";

export function Figure() {
  const view = useViewerStore((s) => s.atlasView);
  const showBody = useViewerStore((s) => s.visibleLayers.body);
  if (!showBody) return null;
  const d = view === "anterior" ? ANTERIOR_D : POSTERIOR_D;
  const shade = interiorPaths(view);
  return (
    <g>
      <ellipse cx={CX} cy={780} rx={210} ry={720} fill="#cbb7a0" opacity={0.07} />
      <path d={d} fill="url(#skinWash)" />
      {shade.map((p) => (
        <path key={p.slice(0, 24)} d={p} fill="#6a5344" opacity={0.11} />
      ))}
      {view === "anterior" ? (
        <>
          <path d={STERNAL_LINE} stroke="#6a5344" strokeWidth={0.8} opacity={0.25} fill="none" />
          <ellipse cx={376} cy={102} rx={7} ry={3.2} fill="#6a5344" opacity={0.22} />
          <ellipse cx={424} cy={102} rx={7} ry={3.2} fill="#6a5344" opacity={0.22} />
          <path d={`M ${CX} 108 Q ${CX + 2} 122 ${CX} 132`} stroke="#6a5344" strokeWidth={1.1} fill="none" opacity={0.35} />
          <path d={`M ${CX - 10} 138 Q ${CX} 142 ${CX + 10} 138`} stroke="#6a5344" strokeWidth={0.9} fill="none" opacity={0.28} />
        </>
      ) : (
        <>
          <path d={SPINE_LINE} stroke="#6a5344" strokeWidth={1.1} opacity={0.28} fill="none" />
          <path d={GLUTEAL_FOLD} stroke="#6a5344" strokeWidth={1.2} fill="none" opacity={0.3} />
          <path d={POPLITEAL(352)} stroke="#6a5344" strokeWidth={1} fill="none" opacity={0.28} />
          <path d={POPLITEAL(448)} stroke="#6a5344" strokeWidth={1} fill="none" opacity={0.28} />
        </>
      )}
      <path d={d} fill="none" stroke="#1a140f" strokeWidth={1.25} />
    </g>
  );
}

export type { AtlasView };
