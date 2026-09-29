import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { unitsToClient } from "@/atlas/camera";
import { useUnitsPerPx } from "@/atlas/screen";
import { useViewerStore } from "@/state/viewerStore";
import type { Point2D } from "@/types";

export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const apply = () => setCoarse(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return coarse;
}

export function PointTooltip({
  open,
  anchor,
  code,
  hanzi,
  pinyin,
  name,
  svg,
}: {
  open: boolean;
  anchor: Point2D;
  code: string;
  hanzi: string;
  pinyin: string;
  name: string;
  svg: SVGSVGElement | null;
}) {
  const k = useUnitsPerPx();
  const pan = useViewerStore((s) => s.atlasPan);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!open) {
      setShown(false);
      return;
    }
    const timer = window.setTimeout(() => setShown(true), 120);
    return () => window.clearTimeout(timer);
  }, [open, code, anchor.x, anchor.y]);

  if (!shown || !svg || typeof document === "undefined") return null;
  const rect = svg.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  const client = unitsToClient(
    anchor,
    { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
    pan,
    k,
  );
  const width = 220;
  let left = client.x + 14;
  let top = client.y - 28;
  if (left + width > rect.right - 8) left = client.x - 14 - width;
  if (top < rect.top + 8) top = client.y + 16;
  const host = document.getElementById("plate") ?? document.body;
  return createPortal(
    <div
      role="tooltip"
      style={{
        position: "fixed",
        left,
        top,
        zIndex: 40,
        width,
        pointerEvents: "none",
        background: "var(--color-paper)",
        color: "var(--color-ink)",
        border: "1px solid var(--color-rule)",
        padding: "6px 8px",
        fontSize: 12,
        lineHeight: 1.35,
      }}
    >
      <span className="code">{code}</span>
      <span> · </span>
      <span className="hanzi">{hanzi}</span>
      <span> · </span>
      <span className="pinyin">{pinyin}</span>
      <span> · </span>
      <span>{name}</span>
    </div>,
    host,
  );
}
