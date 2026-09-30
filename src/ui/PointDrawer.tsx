import { useEffect, useId, useMemo, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { PlateThumb } from "@/atlas/figure/PlateThumb";
import { VIEW_H, VIEW_W } from "@/atlas/figure/landmarks";
import { pointOnView } from "@/atlas/mapCoords";
import { regionFrame } from "@/atlas/regionFrames";
import { loadAcupoints, loadMeridians } from "@/data";
import { t } from "@/i18n";
import { stripTraditionalPrefix } from "@/lib/text";
import { ELEMENT_HANZI, meridianPigment } from "@/lib/tokens";
import { useViewerStore } from "@/state/viewerStore";
import type { Acupoint, AtlasRegion, AtlasView, Confidence, Elemento, Point2D } from "@/types";
import { IconArrowLeft, IconArrowRight, IconClose } from "@/ui/icons";
import { Sheet, useNarrowSheet } from "@/ui/Sheet";
import "./folio.css";

const CONFIDENCE_KEY = {
  high: "confidenceHigh",
  medium: "confidenceMedium",
  low: "confidenceLow",
} as const;

function confidenceSteps(level: Confidence): number {
  if (level === "high") return 3;
  if (level === "medium") return 2;
  return 1;
}

function clockLabel(hour: number): string {
  const start = ((hour % 24) + 24) % 24;
  const end = (start + 2) % 24;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(start)}–${pad(end)}`;
}

function framedPoint(
  point: Acupoint,
  view: AtlasView,
  region: AtlasRegion,
): { pos: Point2D; zoom: number } | null {
  const here = pointOnView(point, view);
  const other: AtlasView = view === "anterior" ? "posterior" : "anterior";
  const pos = here ?? pointOnView(point, other);
  if (!pos) return null;
  const face = here ? view : other;
  if (region !== "body") {
    const frame = regionFrame(region, face);
    const hw = VIEW_W / frame.zoom / 2;
    const hh = VIEW_H / frame.zoom / 2;
    const inside = Math.abs(pos.x - frame.pan.x) <= hw && Math.abs(pos.y - frame.pan.y) <= hh;
    if (inside) return { pos, zoom: frame.zoom };
  }
  return { pos, zoom: 2.4 };
}

function EsMark({ show }: { show: boolean }) {
  if (!show) return null;
  return <span className="t-meta"> ES</span>;
}

export function PointDrawer() {
  const points = useMemo(() => loadAcupoints(), []);
  const meridians = useMemo(() => loadMeridians(), []);
  const selectedId = useViewerStore((s) => s.selectedPointId);
  const setSelected = useViewerStore((s) => s.setSelected);
  const showPoint = useViewerStore((s) => s.showPoint);
  const followQi = useViewerStore((s) => s.followQi);
  const setSheetSnap = useViewerStore((s) => s.setSheetSnap);
  const locale = useViewerStore((s) => s.locale);
  const atlasView = useViewerStore((s) => s.atlasView);
  const atlasRegion = useViewerStore((s) => s.atlasRegion);
  const narrow = useNarrowSheet();
  const headingId = useId();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const point = points.find((p) => p.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedId) return;
    const active = document.activeElement;
    const back = active instanceof HTMLElement || active instanceof SVGElement ? active : null;
    titleRef.current?.focus({ preventScroll: true });
    return () => {
      if (back?.isConnected) back.focus({ preventScroll: true });
    };
  }, [selectedId, narrow]);

  if (!point) return null;

  const mer = meridians.find((m) => m.id === point.meridianId);
  const name = locale === "en" ? point.names.en : point.names.es;
  const esOnly = locale === "en";
  const element: Elemento | undefined = point.element ?? mer?.element;
  const polarity = point.polaridad ?? mer?.polaridad;
  const group = points.filter((pt) => pt.meridianId === point.meridianId);
  const idx = group.findIndex((pt) => pt.id === point.id);
  const prev = idx >= 0 ? group[(idx - 1 + group.length) % group.length] : undefined;
  const next = idx >= 0 ? group[(idx + 1) % group.length] : undefined;
  const framed = framedPoint(point, atlasView, atlasRegion);
  const thumbView: AtlasView =
    pointOnView(point, atlasView) != null
      ? atlasView
      : pointOnView(point, "anterior")
        ? "anterior"
        : "posterior";
  const mark = pointOnView(point, thumbView);
  const traditional = point.indications.map((line) => stripTraditionalPrefix(line)).filter((line) => line.length > 0);
  const steps = confidenceSteps(point.confidence);

  function close() {
    setSheetSnap("closed");
    setSelected(null);
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
            <span className="code">{point.code}</span>
            <span className="chip-square" style={{ background: meridianPigment(mer ?? { id: point.meridianId, element }) }} />
          </div>
          <h2 id={headingId} ref={titleRef} tabIndex={-1} className="hanzi folio-hanzi">
            {point.names.zh}
          </h2>
          <p className="pinyin folio-pinyin">{point.names.pinyin}</p>
          <p className="t-body folio-name">{name}</p>
        </header>
        <dl className="folio-meta">
          {mer ? (
            <>
              <dt className="t-meta">{t(locale, "meridian")}</dt>
              <dd className="t-body">
                {mer.code} {locale === "en" ? mer.names.en : mer.names.es}
              </dd>
            </>
          ) : null}
          {element ? (
            <>
              <dt className="t-meta">{t(locale, "element")}</dt>
              <dd className="t-body">
                <span className="hanzi">{ELEMENT_HANZI[element]}</span> {t(locale, element)}
              </dd>
            </>
          ) : null}
          {polarity ? (
            <>
              <dt className="t-meta">{t(locale, "polarity")}</dt>
              <dd className="t-body">{t(locale, polarity)}</dd>
            </>
          ) : null}
          {mer ? (
            <>
              <dt className="t-meta">{t(locale, "laterality")}</dt>
              <dd className="t-body">{mer.laterality === "midline" ? t(locale, "midline") : t(locale, "bilateral")}</dd>
            </>
          ) : null}
          {mer?.clockHour !== undefined ? (
            <>
              <dt className="t-meta">{t(locale, "clockHour")}</dt>
              <dd className="t-body code">{clockLabel(mer.clockHour)}</dd>
            </>
          ) : null}
        </dl>
        <section>
          <h3 className="t-meta">
            {t(locale, "location")}
            <EsMark show={esOnly} />
          </h3>
          <div className="folio-loc">
            <PlateThumb view={thumbView} x={mark?.x} y={mark?.y} />
            <div>
              <p className="t-body">{point.location.anatomicEs}</p>
              {point.location.cunNote ? <p className="t-label folio-note">{point.location.cunNote}</p> : null}
            </div>
          </div>
        </section>
        {point.functions.length > 0 ? (
          <section>
            <h3 className="t-meta">
              {t(locale, "functions")}
              <EsMark show={esOnly} />
            </h3>
            <ul className="folio-list t-body">
              {point.functions.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ) : null}
        {traditional.length > 0 ? (
          <section>
            <h3 className="t-meta">
              {t(locale, "traditionalUse")}
              <EsMark show={esOnly} />
            </h3>
            <ul className="folio-list t-body">
              {traditional.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ) : null}
        {point.precautions.length > 0 ? (
          <section className="caution">
            <h3 className="t-meta">
              {t(locale, "precautions")}
              <EsMark show={esOnly} />
            </h3>
            <ul className="folio-list t-body">
              {point.precautions.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ) : null}
        {point.combinations && point.combinations.length > 0 ? (
          <section>
            <h3 className="t-meta">
              {t(locale, "combinations")}
              <EsMark show={esOnly} />
            </h3>
            <ul className="folio-list t-body">
              {point.combinations.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ) : null}
        <section>
          <h3 className="t-meta">{t(locale, "confidence")}</h3>
          <p className="t-body">{t(locale, CONFIDENCE_KEY[point.confidence])}</p>
          <div className="folio-meter" aria-hidden="true">
            {[0, 1, 2].map((step) => (
              <span key={step} className={step < steps ? "is-on" : undefined} />
            ))}
          </div>
          <p className="t-label folio-note">{t(locale, "confidenceDidactic")}</p>
        </section>
        {point.sources.length > 0 ? (
          <section>
            <h3 className="t-meta">{t(locale, "sources")}</h3>
            <ol className="folio-notes t-body">
              {point.sources.map((src) => (
                <li key={src}>{src}</li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>
      <footer className="folio-foot">
        {prev ? (
          <button type="button" className="btn btn-ghost" onClick={() => showPoint(prev.id)} aria-label={t(locale, "pointPrev")}>
            <IconArrowLeft />
            <span>{t(locale, "pointPrev")}</span>
          </button>
        ) : null}
        {next ? (
          <button type="button" className="btn btn-ghost" onClick={() => showPoint(next.id)} aria-label={t(locale, "pointNext")}>
            <span>{t(locale, "pointNext")}</span>
            <IconArrowRight />
          </button>
        ) : null}
        {mer ? (
          <button type="button" className="btn" onClick={() => followQi(mer.id)}>
            {t(locale, "followQiBtn")}
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
        anchor={framed?.pos ?? null}
        anchorKey={point.id}
        zoomHint={framed?.zoom ?? 2.4}
      >
        <div className="folio">{ficha}</div>
      </Sheet>
    );
  }

  return (
    <aside className="folio" role="dialog" aria-modal="false" aria-labelledby={headingId} onKeyDown={onEsc}>
      {ficha}
    </aside>
  );
}
