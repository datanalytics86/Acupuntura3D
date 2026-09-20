import { Viewport } from "./Viewport";
import { Figure } from "./figure/Figure";
import { MeridianPaths } from "./MeridianPaths";
import { QiFlow } from "./QiFlow";
import { Points2D } from "./Points2D";

export function AtlasRoot() {
  return (
    <div className="absolute inset-0">
      <div className="pointer-events-none absolute inset-6 rounded-[28px] border border-amber-200/20" />
      <Viewport>
        <Figure />
        <MeridianPaths />
        <QiFlow />
        <Points2D />
      </Viewport>
    </div>
  );
}
