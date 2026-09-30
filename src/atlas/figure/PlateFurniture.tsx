import { useEffect, useState, type ReactNode } from "react";
import { ZoomControls } from "@/atlas/ZoomControls";
import { MESSAGES, t } from "@/i18n";
import { ELEMENT_HANZI, PIGMENT } from "@/lib/tokens";
import { useViewerStore } from "@/state/viewerStore";
import type { AtlasRegion, AtlasView, Elemento } from "@/types";
import { PlateTitle } from "./PlateTitle";
import "./plate.css";

const ELEMENTS: readonly Elemento[] = ["wood", "fire", "earth", "metal", "water"];

function folioRoman(view: AtlasView, region: AtlasRegion): string {
  if (region === "face") return "III";
  if (region === "hand") return "IV";
  if (region === "foot") return "V";
  return view === "posterior" ? "II" : "I";
}

function PlateKey() {
  const locale = useViewerStore((s) => s.locale);
  const [open, setOpen] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(min-width: 1280px)").matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => setOpen(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <details className="plate-key pointer-events-auto" open={open} tabIndex={0} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary className="t-label">{t(locale, "plateKey")}</summary>
      {ELEMENTS.map((el) => (
        <p key={el} className="plate-key-row t-label">
          <span className="chip-square" style={{ color: PIGMENT[el] }} aria-hidden />
          <span>{MESSAGES.es[el]}</span>
          <span lang="en">{MESSAGES.en[el]}</span>
          <span className="hanzi">{ELEMENT_HANZI[el]}</span>
        </p>
      ))}
      <p className="plate-key-row t-label">
        <span className="chip-square" style={{ color: PIGMENT.vessel }} aria-hidden />
        <span>{MESSAGES.es.plateVessel}</span>
        <span lang="en">{MESSAGES.en.plateVessel}</span>
        <span className="hanzi">任督</span>
      </p>
      <p className="plate-hanzi-row hanzi t-label">木 火 土 金 水 · 任督</p>
      <p className="plate-key-row t-label">
        <span className="plate-swatch" aria-hidden />
        <span>{MESSAGES.es.yin}</span>
        <span className="plate-swatch plate-swatch-yang" aria-hidden />
        <span>{MESSAGES.es.yang}</span>
      </p>
      <p className="plate-key-row t-label">
        <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="5.5" fill="none" stroke="var(--color-ink)" strokeWidth="1.25" />
          <circle cx="8" cy="8" r="2.2" fill="var(--color-ink)" />
        </svg>
        <span>{t(locale, "platePoint")}</span>
      </p>
      <p className="plate-key-row t-label">
        <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="6" fill="none" stroke="var(--color-cinnabar)" strokeWidth="1" />
          <circle cx="8" cy="8" r="2" fill="var(--color-cinnabar)" />
        </svg>
        <span className="hanzi">丹</span>
        <span>{t(locale, "plateDantian")}</span>
      </p>
      <p className="plate-key-row t-label">
        <svg width={28} height={16} viewBox="0 0 28 16" aria-hidden="true">
          <circle className="plate-qi-pulse" cx="8" cy="8" r="3" fill="var(--color-cinnabar)" />
          <circle cx="16" cy="8" r="2" fill="var(--color-cinnabar)" opacity={0.5} />
          <circle cx="22" cy="8" r="1.4" fill="var(--color-cinnabar)" opacity={0.22} />
        </svg>
        <span>{t(locale, "plateQiPulse")}</span>
      </p>
    </details>
  );
}

export function PlateFurniture({
  clock,
  onMinimapHost,
}: {
  clock?: ReactNode;
  onMinimapHost: (node: HTMLDivElement | null) => void;
}) {
  const locale = useViewerStore((s) => s.locale);
  const view = useViewerStore((s) => s.atlasView);
  const region = useViewerStore((s) => s.atlasRegion);
  const readerLeftIsRight = view === "anterior";
  const leftLetter = readerLeftIsRight ? "D" : "I";
  const rightLetter = readerLeftIsRight ? "I" : "D";
  const leftLabel = readerLeftIsRight ? t(locale, "plateSideRight") : t(locale, "plateSideLeft");
  const rightLabel = readerLeftIsRight ? t(locale, "plateSideLeft") : t(locale, "plateSideRight");

  return (
    <div className="pointer-events-none absolute inset-0">
      <p data-testid="folio" className="t-meta plate-folio absolute top-3 left-3 m-0 text-ink">
        LÁM. {folioRoman(view, region)}
      </p>
      <div className="absolute top-2 right-24 left-24 flex flex-col items-center gap-1 text-center">
        <PlateTitle />
        <p className="t-ui m-0 text-ink-2">{t(locale, "plateSubtitle")}</p>
      </div>
      <div ref={onMinimapHost} className="absolute top-3 right-3" />
      <span className="plate-side absolute top-1/2 left-3 -translate-y-1/2" role="img" aria-label={leftLabel}>
        {leftLetter}
      </span>
      <span className="plate-side absolute top-1/2 right-3 -translate-y-1/2" role="img" aria-label={rightLabel}>
        {rightLetter}
      </span>
      <div className="absolute bottom-3 left-3 flex max-w-[18rem] flex-col items-start gap-1">
        {clock ? <div className="pointer-events-auto">{clock}</div> : null}
        <p className="plate-colophon">{t(locale, "plateColophon")}</p>
      </div>
      <div className="absolute right-3 bottom-3 flex flex-col items-end gap-2">
        <div className="plate-zoom pointer-events-auto">
          <ZoomControls />
        </div>
        <PlateKey />
      </div>
    </div>
  );
}
