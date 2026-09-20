import { Viewport } from "./Viewport";
import { Figure } from "./figure/Figure";
import { MeridianPaths } from "./MeridianPaths";
import { QiFlow } from "./QiFlow";
import { Points2D } from "./Points2D";

export function AtlasRoot() {
  return (
    <div className="absolute inset-0 bg-[#E7DCC4]">
      <div
        className="absolute inset-5 overflow-hidden rounded-[8px] border border-[#8A6A3B]/35 bg-[#F3EBD8] shadow-[0_1px_0_rgba(255,248,231,0.9),0_18px_44px_rgba(42,33,24,0.16),0_2px_6px_rgba(42,33,24,0.08)]"
      >
        <Viewport>
          <Figure />
          <MeridianPaths />
          <QiFlow />
          <Points2D />
        </Viewport>
      </div>
    </div>
  );
}
