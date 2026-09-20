import { useRef, type ReactNode, type PointerEvent, type WheelEvent } from "react";
import { VIEW_H, VIEW_W } from "@/atlas/figure/landmarks";
import { useViewerStore } from "@/state/viewerStore";

export function Viewport({ children }: { children: ReactNode }) {
  const zoom = useViewerStore((s) => s.atlasZoom);
  const pan = useViewerStore((s) => s.atlasPan);
  const setZoom = useViewerStore((s) => s.setAtlasZoom);
  const setPan = useViewerStore((s) => s.setAtlasPan);
  const reset = useViewerStore((s) => s.resetAtlasCamera);
  const drag = useRef<{ id: number; x: number; y: number; panX: number; panY: number } | null>(null);
  const pinch = useRef<{ d: number; zoom: number } | null>(null);
  const lastTap = useRef(0);

  const vbW = VIEW_W / zoom;
  const vbH = VIEW_H / zoom;
  const vbX = pan.x - vbW / 2;
  const vbY = pan.y - vbH / 2;

  function onWheel(e: WheelEvent<SVGSVGElement>) {
    e.preventDefault();
    const next = Math.min(6, Math.max(1, zoom * (e.deltaY > 0 ? 0.92 : 1.08)));
    setZoom(next);
  }

  function onPointerDown(e: PointerEvent<SVGSVGElement>) {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      reset();
      lastTap.current = 0;
      return;
    }
    lastTap.current = now;
    (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }

  function onPointerMove(e: PointerEvent<SVGSVGElement>) {
    if (drag.current && drag.current.id === e.pointerId) {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const dx = ((e.clientX - drag.current.x) / r.width) * vbW;
      const dy = ((e.clientY - drag.current.y) / r.height) * vbH;
      setPan({ x: drag.current.panX - dx, y: drag.current.panY - dy });
    }
  }

  function onPointerUp(e: PointerEvent<SVGSVGElement>) {
    if (drag.current?.id === e.pointerId) drag.current = null;
    pinch.current = null;
  }

  function onTouchStart(e: React.TouchEvent<SVGSVGElement>) {
    if (e.touches.length === 2) {
      const a = e.touches[0]!;
      const b = e.touches[1]!;
      pinch.current = {
        d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
        zoom,
      };
    }
  }

  function onTouchMove(e: React.TouchEvent<SVGSVGElement>) {
    if (e.touches.length === 2 && pinch.current) {
      const a = e.touches[0]!;
      const b = e.touches[1]!;
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      setZoom(pinch.current.zoom * (d / Math.max(pinch.current.d, 1)));
    }
  }

  return (
    <svg
      className="absolute inset-0 h-full w-full touch-none select-none"
      viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
      preserveAspectRatio="xMidYMid meet"
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      role="img"
      aria-label="Atlas corporal de meridianos"
    >
      <rect x={vbX - 40} y={vbY - 40} width={vbW + 80} height={vbH + 80} fill="#F3EBD8" />
      {children}
    </svg>
  );
}
