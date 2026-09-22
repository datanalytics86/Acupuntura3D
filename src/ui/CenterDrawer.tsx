import { useEffect, useMemo, useRef } from "react";
import { centerById } from "@/atlas/centers";
import { loadAcupoints } from "@/data";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

export function CenterDrawer() {
  const id = useViewerStore((s) => s.selectedCenterId);
  const focus = useViewerStore((s) => s.focusCenter);
  const setSelected = useViewerStore((s) => s.setSelected);
  const locale = useViewerStore((s) => s.locale);
  const panelRef = useRef<HTMLElement>(null);
  const points = useMemo(() => loadAcupoints(), []);
  const center = centerById(id);
  const related = center?.relatedPointId ? points.find((p) => p.id === center.relatedPointId) : undefined;

  useEffect(() => {
    if (center) panelRef.current?.focus();
  }, [center]);

  if (!center) return null;
  const en = locale === "en";

  return (
    <aside
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={center.pinyin}
      className="marginalia drawer-in scroll-thin absolute top-28 right-3 bottom-[5.5rem] z-20 flex w-full max-w-md flex-col overflow-y-auto outline-none md:top-[4.25rem]"
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        focus(null);
      }}
    >
      <div className="h-px w-full" style={{ background: "#7A3B32" }} />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <div className="text-[11px] tracking-[0.22em] text-brass uppercase">{en ? center.en : center.es}</div>
            <div className="hanzi display mt-1 text-6xl leading-none text-ink">{center.zh}</div>
            <div className="mt-2 text-sm text-ink">{center.pinyin}</div>
          </div>
          <button
            type="button"
            className="file-link"
            style={{ minWidth: 44, minHeight: 44 }}
            onClick={() => focus(null)}
            aria-label={t(locale, "close")}
          >
            Esc
          </button>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-ink">{en ? center.noteEn : center.noteEs}</p>
        <section className="mb-4">
          <h3 className="mb-1 text-[10px] tracking-[0.18em] text-brass uppercase">{t(locale, "location")}</h3>
          <p className="text-sm leading-relaxed text-ink">{en ? center.anchorEn : center.anchorEs}</p>
        </section>
        <section className="caution mb-4">
          <h3 className="mb-1 text-[10px] tracking-[0.18em] uppercase">{t(locale, "confidence")}</h3>
          <p className="text-sm">{en ? "Low. Didactic plate anchor." : "Baja. Ancla didáctica de lámina."}</p>
        </section>
        {related ? (
          <button
            type="button"
            className="stamp-btn mt-auto"
            onClick={() => {
              focus(null);
              setSelected(related.id);
            }}
          >
            {en ? `Open the point ${related.code}` : `Abrir el punto ${related.code} ${related.names.zh}`}
          </button>
        ) : null}
      </div>
    </aside>
  );
}
