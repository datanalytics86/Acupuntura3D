import { Viewport } from "./Viewport";
import { Figure } from "./figure/Figure";
import { PlateTitle } from "./figure/PlateTitle";
import { MeridianPaths } from "./MeridianPaths";
import { QiFlow } from "./QiFlow";
import { Points2D } from "./Points2D";

export function AtlasRoot() {
  return (
    <div className="absolute inset-0 bg-[#E7DCC4]">
      <div
        className="absolute inset-x-5 bottom-5 top-24 flex flex-col overflow-hidden border border-[#c4b089] bg-[#F3EBD8] shadow-[0_1px_0_rgba(255,248,231,0.9),0_18px_44px_rgba(42,33,24,0.16)]"
        style={{ borderRadius: "2px 14px 2px 14px" }}
      >
        <div
          className="pointer-events-none absolute inset-[9px] z-10 border border-[#f7f0e0]"
          style={{ borderRadius: "1px 10px 1px 10px" }}
        />
        <PlateTitle />
        <div className="relative min-h-0 flex-1">
          <Viewport>
            <Figure />
            <MeridianPaths />
            <QiFlow />
            <Points2D />
          </Viewport>
        </div>
        <p className="px-5 pt-0.5 pb-2 text-[10px] tracking-wide text-[#8A6A3B]">
          Goran tek-en · CC BY-SA 4.0 · lámina adaptada
        </p>
      </div>
    </div>
  );
}
