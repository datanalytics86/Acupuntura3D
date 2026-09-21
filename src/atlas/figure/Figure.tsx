import { useViewerStore } from "@/state/viewerStore";

/**
 * Licensed surface plates (see public/atlas/ATTRIBUTION.md).
 * Head vertex sits on y=40, soles on y=1480, midline on x=400.
 */
const PLATES = {
  anterior: {
    href: "/atlas/body-anterior.png",
    x: 97.61,
    y: 40,
    width: 604.79,
    height: 1440,
  },
  posterior: {
    href: "/atlas/body-posterior.png",
    x: 97.47,
    y: 40,
    width: 605.06,
    height: 1440,
  },
} as const;

export function Figure() {
  const view = useViewerStore((s) => s.atlasView);
  const showBody = useViewerStore((s) => s.visibleLayers.body);
  if (!showBody) return null;

  const plate = PLATES[view];

  return (
    <g>
      <ellipse cx={400} cy={1504} rx={150} ry={14} fill="#8A6A3B" opacity={0.13} />
      <image
        href={plate.href}
        x={plate.x}
        y={plate.y}
        width={plate.width}
        height={plate.height}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}
