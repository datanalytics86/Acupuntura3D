import { useEffect, useMemo } from "react";
import { AtlasRoot } from "@/atlas/AtlasRoot";
import { Disclaimer } from "@/ui/Disclaimer";
import { Topbar } from "@/ui/Topbar";
import { MeridianRail } from "@/ui/MeridianRail";
import { PointDrawer } from "@/ui/PointDrawer";
import { QiClock } from "@/ui/QiClock";
import { LegalModal } from "@/ui/LegalModal";
import { loadAcupoints } from "@/data";
import { pointOnView } from "@/atlas/mapCoords";
import { useViewerStore } from "@/state/viewerStore";

export function App() {
  const points = useMemo(() => loadAcupoints(), []);
  const selected = useViewerStore((s) => s.selectedPointId);
  const setSelected = useViewerStore((s) => s.setSelected);
  const setSearch = useViewerStore((s) => s.setSearch);
  const locale = useViewerStore((s) => s.locale);
  const atlasView = useViewerStore((s) => s.atlasView);
  const setAtlasView = useViewerStore((s) => s.setAtlasView);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "en" : locale;
  }, [locale]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === "Escape") (e.target as HTMLElement).blur();
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
        return;
      }
      if (e.key === "Escape") {
        setSelected(null);
        setSearch("");
        return;
      }
      if (e.key === "a" || e.key === "A") {
        setAtlasView("anterior");
        return;
      }
      if (e.key === "p" || e.key === "P") {
        setAtlasView("posterior");
        return;
      }
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const merId = points.find((pt) => pt.id === selected)?.meridianId;
      const group = points.filter((pt) => (merId ? pt.meridianId === merId : true));
      if (group.length === 0) return;
      const idx = group.findIndex((pt) => pt.id === selected);
      const next =
        e.key === "ArrowRight"
          ? group[(idx + 1 + group.length) % group.length]
          : group[(idx - 1 + group.length) % group.length];
      if (next) setSelected(next.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [points, selected, setSelected, setSearch, setAtlasView]);

  useEffect(() => {
    const pt = points.find((p) => p.id === selected);
    if (!pt) return;
    if (!pointOnView(pt, atlasView)) {
      const other = atlasView === "anterior" ? "posterior" : "anterior";
      if (pointOnView(pt, other)) setAtlasView(other);
    }
  }, [selected, atlasView, points, setAtlasView]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#EFE6D2]">
      <AtlasRoot />
      <Topbar />
      <MeridianRail />
      <PointDrawer />
      <QiClock />
      <Disclaimer />
      <LegalModal />
    </div>
  );
}
