import { useEffect, useMemo, useRef } from "react";
import { loadAcupoints, loadMeridians } from "@/data";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

function EsBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="ml-1 rounded bg-[#8A6A3B]/10 px-1 py-px text-[9px] tracking-wider text-[#8A6A3B] uppercase">ES</span>
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
  const accent = mer?.color ?? "#e8c98a";
  const esOnly = locale === "en";

  return (
    <aside
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${point.code} ${point.names.pinyin}`}
      className="panel scroll-thin absolute right-3 bottom-32 top-24 z-20 flex w-full max-w-md flex-col overflow-y-auto rounded-2xl outline-none max-md:right-3 max-md:bottom-32 max-md:top-auto max-md:max-h-[52vh]"
    >
      <div className="h-1 w-full rounded-t-2xl" style={{ background: accent }} />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm tracking-wide text-[#8A6A3B]">{point.code}</span>
              <span className="hanzi display text-3xl leading-none text-[#2A2118]">{point.names.zh}</span>
            </div>
            <div className="mt-1 text-sm text-[#2A2118]">
              {point.names.pinyin}
              <span className="mx-1.5 text-[#8A6A3B]/40">·</span>
              {name}
            </div>
          </div>
          <button
            type="button"
            className="rounded-full border border-[#8A6A3B]/35 px-2 py-1 text-[10px] tracking-widest text-[#8A6A3B] uppercase"
            onClick={() => setSelected(null)}
            aria-label={t(locale, "close")}
          >
            Esc
          </button>
        </div>
        <div className="mb-4 flex flex-wrap gap-1.5 text-[11px]">
          {mer ? (
            <span className="rounded-full border border-[#8A6A3B]/35 bg-[#F3EBD8] px-2 py-1 text-[#2A2118]">
              {mer.id} {locale === "en" ? mer.names.en : mer.names.es}
            </span>
          ) : null}
          {point.element ? (
            <span className="rounded-full border border-[#8A6A3B]/35 bg-[#F3EBD8] px-2 py-1 text-[#2A2118]">{t(locale, point.element)}</span>
          ) : null}
          {point.polaridad ? (
            <span className="rounded-full border border-[#8A6A3B]/35 bg-[#F3EBD8] px-2 py-1 text-[#2A2118]">{t(locale, point.polaridad)}</span>
          ) : null}
          <span className="rounded-full border border-[#8A6A3B]/35 bg-[#F3EBD8] px-2 py-1 text-[#2A2118]">
            {point.laterality}
            {mer?.laterality === "bilateral" ? " · L/R" : ""}
          </span>
        </div>
        <section className="mb-4">
          <h3 className="mb-1 text-[10px] tracking-[0.18em] text-[#8A6A3B] uppercase">
            {t(locale, "location")}
            <EsBadge show={esOnly} />
          </h3>
          <p className="text-sm leading-relaxed text-[#2A2118]">{point.location.anatomicEs}</p>
          {point.location.cunNote ? <p className="mt-1 text-xs text-[#8A6A3B]">{point.location.cunNote}</p> : null}
        </section>
        {point.functions.length > 0 ? (
          <section className="mb-4">
            <h3 className="mb-1 text-[10px] tracking-[0.18em] text-[#8A6A3B] uppercase">
              {t(locale, "functions")}
              <EsBadge show={esOnly} />
            </h3>
            <ul className="space-y-1 text-sm leading-relaxed text-[#2A2118]">
              {point.functions.map((f) => (
                <li key={f} className="border-l border-[#8A6A3B]/35 pl-2">
                  {f}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {point.indications.length > 0 ? (
          <section className="mb-4">
            <h3 className="mb-1 text-[10px] tracking-[0.18em] text-[#8A6A3B] uppercase">
              {t(locale, "indications")}
              <EsBadge show={esOnly} />
            </h3>
            <ul className="space-y-2 text-sm leading-relaxed text-[#2A2118]">
              {point.indications.map((f) => (
                <li key={f}>
                  <span className="mr-1.5 rounded-full bg-[#8A6A3B]/12 px-2 py-0.5 text-[9px] tracking-wider text-[#8A6A3B] uppercase">
                    {t(locale, "traditional")}
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {point.precautions.length > 0 ? (
          <section className="mb-4 rounded-xl border border-rose-800/25 bg-rose-50 p-3">
            <h3 className="mb-1 text-[10px] tracking-[0.18em] text-rose-900 uppercase">
              {t(locale, "precautions")}
              <EsBadge show={esOnly} />
            </h3>
            <ul className="space-y-1 text-sm text-rose-900">
              {point.precautions.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
        ) : null}
        {point.combinations && point.combinations.length > 0 ? (
          <section className="mb-4">
            <h3 className="mb-1 text-[10px] tracking-[0.18em] text-[#8A6A3B] uppercase">
              {t(locale, "combinations")}
              <EsBadge show={esOnly} />
            </h3>
            <ul className="space-y-1 text-sm text-[#2A2118]">
              {point.combinations.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
        ) : null}
        <section className="mb-4 text-[11px] leading-relaxed text-[#8A6A3B]">
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
            className="mt-auto rounded-full bg-[#8A6A3B] px-4 py-2.5 text-sm text-[#F7F1E4] transition hover:bg-[#6B4A36]"
          >
            {t(locale, "followQi")}
          </button>
        ) : null}
      </div>
    </aside>
  );
}
