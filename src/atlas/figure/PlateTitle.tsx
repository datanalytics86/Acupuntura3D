import { useViewerStore } from "@/state/viewerStore";

export function PlateTitle() {
  const view = useViewerStore((s) => s.atlasView);
  const region = useViewerStore((s) => s.atlasRegion);
  const title =
    region === "face"
      ? "Rostro — lámina"
      : region === "hand"
        ? "Mano — dorso"
        : region === "foot"
          ? "Pie — empeine y maléolo"
          : view === "anterior"
            ? "Cuerpo humano — vista anterior"
            : "Cuerpo humano — vista posterior";

  return (
    <header className="relative z-20 flex flex-col items-center gap-1 px-4 pt-2 pb-0">
      <h2 className="display text-center text-[1.65rem] leading-none font-semibold tracking-wide text-ink">{title}</h2>
      <span className="mt-1 block h-px w-36 bg-brass-line" />
    </header>
  );
}
