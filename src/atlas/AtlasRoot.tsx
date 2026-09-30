import { useEffect, useState, type ReactNode } from "react";
import { useViewerStore } from "@/state/viewerStore";
import { Viewport } from "./Viewport";
import { DantianMarks } from "./DantianMarks";
import { Figure } from "./figure/Figure";
import { Minimap } from "./figure/Minimap";
import { PlateDefs } from "./figure/PlateDefs";
import { PlateFurniture } from "./figure/PlateFurniture";
import { MeridianPaths } from "./MeridianPaths";
import { Points2D } from "./Points2D";
import { QiFlow } from "./QiFlow";
import "./figure/plate.css";

let sparePlate: HTMLImageElement | null = null;
let spareSrc = "";

function preloadOtherPlate(src: string): void {
  if (spareSrc === src && sparePlate) return;
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  sparePlate = img;
  spareSrc = src;
}

export function AtlasRoot({ clock }: { clock?: ReactNode }) {
  const view = useViewerStore((s) => s.atlasView);
  const [minimapHost, setMinimapHost] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const src = view === "anterior" ? "/atlas/body-posterior.png" : "/atlas/body-anterior.png";
    const run = () => preloadOtherPlate(src);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run);
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(run, 1);
    return () => window.clearTimeout(id);
  }, [view]);

  return (
    <main id="plate" data-testid="plate" className="plate-cell">
      <PlateFurniture clock={clock} onMinimapHost={setMinimapHost} />
      <div className="plate-window" data-testid="plate-window">
        <Viewport>
          <PlateDefs />
          <Figure />
          <MeridianPaths />
          <QiFlow />
          <Points2D />
          <DantianMarks />
          <Minimap host={minimapHost} />
        </Viewport>
      </div>
    </main>
  );
}
