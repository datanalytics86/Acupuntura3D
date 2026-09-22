import { useEffect, useMemo, useRef } from "react";
import { loadAcupoints, loadMeridians } from "@/data";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

function EsBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="ml-1 px-1 py-px text-[9px] tracking-[0.16em] text-brass uppercase">ES</span>
  );
}

export function PointDrawer() {
  const points = useMemo(() => loadAcupoints(), []);
  const meridians = useMemo(() => loadMeridians(), []);
  const selectedId = useViewerStore((s) => s.selectedPointId);
  const setSelected = useViewerStore((s) => s.setSelected);
  const followQi = useViewerStore((s) => s.followQi);
  const locale = useViewerStore((s) => s.locale);
  const panelRef = useRef<HTMLElement>(null);
  const point = points.find((p) => p.id === selectedId);

  useEffect(() => {
    if (point) panelRef.current?.focus();
  }, [point]);

  if (!point) return null;
  const mer = meridians.find((m) => m.id === point.meridianId);
  const name = locale === "en" ? point.names.en : point.names.es;
  const esOnly = locale === "en";

  return (
    <aside
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${point.code} ${point.names.pinyin}`}
      className="marginalia drawer-in scroll-thin absolute top-28 right-3 bottom-[5.5rem] z-20 flex w-full max-w-md flex-col overflow-y-auto outline-none md:top-[4.25rem]"
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        setSelected(null);
      }}
    >
      <div className="h-px w-full" style={{ background: mer?.color ?? "var(--color-brass)" }} />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <div className="text-[11px] tracking-[0.22em] text-brass uppercase">{point.code}</div>
            <h2 className="hanzi display mt-1 text-6xl leading-none font-medium text-ink">{point.names.zh}</h2>
            <div className="mt-2 text-sm text-ink">
              {point.names.pinyin}
              <span className="mx-1.5 text-brass">·</span>
              {name}
            </div>
          </div>
          <button
            type="button"
            className="file-link"
            style={{ minWidth: 44, minHeight: 44 }}
            onClick={() => setSelected(null)}
            aria-label={t(locale, "close")}
          >
            Esc
          </button>
        </div>
        <div className="mb-4 flex flex-wrap gap-x-3 gap-y-1 text-[11px] tracking-[0.14em] text-ink uppercase">
          {mer ? <span>{mer.id} {locale === "en" ? mer.names.en : mer.names.es}</span> : null}
          {point.element ? <span>{t(locale, point.element)}</span> : null}
          {point.polaridad ? <span>{t(locale, point.polaridad)}</span> : null}
          <span>
            {point.laterality}
            {mer?.laterality === "bilateral" ? " · L/R" : ""}
          </span>
        </div>
        <section className="mb-4">
          <h3 className="mb-1 text-[10px] tracking-[0.18em] text-brass uppercase">
            {t(locale, "location")}
            <EsBadge show={esOnly} />
          </h3>
          <p className="text-sm leading-relaxed text-ink">{point.location.anatomicEs}</p>
          {point.location.cunNote ? <p className="mt-1 text-xs text-brass">{point.location.cunNote}</p> : null}
        </section>
        {point.functions.length > 0 ? (
          <section className="mb-4">
            <h3 className="mb-1 text-[10px] tracking-[0.18em] text-brass uppercase">
              {t(locale, "functions")}
              <EsBadge show={esOnly} />
            </h3>
            <ul className="space-y-1 text-sm leading-relaxed text-ink">
              {point.functions.map((f) => (
                <li key={f} className="border-l border-brass-line pl-2">
                  {f}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {point.indications.length > 0 ? (
          <section className="mb-4">
            <h3 className="mb-1 text-[10px] tracking-[0.18em] text-brass uppercase">
              {t(locale, "indications")}
              <EsBadge show={esOnly} />
            </h3>
            <ul className="space-y-2 text-sm leading-relaxed text-ink">
              {point.indications.map((f) => (
                <li key={f}>
                  <span className="mr-1.5 text-[9px] tracking-[0.16em] text-brass uppercase">{t(locale, "traditional")}</span>
                  {f}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {point.precautions.length > 0 ? (
          <section className="caution mb-4">
            <h3 className="mb-1 text-[10px] tracking-[0.18em] uppercase">
              {t(locale, "precautions")}
              <EsBadge show={esOnly} />
            </h3>
            <ul className="space-y-1 text-sm">
              {point.precautions.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
        ) : null}
        {point.combinations && point.combinations.length > 0 ? (
          <section className="mb-4">
            <h3 className="mb-1 text-[10px] tracking-[0.18em] text-brass uppercase">
              {t(locale, "combinations")}
              <EsBadge show={esOnly} />
            </h3>
            <ul className="space-y-1 text-sm text-ink">
              {point.combinations.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
        ) : null}
        <section className="mb-4 text-[11px] leading-relaxed text-brass">
          <div>
            {t(locale, "confidence")}:{" "}
            {t(
              locale,
              point.confidence === "high"
                ? "qualityHigh"
                : point.confidence === "medium"
                  ? "qualityMedium"
                  : "qualityLow",
            )}
          </div>
          <div>
            {t(locale, "sources")}: {point.sources.join(" · ")}
          </div>
        </section>
        {mer ? (
          <button type="button" onClick={() => followQi(mer.id)} className="stamp-btn mt-auto">
            {t(locale, "followQi")}
          </button>
        ) : null}
      </div>
    </aside>
  );
}
