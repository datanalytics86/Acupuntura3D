import { useViewerStore } from "@/state/viewerStore";
import type { AtlasRegion } from "@/types";

const REGIONS: { id: AtlasRegion; label: string }[] = [
  { id: "body", label: "Cuerpo" },
  { id: "face", label: "Rostro" },
  { id: "hand", label: "Mano" },
  { id: "foot", label: "Pie" },
];

export function PlateTitle() {
  const view = useViewerStore((s) => s.atlasView);
  const region = useViewerStore((s) => s.atlasRegion);
  const setRegion = useViewerStore((s) => s.setAtlasRegion);
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
      <div className="mt-1 flex items-center gap-1" role="group" aria-label="Región de la lámina">
        {REGIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={region === item.id}
            onClick={() => setRegion(item.id)}
            className={`plate-chip ${region === item.id ? "is-on" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}
