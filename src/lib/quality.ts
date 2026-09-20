import type { QualityTier } from "@/types";

export function detectQuality(): QualityTier {
  if (typeof window === "undefined") return "medium";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  if (conn?.saveData || conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") return "low";
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const dpr = window.devicePixelRatio || 1;
  if (mobile || dpr < 1.25) return "medium";
  return "high";
}

export function canvasDpr(tier: QualityTier): [number, number] {
  if (tier === "low") return [1, 1];
  if (tier === "medium") return [1, 1.5];
  return [1, 2];
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
