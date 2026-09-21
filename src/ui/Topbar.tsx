import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";
import { SearchBox } from "./SearchBox";
import type { Locale } from "@/types";

const LAYERS = ["body", "meridians", "points", "qi"] as const;
const LAYER_LABEL: Record<(typeof LAYERS)[number], "body" | "tubes" | "points" | "qi"> = {
  body: "body",
  meridians: "tubes",
  points: "points",
  qi: "qi",
};

export function Topbar() {
  const locale = useViewerStore((s) => s.locale);
  const setLocale = useViewerStore((s) => s.setLocale);
  const layers = useViewerStore((s) => s.visibleLayers);
  const toggle = useViewerStore((s) => s.toggleLayer);
  const railOpen = useViewerStore((s) => s.railOpen);
  const setRailOpen = useViewerStore((s) => s.setRailOpen);
  const atlasView = useViewerStore((s) => s.atlasView);
  const setAtlasView = useViewerStore((s) => s.setAtlasView);

  return (
    <header className="running-head pointer-events-auto absolute inset-x-0 top-0 z-20 flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 md:px-5">
      <button
        type="button"
        className="file-link md:hidden"
        onClick={() => setRailOpen(!railOpen)}
      >
        {t(locale, "meridians")}
      </button>
      <div className="flex items-center gap-2">
        <span className="hanzi text-xl leading-none text-ink">针</span>
        <span className="h-6 w-px bg-brass-line" aria-hidden />
        <div>
          <h1 className="display text-[1.2rem] leading-none font-semibold text-ink">{t(locale, "title")}</h1>
          <p className="mt-0.5 text-[10px] tracking-[0.2em] text-brass uppercase">{t(locale, "subtitle")}</p>
        </div>
      </div>
      <div className="flex items-center gap-3" role="group" aria-label={t(locale, "anterior")}>
        {(["anterior", "posterior"] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={atlasView === v}
            onClick={() => setAtlasView(v)}
            className={`file-link ${atlasView === v ? "is-on" : ""}`}
          >
            {t(locale, v)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {LAYERS.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={layers[key]}
            onClick={() => toggle(key)}
            className={`file-link ${layers[key] ? "is-on" : ""}`}
          >
            {t(locale, LAYER_LABEL[key])}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {(["es", "en"] as Locale[]).map((l) => (
          <button
            key={l}
            type="button"
            aria-pressed={locale === l}
            onClick={() => setLocale(l)}
            className={`file-link ${locale === l ? "is-on" : ""}`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="min-w-[12rem] flex-1 md:max-w-xs md:flex-none">
        <SearchBox />
      </div>
    </header>
  );
}
