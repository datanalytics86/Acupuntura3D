import { memo, useMemo } from "react";
import { loadMeridians } from "@/data";
import { anchorsToPath, samplePath, type PathSample } from "@/atlas/catmullRom";
import { MERIDIAN_ANCHORS_2D } from "@/atlas/meridianAnchors";
import { meridianAtHour } from "@/atlas/qiTime";
import { useUnitsPerPx } from "@/atlas/screen";
import { meridianPigment } from "@/lib/tokens";
import { useViewerStore } from "@/state/viewerStore";
import type { Point2D } from "@/types";

const PAPER_CASING = "rgba(251,247,238,.6)";

const pathByKey = new Map<string, string>();

function sides(anchors: Point2D[], both: boolean): Point2D[][] {
  const out = [anchors];
  if (both && anchors.some((p) => Math.abs(p.x - 400) > 6)) {
    out.push(anchors.map((p) => ({ x: 800 - p.x, y: p.y })));
  }
  return out;
}

function memoPath(id: string, view: string, side: string, pts: Point2D[]): string {
  const key = `${id}|${view}|${side}`;
  const hit = pathByKey.get(key);
  if (hit) return hit;
  const d = anchorsToPath(pts);
  pathByKey.set(key, d);
  return d;
}

function casingColor(pigment: string, hour: boolean): string {
  if (!hour || !/^#[0-9A-Fa-f]{6}$/.test(pigment)) return PAPER_CASING;
  const r = Number.parseInt(pigment.slice(1, 3), 16);
  const g = Number.parseInt(pigment.slice(3, 5), 16);
  const b = Number.parseInt(pigment.slice(5, 7), 16);
  const mix = (paper: number, ink: number) => Math.round(paper * 0.88 + ink * 0.12);
  return `rgba(${mix(251, r)},${mix(247, g)},${mix(238, b)},.6)`;
}

function labelAt(pts: Point2D[], k: number): { x: number; y: number; anchor: "start" | "end" } | null {
  const a = pts[0];
  const b = pts[1] ?? a;
  if (!a || !b) return null;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len;
  let ny = dx / len;
  const outward = a.x - 400;
  if (outward * nx < 0 || (Math.abs(outward) <= 6 && nx < 0)) {
    nx = -nx;
    ny = -ny;
  }
  const gap = 9 * k;
  return { x: a.x + nx * gap, y: a.y + ny * gap, anchor: nx >= 0 ? "start" : "end" };
}

function chevronD(k: number): string {
  const len = 5 * k;
  const wing = 2.2 * k;
  return `M ${-len} ${-wing} L 0 0 L ${-len} ${wing}`;
}

interface Trace {
  key: string;
  id: string;
  code: string;
  d: string;
  pts: Point2D[];
  pigment: string;
  yang: boolean;
}

export const MeridianPaths = memo(function MeridianPaths() {
  const k = useUnitsPerPx();
  const view = useViewerStore((s) => s.atlasView);
  const visible = useViewerStore((s) => s.visibleLayers.meridians);
  const active = useViewerStore((s) => s.activeMeridianId);
  const both = useViewerStore((s) => s.bothSides);
  const hour = useViewerStore((s) => s.clockHour);
  const meridians = useMemo(() => loadMeridians(), []);

  const traces = useMemo(() => {
    const out: Trace[] = [];
    for (const m of meridians) {
      const pack = m.anchors2d ?? MERIDIAN_ANCHORS_2D[m.id];
      const anchors = pack?.[view];
      if (!anchors || anchors.length < 2) continue;
      const mirrored = sides(anchors, both && m.laterality === "bilateral");
      mirrored.forEach((pts, i) => {
        const side = i === 0 ? "src" : "mir";
        out.push({
          key: `${m.id}|${view}|${side}`,
          id: m.id,
          code: m.code,
          d: memoPath(m.id, view, side, pts),
          pts,
          pigment: meridianPigment(m),
          yang: m.polaridad === "yang",
        });
      });
    }
    return out;
  }, [meridians, view, both]);

  const ticks = useMemo(() => {
    const out = new Map<string, PathSample[]>();
    const step = 140 * k;
    for (const t of traces) out.set(t.key, samplePath(t.pts, step));
    return out;
  }, [traces, k]);

  if (!visible) return null;

  const hourId = meridianAtHour(hour, meridians);

  return (
    <g mask="url(#region-focus)" pointerEvents="none">
      {traces.map((t) => {
        const hot = active === t.id;
        const dim = active !== null && !hot;
        const opacity = dim ? 0.28 : hot ? 1 : 0.85;
        const casingPx = (hot ? 5 : 3.5) * k;
        const strokePx = (hot ? 2.25 : 1.25) * k;
        const dash = t.yang ? `${7 * k} ${2.5 * k}` : undefined;
        const place = labelAt(t.pts, k);
        const samples = ticks.get(t.key) ?? [];
        return (
          <g key={t.key} opacity={opacity} data-meridian={t.id} data-hour={hourId === t.id ? "on" : "off"}>
            <path
              d={t.d}
              fill="none"
              stroke={casingColor(t.pigment, hourId === t.id)}
              strokeWidth={casingPx}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={dash}
            />
            <path
              d={t.d}
              fill="none"
              stroke={t.pigment}
              strokeWidth={strokePx}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={dash}
            />
            {samples.map((s, i) => (
              <path
                key={`${t.key}-chev-${i}`}
                d={chevronD(k)}
                transform={`translate(${s.x} ${s.y}) rotate(${s.angle})`}
                fill="none"
                stroke={t.pigment}
                strokeWidth={1.25 * k}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {place ? (
              <text
                className="code"
                x={place.x}
                y={place.y}
                fontSize={11 * k}
                fill={t.pigment}
                stroke="#FBF7EE"
                strokeWidth={3 * k}
                paintOrder="stroke"
                strokeLinejoin="round"
                textAnchor={place.anchor}
                dominantBaseline="middle"
              >
                {t.code}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
});
