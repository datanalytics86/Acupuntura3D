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
  const accent = mer?.color ?? "#e8c98a";

  return (
    <aside className="panel scroll-thin absolute right-3 bottom-32 top-24 z-20 flex w-full max-w-md flex-col overflow-y-auto rounded-2xl max-md:right-3 max-md:bottom-32 max-md:top-auto max-md:max-h-[52vh]">
      <div className="h-1 w-full rounded-t-2xl" style={{ background: accent }} />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm tracking-wide text-amber-200">{point.code}</span>
              <span className="hanzi display text-3xl leading-none text-zinc-50">{point.names.zh}</span>
            </div>
            <div className="mt-1 text-sm text-zinc-300">
              {point.names.pinyin}
              <span className="mx-1.5 text-white/20">·</span>
              {name}
            </div>
          </div>
          <button
            type="button"
            className="rounded-full border border-white/10 px-2 py-1 text-[10px] tracking-widest text-zinc-400 uppercase"
            onClick={() => setSelected(null)}
            aria-label={t(locale, "close")}
          >
            Esc
          </button>
        </div>
        <div className="mb-4 flex flex-wrap gap-1.5 text-[11px]">
          {mer ? (
            <span className="rounded-full bg-white/8 px-2 py-1 text-zinc-300">
              {mer.id} {locale === "en" ? mer.names.en : mer.names.es}
            </span>
          ) : null}
          {point.element ? (
            <span className="rounded-full bg-white/8 px-2 py-1 text-zinc-300">{t(locale, point.element)}</span>
          ) : null}
          {point.polaridad ? (
            <span className="rounded-full bg-white/8 px-2 py-1 text-zinc-300">{t(locale, point.polaridad)}</span>
          ) : null}
          <span className="rounded-full bg-white/8 px-2 py-1 text-zinc-300">
            {point.laterality}
            {mer?.laterality === "bilateral" ? " · L/R" : ""}
          </span>
        </div>
        <section className="mb-4">
          <h3 className="mb-1 text-[10px] tracking-[0.18em] text-zinc-500 uppercase">{t(locale, "location")}</h3>
          <p className="text-sm leading-relaxed text-zinc-200">{point.location.anatomicEs}</p>
          {point.location.cunNote ? <p className="mt-1 text-xs text-zinc-500">{point.location.cunNote}</p> : null}
        </section>
        {point.functions.length > 0 ? (
          <section className="mb-4">
            <h3 className="mb-1 text-[10px] tracking-[0.18em] text-zinc-500 uppercase">{t(locale, "functions")}</h3>
            <ul className="space-y-1 text-sm leading-relaxed text-zinc-200">
              {point.functions.map((f) => (
                <li key={f} className="border-l border-amber-200/30 pl-2">
                  {f}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {point.indications.length > 0 ? (
          <section className="mb-4">
            <h3 className="mb-1 text-[10px] tracking-[0.18em] text-zinc-500 uppercase">{t(locale, "indications")}</h3>
            <ul className="space-y-2 text-sm leading-relaxed text-zinc-200">
              {point.indications.map((f) => (
                <li key={f}>
                  <span className="mr-1.5 rounded-full bg-amber-300/12 px-2 py-0.5 text-[9px] tracking-wider text-amber-200 uppercase">
                    {t(locale, "traditional")}
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {point.precautions.length > 0 ? (
          <section className="mb-4 rounded-xl border border-rose-300/20 bg-rose-950/30 p-3">
            <h3 className="mb-1 text-[10px] tracking-[0.18em] text-rose-200 uppercase">{t(locale, "precautions")}</h3>
            <ul className="space-y-1 text-sm text-rose-50">
              {point.precautions.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
        ) : null}
        {point.combinations && point.combinations.length > 0 ? (
          <section className="mb-4">
            <h3 className="mb-1 text-[10px] tracking-[0.18em] text-zinc-500 uppercase">{t(locale, "combinations")}</h3>
            <ul className="space-y-1 text-sm text-zinc-200">
              {point.combinations.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
        ) : null}
        <section className="mb-4 text-[11px] leading-relaxed text-zinc-500">
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
            className="mt-auto rounded-full bg-amber-300/18 px-4 py-2.5 text-sm text-amber-100 transition hover:bg-amber-300/28"
          >
            {t(locale, "followQi")}
          </button>
        ) : null}
      </div>
    </aside>
  );
}
