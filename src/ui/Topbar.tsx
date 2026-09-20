import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";
import { SearchBox } from "./SearchBox";
import type { Locale, QualityTier } from "@/types";

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
  const quality = useViewerStore((s) => s.qualityTier);
  const setQuality = useViewerStore((s) => s.setQuality);
  const layers = useViewerStore((s) => s.visibleLayers);
  const toggle = useViewerStore((s) => s.toggleLayer);
  const railOpen = useViewerStore((s) => s.railOpen);
  const setRailOpen = useViewerStore((s) => s.setRailOpen);
  const atlasView = useViewerStore((s) => s.atlasView);
  const setAtlasView = useViewerStore((s) => s.setAtlasView);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col gap-2 p-3 md:flex-row md:items-start md:justify-between">
      <div className="panel pointer-events-auto flex items-center gap-3 rounded-2xl px-3 py-2">
        <button
          type="button"
          className="rounded-full border border-[#8A6A3B]/35 px-2.5 py-1 text-[11px] text-[#2A2118] md:hidden"
          onClick={() => setRailOpen(!railOpen)}
        >
          {t(locale, "meridians")}
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F1E4] text-[#6B2D3C] ring-1 ring-[#8A6A3B]/35">
          <span className="hanzi text-lg leading-none">针</span>
        </div>
        <div>
          <h1 className="display text-[1.15rem] leading-none font-semibold tracking-wide text-[#2A2118]">
            {t(locale, "title")}
          </h1>
          <p className="mt-0.5 text-[10px] tracking-[0.18em] text-[#8A6A3B] uppercase">{t(locale, "subtitle")}</p>
        </div>
        <div className="ml-1 flex rounded-full border border-[#8A6A3B]/35 bg-[#F7F1E4] p-0.5">
          {(["anterior", "posterior"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={atlasView === v}
              onClick={() => setAtlasView(v)}
              className={`rounded-full px-2.5 py-1 text-[11px] ${
                atlasView === v ? "bg-[#8A6A3B] text-[#F7F1E4]" : "text-[#2A2118]"
              }`}
            >
              {t(locale, v)}
            </button>
          ))}
        </div>
      </div>
      <div className="panel pointer-events-auto flex w-full max-w-xl flex-col gap-2 rounded-2xl p-2 md:items-end">
        <SearchBox />
        <div className="flex flex-wrap items-center gap-1 text-[11px] text-[#2A2118]">
          {LAYERS.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={layers[key]}
              onClick={() => toggle(key)}
              className={`rounded-full px-2.5 py-1 transition ${
                layers[key]
                  ? "bg-[#8A6A3B] text-[#F7F1E4]"
                  : "border border-[#8A6A3B]/35 text-[#2A2118] hover:bg-[#8A6A3B]/10"
              }`}
            >
              {t(locale, LAYER_LABEL[key])}
            </button>
          ))}
          <span className="mx-1 h-3 w-px bg-[#8A6A3B]/35" />
          {(["es", "en"] as Locale[]).map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={locale === l}
              onClick={() => setLocale(l)}
              className={`rounded-full px-2 py-1 uppercase ${
                locale === l ? "bg-[#8A6A3B] text-[#F7F1E4]" : "text-[#8A6A3B]"
              }`}
            >
              {l}
            </button>
          ))}
          {(["high", "medium", "low"] as QualityTier[]).map((q) => (
            <button
              key={q}
              type="button"
              aria-pressed={quality === q}
              onClick={() => setQuality(q)}
              className={`rounded-full px-2 py-1 ${quality === q ? "text-[#2A2118] font-medium" : "text-[#8A6A3B]"}`}
            >
              {q === "high" ? t(locale, "qualityHigh") : q === "medium" ? t(locale, "qualityMedium") : t(locale, "qualityLow")}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
