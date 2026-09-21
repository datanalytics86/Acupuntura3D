import { useEffect, useMemo, useRef } from "react";
import { loadMeridians } from "@/data";
import { anchorsToPath } from "@/atlas/catmullRom";
import { MERIDIAN_ANCHORS_2D } from "@/atlas/meridianAnchors";
import { CENTERS } from "@/atlas/centers";
import { CLOCK_HOUR_SECONDS, meridianAtHour } from "@/atlas/qiTime";
import { prefersReducedMotion } from "@/lib/quality";
import { useViewerStore } from "@/state/viewerStore";
import type { Meridian, Point2D } from "@/types";

const BEADS = 5;
const CINNABAR = "#7A3B32";

function pathFor(m: Meridian, view: "anterior" | "posterior"): string {
  const anchors = (m.anchors2d ?? MERIDIAN_ANCHORS_2D[m.id])?.[view];
  if (!anchors || anchors.length < 2) return "";
  return anchorsToPath(anchors);
}

function mirror(d: Point2D[]): Point2D[] {
  return d.map((p) => ({ x: 800 - p.x, y: p.y }));
}

/** Beads move by writing the DOM. The organ clock is the only React update. */
function Stream({
  d,
  color,
  playing,
  speed,
  pace,
  count,
  opacity,
}: {
  d: string;
  color: string;
  playing: boolean;
  speed: number;
  pace: number;
  count: number;
  opacity: number;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const beads = useRef<Array<SVGCircleElement | null>>([]);

  useEffect(() => {
    if (!playing || !d || prefersReducedMotion()) return;
    let raf = 0;
    const tick = (t: number) => {
      const el = pathRef.current;
      const L = el?.getTotalLength() ?? 0;
      if (el && L > 1) {
        for (let i = 0; i < count; i += 1) {
          const node = beads.current[i];
          if (!node) continue;
          const u = (t * 0.00004 * speed * pace - i * 0.065) % 1;
          const s = (u < 0 ? u + 1 : u) * L;
          const p = el.getPointAtLength(s);
          node.setAttribute("cx", p.x.toFixed(1));
          node.setAttribute("cy", p.y.toFixed(1));
          const falloff = 1 - i / count;
          node.setAttribute("opacity", String(Math.max(0.15, opacity * falloff)));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, d, speed, pace, count, opacity]);

  if (!d) return null;
  return (
    <g pointerEvents="none" style={{ mixBlendMode: "multiply" }}>
      <path ref={pathRef} d={d} fill="none" stroke="none" />
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          ref={(node) => {
            beads.current[i] = node;
          }}
          r={i === 0 ? 4.4 : 3.1}
          fill={color}
          stroke="var(--color-paper)"
          strokeWidth={i === 0 ? 1.6 : 1}
          opacity={0}
        />
      ))}
    </g>
  );
}

function useOrganClock(on: boolean, speed: number) {
  useEffect(() => {
    if (!on || prefersReducedMotion()) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      acc += dt * speed;
      if (acc >= CLOCK_HOUR_SECONDS) {
        acc -= CLOCK_HOUR_SECONDS;
        const store = useViewerStore.getState();
        store.setClockHour(store.clockHour + 1);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, speed]);
}

export function QiFlow() {
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

  const active = meridians.find((m) => m.id === (activeId ?? "ST")) ?? meridians[0];
  const clockId = meridianAtHour(hour, meridians);
  const clock = clockId && clockId !== active?.id ? meridians.find((m) => m.id === clockId) : undefined;

  const streams: { key: string; d: string; color: string; pace: number; opacity: number }[] = [];
  const pushMeridian = (m: Meridian | undefined, pace: number, opacity: number) => {
    if (!m) return;
    const anchors = (m.anchors2d ?? MERIDIAN_ANCHORS_2D[m.id])?.[view];
    const d = pathFor(m, view);
    if (!d || !anchors) return;
    streams.push({ key: `${m.id}-a`, d, color: m.color, pace, opacity });
    if (both && m.laterality === "bilateral" && anchors.some((p) => Math.abs(p.x - 400) > 6)) {
      streams.push({
        key: `${m.id}-b`,
        d: anchorsToPath(mirror(anchors)),
        color: m.color,
        pace,
        opacity,
      });
    }
  };
  pushMeridian(active, 1, 0.95);
  pushMeridian(clock, 0.85, 0.62);

  if (centersOn && visible) {
    if (view === "anterior") {
      const at = (id: "upper" | "middle" | "lower") => CENTERS.find((c) => c.id === id)?.anterior;
      const a = at("upper");
      const b = at("middle");
      const c = at("lower");
      if (a && b && c) {
        streams.push({
          key: "dantian-down",
          d: `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y}`,
          color: CINNABAR,
          pace: 0.55,
          opacity: 0.9,
        });
      }
    } else {
      const gv = meridians.find((m) => m.id === "GV");
      const d = gv ? pathFor(gv, "posterior") : "";
      if (d) streams.push({ key: "orbit-up", d, color: CINNABAR, pace: 0.55, opacity: 0.9 });
    }
  }

  if (!visible || streams.length === 0) return null;

  return (
    <g aria-hidden>
      {streams.map((s) => (
        <Stream
          key={s.key}
          d={s.d}
          color={s.color}
          playing={playing}
          speed={speed}
          pace={s.pace}
          count={s.key.startsWith("dantian") || s.key.startsWith("orbit") ? 3 : BEADS}
          opacity={s.opacity}
        />
      ))}
    </g>
  );
}
