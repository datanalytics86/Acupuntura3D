import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

export function PlateTitle() {
  const view = useViewerStore((s) => s.atlasView);
  const region = useViewerStore((s) => s.atlasRegion);
  const locale = useViewerStore((s) => s.locale);
  const title =
    region === "face"
      ? t(locale, "plateFace")
      : region === "hand"
        ? t(locale, "plateHand")
        : region === "foot"
          ? t(locale, "plateFoot")
          : view === "anterior"
            ? locale === "es"
              ? "Cuerpo humano — vista anterior"
              : t(locale, "plateAnterior")
            : t(locale, "platePosterior");

  return <h2 className="t-title m-0 text-center text-ink">{title}</h2>;
}
