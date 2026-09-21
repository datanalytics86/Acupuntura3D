import { useMemo } from "react";
import { loadMeridians } from "@/data";
import { anchorsToPath } from "@/atlas/catmullRom";
import { MERIDIAN_ANCHORS_2D } from "@/atlas/meridianAnchors";
import { useViewerStore } from "@/state/viewerStore";
import type { Point2D } from "@/types";

function sides(anchors: Point2D[], both: boolean): Point2D[][] {
  const out = [anchors];
  if (both && anchors.some((p) => Math.abs(p.x - 400) > 6)) {
    out.push(anchors.map((p) => ({ x: 800 - p.x, y: p.y })));
  }
  return out;
}

export function MeridianPaths() {
  const meridians = useMemo(() => loadMeridians(), []);
  const view = useViewerStore((s) => s.atlasView);
  const visible = useViewerStore((s) => s.visibleLayers.meridians);
  const active = useViewerStore((s) => s.activeMeridianId);
  const both = useViewerStore((s) => s.bothSides);
  const hour = useViewerStore((s) => s.clockHour);
  if (!visible) return null;

  return (
    <g>
      {meridians.map((m) => {
        const pack = m.anchors2d ?? MERIDIAN_ANCHORS_2D[m.id];
        const anchors = pack?.[view];
        if (!anchors || anchors.length < 2) return null;
        const dim = Boolean(active) && active !== m.id;
        const start = m.clockHour;
        const boosted =
          start !== undefined &&
          (start < (start + 2) % 24
            ? hour >= start && hour < start + 2
            : hour >= start || hour < (start + 2) % 24);
        const hot = !dim && (active === m.id || boosted);
        return sides(anchors, both && m.laterality === "bilateral").map((pts, i) => (
          <path
            key={`${m.id}-${i}`}
            d={anchorsToPath(pts)}
            fill="none"
            stroke={m.color}
            strokeWidth={dim ? 1.25 : 1.55}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={dim ? 0.18 : hot ? 0.95 : 0.72}
            style={{ mixBlendMode: "multiply" }}
            pathLength={1000}
          />
        ));
      })}
    </g>
  );
}
