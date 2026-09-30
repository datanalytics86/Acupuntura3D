import { useEffect, useState, type ReactNode } from "react";
import { ZoomControls } from "@/atlas/ZoomControls";
import { t } from "@/i18n";
import { ELEMENT_HANZI, PIGMENT } from "@/lib/tokens";
import { useViewerStore } from "@/state/viewerStore";
import type { AtlasRegion, AtlasView, Elemento, Locale } from "@/types";
import { PlateTitle } from "./PlateTitle";
import "./plate.css";

const ELEMENTS: readonly Elemento[] = ["wood", "fire", "earth", "metal", "water"];

function folioRoman(view: AtlasView, region: AtlasRegion): string {
  if (region === "face") return "III";
  if (region === "hand") return "IV";
  if (region === "foot") return "V";
  return view === "posterior" ? "II" : "I";
}

function useMinWidth(px: number): boolean {
  const query = `(min-width: ${px}px)`;
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function" ? window.matchMedia(query).matches : true,
  );
  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

function KeyBody({ locale }: { locale: Locale }) {
  return (
    <>
      <h3 className="plate-key-title">{t(locale, "plateKey")}</h3>
      <div className="plate-key-cols">
        {ELEMENTS.map((el) => (
          <p key={el} className="plate-key-row">
            <span className="chip-square" style={{ color: PIGMENT[el] }} aria-hidden />
            <span>{t(locale, el)}</span>
            <span className="hanzi">{ELEMENT_HANZI[el]}</span>
          </p>
        ))}
        <p className="plate-key-row">
          <span className="chip-square" style={{ color: PIGMENT.vessel }} aria-hidden />
          <span>{t(locale, "plateVessel")}</span>
          <span className="hanzi">任督</span>
        </p>
      </div>
      <div className="plate-key-swatches">
        <p className="plate-key-row">
          <span className="plate-swatch" aria-hidden />
          <span>{t(locale, "yin")}</span>
        </p>
        <p className="plate-key-row">
          <span className="plate-swatch plate-swatch-yang" aria-hidden />
          <span>{t(locale, "yang")}</span>
        </p>
        <p className="plate-key-row">
          <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="5.5" fill="none" stroke="var(--color-ink)" strokeWidth="1.25" />
            <circle cx="8" cy="8" r="2.2" fill="var(--color-ink)" />
          </svg>
          <span>{t(locale, "platePoint")}</span>
        </p>
        <p className="plate-key-row">
          <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="6" fill="none" stroke="var(--color-cinnabar)" strokeWidth="1" />
            <circle cx="8" cy="8" r="2" fill="var(--color-cinnabar)" />
          </svg>
          <span>{t(locale, "plateDantian")}</span>
        </p>
        <p className="plate-key-row plate-key-qi">
          <svg width={28} height={16} viewBox="0 0 28 16" aria-hidden="true">
            <circle className="plate-qi-pulse" cx="8" cy="8" r="3" fill="var(--color-cinnabar)" />
            <circle cx="16" cy="8" r="2" fill="var(--color-cinnabar)" opacity={0.5} />
            <circle cx="22" cy="8" r="1.4" fill="var(--color-cinnabar)" opacity={0.22} />
          </svg>
          <span>{t(locale, "plateQiPulse")}</span>
        </p>
      </div>
    </>
  );
}

function PlateKey() {
  const locale = useViewerStore((s) => s.locale);
  const wide = useMinWidth(1100);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (wide) setOpen(false);
  }, [wide]);

  if (wide) {
    return (
      <section className="plate-key" data-testid="plate-key" aria-label={t(locale, "plateKey")}>
        <KeyBody locale={locale} />
      </section>
    );
  }

  return (
    <div className="plate-key-pop" data-testid="plate-key">
      <button
        type="button"
        className="plate-key-button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {t(locale, "plateKey")}
      </button>
      {open ? (
        <div className="plate-key-panel" role="dialog" aria-label={t(locale, "plateKey")}>
          <KeyBody locale={locale} />
        </div>
      ) : null}
    </div>
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

  return (
    <>
      <header className="plate-band-top">
        <p data-testid="folio" className="plate-folio">
          {t(locale, "plateLam")} {folioRoman(view, region)}
        </p>
        <div className="plate-title-block">
          <PlateTitle />
        </div>
      </header>
      <div className="plate-slot-clock">{clock}</div>
      <div className="plate-slot-right">
        <div ref={onMinimapHost} className="plate-minimap-host" />
        <div className="plate-slot-controls">
          <div data-testid="plate-zoom" className="plate-zoom">
            <ZoomControls />
          </div>
          <PlateKey />
        </div>
      </div>
      <footer className="plate-band-bottom">
        <p data-testid="plate-colophon" className="plate-colophon">
          {t(locale, "plateColophon")}
        </p>
      </footer>
    </>
  );
}
