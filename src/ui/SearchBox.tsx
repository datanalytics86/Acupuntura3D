import { useId, useMemo } from "react";
import { loadAcupoints } from "@/data";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

export function SearchBox() {
  const id = useId();
  const locale = useViewerStore((s) => s.locale);
  const query = useViewerStore((s) => s.searchQuery);
  const setSearch = useViewerStore((s) => s.setSearch);
  const setSelected = useViewerStore((s) => s.setSelected);
  const setActive = useViewerStore((s) => s.setActiveMeridian);
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
          const exact = points.filter((p) => p.code.toLowerCase() === value.trim().toLowerCase());
          if (exact.length === 1 && exact[0]) {
            setSelected(exact[0].id);
            setActive(exact[0].meridianId);
          }
        }}
        placeholder={t(locale, "search")}
        className="w-full rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-amber-300/50 focus:bg-black/45"
      />
    </div>
  );
}
