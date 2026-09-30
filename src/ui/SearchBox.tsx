import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";
import { IconSearch } from "./icons";

export function SearchBox() {
  const locale = useViewerStore((s) => s.locale);
  const open = useViewerStore((s) => s.paletteOpen);
  const setPaletteOpen = useViewerStore((s) => s.setPaletteOpen);

  return (
    <button
      type="button"
      className="topbar-search"
      data-testid="search-trigger"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls="command-palette"
      aria-keyshortcuts="/"
      aria-label={t(locale, "searchTrigger")}
      onClick={() => setPaletteOpen(true)}
    >
      <IconSearch />
      <span className="topbar-search-label">{t(locale, "searchTrigger")}</span>
      <kbd className="topbar-kbd">/</kbd>
    </button>
  );
}
