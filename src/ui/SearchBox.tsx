import { useId } from "react";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

export function SearchBox() {
  const id = useId();
  const locale = useViewerStore((s) => s.locale);
  const query = useViewerStore((s) => s.searchQuery);
  const setSearch = useViewerStore((s) => s.setSearch);
  return (
    <input
      id={id}
      type="search"
      value={query}
      onChange={(e) => setSearch(e.target.value)}
      placeholder={t(locale, "search")}
      className="w-full rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-amber-300/50 focus:bg-black/45"
    />
  );
}
