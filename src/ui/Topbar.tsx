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
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          type="button"
          className="rounded-md border border-white/10 bg-black/50 px-2 py-1 text-xs md:hidden"
          onClick={() => setRailOpen(!railOpen)}
        >
          {t(locale, "meridians")}
        </button>
        <h1 className="text-sm font-semibold tracking-wide text-amber-100">{t(locale, "title")}</h1>
      </div>
      <div className="pointer-events-auto flex w-full max-w-xl flex-col gap-2 md:items-end">
        <SearchBox />
        <div className="flex flex-wrap items-center gap-1 text-[11px]">
          {LAYERS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`rounded-full px-2 py-0.5 ${layers[key] ? "bg-amber-400/20 text-amber-100" : "bg-white/5 text-zinc-500"}`}
            >
              {t(locale, LAYER_LABEL[key])}
            </button>
          ))}
          {(["es", "en"] as Locale[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              className={`rounded px-1.5 py-0.5 uppercase ${locale === l ? "text-amber-200" : "text-zinc-500"}`}
            >
              {l}
            </button>
          ))}
          {(["high", "medium", "low"] as QualityTier[]).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuality(q)}
              className={`rounded px-1.5 py-0.5 ${quality === q ? "text-emerald-200" : "text-zinc-500"}`}
            >
              {q === "high" ? t(locale, "qualityHigh") : q === "medium" ? t(locale, "qualityMedium") : t(locale, "qualityLow")}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
