import { useId, useMemo } from "react";
import { loadAcupoints } from "@/data";
import { matchCenter } from "@/atlas/centers";
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
  const showPoint = useViewerStore((s) => s.showPoint);
  const focusCenter = useViewerStore((s) => s.focusCenter);
  const setRailOpen = useViewerStore((s) => s.setRailOpen);
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
          if (value.trim()) setRailOpen(true);
          const q = fold(value.trim());
          if (!q) return;
          const center = matchCenter(value.trim());
          if (center) {
            focusCenter(center.id);
            return;
          }
          const exact = points.filter(
            (p) => fold(p.code) === q || fold(p.names.pinyin.replace(/\s/g, "")) === q,
          );
          if (exact.length !== 1 || !exact[0]) return;
          showPoint(exact[0].id);
        }}
        placeholder={t(locale, "search")}
        className="archive-field"
      />
    </div>
  );
}
