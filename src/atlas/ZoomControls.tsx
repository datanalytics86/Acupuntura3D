import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";
import { IconMinus, IconPlus, IconReset } from "@/ui/icons";

export function ZoomControls() {
  const locale = useViewerStore((s) => s.locale);
  const zoomBy = useViewerStore((s) => s.zoomBy);
  const resetAtlasCamera = useViewerStore((s) => s.resetAtlasCamera);
  return (
    <>
      <button type="button" data-testid="zoom-in" aria-label={t(locale, "zoomIn")} onClick={() => zoomBy(1.15)}>
        <IconPlus />
      </button>
      <button type="button" data-testid="zoom-out" aria-label={t(locale, "zoomOut")} onClick={() => zoomBy(1 / 1.15)}>
        <IconMinus />
      </button>
      <button type="button" data-testid="zoom-reset" aria-label={t(locale, "zoomReset")} onClick={() => resetAtlasCamera()}>
        <IconReset />
      </button>
    </>
  );
}
