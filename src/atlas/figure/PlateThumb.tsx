import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";
import type { AtlasView } from "@/types";
import { BODY_PLATE } from "./Figure";

/** 72×144 locator for the point card. Same PNG frame as the plate, so the bitmap stays cached. */
export function PlateThumb({
  view,
  x,
  y,
  label,
}: {
  view: AtlasView;
  x: number;
  y: number;
  label?: string;
}) {
  const locale = useViewerStore((s) => s.locale);
  const plate = BODY_PLATE[view];
  return (
    <svg width={72} height={144} viewBox="0 0 800 1600" role="img" aria-label={label ?? t(locale, "plateThumb")}>
      <rect width={800} height={1600} fill="var(--color-paper)" />
      <image href={plate.href} x={plate.x} y={plate.y} width={plate.width} height={plate.height} />
      <circle cx={x} cy={y} r={78} fill="none" stroke="var(--color-cinnabar)" strokeWidth={22} />
      <circle cx={x} cy={y} r={30} fill="var(--color-cinnabar)" />
    </svg>
  );
}
