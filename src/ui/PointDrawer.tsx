import { useMemo } from "react";
import { loadAcupoints, loadMeridians } from "@/data";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

export function PointDrawer() {
  const points = useMemo(() => loadAcupoints(), []);
  const meridians = useMemo(() => loadMeridians(), []);
  const selectedId = useViewerStore((s) => s.selectedPointId);
  const setSelected = useViewerStore((s) => s.setSelected);
  const followQi = useViewerStore((s) => s.followQi);
  const locale = useViewerStore((s) => s.locale);
  const point = points.find((p) => p.id === selectedId);
  if (!point) return null;
  const mer = meridians.find((m) => m.id === point.meridianId);
  const name = locale === "en" ? point.names.en : point.names.es;

  return (
    <aside className="absolute right-0 bottom-24 top-20 z-20 flex w-full max-w-md flex-col overflow-y-auto border-t border-white/10 bg-black/70 p-4 backdrop-blur-md md:bottom-24 md:top-20 md:border-t-0 md:border-l max-md:bottom-28 max-md:top-auto max-md:max-h-[55vh] max-md:rounded-t-2xl">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="font-mono text-lg text-amber-200">
            {point.code} <span className="text-xl text-zinc-100">{point.names.zh}</span>
          </div>
          <div className="text-sm text-zinc-300">
            {point.names.pinyin} · {name}
          </div>
        </div>
        <button type="button" className="text-zinc-400" onClick={() => setSelected(null)} aria-label={t(locale, "close")}>
          Esc
        </button>
      </div>
      <dl className="mb-3 grid grid-cols-2 gap-2 text-[12px] text-zinc-400">
        {mer ? (
          <div>
            {t(locale, "meridians")}: {mer.id} {locale === "en" ? mer.names.en : mer.names.es}
          </div>
        ) : null}
        {point.element ? (
          <div>
            {t(locale, "element")}: {t(locale, point.element)}
          </div>
        ) : null}
        {point.polaridad ? (
          <div>
            {t(locale, "polarity")}: {t(locale, point.polaridad)}
          </div>
        ) : null}
        <div>
          {t(locale, "laterality")}: {point.laterality}
          {mer?.laterality === "bilateral" ? " (L/R)" : ""}
        </div>
      </dl>
      <section className="mb-3">
        <h3 className="text-[11px] uppercase tracking-wide text-zinc-500">{t(locale, "location")}</h3>
        <p className="text-sm text-zinc-200">{point.location.anatomicEs}</p>
        {point.location.cunNote ? <p className="text-xs text-zinc-500">{point.location.cunNote}</p> : null}
      </section>
      {point.functions.length > 0 ? (
        <section className="mb-3">
          <h3 className="text-[11px] uppercase tracking-wide text-zinc-500">{t(locale, "functions")}</h3>
          <ul className="list-disc pl-4 text-sm text-zinc-200">
            {point.functions.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {point.indications.length > 0 ? (
        <section className="mb-3">
          <h3 className="text-[11px] uppercase tracking-wide text-zinc-500">{t(locale, "indications")}</h3>
          <ul className="space-y-1 text-sm text-zinc-200">
            {point.indications.map((f) => (
              <li key={f}>
                <span className="mr-1 rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] uppercase text-amber-200">
                  {t(locale, "traditional")}
                </span>
                {f}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {point.precautions.length > 0 ? (
        <section className="mb-3">
          <h3 className="text-[11px] uppercase tracking-wide text-rose-300">{t(locale, "precautions")}</h3>
          <ul className="list-disc pl-4 text-sm text-rose-100">
            {point.precautions.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {point.combinations && point.combinations.length > 0 ? (
        <section className="mb-3">
          <h3 className="text-[11px] uppercase tracking-wide text-zinc-500">{t(locale, "combinations")}</h3>
          <ul className="list-disc pl-4 text-sm text-zinc-200">
            {point.combinations.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      ) : null}
      <section className="mb-4 text-[11px] text-zinc-500">
        <div>
          {t(locale, "confidence")}: {point.confidence}
        </div>
        <div>
          {t(locale, "sources")}: {point.sources.join(" · ")}
        </div>
      </section>
      {mer ? (
        <button
          type="button"
          onClick={() => followQi(mer.id)}
          className="mt-auto rounded-md bg-amber-400/20 px-3 py-2 text-sm text-amber-100 hover:bg-amber-400/30"
        >
          {t(locale, "followQi")}
        </button>
      ) : null}
    </aside>
  );
}
