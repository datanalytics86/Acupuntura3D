import { createPortal } from "react-dom";
import { visibleRect, usePlateBox, useUnitsPerPx } from "@/atlas/screen";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";
import { BODY_PLATE } from "./Figure";
import "./plate.css";

/** Screen-corner map. Must render under Viewport so the plate box and k are the live ones. */
export function Minimap({ host }: { host: HTMLElement | null }) {
  const view = useViewerStore((s) => s.atlasView);
  const region = useViewerStore((s) => s.atlasRegion);
  const zoom = useViewerStore((s) => s.atlasZoom);
  const pan = useViewerStore((s) => s.atlasPan);
  const resetAtlasCamera = useViewerStore((s) => s.resetAtlasCamera);
  const locale = useViewerStore((s) => s.locale);
  const k = useUnitsPerPx();
  const box = usePlateBox();
  const show = host !== null && box.w > 0 && box.h > 0 && (zoom > 1.25 || region !== "body");
  if (!show || !host) return null;

  const vis = visibleRect(pan, k, box);
  const plate = BODY_PLATE[view];
  return createPortal(
    <button
      type="button"
      className="plate-minimap pointer-events-auto"
      aria-label={t(locale, "minimap")}
      onClick={() => resetAtlasCamera()}
    >
      <svg width={72} height={144} viewBox="0 0 800 1600" aria-hidden="true">
        <rect width={800} height={1600} fill="var(--color-paper)" />
        <image href={plate.href} x={plate.x} y={plate.y} width={plate.width} height={plate.height} />
        <rect
          x={vis.l}
          y={vis.t}
          width={Math.max(0, vis.r - vis.l)}
          height={Math.max(0, vis.b - vis.t)}
          fill="var(--color-cinnabar)"
          fillOpacity={0.12}
          stroke="var(--color-cinnabar)"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </button>,
    host,
  );
}
