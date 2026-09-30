import type { KeyboardEvent } from "react";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";
import type { AtlasRegion, AtlasView } from "@/types";
import { CommandPalette } from "./CommandPalette";
import { IconIndex } from "./icons";
import { SearchBox } from "./SearchBox";
import "./topbar.css";

const VIEWS: readonly AtlasView[] = ["anterior", "posterior"];
const REGIONS: readonly AtlasRegion[] = ["body", "face", "hand", "foot"];

const REGION_KEY = {
  body: "body",
  face: "regionFace",
  hand: "regionHand",
  foot: "regionFoot",
} as const;

function focusTestId(id: string): void {
  queueMicrotask(() => {
    document.querySelector<HTMLElement>(`[data-testid="${id}"]`)?.focus();
  });
}

function onRadioKey<T extends string>(
  event: KeyboardEvent<HTMLButtonElement>,
  values: readonly T[],
  current: T,
  pick: (next: T) => void,
  testId: (value: T) => string,
): void {
  const key = event.key;
  let delta = 0;
  if (key === "ArrowRight" || key === "ArrowDown") delta = 1;
  else if (key === "ArrowLeft" || key === "ArrowUp") delta = -1;
  else if (key === "Home") delta = -2;
  else if (key === "End") delta = 2;
  else return;
  event.preventDefault();
  event.stopPropagation();
  const last = values.length - 1;
  const index = values.indexOf(current);
  const base = index < 0 ? 0 : index;
  let nextIndex = base;
  if (delta === 1) nextIndex = base >= last ? 0 : base + 1;
  else if (delta === -1) nextIndex = base <= 0 ? last : base - 1;
  else if (delta < 0) nextIndex = 0;
  else nextIndex = last;
  const next = values[nextIndex];
  if (next === undefined) return;
  if (next !== current) pick(next);
  focusTestId(testId(next));
}

export function Topbar() {
  const locale = useViewerStore((s) => s.locale);
  const setLocale = useViewerStore((s) => s.setLocale);
  const railOpen = useViewerStore((s) => s.railOpen);
  const setRailOpen = useViewerStore((s) => s.setRailOpen);
  const setHelpOpen = useViewerStore((s) => s.setHelpOpen);
  const atlasView = useViewerStore((s) => s.atlasView);
  const setAtlasView = useViewerStore((s) => s.setAtlasView);
  const atlasRegion = useViewerStore((s) => s.atlasRegion);
  const setAtlasRegion = useViewerStore((s) => s.setAtlasRegion);

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="topbar-mark" aria-hidden="true">
          针
        </span>
        <h1 className="topbar-title">{t(locale, "title")}</h1>
      </div>
      <div className="topbar-tools">
        <SearchBox />
        <button
          type="button"
          className="topbar-tool topbar-locale"
          aria-label={`${t(locale, "locale")}: ${locale === "es" ? "ES" : "EN"}`}
          onClick={() => setLocale(locale === "es" ? "en" : "es")}
        >
          <span className={locale === "es" ? "is-on" : "is-off"}>ES</span>
          <span aria-hidden="true">·</span>
          <span className={locale === "en" ? "is-on" : "is-off"}>EN</span>
        </button>
        <button
          type="button"
          className="topbar-tool topbar-help"
          aria-label={t(locale, "helpOpen")}
          onClick={() => setHelpOpen(true)}
        >
          ?
        </button>
        <button
          type="button"
          className="topbar-tool"
          data-testid="index-toggle"
          aria-pressed={railOpen}
          aria-label={t(locale, "indexOpen")}
          onClick={() => setRailOpen(!railOpen)}
        >
          <IconIndex />
        </button>
      </div>
      <div className="topbar-plate">
        <div
          className="topbar-seg"
          role="radiogroup"
          aria-label={t(locale, "viewGroup")}
          data-view={atlasView}
        >
          {VIEWS.map((view) => {
            const checked = atlasView === view;
            return (
              <button
                key={view}
                type="button"
                role="radio"
                className="topbar-radio"
                data-testid={`view-${view}`}
                aria-checked={checked}
                tabIndex={checked ? 0 : -1}
                onClick={() => {
                  if (!checked) setAtlasView(view);
                }}
                onKeyDown={(event) =>
                  onRadioKey(event, VIEWS, atlasView, setAtlasView, (value) => `view-${value}`)
                }
              >
                {t(locale, view)}
              </button>
            );
          })}
          <span className="topbar-seg-bar" aria-hidden="true" />
        </div>
        <div className="topbar-regions">
          <div className="topbar-regions-scroller" role="radiogroup" aria-label={t(locale, "regionGroup")} tabIndex={0}>
            {REGIONS.map((id) => {
              const checked = atlasRegion === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  className="topbar-radio topbar-region"
                  data-testid={`region-${id}`}
                  aria-checked={checked}
                  tabIndex={checked ? 0 : -1}
                  onClick={() => {
                    if (!checked) setAtlasRegion(id);
                  }}
                  onKeyDown={(event) =>
                    onRadioKey(event, REGIONS, atlasRegion, setAtlasRegion, (value) => `region-${value}`)
                  }
                >
                  {t(locale, REGION_KEY[id])}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <CommandPalette />
    </header>
  );
}
