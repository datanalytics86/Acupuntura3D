import { CX } from "./landmarks";
import {
  ANTERIOR_CONTOURS,
  ANTERIOR_FILLS,
  ANTERIOR_STROKES,
  POSTERIOR_CONTOURS,
  POSTERIOR_FILLS,
  POSTERIOR_STROKES,
  SKIN,
} from "./parts";
import { useViewerStore } from "@/state/viewerStore";

function Gradients() {
  return (
    <defs>
      <linearGradient id="encSkin" x1="0.18" y1="0" x2="0.92" y2="1">
        <stop offset="0%" stopColor="#F6D7C0" />
        <stop offset="45%" stopColor="#E8C4A8" />
        <stop offset="100%" stopColor="#C48A6A" />
      </linearGradient>
      <linearGradient id="encSkinL" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F6D7C0" />
        <stop offset="50%" stopColor="#E8C4A8" />
        <stop offset="100%" stopColor="#D09A78" />
      </linearGradient>
      <linearGradient id="encSkinR" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E8C4A8" />
        <stop offset="40%" stopColor="#D09A78" />
        <stop offset="100%" stopColor="#C48A6A" />
      </linearGradient>
      <radialGradient id="encMuscle" cx="0.34" cy="0.28" r="0.72">
        <stop offset="0%" stopColor="#C48A6A" stopOpacity="0.06" />
        <stop offset="65%" stopColor="#C48A6A" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#A56B50" stopOpacity="0.16" />
      </radialGradient>
      <linearGradient id="encHair" x1="0.3" y1="0" x2="0.75" y2="1">
        <stop offset="0%" stopColor="#5A4036" />
        <stop offset="100%" stopColor="#3D2A22" />
      </linearGradient>
      <radialGradient id="encGround" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#8A6A3B" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#8A6A3B" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

export function Figure() {
  const view = useViewerStore((s) => s.atlasView);
  const showBody = useViewerStore((s) => s.visibleLayers.body);
  if (!showBody) return null;

  const fills = view === "anterior" ? ANTERIOR_FILLS : POSTERIOR_FILLS;
  const strokes = view === "anterior" ? ANTERIOR_STROKES : POSTERIOR_STROKES;
  const contours = view === "anterior" ? ANTERIOR_CONTOURS : POSTERIOR_CONTOURS;

  return (
    <g>
      <Gradients />
      <ellipse cx={CX} cy={1506} rx={168} ry={20} fill="url(#encGround)" />
      {fills.map((p) => (
        <path
          key={`${view}-${p.id}`}
          d={p.d}
          fill={p.fill}
          opacity={p.opacity ?? 1}
          stroke="none"
        />
      ))}
      {strokes.map((s) => (
        <path
          key={`${view}-${s.id}`}
          d={s.d}
          fill="none"
          stroke={s.stroke}
          strokeWidth={s.strokeWidth}
          opacity={s.opacity ?? 1}
          strokeLinecap={s.linecap ?? "round"}
          strokeLinejoin={s.linejoin ?? "round"}
        />
      ))}
      {contours.map((d, i) => (
        <path
          key={`${view}-ink-${i}`}
          d={d}
          fill="none"
          stroke={SKIN.outline}
          strokeWidth={0.95}
          opacity={0.72}
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}
