import { Viewport } from "./Viewport";
import { Figure } from "./figure/Figure";
import { FacePlate } from "./figure/FacePlate";
import { FootPlate } from "./figure/FootPlate";
import { HandPlate } from "./figure/HandPlate";
import { PlateTitle } from "./figure/PlateTitle";
import { MeridianPaths } from "./MeridianPaths";
import { QiFlow } from "./QiFlow";
import { Points2D } from "./Points2D";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

export function AtlasRoot() {
  const region = useViewerStore((s) => s.atlasRegion);
  const selected = useViewerStore((s) => s.selectedPointId);
  const locale = useViewerStore((s) => s.locale);

  return (
    <div className="absolute inset-0 bg-desk">
      <div
        className="absolute inset-x-5 bottom-5 top-28 flex flex-col overflow-hidden border border-brass-line bg-paper shadow-[0_1px_0_rgba(255,248,231,0.9)] md:top-20"
        style={{ borderRadius: "var(--radius-plate)", viewTransitionName: "atlas-plate" }}
      >
        <div
          className="pointer-events-none absolute inset-[9px] z-10 border border-paper-inset"
          style={{ borderRadius: "1px 10px 1px 10px" }}
        />
        <PlateTitle />
        <div className="relative min-h-0 flex-1">
          <Viewport>
            {region === "body" ? (
              <>
                <Figure />
                <MeridianPaths />
                <QiFlow />
                <Points2D />
              </>
            ) : null}
            {region === "face" ? <FacePlate /> : null}
            {region === "hand" ? <HandPlate /> : null}
            {region === "foot" ? <FootPlate /> : null}
          </Viewport>
        </div>
        {!selected ? (
          <p className="display pointer-events-none absolute right-6 bottom-8 text-[1.15rem] text-brass">
            {t(locale, "choosePoint")}
          </p>
        ) : null}
        <p className="px-5 pt-0.5 pb-2 text-[10px] tracking-[0.16em] text-brass uppercase">
          {region === "body" ? "Goran tek-en · CC BY-SA 4.0 · lámina adaptada" : "Lámina del atlas · tinta sobre papel"}
        </p>
      </div>
    </div>
  );
}
