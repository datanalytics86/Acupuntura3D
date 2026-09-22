import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";
import { SearchBox } from "./SearchBox";
import type { AtlasRegion, Locale } from "@/types";

const HIT = { minWidth: 44, minHeight: 44 } as const;

const REGIONS: readonly AtlasRegion[] = ["body", "face", "hand", "foot"];

const REGION_LABEL: Record<"es" | "en", Record<AtlasRegion, string>> = {
  es: { body: "Cuerpo", face: "Rostro", hand: "Mano", foot: "Pie" },
  en: { body: "Body", face: "Face", hand: "Hand", foot: "Foot" },
};

export function Topbar() {
  const locale = useViewerStore((s) => s.locale);
  const setLocale = useViewerStore((s) => s.setLocale);
  const railOpen = useViewerStore((s) => s.railOpen);
  const setRailOpen = useViewerStore((s) => s.setRailOpen);
  const atlasView = useViewerStore((s) => s.atlasView);
  const setAtlasView = useViewerStore((s) => s.setAtlasView);
  const atlasRegion = useViewerStore((s) => s.atlasRegion);
  const setAtlasRegion = useViewerStore((s) => s.setAtlasRegion);
  const regionLang = locale === "es" ? "es" : "en";

  return (
    <header className="running-head pointer-events-auto absolute inset-x-0 top-0 z-20 flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 min-[1100px]:flex-nowrap md:px-5">
      <button
        type="button"
        className={`file-link shrink-0 ${railOpen ? "is-on" : ""}`}
        style={HIT}
        aria-pressed={railOpen}
        onClick={() => setRailOpen(!railOpen)}
      >
        {t(locale, "meridians")}
      </button>
      <div className="flex shrink-0 items-center gap-2">
        <span className="hanzi text-xl leading-none text-ink">针</span>
        <span className="h-6 w-px bg-brass-line" aria-hidden />
        <div className="whitespace-nowrap">
          <h1 className="display text-[1.2rem] leading-none font-semibold text-ink">{t(locale, "title")}</h1>
          <p className="mt-0.5 text-[10px] tracking-[0.2em] text-brass uppercase">{t(locale, "subtitle")}</p>
        </div>
      </div>
      <div
        className="order-last flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-1 min-[1100px]:order-none min-[1100px]:w-auto min-[1100px]:shrink-0 min-[1100px]:flex-nowrap"
        role="group"
        aria-label={regionLang === "es" ? "Vista y región" : "View and region"}
      >
        {(["anterior", "posterior"] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={atlasView === v}
            onClick={() => setAtlasView(v)}
            className={`file-link shrink-0 ${atlasView === v ? "is-on" : ""}`}
            style={HIT}
          >
            {t(locale, v)}
          </button>
        ))}
        {REGIONS.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={atlasRegion === id}
            onClick={() => setAtlasRegion(id)}
            className={`file-link shrink-0 ${atlasRegion === id ? "is-on" : ""}`}
            style={HIT}
          >
            {REGION_LABEL[regionLang][id]}
          </button>
        ))}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {(["es", "en"] as Locale[]).map((l) => (
          <button
            key={l}
            type="button"
            aria-pressed={locale === l}
            onClick={() => setLocale(l)}
            className={`file-link shrink-0 ${locale === l ? "is-on" : ""}`}
            style={HIT}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="ml-auto w-56 max-w-full shrink-0">
        <SearchBox />
      </div>
    </header>
  );
}
