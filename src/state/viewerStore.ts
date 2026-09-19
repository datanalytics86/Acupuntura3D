import { create } from "zustand";
import type { Elemento, Locale, QualityTier, ViewerState } from "@/types";

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
  qiPlaying: true,
  qiSpeed: 1,
  clockHour: initialHour,
  locale: "es",
  qualityTier: "high",
  searchQuery: "",
  filters: { starOnly: true },
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
  setQuality: (q) => set({ qualityTier: q }),
  setSearch: (q) => set({ searchQuery: q }),
  setElementFilter: (e) => set((s) => ({ filters: { ...s.filters, element: e } })),
  setStarOnly: (v) => set((s) => ({ filters: { ...s.filters, starOnly: v } })),
  setRailOpen: (v) => set({ railOpen: v }),
  followQi: (meridianId) =>
    set({
      activeMeridianId: meridianId,
      qiPlaying: true,
      visibleLayers: {
        body: true,
        meridians: true,
        points: true,
        qi: true,
        labels: false,
      },
    }),
}));
