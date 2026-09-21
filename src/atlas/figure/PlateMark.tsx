import { useViewerStore } from "@/state/viewerStore";

export function PlateMark({
  x,
  y,
  id,
  code,
  zh,
  meridianId,
}: {
  x: number;
  y: number;
  id: string;
  code: string;
  zh: string;
  meridianId: string;
}) {
  const setSelected = useViewerStore((s) => s.setSelected);
  const setActive = useViewerStore((s) => s.setActiveMeridian);
  const selected = useViewerStore((s) => s.selectedPointId);
  const on = selected === id;

  return (
    <g
      transform={`translate(${x} ${y})`}
      onClick={(e) => {
        e.stopPropagation();
        setSelected(id);
        setActive(meridianId);
      }}
      style={{ cursor: "pointer" }}
    >
      <circle r={18} fill="transparent" />
      {on ? <circle r={12} fill="var(--color-brass)" opacity={0.16} /> : null}
      <circle r={4.2} fill="var(--color-paper)" />
      <circle r={3.2} fill="var(--color-jade-ink)" />
      <text
        y={-14}
        textAnchor="middle"
        fill="var(--color-ink)"
        stroke="var(--color-paper)"
        strokeWidth={4}
        paintOrder="stroke"
        fontFamily="Cormorant Garamond, Times New Roman, serif"
        fontSize={18}
      >
        {code} {zh}
      </text>
    </g>
  );
}
