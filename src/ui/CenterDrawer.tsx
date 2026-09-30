import { useEffect, useId, useMemo, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { centerById, positionOnView } from "@/atlas/centers";
import { regionFrame } from "@/atlas/regionFrames";
import { loadAcupoints } from "@/data";
import { t } from "@/i18n";
import { CINNABAR } from "@/lib/tokens";
import { useViewerStore } from "@/state/viewerStore";
import { IconClose } from "@/ui/icons";
import { Sheet, useNarrowSheet } from "@/ui/Sheet";
import "./folio.css";

export function CenterDrawer() {
  const id = useViewerStore((s) => s.selectedCenterId);
  const focus = useViewerStore((s) => s.focusCenter);
  const setSelected = useViewerStore((s) => s.setSelected);
  const setSheetSnap = useViewerStore((s) => s.setSheetSnap);
  const locale = useViewerStore((s) => s.locale);
  const atlasView = useViewerStore((s) => s.atlasView);
  const atlasRegion = useViewerStore((s) => s.atlasRegion);
  const narrow = useNarrowSheet();
  const headingId = useId();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const points = useMemo(() => loadAcupoints(), []);
  const center = centerById(id);
  const related = center?.relatedPointId ? points.find((p) => p.id === center.relatedPointId) : undefined;
  const en = locale === "en";
  const anchor = center ? (positionOnView(center, atlasView) ?? center.anterior ?? null) : null;
  const onFace = atlasRegion === "face" && center?.id === "upper";
  const zoomHint = onFace ? regionFrame("face", atlasView).zoom : 2.15;

  useEffect(() => {
    if (!center) return;
    titleRef.current?.focus({ preventScroll: true });
  }, [center, narrow]);

  if (!center) return null;

  function close() {
    setSheetSnap("closed");
    focus(null);
  }

  function onEsc(e: ReactKeyboardEvent) {
    if (e.key !== "Escape") return;
    close();
  }

  const ficha = (
    <>
      <div className="folio-body" tabIndex={0}>
        <header>
          <div className="folio-kicker">
            <span className="t-meta">{t(locale, "centers")}</span>
            <span className="chip-square" style={{ background: CINNABAR }} />
          </div>
          <h2 id={headingId} ref={titleRef} tabIndex={-1} className="hanzi folio-hanzi">
            {center.zh}
          </h2>
          <p className="pinyin folio-pinyin">{center.pinyin}</p>
          <p className="t-body folio-name">{en ? center.en : center.es}</p>
        </header>
        <p className="t-body">{en ? center.noteEn : center.noteEs}</p>
        <section>
          <h3 className="t-meta">{t(locale, "location")}</h3>
          <p className="t-body">{en ? center.anchorEn : center.anchorEs}</p>
        </section>
        <section>
          <h3 className="t-meta">{t(locale, "confidence")}</h3>
          <p className="t-body">{t(locale, "confidenceLow")}</p>
          <div className="folio-meter" aria-hidden="true">
            <span className="is-on" />
            <span />
            <span />
          </div>
          <p className="t-label folio-note">{t(locale, "confidenceDidactic")}</p>
        </section>
      </div>
      <footer className="folio-foot">
        {related ? (
          <button
            type="button"
            className="btn"
            onClick={() => {
              focus(null);
              setSelected(related.id);
            }}
          >
            {t(locale, "openPoint")} {related.code} <span className="hanzi">{related.names.zh}</span>
          </button>
        ) : null}
        <button type="button" className="btn btn-ghost" onClick={close} aria-label={t(locale, "close")}>
          <IconClose />
        </button>
      </footer>
    </>
  );

  if (narrow) {
    return (
      <Sheet
        onClose={close}
        labelledBy={headingId}
        anchor={anchor}
        anchorKey={center.id}
        zoomHint={zoomHint}
      >
        <div className="folio" onKeyDown={onEsc}>
          {ficha}
        </div>
      </Sheet>
    );
  }

  return (
    <aside className="folio" role="dialog" aria-modal="false" aria-labelledby={headingId} onKeyDown={onEsc}>
      {ficha}
    </aside>
  );
}
