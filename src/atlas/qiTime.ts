import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/quality";
import { useViewerStore } from "@/state/viewerStore";

/** One clock hour of the organ clock, at speed 1. */
export const CLOCK_HOUR_SECONDS = 8;

export function meridianAtHour(
  hour: number,
  meridians: { id: string; clockHour?: number }[],
): string | null {
  const h = ((hour % 24) + 24) % 24;
  const hit = meridians.find((m) => {
    if (m.clockHour === undefined) return false;
    const start = m.clockHour;
    const end = (start + 2) % 24;
    return start < end ? h >= start && h < end : h >= start || h < end;
  });
  return hit?.id ?? null;
}

/** Advances clockHour. The comet itself is CSS, not this loop. */
export function useOrganClock(on: boolean, speed: number): void {
  useEffect(() => {
    if (!on || prefersReducedMotion()) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let seen = useViewerStore.getState().clockHour;
    const tick = (now: number) => {
      const store = useViewerStore.getState();
      if (store.clockHour !== seen) {
        seen = store.clockHour;
        acc = 0;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      acc += dt * speed;
      if (acc >= CLOCK_HOUR_SECONDS) {
        acc = 0;
        store.setClockHour(store.clockHour + 1);
        seen = useViewerStore.getState().clockHour;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, speed]);
}
