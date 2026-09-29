import { CINNABAR } from "@/lib/tokens";
import type { AtlasView } from "@/types";

const PLATES = {
  anterior: { href: "/atlas/body-anterior.png", x: 97.61, y: 40, width: 604.79, height: 1440 },
  posterior: { href: "/atlas/body-posterior.png", x: 97.47, y: 40, width: 605.06, height: 1440 },
} as const;

/** 72×144 plate. Marker coordinates are viewBox units (800×1600). */
export function PlateThumb({ view, x, y }: { view: AtlasView; x?: number; y?: number }) {
  const plate = PLATES[view];
  const marked = typeof x === "number" && typeof y === "number";
  return (
    <svg className="folio-thumb" viewBox="0 0 800 1600" width={72} height={144} aria-hidden="true" focusable="false">
      <rect width={800} height={1600} fill="var(--color-paper)" />
      <image href={plate.href} x={plate.x} y={plate.y} width={plate.width} height={plate.height} />
      {marked ? <circle cx={x} cy={y} r={28} fill={CINNABAR} /> : null}
    </svg>
  );
}
