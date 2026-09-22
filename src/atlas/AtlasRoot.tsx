import { Viewport } from "./Viewport";
import { Figure } from "./figure/Figure";
import { PlateTitle } from "./figure/PlateTitle";
import { MeridianPaths } from "./MeridianPaths";
import { QiFlow } from "./QiFlow";
import { Points2D } from "./Points2D";
import { DantianMarks } from "./DantianMarks";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

export function AtlasRoot() {
  const region = useViewerStore((s) => s.atlasRegion);
  const selected = useViewerStore((s) => s.selectedPointId);
  const center = useViewerStore((s) => s.selectedCenterId);
  const railOpen = useViewerStore((s) => s.railOpen);
  const locale = useViewerStore((s) => s.locale);
  const detailOpen = Boolean(selected || center);

  return (
    <div className="absolute inset-0 bg-desk">
      <div
        className={`atlas-frame absolute inset-x-4 bottom-[5.5rem] top-28 flex flex-col overflow-hidden border border-brass-line bg-paper shadow-[0_1px_0_rgba(255,248,231,0.9)] md:top-[4.25rem] ${
          railOpen ? "md:left-[20.5rem]" : "md:left-5"
        } ${detailOpen ? "md:right-[30rem]" : "md:right-5"}`}
        style={{ borderRadius: "var(--radius-plate)", viewTransitionName: "atlas-plate" }}
      >
        <div
          className="pointer-events-none absolute inset-[9px] z-10 border border-paper-inset"
          style={{ borderRadius: "1px 10px 1px 10px" }}
        />
        <PlateTitle />
        <div className="relative min-h-0 flex-1">
          <Viewport>
            <Figure />
            <MeridianPaths />
            <QiFlow />
            <Points2D />
            <DantianMarks />
          </Viewport>
        </div>
        {!selected && !center ? (
          <p className="display pointer-events-none absolute right-6 bottom-8 text-[1.05rem] text-ink">
            {t(locale, "choosePoint")}
          </p>
        ) : null}
        <p className="px-5 pt-0.5 pb-2 text-[10px] tracking-[0.14em] text-ink">
          {region === "body"
            ? "Goran tek-en · CC BY-SA 4.0 · lámina adaptada"
            : "Detalle de la misma lámina · Goran tek-en · CC BY-SA 4.0"}
          <span className="mx-2 text-ink">·</span>
          A/P · 1–4 región · C centros · / buscar
        </p>
      </div>
    </div>
  );
}
