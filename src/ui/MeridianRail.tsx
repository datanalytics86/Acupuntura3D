import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode, type Ref } from "react";
import { loadAcupoints, loadMeridians, STAR_CODES } from "@/data";
import { t } from "@/i18n";
import { PIGMENT, meridianPigment } from "@/lib/tokens";
import { useViewerStore } from "@/state/viewerStore";
import type { Acupoint, Elemento, Meridian } from "@/types";
import "./rail.css";

const NARROW = "(max-width: 1023px)";

const ELEMENTS = ["wood", "fire", "earth", "metal", "water"] as const satisfies readonly Elemento[];

const GROUPS = [
  { key: "wood", ids: ["GB", "LR"] },
  { key: "fire", ids: ["HT", "SI", "PC", "TE"] },
  { key: "earth", ids: ["ST", "SP"] },
  { key: "metal", ids: ["LU", "LI"] },
  { key: "water", ids: ["BL", "KI"] },
  { key: "vessel", ids: ["GV", "CV"] },
] as const;

function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia(NARROW).matches,
  );
  useEffect(() => {
    const media = window.matchMedia(NARROW);
    const onChange = () => setNarrow(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return narrow;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function hourLabel(start: number): string {
  return `${pad2(start)}\u2013${pad2((start + 2) % 24)}`;
}

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function GlyphBody() {
  return (
    <Glyph>
      <circle cx="10" cy="4.2" r="1.7" />
      <path d="M10 6.2v4.2M6.8 8.2h6.4M7.4 17.6l1.8-6.4h1.6l1.8 6.4" />
    </Glyph>
  );
}

function GlyphMeridians() {
  return (
    <Glyph>
      <path d="M3.5 14c2-4.5 3.8-4.5 5.8 0s3.8 4.5 6.2 0" />
    </Glyph>
  );
}

function GlyphPoints() {
  return (
    <Glyph>
      <circle cx="6" cy="6.5" r="1.2" />
      <circle cx="13.5" cy="5.5" r="1.2" />
      <circle cx="10" cy="12.5" r="1.6" />
    </Glyph>
  );
}

function GlyphQi() {
  return (
    <Glyph>
      <path d="M3.5 10h9" />
      <path d="M10 6.2 15 10l-5 3.8" />
    </Glyph>
  );
}

function GlyphCenters() {
  return (
    <Glyph>
      <circle cx="10" cy="10" r="4.2" />
      <circle cx="10" cy="10" r="1.1" />
    </Glyph>
  );
}

const LAYERS = [
  ["body", GlyphBody],
  ["meridians", GlyphMeridians],
  ["points", GlyphPoints],
  ["qi", GlyphQi],
  ["centers", GlyphCenters],
] as const;

function starsByMeridian(points: readonly Acupoint[]): Map<string, Acupoint[]> {
  const want = new Set<string>(STAR_CODES);
  const map = new Map<string, Acupoint[]>();
  for (const point of points) {
    if (!want.has(point.code)) continue;
    const list = map.get(point.meridianId);
    if (list) list.push(point);
    else map.set(point.meridianId, [point]);
  }
  return map;
}

function RailBody({ titleRef }: { titleRef?: Ref<HTMLHeadingElement> }) {
  const meridians = useMemo(() => loadMeridians(), []);
  const points = useMemo(() => loadAcupoints(), []);
  const stars = useMemo(() => starsByMeridian(points), [points]);
  const byId = useMemo(() => new Map(meridians.map((m) => [m.id, m])), [meridians]);
  const locale = useViewerStore((s) => s.locale);
  const active = useViewerStore((s) => s.activeMeridianId);
  const selected = useViewerStore((s) => s.selectedPointId);
  const setActive = useViewerStore((s) => s.setActiveMeridian);
  const showPoint = useViewerStore((s) => s.showPoint);
  const element = useViewerStore((s) => s.filters.element);
  const setElementFilter = useViewerStore((s) => s.setElementFilter);
  const layers = useViewerStore((s) => s.visibleLayers);
  const toggle = useViewerStore((s) => s.toggleLayer);
  const groups = element ? GROUPS.filter((group) => group.key === element) : GROUPS;

  return (
    <>
      <h2 id="meridian-rail-title" className="t-meta" tabIndex={-1} ref={titleRef}>
        {t(locale, "meridians")}
      </h2>
      <section className="rail-block">
        <h3 className="t-meta">{t(locale, "layers")}</h3>
        <div className="rail-layers" role="group" aria-label={t(locale, "layers")}>
          {LAYERS.map(([key, Icon]) => (
            <button
              key={key}
              type="button"
              className="rail-layer"
              aria-pressed={layers[key]}
              onClick={() => toggle(key)}
            >
              <Icon />
              {t(locale, key)}
            </button>
          ))}
        </div>
      </section>
      <section className="rail-block">
        <h3 className="t-meta">{t(locale, "element")}</h3>
        <div className="rail-elements" role="group" aria-label={t(locale, "element")}>
          {ELEMENTS.map((el) => (
            <button
              key={el}
              type="button"
              className="rail-element"
              aria-pressed={element === el}
              onClick={() => setElementFilter(element === el ? undefined : el)}
            >
              <span className="rail-swatch" style={{ background: PIGMENT[el] }} aria-hidden="true" />
              {t(locale, el)}
            </button>
          ))}
        </div>
      </section>
      <div className="rail-groups">
        {groups.map((group) => {
          const rows = group.ids.flatMap((id) => {
            const meridian = byId.get(id);
            return meridian ? [meridian] : [];
          });
          if (rows.length === 0) return null;
          const label = group.key === "vessel" ? t(locale, "vessels") : t(locale, group.key);
          return (
            <section key={group.key} className="rail-group">
              <h3 className="t-meta">{label}</h3>
              <ul className="rail-list">
                {rows.map((meridian) => (
                  <MeridianRow
                    key={meridian.id}
                    meridian={meridian}
                    locale={locale}
                    open={active === meridian.id}
                    selected={selected}
                    stars={active === meridian.id ? (stars.get(meridian.id) ?? []) : []}
                    onToggle={() => setActive(active === meridian.id ? null : meridian.id)}
                    onPoint={showPoint}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}

function MeridianRow({
  meridian,
  locale,
  open,
  selected,
  stars,
  onToggle,
  onPoint,
}: {
  meridian: Meridian;
  locale: "es" | "en";
  open: boolean;
  selected: string | null;
  stars: readonly Acupoint[];
  onToggle: () => void;
  onPoint: (id: string) => void;
}) {
  const name = locale === "en" ? meridian.names.en : meridian.names.es;
  return (
    <li>
      <button type="button" className="rail-row" aria-pressed={open} aria-expanded={open} onClick={onToggle}>
        <span className="rail-swatch" style={{ background: meridianPigment(meridian) }} aria-hidden="true" />
        <span className="code">{meridian.code}</span>
        <span className="rail-name">{name}</span>
        <span className="hanzi">{meridian.names.zh}</span>
        <span className="rail-meta">{meridian.pointCount}</span>
        {meridian.clockHour !== undefined ? (
          <span className="rail-meta">{hourLabel(meridian.clockHour)}</span>
        ) : null}
      </button>
      {open && stars.length > 0 ? (
        <ul className="rail-stars">
          {stars.map((point) => (
            <li key={point.id}>
              <button
                type="button"
                className="rail-star"
                aria-current={selected === point.id ? "true" : undefined}
                onClick={() => onPoint(point.id)}
              >
                <span className="code">{point.code}</span>
                <span className="rail-name">{locale === "en" ? point.names.en : point.names.es}</span>
                <span className="hanzi">{point.names.zh}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function trapTab(e: KeyboardEvent<HTMLDivElement>, root: HTMLElement | null, heading: HTMLElement | null) {
  if (e.key !== "Tab" || !root) return;
  const items = [...root.querySelectorAll<HTMLElement>("button, [href], input, select, textarea")].filter(
    (el) => !el.hasAttribute("disabled"),
  );
  const first = items[0];
  const last = items[items.length - 1];
  if (!first || !last) return;
  const active = document.activeElement;
  if (e.shiftKey && (active === first || active === heading)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
}

export function MeridianRail() {
  const railOpen = useViewerStore((s) => s.railOpen);
  const setRailOpen = useViewerStore((s) => s.setRailOpen);
  const locale = useViewerStore((s) => s.locale);
  const narrow = useNarrow();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!narrow || !railOpen) return;
    const prev = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    titleRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopImmediatePropagation();
      setRailOpen(false);
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      prev?.focus();
    };
  }, [narrow, railOpen, setRailOpen]);

  if (!railOpen) return null;

  if (narrow) {
    return (
      <div
        className="rail-overlay"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="meridian-rail-title"
        onKeyDown={(e) => trapTab(e, overlayRef.current, titleRef.current)}
      >
        <aside className="meridian-rail meridian-rail-drawer scroll-thin">
          <RailBody titleRef={titleRef} />
        </aside>
        <button type="button" className="rail-scrim" aria-label={t(locale, "close")} onClick={() => setRailOpen(false)} />
      </div>
    );
  }

  return (
    <aside className="meridian-rail scroll-thin" aria-labelledby="meridian-rail-title">
      <RailBody />
    </aside>
  );
}
