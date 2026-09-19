import { useEffect, useMemo } from "react";
import { CanvasRoot } from "@/scene/CanvasRoot";
import { Disclaimer } from "@/ui/Disclaimer";
import { Topbar } from "@/ui/Topbar";
import { MeridianRail } from "@/ui/MeridianRail";
import { PointDrawer } from "@/ui/PointDrawer";
import { QiClock } from "@/ui/QiClock";
import { loadAcupoints } from "@/data";
import { useViewerStore } from "@/state/viewerStore";

export function App() {
  const points = useMemo(() => loadAcupoints(), []);
  const selected = useViewerStore((s) => s.selectedPointId);
  const setSelected = useViewerStore((s) => s.setSelected);
  const setSearch = useViewerStore((s) => s.setSearch);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        const el = document.querySelector<HTMLInputElement>('input[type="search"]');
        el?.focus();
        return;
      }
      if (e.key === "Escape") {
        setSelected(null);
        setSearch("");
        return;
      }
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const merId = points.find((p) => p.id === selected)?.meridianId;
      const group = points.filter((p) => (merId ? p.meridianId === merId : true));
      if (group.length === 0) return;
      const idx = group.findIndex((p) => p.id === selected);
      const next =
        e.key === "ArrowRight"
          ? group[(idx + 1 + group.length) % group.length]
          : group[(idx - 1 + group.length) % group.length];
      if (next) setSelected(next.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [points, selected, setSelected, setSearch]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#07090c]">
      <CanvasRoot />
      <Topbar />
      <MeridianRail />
      <PointDrawer />
      <QiClock />
      <Disclaimer />
    </div>
  );
}
