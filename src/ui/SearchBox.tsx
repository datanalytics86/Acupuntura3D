import { useId, useMemo } from "react";
import { loadAcupoints } from "@/data";
import { pointOnView } from "@/atlas/mapCoords";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

function fold(s: string): string {
  return s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

export function SearchBox() {
  const id = useId();
  const locale = useViewerStore((s) => s.locale);
  const query = useViewerStore((s) => s.searchQuery);
  const setSearch = useViewerStore((s) => s.setSearch);
  const setSelected = useViewerStore((s) => s.setSelected);
  const setActive = useViewerStore((s) => s.setActiveMeridian);
  const setPan = useViewerStore((s) => s.setAtlasPan);
  const setZoom = useViewerStore((s) => s.setAtlasZoom);
  const setView = useViewerStore((s) => s.setAtlasView);
  const setRegion = useViewerStore((s) => s.setAtlasRegion);
  const view = useViewerStore((s) => s.atlasView);
  const points = useMemo(() => loadAcupoints(), []);

  return (
    <div className="w-full">
      <label htmlFor={id} className="sr-only">
        {t(locale, "search")}
      </label>
      <input
        id={id}
        type="search"
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
          const q = fold(value.trim());
          if (!q) return;
          const exact = points.filter(
            (p) => fold(p.code) === q || fold(p.names.pinyin.replace(/\s/g, "")) === q,
          );
          if (exact.length !== 1 || !exact[0]) return;
          const hit = exact[0];
          setSelected(hit.id);
          setActive(hit.meridianId);
          setRegion("body");
          const here = pointOnView(hit, view);
          const other = view === "anterior" ? "posterior" : "anterior";
          const pos = here ?? pointOnView(hit, other);
          if (!here && pointOnView(hit, other)) setView(other);
          if (pos) {
            setPan(pos);
            setZoom(2.4);
          }
        }}
        placeholder={t(locale, "search")}
        className="archive-field"
      />
    </div>
  );
}
