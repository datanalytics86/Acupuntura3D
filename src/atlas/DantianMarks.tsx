import { CENTERS, type EnergyCenter } from "@/atlas/centers";
import { useViewerStore } from "@/state/viewerStore";
import type { Point2D } from "@/types";

const INK = "#7A3B32";

function Seal({
  center,
  pos,
  selected,
  onSelect,
}: {
  center: EnergyCenter;
  pos: Point2D;
  selected: boolean;
  onSelect: (id: EnergyCenter["id"]) => void;
}) {
  return (
    <g
      transform={`translate(${pos.x} ${pos.y})`}
      className={selected ? "center-live" : undefined}
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(center.id);
      }}
    >
      <circle r={26} fill="transparent" />
      <circle r={22} fill="var(--color-paper)" fillOpacity={0.92} stroke={INK} strokeWidth={selected ? 1.8 : 1.15} />
      <circle r={15} fill="none" stroke={INK} strokeWidth={0.7} />
      <circle r={2.4} fill={INK} />
      <text
        x={30}
        y={-2}
        fill={INK}
        fontFamily="Cormorant Garamond, Times New Roman, serif"
        fontSize={20}
        stroke="var(--color-paper)"
        strokeWidth={4}
        paintOrder="stroke"
      >
        {center.zh}
      </text>
      <text
        x={30}
        y={16}
        fill="var(--color-brass)"
        fontFamily="Outfit, Segoe UI, sans-serif"
        fontSize={11}
        letterSpacing={1.2}
        stroke="var(--color-paper)"
        strokeWidth={3}
        paintOrder="stroke"
      >
        {center.pinyin}
      </text>
    </g>
  );
}

export function DantianMarks({ frame }: { frame: "body" | "face" }) {
  const view = useViewerStore((s) => s.atlasView);
  const visible = useViewerStore((s) => s.visibleLayers.centers);
  const selected = useViewerStore((s) => s.selectedCenterId);
  const focus = useViewerStore((s) => s.focusCenter);
  if (!visible) return null;

  const placed = CENTERS.flatMap((center) => {
    const pos = frame === "face" ? center.face : view === "posterior" ? center.posterior : center.anterior;
    return pos ? [{ center, pos }] : [];
  });
  if (placed.length === 0) return null;

  const axis =
    frame === "body" && view === "anterior"
      ? placed.filter((p) => p.center.anterior).map((p) => p.pos)
      : [];

  return (
    <g aria-label="Dantian">
      {axis.length >= 2 ? (
        <line
          x1={400}
          y1={Math.min(...axis.map((p) => p.y))}
          x2={400}
          y2={Math.max(...axis.map((p) => p.y))}
          stroke={INK}
          strokeWidth={0.8}
          strokeDasharray="2 6"
          opacity={0.55}
          style={{ mixBlendMode: "multiply" }}
        />
      ) : null}
      {placed.map(({ center, pos }) => (
        <Seal key={center.id} center={center} pos={pos} selected={selected === center.id} onSelect={focus} />
      ))}
    </g>
  );
}
