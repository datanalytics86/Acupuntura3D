import { useEffect, useMemo, useState } from "react";
import { AtlasRoot } from "@/atlas/AtlasRoot";
import { handleCameraKey } from "@/atlas/cameraKeys";
import { CENTERS } from "@/atlas/centers";
import { loadAcupoints } from "@/data";
import { t } from "@/i18n";
import { Disclaimer } from "@/ui/Disclaimer";
import { Topbar } from "@/ui/Topbar";
import { MeridianRail } from "@/ui/MeridianRail";
import { PointDrawer } from "@/ui/PointDrawer";
import { CenterDrawer } from "@/ui/CenterDrawer";
import { QiClock } from "@/ui/QiClock";
import { LegalModal } from "@/ui/LegalModal";
import { HelpDialog } from "@/ui/HelpDialog";
import { mediaMatches } from "@/lib/quality";
import { useViewerStore } from "@/state/viewerStore";

function isTextField(target: EventTarget | null): target is HTMLInputElement | HTMLTextAreaElement {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

function isPaletteField(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.dataset.testid === "palette-input";
}

function inPalette(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target.closest("[data-testid='palette-input'], [data-testid='palette-option']")) return true;
  const dialog = target.closest("[role='dialog']");
  if (!(dialog instanceof HTMLElement) || dialog.dataset.testid === "help-dialog" || dialog.id === "legal-gate") {
    return false;
  }
  return Boolean(dialog.querySelector("[data-testid='palette-input']"));
}

function inRadioGroup(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest("[role='radiogroup']"));
}

function useSheetHistory(): void {
  useEffect(() => {
    let pushed = false;
    const narrow = () => mediaMatches("(max-width: 1023px)");
    const closeSheet = () => {
      const store = useViewerStore.getState();
      if (store.selectedPointId) store.setSelected(null);
      if (store.selectedCenterId) store.focusCenter(null);
    };
    const onPop = () => {
      pushed = false;
      closeSheet();
    };
    window.addEventListener("popstate", onPop);
    const unsubscribe = useViewerStore.subscribe((state, prev) => {
      if (!narrow()) return;
      const now = Boolean(state.selectedPointId || state.selectedCenterId);
      const was = Boolean(prev.selectedPointId || prev.selectedCenterId);
      if (now && !was) {
        history.pushState({ acu3dSheet: 1 }, "");
        pushed = true;
      } else if (!now && was && pushed) {
        pushed = false;
        history.back();
      }
    });
    return () => {
      window.removeEventListener("popstate", onPop);
      unsubscribe();
    };
  }, []);
}

function FirstHint() {
  const locale = useViewerStore((s) => s.locale);
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (window.localStorage.getItem("acu3d.hint.v1") === "1") return;
    } catch {
      return;
    }
    let alive = true;
    const reveal = () => {
      if (!alive || document.getElementById("legal-gate")) return;
      setShow(true);
    };
    const id = window.setInterval(reveal, 200);
    reveal();
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);
  useEffect(() => {
    if (!show) return;
    const dismiss = () => {
      try {
        window.localStorage.setItem("acu3d.hint.v1", "1");
      } catch {
        /* quota or private mode */
      }
      setShow(false);
    };
    window.addEventListener("pointerdown", dismiss, true);
    window.addEventListener("keydown", dismiss, true);
    return () => {
      window.removeEventListener("pointerdown", dismiss, true);
      window.removeEventListener("keydown", dismiss, true);
    };
  }, [show]);
  if (!show) return null;
  return (
    <p className="first-hint" role="status" data-testid="first-hint">
      {t(locale, "firstHint")}
    </p>
  );
}

export function App() {
  const points = useMemo(() => loadAcupoints(), []);
  const selected = useViewerStore((s) => s.selectedPointId);
  const selectedCenter = useViewerStore((s) => s.selectedCenterId);
  const railOpen = useViewerStore((s) => s.railOpen);
  const locale = useViewerStore((s) => s.locale);
  const atlasView = useViewerStore((s) => s.atlasView);
  const atlasRegion = useViewerStore((s) => s.atlasRegion);
  const folioOpen = Boolean(selected || selectedCenter);
  const selectedPoint = points.find((pt) => pt.id === selected) ?? null;
  const selectionLive = selectedPoint
    ? `${selectedPoint.code} ${selectedPoint.names.pinyin} ${t(locale, "selected")}`
    : "";
  const spoken = [
    t(locale, atlasView === "anterior" ? "liveViewAnterior" : "liveViewPosterior"),
    t(
      locale,
      atlasRegion === "face"
        ? "liveRegionFace"
        : atlasRegion === "hand"
          ? "liveRegionHand"
          : atlasRegion === "foot"
            ? "liveRegionFoot"
            : "liveRegionBody",
    ),
    selectionLive,
  ]
    .filter(Boolean)
    .join(". ");
  useSheetHistory();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.getElementById("legal-gate")) return;
      const store = useViewerStore.getState();
      const target = e.target;

      if (store.paletteOpen) {
        if (e.key === "Escape" && !isPaletteField(target) && !inPalette(target)) {
          e.preventDefault();
          store.setPaletteOpen(false);
        }
        return;
      }

      if (store.helpOpen) {
        if (e.key === "Escape") {
          e.preventDefault();
          store.setHelpOpen(false);
        }
        return;
      }

      if (isTextField(target) && !isPaletteField(target)) {
        if (e.key === "Escape") target.blur();
        return;
      }

      if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && inRadioGroup(target)) return;

      const chordK = e.key === "k" || e.key === "K";
      if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.repeat && chordK) {
        e.preventDefault();
        store.setPaletteOpen(true);
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "/" && !e.repeat) {
        e.preventDefault();
        store.setPaletteOpen(true);
        return;
      }
      if (e.key === "?" && !e.repeat) {
        e.preventDefault();
        store.setHelpOpen(true);
        return;
      }
      if (handleCameraKey(e)) return;
      if (e.repeat) return;

      if (e.key === "Escape") {
        if (store.selectedPointId || store.selectedCenterId) {
          store.setSelected(null);
          store.focusCenter(null);
          return;
        }
        if (store.railOpen) {
          store.setRailOpen(false);
          return;
        }
        store.setSearch("");
        return;
      }
      if (e.key === "a" || e.key === "A") {
        store.setAtlasView("anterior");
        return;
      }
      if (e.key === "p" || e.key === "P") {
        store.setAtlasView("posterior");
        return;
      }
      if (e.key === "c" || e.key === "C") {
        store.toggleLayer("centers");
        return;
      }
      if (e.key >= "1" && e.key <= "4") {
        store.setAtlasRegion((["body", "face", "hand", "foot"] as const)[Number(e.key) - 1]!);
        return;
      }
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const selectedCenterId = store.selectedCenterId;
      if (selectedCenterId) {
        const order = CENTERS.map((c) => c.id);
        const idx = order.indexOf(selectedCenterId);
        const step = e.key === "ArrowRight" ? 1 : -1;
        const next = order[(idx + step + order.length) % order.length];
        if (next) store.focusCenter(next);
        return;
      }
      const selectedId = store.selectedPointId;
      if (!selectedId) return;
      const merId = points.find((pt) => pt.id === selectedId)?.meridianId;
      const group = points.filter((pt) => pt.meridianId === merId);
      const idx = group.findIndex((pt) => pt.id === selectedId);
      if (idx < 0 || group.length === 0) return;
      const next =
        e.key === "ArrowRight" ? group[(idx + 1) % group.length] : group[(idx - 1 + group.length) % group.length];
      if (next) store.showPoint(next.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [points]);

  return (
    <div className="app desk-grain" data-rail={railOpen ? "open" : "closed"} data-folio={folioOpen ? "open" : "closed"}>
      <div className="app-head">
        <Topbar />
      </div>
      <div className="app-index">
        <MeridianRail />
      </div>
      <div className="app-plate">
        <AtlasRoot clock={<QiClock />} />
        <FirstHint />
      </div>
      <div className="app-folio">
        <PointDrawer />
        <CenterDrawer />
      </div>
      <footer className="app-foot">
        <p className="a11y-live" aria-live="polite" aria-atomic="true">
          {spoken}
        </p>
        <div className="foot-chip" data-slot="clock-chip" aria-hidden="true" />
        <Disclaimer />
      </footer>
      <LegalModal />
      <HelpDialog />
    </div>
  );
}
