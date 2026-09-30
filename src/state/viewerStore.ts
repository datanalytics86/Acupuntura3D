import { create } from "zustand";
import type { AtlasRegion, AtlasView, Elemento, Locale, Point2D, ViewerState } from "@/types";
import { loadAcupoints } from "@/data";
import { pointOnView } from "@/atlas/mapCoords";
import { CENTERS, positionOnView, type CenterId } from "@/atlas/centers";
import { fitRegion } from "@/atlas/regionAnatomy";
import { inRegionFrame, noteRegionPlate, regionFrame } from "@/atlas/regionFrames";
import { prefersReducedMotion } from "@/lib/quality";
import { withPaperTransition } from "@/lib/paperTransition";
import { clampZoom, lerpCamera, zoomAbout, type Camera } from "@/atlas/camera";
import { unitsPerPx, type PlateBox } from "@/atlas/screen";
import { VIEW_H, VIEW_W } from "@/atlas/figure/landmarks";

function initialRail(): boolean {
  return false;
}

export type SheetSnap = "closed" | "peek" | "half" | "full";
export type LabelsMode = "auto" | "all" | "none";

interface ViewerActions {
  railOpen: boolean;
  plateBox: PlateBox;
  paletteOpen: boolean;
  helpOpen: boolean;
  sheetSnap: SheetSnap;
  labelsMode: LabelsMode;
  setSelected: (id: string | null) => void;
  showPoint: (id: string) => void;
  setHovered: (id: string | null) => void;
  hoveredMeridianId: string | null;
  setHoveredMeridian: (id: string | null) => void;
  setActiveMeridian: (id: string | null) => void;
  toggleLayer: (key: keyof ViewerState["visibleLayers"]) => void;
  setQiPlaying: (v: boolean) => void;
  setQiSpeed: (v: number) => void;
  setClockHour: (h: number) => void;
  setLocale: (l: Locale) => void;
  setSearch: (q: string) => void;
  setElementFilter: (e?: Elemento) => void;
  setRailOpen: (v: boolean) => void;
  followQi: (meridianId: string) => void;
  setAtlasView: (v: AtlasView) => void;
  setAtlasRegion: (r: AtlasRegion) => void;
  focusCenter: (id: CenterId | null) => void;
  setAtlasZoom: (z: number) => void;
  setAtlasPan: (p: Point2D) => void;
  setPlateBox: (b: PlateBox) => void;
  setPaletteOpen: (v: boolean) => void;
  setHelpOpen: (v: boolean) => void;
  setSheetSnap: (s: SheetSnap) => void;
  setLabelsMode: (m: LabelsMode) => void;
  flyTo: (target: Camera, opts?: { duration?: number; keepAim?: boolean }) => void;
  zoomBy: (factor: number, anchor?: Point2D) => void;
  stopFlight: () => void;
  resetAtlasCamera: () => void;
}

/** Keep 0..800 × 0..1600 intersecting the visible plate. Interior centres stay put. */
function clampPan(pan: Point2D, zoom: number, box: PlateBox): Point2D {
  const z = zoom > 0 ? zoom : 1;
  const vbW = VIEW_W / z;
  const vbH = VIEW_H / z;
  let visW = vbW;
  let visH = vbH;
  if (box.w > 0 && box.h > 0) {
    const k = unitsPerPx(vbW, vbH, box);
    visW = box.w * k;
    visH = box.h * k;
  }
  return {
    x: Math.min(VIEW_W + visW / 2, Math.max(-visW / 2, pan.x)),
    y: Math.min(VIEW_H + visH / 2, Math.max(-visH / 2, pan.y)),
  };
}

/** fitRegion once the plate is measured; the old locked frame in node tests (box 0). */
function detailCamera(region: AtlasRegion, view: AtlasView, box: PlateBox): { pan: Point2D; zoom: number } {
  if (box.w <= 0 || box.h <= 0) return regionFrame(region, view);
  return fitRegion(region, view, box);
}

function insideFrame(pos: Point2D, frame: { pan: Point2D; zoom: number }): boolean {
  const hw = VIEW_W / frame.zoom / 2;
  const hh = VIEW_H / frame.zoom / 2;
  return Math.abs(pos.x - frame.pan.x) <= hw && Math.abs(pos.y - frame.pan.y) <= hh;
}

let flight = 0;
let aim: Camera | null = null;

function stopFlight(): void {
  if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(flight);
}

const initialHour = new Date().getHours();

export const useViewerStore = create<ViewerState & ViewerActions>((set, get) => ({
  selectedPointId: null,
  hoveredPointId: null,
  activeMeridianId: null,
  visibleLayers: {
    body: true,
    meridians: true,
    points: true,
    qi: true,
    centers: true,
  },
  qiPlaying: !prefersReducedMotion(),
  qiSpeed: 1,
  clockHour: initialHour,
  locale: "es",
  searchQuery: "",
  filters: { starOnly: true },
  atlasView: "anterior",
  atlasRegion: "body",
  selectedCenterId: null,
  atlasZoom: 1,
  atlasPan: { x: 400, y: 800 },
  bothSides: true,
  railOpen: initialRail(),
  plateBox: { w: 0, h: 0 },
  paletteOpen: false,
  helpOpen: false,
  sheetSnap: "closed",
  labelsMode: "auto",
  setSelected: (id) => set({ selectedPointId: id, ...(id ? { selectedCenterId: null } : {}) }),
  showPoint: (id) => {
    const pt = loadAcupoints().find((p) => p.id === id);
    if (!pt) return;
    const s = get();
    const here = pointOnView(pt, s.atlasView);
    const other = s.atlasView === "anterior" ? "posterior" : "anterior";
    const pos = here ?? pointOnView(pt, other);
    const view = here ? s.atlasView : other;
    const frame = s.atlasRegion === "body" ? null : detailCamera(s.atlasRegion, view, s.plateBox);
    const measured = s.plateBox.w > 0 && s.plateBox.h > 0;
    const inDetail = Boolean(
      pos && frame && (measured ? inRegionFrame(s.atlasRegion, view, pos) : insideFrame(pos, frame)),
    );
    const apply = () => {
      set({
        selectedPointId: id,
        selectedCenterId: null,
        activeMeridianId: pt.meridianId,
        atlasView: view,
        ...(inDetail ? {} : { atlasRegion: "body" as const }),
      });
      if (inDetail && frame) {
        get().flyTo({ pan: frame.pan, zoom: frame.zoom });
        return;
      }
      get().flyTo({ pan: pos ?? { x: 400, y: 800 }, zoom: pos ? 2.4 : 1 });
    };
    if (view !== s.atlasView) withPaperTransition(apply);
    else apply();
  },
  setHovered: (id) => set({ hoveredPointId: id }),
  hoveredMeridianId: null,
  setHoveredMeridian: (id) => set({ hoveredMeridianId: id }),
  setActiveMeridian: (id) => set({ activeMeridianId: id }),
  toggleLayer: (key) =>
    set((s) => ({
      visibleLayers: { ...s.visibleLayers, [key]: !s.visibleLayers[key] },
    })),
  setQiPlaying: (v) => set({ qiPlaying: v && !prefersReducedMotion() }),
  setQiSpeed: (v) => set({ qiSpeed: Math.min(4, Math.max(0.25, v)) }),
  setClockHour: (h) => set({ clockHour: ((h % 24) + 24) % 24 }),
  setLocale: (l) => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
    }
    set({ locale: l });
  },
  setSearch: (q) => set({ searchQuery: q }),
  setElementFilter: (e) => set((s) => ({ filters: { ...s.filters, element: e } })),
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
      const s = get();
      const region = s.atlasRegion;
      set({ atlasView: v });
      if (region === "body") return;
      get().flyTo(detailCamera(region, v, s.plateBox));
    }),
  setAtlasRegion: (r) =>
    withPaperTransition(() => {
      const s = get();
      set({ atlasRegion: r });
      get().flyTo(detailCamera(r, s.atlasView, s.plateBox));
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
    const framed = onFace ? detailCamera("face", view, s.plateBox) : null;
    const pos = framed ? framed.pan : (positionOnView(center, view) ?? center.anterior);
    const apply = () => {
      set({
        selectedCenterId: id,
        selectedPointId: null,
        atlasView: view,
        atlasRegion: onFace ? "face" : "body",
        visibleLayers: { ...get().visibleLayers, centers: true },
      });
      get().flyTo({
        pan: pos ?? get().atlasPan,
        zoom: framed ? framed.zoom : 2.15,
      });
    };
    if (view !== s.atlasView) withPaperTransition(apply);
    else apply();
  },
  setAtlasZoom: (z) => {
    const zoom = clampZoom(z);
    const s = get();
    set({ atlasZoom: zoom, atlasPan: clampPan(s.atlasPan, zoom, s.plateBox) });
  },
  setAtlasPan: (p) => {
    const s = get();
    set({ atlasPan: clampPan(p, s.atlasZoom, s.plateBox) });
  },
  setPlateBox: (b) => {
    noteRegionPlate(b);
    set({ plateBox: b });
  },
  setPaletteOpen: (v) => set({ paletteOpen: v }),
  setHelpOpen: (v) => set({ helpOpen: v }),
  setSheetSnap: (s) => set({ sheetSnap: s }),
  setLabelsMode: (m) => set({ labelsMode: m }),
  resetAtlasCamera: () => {
    set({ atlasRegion: "body" });
    get().flyTo({ pan: { x: 400, y: 800 }, zoom: 1 });
  },
  flyTo: (target, opts) => {
    const zoom = clampZoom(target.zoom);
    const box = get().plateBox;
    const to: Camera = { pan: clampPan(target.pan, zoom, box), zoom };
    if (opts?.keepAim) aim = to;
    else aim = null;
    const duration = opts?.duration ?? 420;
    stopFlight();
    if (duration <= 0 || prefersReducedMotion() || typeof requestAnimationFrame !== "function") {
      set({ atlasPan: to.pan, atlasZoom: to.zoom });
      return;
    }
    const from: Camera = { pan: get().atlasPan, zoom: get().atlasZoom };
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const cam = lerpCamera(from, to, t);
      set({ atlasPan: clampPan(cam.pan, cam.zoom, get().plateBox), atlasZoom: cam.zoom });
      if (t < 1) flight = requestAnimationFrame(step);
      else if (aim === to) aim = null;
    };
    flight = requestAnimationFrame(step);
  },
  zoomBy: (factor, anchor) => {
    const s = get();
    const base = aim ?? { pan: s.atlasPan, zoom: s.atlasZoom };
    const spun = zoomAbout(base, factor, anchor ?? base.pan);
    const zoom = clampZoom(spun.zoom);
    aim = { pan: clampPan(spun.pan, zoom, s.plateBox), zoom };
    get().flyTo(aim, { duration: 160, keepAim: true });
  },
  stopFlight,
}));
