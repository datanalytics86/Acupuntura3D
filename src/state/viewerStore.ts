import { create } from "zustand";
import type { AtlasView, Elemento, Locale, Point2D, QualityTier, ViewerState } from "@/types";
import { detectQuality, prefersReducedMotion } from "@/lib/quality";

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
  setAtlasZoom: (z: number) => void;
  setAtlasPan: (p: Point2D) => void;
  resetAtlasCamera: () => void;
  setBothSides: (v: boolean) => void;
}

const initialHour = new Date().getHours();

export const useViewerStore = create<ViewerState & ViewerActions>((set) => ({
  selectedPointId: null,
  hoveredPointId: null,
  activeMeridianId: "ST",
  visibleLayers: {
    body: true,
    meridians: true,
    points: true,
    qi: true,
    labels: false,
  },
  qiPlaying: !prefersReducedMotion(),
  qiSpeed: 1,
  clockHour: initialHour,
  locale: "es",
  qualityTier: initialQuality(),
  searchQuery: "",
  filters: { starOnly: true },
  atlasView: "anterior",
  atlasZoom: 1,
  atlasPan: { x: 400, y: 800 },
  bothSides: true,
  railOpen: true,
  setSelected: (id) => set({ selectedPointId: id }),
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
        body: true,
        meridians: true,
        points: true,
        qi: true,
        labels: false,
      },
    }),
  setAtlasView: (v) => set({ atlasView: v }),
  setAtlasZoom: (z) => set({ atlasZoom: Math.min(6, Math.max(1, z)) }),
  setAtlasPan: (p) => set({ atlasPan: p }),
  resetAtlasCamera: () => set({ atlasZoom: 1, atlasPan: { x: 400, y: 800 } }),
  setBothSides: (v) => set({ bothSides: v }),
}));
