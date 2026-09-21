import { create } from "zustand";
import type { AtlasRegion, AtlasView, Elemento, Locale, Point2D, QualityTier, ViewerState } from "@/types";
import { CENTERS, positionOnView, type CenterId } from "@/atlas/centers";
import { regionFrame } from "@/atlas/regionFrames";
import { detectQuality, prefersReducedMotion } from "@/lib/quality";
import { withPaperTransition } from "@/lib/paperTransition";

const QUALITY_KEY = "acu3d.quality";

function readSavedQuality(): QualityTier | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(QUALITY_KEY);
    if (saved === "high" || saved === "medium" || saved === "low") return saved;
  } catch {
    /* ignore */
  }
  return null;
}

function initialQuality(): QualityTier {
  return readSavedQuality() ?? detectQuality();
}

function initialRail(): boolean {
  return false;
}

interface ViewerActions {
  railOpen: boolean;
  setSelected: (id: string | null) => void;
  setHovered: (id: string | null) => void;
  setActiveMeridian: (id: string | null) => void;
  toggleLayer: (key: keyof ViewerState["visibleLayers"]) => void;
  setQiPlaying: (v: boolean) => void;
  setQiSpeed: (v: number) => void;
  setClockHour: (h: number) => void;
  setLocale: (l: Locale) => void;
  setQuality: (q: QualityTier) => void;
  setSearch: (q: string) => void;
  setElementFilter: (e?: Elemento) => void;
  setStarOnly: (v: boolean) => void;
  setRailOpen: (v: boolean) => void;
  followQi: (meridianId: string) => void;
  setAtlasView: (v: AtlasView) => void;
  setAtlasRegion: (r: AtlasRegion) => void;
  focusCenter: (id: CenterId | null) => void;
  setAtlasZoom: (z: number) => void;
  setAtlasPan: (p: Point2D) => void;
  resetAtlasCamera: () => void;
  setBothSides: (v: boolean) => void;
}

const initialHour = new Date().getHours();

export const useViewerStore = create<ViewerState & ViewerActions>((set, get) => ({
  selectedPointId: null,
  hoveredPointId: null,
  activeMeridianId: "ST",
  visibleLayers: {
    body: true,
    meridians: true,
    points: true,
    qi: true,
    labels: false,
    centers: true,
  },
  qiPlaying: !prefersReducedMotion(),
  qiSpeed: 1,
  clockHour: initialHour,
  locale: "es",
  qualityTier: initialQuality(),
  searchQuery: "",
  filters: { starOnly: true },
  atlasView: "anterior",
  atlasRegion: "body",
  selectedCenterId: null,
  atlasZoom: 1,
  atlasPan: { x: 400, y: 800 },
  bothSides: true,
  railOpen: initialRail(),
  setSelected: (id) => set({ selectedPointId: id, ...(id ? { selectedCenterId: null } : {}) }),
  setHovered: (id) => set({ hoveredPointId: id }),
  setActiveMeridian: (id) => set({ activeMeridianId: id }),
  toggleLayer: (key) =>
    set((s) => ({
      visibleLayers: { ...s.visibleLayers, [key]: !s.visibleLayers[key] },
    })),
  setQiPlaying: (v) => set({ qiPlaying: v }),
  setQiSpeed: (v) => set({ qiSpeed: Math.min(4, Math.max(0.25, v)) }),
  setClockHour: (h) => set({ clockHour: ((h % 24) + 24) % 24 }),
  setLocale: (l) => set({ locale: l }),
  setQuality: (q) => {
    try {
      window.localStorage.setItem(QUALITY_KEY, q);
    } catch {
      /* ignore */
    }
    set({ qualityTier: q });
  },
  setSearch: (q) => set({ searchQuery: q }),
  setElementFilter: (e) => set((s) => ({ filters: { ...s.filters, element: e } })),
  setStarOnly: (v) => set((s) => ({ filters: { ...s.filters, starOnly: v } })),
  setRailOpen: (v) => set({ railOpen: v }),
  followQi: (meridianId) =>
    set({
      activeMeridianId: meridianId,
      qiPlaying: prefersReducedMotion() ? false : true,
      visibleLayers: {
        ...get().visibleLayers,
        body: true,
        meridians: true,
        points: true,
        qi: true,
      },
    }),
  setAtlasView: (v) =>
    withPaperTransition(() => {
      const region = get().atlasRegion;
      if (region === "body") {
        set({ atlasView: v });
        return;
      }
      const frame = regionFrame(region, v);
      set({ atlasView: v, atlasPan: frame.pan, atlasZoom: frame.zoom });
    }),
  setAtlasRegion: (r) =>
    withPaperTransition(() => {
      const frame = regionFrame(r, get().atlasView);
      set({ atlasRegion: r, atlasPan: frame.pan, atlasZoom: frame.zoom });
    }),
  focusCenter: (id) => {
    if (!id) {
      set({ selectedCenterId: null });
      return;
    }
    const s = get();
    const center = CENTERS.find((c) => c.id === id);
    if (!center) return;
    const onFace = s.atlasRegion === "face" && center.id === "upper";
    const here = positionOnView(center, s.atlasView);
    const view = onFace ? s.atlasView : here ? s.atlasView : "anterior";
    const framed = onFace ? regionFrame("face", view) : null;
    const pos = framed ? framed.pan : (positionOnView(center, view) ?? center.anterior);
    const apply = () =>
      set({
        selectedCenterId: id,
        selectedPointId: null,
        atlasView: view,
        atlasRegion: onFace ? "face" : "body",
        atlasPan: pos ?? s.atlasPan,
        atlasZoom: framed ? framed.zoom : 2.15,
        visibleLayers: { ...s.visibleLayers, centers: true },
      });
    if (view !== s.atlasView) withPaperTransition(apply);
    else apply();
  },
  setAtlasZoom: (z) => set({ atlasZoom: Math.min(6, Math.max(1, z)) }),
  setAtlasPan: (p) => set({ atlasPan: p }),
  resetAtlasCamera: () => set({ atlasRegion: "body", atlasZoom: 1, atlasPan: { x: 400, y: 800 } }),
  setBothSides: (v) => set({ bothSides: v }),
}));
