import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { VIEW_H, VIEW_W } from "@/atlas/figure/landmarks";
import { unitsPerPx } from "@/atlas/screen";
import { t } from "@/i18n";
import { useViewerStore, type SheetSnap } from "@/state/viewerStore";
import type { Point2D } from "@/types";
import "./sheet.css";

const ORDER: readonly SheetSnap[] = ["closed", "peek", "half", "full"];
const SHORT_PX = 24;
const STEP_PX = 48;
const SKIP_PX = 160;
const FLING = 0.6;
const FLING_FAR = 1.2;

function moveSnap(current: SheetSnap, steps: number): SheetSnap {
  const index = ORDER.indexOf(current);
  const base = index < 0 ? 0 : index;
  const next = Math.min(ORDER.length - 1, Math.max(0, base + steps));
  return ORDER[next] ?? current;
}

/**
 * Positive dyPx / vyPxPerMs collapse the sheet.
 * |vy| ≥ 0.6 px/ms wins over distance; |vy| ≥ 1.2 skips one snap.
 */
export function nextSnap(current: SheetSnap, dyPx: number, vyPxPerMs: number): SheetSnap {
  if (vyPxPerMs <= -FLING_FAR) return moveSnap(current, 2);
  if (vyPxPerMs >= FLING_FAR) return moveSnap(current, -2);
  if (vyPxPerMs <= -FLING) return moveSnap(current, 1);
  if (vyPxPerMs >= FLING) return moveSnap(current, -1);
  if (Math.abs(dyPx) < SHORT_PX) return current;
  if (dyPx <= -SKIP_PX) return moveSnap(current, 2);
  if (dyPx <= -STEP_PX) return moveSnap(current, 1);
  if (dyPx >= SKIP_PX) return moveSnap(current, -2);
  if (dyPx >= STEP_PX) return moveSnap(current, -1);
  return current;
}

export function useNarrowSheet(): boolean {
  const query = "(max-width: 1023px)";
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setNarrow(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return narrow;
}

function snapHeight(snap: SheetSnap): number {
  if (snap === "closed") return 0;
  if (snap === "peek") return 168;
  const height = typeof window === "undefined" ? 800 : window.innerHeight;
  if (snap === "half") return height * 0.52;
  return Math.max(168, height - 48);
}

function tabbables(root: HTMLElement): HTMLElement[] {
  const sel =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return [...root.querySelectorAll<HTMLElement>(sel)].filter((el) => el.tabIndex >= 0);
}

export function Sheet({
  children,
  onClose,
  labelledBy,
  anchor,
  anchorKey,
  zoomHint,
}: {
  children: ReactNode;
  onClose: () => void;
  labelledBy: string;
  anchor: Point2D | null;
  anchorKey: string;
  zoomHint: number;
}) {
  const snap = useViewerStore((s) => s.sheetSnap);
  const setSheetSnap = useViewerStore((s) => s.setSheetSnap);
  const plateW = useViewerStore((s) => s.plateBox.w);
  const plateH = useViewerStore((s) => s.plateBox.h);
  const flyTo = useViewerStore((s) => s.flyTo);
  const locale = useViewerStore((s) => s.locale);
  const rootRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ y0: number; lastY: number; lastT: number; vy: number; snap: SheetSnap } | null>(null);
  const framed = useRef("");
  const [dragH, setDragH] = useState<number | null>(null);

  useEffect(() => {
    if (useViewerStore.getState().sheetSnap === "closed") setSheetSnap("peek");
  }, [setSheetSnap]);

  useLayoutEffect(() => {
    if (!anchor) return;
    if (snap !== "peek" && snap !== "half") return;
    if (plateW <= 0 || plateH <= 0) return;
    const sheetPx = rootRef.current?.getBoundingClientRect().height ?? 0;
    if (sheetPx <= 0) return;
    const zoom = framed.current === anchorKey ? useViewerStore.getState().atlasZoom : zoomHint;
    framed.current = anchorKey;
    const safeZoom = zoom > 0 ? zoom : 1;
    const k = unitsPerPx(VIEW_W / safeZoom, VIEW_H / safeZoom, { w: plateW, h: plateH });
    flyTo({ pan: { x: anchor.x, y: anchor.y + (sheetPx / 2) * k }, zoom: safeZoom });
  }, [anchor, anchorKey, snap, zoomHint, plateW, plateH, flyTo]);

  function onKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (snap !== "full" || e.key !== "Tab") return;
    const root = rootRef.current;
    if (!root) return;
    const nodes = tabbables(root);
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (!first || !last) {
      e.preventDefault();
      return;
    }
    const active = document.activeElement;
    const index = active instanceof HTMLElement ? nodes.indexOf(active) : -1;
    if (e.shiftKey) {
      if (index <= 0) {
        e.preventDefault();
        last.focus();
      }
      return;
    }
    if (index === nodes.length - 1) {
      e.preventDefault();
      first.focus();
    }
  }

  function onPointerDown(e: ReactPointerEvent<HTMLButtonElement>) {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = { y0: e.clientY, lastY: e.clientY, lastT: e.timeStamp, vy: 0, snap };
    setDragH(snapHeight(snap));
  }

  function onPointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    const g = gesture.current;
    if (!g) return;
    const dt = e.timeStamp - g.lastT;
    if (dt > 0 && dt < 100) g.vy = (e.clientY - g.lastY) / dt;
    else if (dt >= 100) g.vy = 0;
    g.lastY = e.clientY;
    g.lastT = e.timeStamp;
    const limit = typeof window === "undefined" ? 800 : window.innerHeight;
    const next = Math.min(limit, Math.max(0, snapHeight(g.snap) - (e.clientY - g.y0)));
    setDragH(next);
  }

  function onPointerUp(e: ReactPointerEvent<HTMLButtonElement>) {
    const g = gesture.current;
    if (!g) return;
    const dy = e.clientY - g.y0;
    const dt = e.timeStamp - g.lastT;
    let vy = g.vy;
    if (dt > 0 && dt < 100) vy = (e.clientY - g.lastY) / dt;
    else if (dt >= 100) vy = 0;
    gesture.current = null;
    setDragH(null);
    const next = nextSnap(g.snap, dy, vy);
    if (next === "closed") {
      onClose();
      return;
    }
    setSheetSnap(next);
  }

  return (
    <div
      ref={rootRef}
      className="sheet"
      data-testid="sheet"
      data-snap={snap}
      role="dialog"
      aria-modal={snap === "full"}
      aria-labelledby={labelledBy}
      style={dragH === null ? undefined : { height: `${dragH}px` }}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        className="sheet-handle"
        data-testid="sheet-handle"
        aria-label={t(locale, "sheetHandle")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
      <div className="sheet-body">{children}</div>
    </div>
  );
}
