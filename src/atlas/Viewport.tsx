import { useEffect, useMemo, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { clientToUnits, zoomAbout } from "@/atlas/camera";
import { VIEW_H, VIEW_W } from "@/atlas/figure/landmarks";
import { ScreenContext, unitsPerPx, visibleRect, type PlateBox } from "@/atlas/screen";
import { useViewerStore } from "@/state/viewerStore";
import type { Point2D } from "@/types";

type Ptr = { x: number; y: number };
type Gesture =
  | { kind: "drag"; id: number; x: number; y: number; panX: number; panY: number }
  | { kind: "pinch"; d: number; zoom: number; pan: Point2D; midX: number; midY: number };

function eventOnHit(e: { target: EventTarget | null; nativeEvent: Event }): boolean {
  const path = typeof e.nativeEvent.composedPath === "function" ? e.nativeEvent.composedPath() : [];
  for (const node of path) {
    if (node instanceof Element && (node.hasAttribute("data-atlas-hit") || node.closest("[data-atlas-hit]"))) {
      return true;
    }
  }
  const target = e.target;
  return target instanceof Element && Boolean(target.closest("[data-atlas-hit]"));
}

export function Viewport({ children }: { children: ReactNode }) {
  const zoom = useViewerStore((s) => s.atlasZoom);
  const pan = useViewerStore((s) => s.atlasPan);
  const setZoom = useViewerStore((s) => s.setAtlasZoom);
  const setPan = useViewerStore((s) => s.setAtlasPan);
  const setPlateBox = useViewerStore((s) => s.setPlateBox);
  const reset = useViewerStore((s) => s.resetAtlasCamera);
  const stopFlight = useViewerStore((s) => s.stopFlight);
  const svgRef = useRef<SVGSVGElement>(null);
  const [box, setBox] = useState<PlateBox>({ w: 0, h: 0 });
  const ptrs = useRef(new Map<number, Ptr>());
  const gesture = useRef<Gesture | null>(null);
  const lastUp = useRef(0);
  const tapStart = useRef<Ptr | null>(null);

  const k = unitsPerPx(VIEW_W / zoom, VIEW_H / zoom, box);
  // k depends on zoom and plate size, not pan. A fresh object would rerender every consumer on drag.
  const screen = useMemo(() => ({ k, box }), [k, box]);
  const vis = visibleRect(pan, k, box);
  const vbW = VIEW_W / zoom;
  const vbH = VIEW_H / zoom;
  const vbX = pan.x - vbW / 2;
  const vbY = pan.y - vbH / 2;

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const next = { w: entry.contentRect.width, h: entry.contentRect.height };
      setBox((prev) => (prev.w === next.w && prev.h === next.h ? prev : next));
      setPlateBox(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [setPlateBox]);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    // Trackpad pinch arrives as ctrl+wheel and uses the same cursor anchor.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy =
        e.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? e.deltaY * 16
          : e.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? e.deltaY * el.clientHeight
            : e.deltaY;
      if (dy === 0) return;
      const s = useViewerStore.getState();
      const rect = el.getBoundingClientRect();
      const units = unitsPerPx(VIEW_W / s.atlasZoom, VIEW_H / s.atlasZoom, {
        w: rect.width,
        h: rect.height,
      });
      const anchor = clientToUnits({ x: e.clientX, y: e.clientY }, rect, s.atlasPan, units);
      s.zoomBy(Math.exp(-dy * 0.0015), anchor);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  function armGesture() {
    const pts = [...ptrs.current.entries()];
    const s = useViewerStore.getState();
    const a = pts[0];
    const b = pts[1];
    if (a && b) {
      gesture.current = {
        kind: "pinch",
        d: Math.hypot(a[1].x - b[1].x, a[1].y - b[1].y),
        zoom: s.atlasZoom,
        pan: { x: s.atlasPan.x, y: s.atlasPan.y },
        midX: (a[1].x + b[1].x) / 2,
        midY: (a[1].y + b[1].y) / 2,
      };
      return;
    }
    if (a) {
      gesture.current = {
        kind: "drag",
        id: a[0],
        x: a[1].x,
        y: a[1].y,
        panX: s.atlasPan.x,
        panY: s.atlasPan.y,
      };
      return;
    }
    gesture.current = null;
  }

  function onPointerDown(e: PointerEvent<SVGSVGElement>) {
    if (eventOnHit(e)) return;
    const now = Date.now();
    if (ptrs.current.size === 0 && now - lastUp.current < 280) {
      lastUp.current = 0;
      tapStart.current = null;
      gesture.current = null;
      reset();
      return;
    }
    if (ptrs.current.size === 0) tapStart.current = { x: e.clientX, y: e.clientY };
    stopFlight();
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
    armGesture();
  }

  function onPointerMove(e: PointerEvent<SVGSVGElement>) {
    const held = ptrs.current.get(e.pointerId);
    if (held) {
      held.x = e.clientX;
      held.y = e.clientY;
    }
    const g = gesture.current;
    if (!g) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const plate = { w: rect.width, h: rect.height };
    if (g.kind === "drag") {
      if (g.id !== e.pointerId) return;
      const units = unitsPerPx(VIEW_W / zoom, VIEW_H / zoom, plate);
      setPan({
        x: g.panX - (e.clientX - g.x) * units,
        y: g.panY - (e.clientY - g.y) * units,
      });
      return;
    }
    const pts = [...ptrs.current.values()];
    const a = pts[0];
    const b = pts[1];
    if (!a || !b) return;
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;
    const k0 = unitsPerPx(VIEW_W / g.zoom, VIEW_H / g.zoom, plate);
    const anchor = clientToUnits({ x: g.midX, y: g.midY }, rect, g.pan, k0);
    const nextZoom = zoomAbout({ pan: g.pan, zoom: g.zoom }, d / Math.max(g.d, 1), anchor).zoom;
    const k1 = unitsPerPx(VIEW_W / nextZoom, VIEW_H / nextZoom, plate);
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setZoom(nextZoom);
    setPan({
      x: anchor.x - (midX - cx) * k1,
      y: anchor.y - (midY - cy) * k1,
    });
  }

  function onPointerUp(e: PointerEvent<SVGSVGElement>) {
    ptrs.current.delete(e.pointerId);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (ptrs.current.size === 0) {
      gesture.current = null;
      const start = tapStart.current;
      const moved = !start || Math.hypot(e.clientX - start.x, e.clientY - start.y) > 12;
      lastUp.current = moved ? 0 : Date.now();
      tapStart.current = null;
      return;
    }
    armGesture();
  }

  function onDoubleClick(e: MouseEvent<SVGSVGElement>) {
    if (eventOnHit(e)) return;
    reset();
  }

  const measured = box.w > 0 && box.h > 0;
  const paper = measured
    ? { x: vis.l, y: vis.t, w: vis.r - vis.l, h: vis.b - vis.t }
    : { x: vbX, y: vbY, w: vbW, h: vbH };

  return (
    <ScreenContext.Provider value={screen}>
      <svg
        ref={svgRef}
        className="atlas-stage touch-none select-none"
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
        overflow="visible"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
        role="group"
        aria-label="Atlas corporal de meridianos"
      >
        <rect x={paper.x} y={paper.y} width={paper.w} height={paper.h} fill="var(--color-paper)" />
        {children}
      </svg>
    </ScreenContext.Provider>
  );
}
