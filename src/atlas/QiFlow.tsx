import type { CSSProperties } from "react";
import { useMemo } from "react";
import { loadMeridians } from "@/data";
import { anchorsToPath, pathLength } from "@/atlas/catmullRom";
import { MERIDIAN_ANCHORS_2D } from "@/atlas/meridianAnchors";
import { CENTERS } from "@/atlas/centers";
import { meridianAtHour, useOrganClock } from "@/atlas/qiTime";
import { useUnitsPerPx } from "@/atlas/screen";
import { CINNABAR } from "@/lib/colors";
import { meridianPigment } from "@/lib/tokens";
import { prefersReducedMotion } from "@/lib/quality";
import { useViewerStore } from "@/state/viewerStore";
import type { Meridian, Point2D } from "@/types";
import "./qi.css";

type QiStyle = CSSProperties & { "--qi-dur": string };

const geomByKey = new Map<string, { d: string; len: number }>();

function sides(anchors: Point2D[], both: boolean): Point2D[][] {
  const out = [anchors];
  if (both && anchors.some((p) => Math.abs(p.x - 400) > 6)) {
    out.push(anchors.map((p) => ({ x: 800 - p.x, y: p.y })));
  }
  return out;
}

function curveGeom(key: string, pts: Point2D[]): { d: string; len: number } {
  const hit = geomByKey.get(key);
  if (hit) return hit;
  const g = { d: anchorsToPath(pts), len: pathLength(pts) };
  geomByKey.set(key, g);
  return g;
}

function lineGeom(key: string, pts: Point2D[]): { d: string; len: number } {
  const hit = geomByKey.get(key);
  if (hit) return hit;
  const first = pts[0];
  if (!first || pts.length < 2) return { d: "", len: 0 };
  let d = `M ${first.x} ${first.y}`;
  let len = 0;
  for (let i = 1; i < pts.length; i += 1) {
    const p = pts[i];
    const prev = pts[i - 1];
    if (!p || !prev) continue;
    d += ` L ${p.x} ${p.y}`;
    len += Math.hypot(p.x - prev.x, p.y - prev.y);
  }
  const g = { d, len };
  if (g.len > 0) geomByKey.set(key, g);
  return g;
}

function anchorsOf(m: Meridian, view: "anterior" | "posterior"): Point2D[] | null {
  const anchors = (m.anchors2d ?? MERIDIAN_ANCHORS_2D[m.id])?.[view];
  if (!anchors || anchors.length < 2) return null;
  return anchors;
}

interface Stream {
  key: string;
  d: string;
  len: number;
  pigment: string;
}

export function QiFlow() {
  const k = useUnitsPerPx();
  const meridians = useMemo(() => loadMeridians(), []);
  const view = useViewerStore((s) => s.atlasView);
  const visible = useViewerStore((s) => s.visibleLayers.qi);
  const centersOn = useViewerStore((s) => s.visibleLayers.centers);
  const playing = useViewerStore((s) => s.qiPlaying);
  const speed = useViewerStore((s) => s.qiSpeed);
  const activeId = useViewerStore((s) => s.activeMeridianId);
  const both = useViewerStore((s) => s.bothSides);
  const hour = useViewerStore((s) => s.clockHour);

  useOrganClock(visible && playing, speed);

  if (!visible || prefersReducedMotion()) return null;

  const streams: Stream[] = [];
  const targetId = activeId ?? meridianAtHour(hour, meridians);
  const target = meridians.find((m) => m.id === targetId);
  if (target) {
    const anchors = anchorsOf(target, view);
    if (anchors) {
      const pigment = meridianPigment(target);
      sides(anchors, both && target.laterality === "bilateral").forEach((pts, i) => {
        const side = i === 0 ? "src" : "mir";
        const g = curveGeom(`${target.id}|${view}|${side}`, pts);
        if (g.d && g.len > 0) streams.push({ key: `${target.id}-${side}`, ...g, pigment });
      });
    }
  }

  if (centersOn) {
    if (view === "anterior") {
      const at = (id: "upper" | "middle" | "lower") => CENTERS.find((c) => c.id === id)?.anterior;
      const a = at("upper");
      const b = at("middle");
      const c = at("lower");
      if (a && b && c) {
        const g = lineGeom("dantian-down", [a, b, c]);
        if (g.d && g.len > 0) streams.push({ key: "dantian-down", ...g, pigment: CINNABAR });
      }
    } else {
      const gv = meridians.find((m) => m.id === "GV");
      const anchors = gv ? anchorsOf(gv, "posterior") : null;
      if (anchors) {
        const g = curveGeom("orbit-up|posterior|src", anchors);
        if (g.d && g.len > 0) streams.push({ key: "orbit-up", ...g, pigment: CINNABAR });
      }
    }
  }

  if (streams.length === 0) return null;

  const paused = playing ? "" : " is-paused";
  return (
    <g aria-hidden>
      {streams.map((s) => {
        const style: QiStyle = { "--qi-dur": `${(s.len / (160 * speed)).toFixed(2)}s` };
        return (
          <g key={s.key} pointerEvents="none" mask="url(#region-focus)" style={style}>
            <path className={`qi-comet qi-tail${paused}`} pathLength={1} d={s.d} stroke={s.pigment} strokeWidth={2 * k} />
            <path className={`qi-comet qi-mid${paused}`} pathLength={1} d={s.d} stroke={s.pigment} strokeWidth={2.6 * k} />
            <path className={`qi-comet qi-head${paused}`} pathLength={1} d={s.d} stroke={s.pigment} strokeWidth={3.5 * k} />
          </g>
        );
      })}
    </g>
  );
}
