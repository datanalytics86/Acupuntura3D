import { CENTERS, type EnergyCenter } from "@/atlas/centers";
import { CX, Y } from "@/atlas/figure/landmarks";
import { CINNABAR, INK } from "@/lib/colors";
import { useViewerStore } from "@/state/viewerStore";
import type { Point2D } from "@/types";

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
  const onFace = pos.y <= Y.chin + 6 && Math.abs(pos.x - CX) < 76;
  const lx = onFace ? CX + 74 - pos.x : 28;
  const ink = selected ? CINNABAR : INK;
  return (
    <g
      data-atlas-hit=""
      transform={`translate(${pos.x} ${pos.y})`}
      className={selected ? "center-live" : undefined}
      style={{ cursor: "pointer" }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(center.id);
      }}
    >
      <circle r={26} fill="transparent" />
      <circle r={22} fill="var(--color-paper)" fillOpacity={0.92} stroke={ink} strokeWidth={selected ? 1.5 : 1.1} />
      <circle r={15} fill="none" stroke={ink} strokeWidth={0.7} />
      <circle r={2.4} fill={ink} />
      <text
        x={lx}
        y={-2}
        fill={INK}
        fontFamily="Cormorant Garamond, Times New Roman, serif"
        fontSize={13}
        stroke="var(--color-paper)"
        strokeWidth={1.1}
        paintOrder="stroke"
      >
        {center.zh}
      </text>
      <text
        x={lx}
        y={14}
        fill={INK}
        fontFamily="Cormorant Garamond, Times New Roman, serif"
        fontSize={11}
        letterSpacing={0.4}
        stroke="var(--color-paper)"
        strokeWidth={1.1}
        paintOrder="stroke"
      >
        {center.pinyin}
      </text>
    </g>
  );
}

export function DantianMarks() {
  const view = useViewerStore((s) => s.atlasView);
  const visible = useViewerStore((s) => s.visibleLayers.centers);
  const selected = useViewerStore((s) => s.selectedCenterId);
  const focus = useViewerStore((s) => s.focusCenter);
  if (!visible) return null;

  const placed = CENTERS.flatMap((center) => {
    const pos = view === "posterior" ? center.posterior : center.anterior;
    return pos ? [{ center, pos }] : [];
  });
  if (placed.length === 0) return null;

  const axis =
    view === "anterior"
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
          strokeWidth={1.1}
          strokeDasharray="2 6"
          opacity={0.4}
        />
      ) : null}
      {placed.map(({ center, pos }) => (
        <Seal key={center.id} center={center} pos={pos} selected={selected === center.id} onSelect={focus} />
      ))}
    </g>
  );
}
