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

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col gap-2 p-3 md:flex-row md:items-start md:justify-between">
      <div className="panel pointer-events-auto flex items-center gap-3 rounded-2xl px-3 py-2">
        <button
          type="button"
          className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] md:hidden"
          onClick={() => setRailOpen(!railOpen)}
        >
          {t(locale, "meridians")}
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-300/15 text-amber-200">
          <span className="hanzi text-lg leading-none">针</span>
        </div>
        <div>
          <h1 className="display text-[1.15rem] leading-none font-semibold tracking-wide text-amber-100">
            {t(locale, "title")}
          </h1>
          <p className="mt-0.5 text-[10px] tracking-[0.18em] text-zinc-500 uppercase">{t(locale, "subtitle")}</p>
        </div>
      </div>
      <div className="panel pointer-events-auto flex w-full max-w-xl flex-col gap-2 rounded-2xl p-2 md:items-end">
        <SearchBox />
        <div className="flex flex-wrap items-center gap-1 text-[11px]">
          {LAYERS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`rounded-full px-2.5 py-1 transition ${
                layers[key]
                  ? "bg-amber-300/18 text-amber-100"
                  : "bg-white/5 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t(locale, LAYER_LABEL[key])}
            </button>
          ))}
          <span className="mx-1 h-3 w-px bg-white/10" />
          {(["es", "en"] as Locale[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              className={`rounded-full px-2 py-1 uppercase ${locale === l ? "bg-white/10 text-amber-100" : "text-zinc-500"}`}
            >
              {l}
            </button>
          ))}
          {(["high", "medium", "low"] as QualityTier[]).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuality(q)}
              className={`rounded-full px-2 py-1 ${quality === q ? "text-emerald-200" : "text-zinc-500"}`}
            >
              {q === "high" ? t(locale, "qualityHigh") : q === "medium" ? t(locale, "qualityMedium") : t(locale, "qualityLow")}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
