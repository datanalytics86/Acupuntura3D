import { useEffect, useMemo, useRef, useState } from "react";
import { loadMeridians } from "@/data";
import { anchorsToPath } from "@/atlas/catmullRom";
import { MERIDIAN_ANCHORS_2D } from "@/atlas/meridianAnchors";
import { useViewerStore } from "@/state/viewerStore";
import type { Point2D } from "@/types";

export function QiFlow() {
  const meridians = useMemo(() => loadMeridians(), []);
  const view = useViewerStore((s) => s.atlasView);
  const visible = useViewerStore((s) => s.visibleLayers.qi);
  const playing = useViewerStore((s) => s.qiPlaying);
  const speed = useViewerStore((s) => s.qiSpeed);
  const quality = useViewerStore((s) => s.qualityTier);
  const active = useViewerStore((s) => s.activeMeridianId);
  const both = useViewerStore((s) => s.bothSides);
  const pathRef = useRef<SVGPathElement>(null);
  const [beads, setBeads] = useState<Point2D[]>([]);

  const target = meridians.find((m) => m.id === (active ?? "ST")) ?? meridians[0];
  const pack = target ? (target.anchors2d ?? MERIDIAN_ANCHORS_2D[target.id]) : undefined;
  const anchors = pack?.[view];
  const d = anchors && anchors.length > 1 ? anchorsToPath(anchors) : "";
  const n = quality === "low" ? 0 : quality === "medium" ? 5 : 10;

  useEffect(() => {
    if (!visible || !playing || !d || n === 0) {
      setBeads([]);
      return;
    }
    let raf = 0;
    const tick = (t: number) => {
      const el = pathRef.current;
      if (!el) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const L = el.getTotalLength();
      if (L < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const pts: Point2D[] = [];
      for (let i = 0; i < n; i += 1) {
        const s = ((t * 0.06 * speed * L + (i * L) / n) % L + L) % L;
        const p = el.getPointAtLength(s);
        pts.push({ x: p.x, y: p.y });
      }
      setBeads(pts);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, playing, d, n, speed]);

  if (!visible || !d) return null;

  return (
    <g>
      <path ref={pathRef} d={d} fill="none" stroke="none" />
      {both && target?.laterality === "bilateral" ? (
        <path d={anchorsToPath(anchors!.map((p) => ({ x: 800 - p.x, y: p.y })))} fill="none" stroke="none" />
      ) : null}
      {beads.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={quality === "high" ? 4.2 : 3.2}
          fill={target?.color ?? "#e8c98a"}
          opacity={0.95}
        />
      ))}
    </g>
  );
}
