import { useState } from "react";
import { useViewerStore } from "@/state/viewerStore";

const REGIONS = [
  { id: "body", label: "Cuerpo" },
  { id: "face", label: "Rostro" },
  { id: "hand", label: "Mano" },
  { id: "foot", label: "Pie" },
] as const;

type RegionId = (typeof REGIONS)[number]["id"];

export function PlateTitle() {
  const view = useViewerStore((s) => s.atlasView);
  const setZoom = useViewerStore((s) => s.setAtlasZoom);
  const setPan = useViewerStore((s) => s.setAtlasPan);
  const reset = useViewerStore((s) => s.resetAtlasCamera);
  const [region, setRegion] = useState<RegionId>("body");
  const title =
    view === "anterior" ? "Cuerpo humano — vista anterior" : "Cuerpo humano — vista posterior";

  function frame(next: RegionId) {
    setRegion(next);
    if (next === "body") {
      reset();
      return;
    }
    if (next === "face") {
      setZoom(4.4);
      setPan({ x: 400, y: 150 });
      return;
    }
    if (next === "hand") {
      setZoom(6);
      setPan({ x: 168, y: 800 });
      return;
    }
    setZoom(5.4);
    setPan({ x: 330, y: 1435 });
  }

  return (
    <header className="relative z-20 flex flex-col items-center gap-1 px-4 pt-2 pb-0">
      <h2 className="display text-center text-[1.65rem] leading-none font-semibold tracking-wide text-[#3a2a1c]">
        {title}
      </h2>
      <div className="flex items-center gap-1" role="group" aria-label="Región de la lámina">
        {REGIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={region === item.id}
            onClick={() => frame(item.id)}
            className={
              region === item.id
                ? "border border-[#4a3224] bg-[#3a2a1c] px-2.5 py-0.5 text-[11px] tracking-wide text-[#F7F0E0]"
                : "border border-[#c4b089] bg-[#F7F0E0] px-2.5 py-0.5 text-[11px] tracking-wide text-[#4a3224]"
            }
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}
