/** Nearest plate mark in client pixels. Ties keep the earlier mark. */

export interface ScreenPoint {
  x: number;
  y: number;
}

export function nearestWithin<T extends ScreenPoint>(
  marks: readonly T[],
  x: number,
  y: number,
  radius: number,
): T | null {
  let best: T | null = null;
  let bestD = radius;
  for (const mark of marks) {
    const d = Math.hypot(mark.x - x, mark.y - y);
    if (d <= radius && (best === null || d < bestD)) {
      best = mark;
      bestD = d;
    }
  }
  return best;
}

/** The seal keeps the tap unless the point is strictly closer and still inside the radius. */
export function pointWinsOverSeal(pointDistance: number, sealDistance: number, radius: number): boolean {
  return pointDistance <= radius && pointDistance < sealDistance;
}

export function svgUserToClient(svg: SVGSVGElement, x: number, y: number): ScreenPoint | null {
  if (typeof svg.getScreenCTM !== "function" || typeof svg.createSVGPoint !== "function") return null;
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  const screen = pt.matrixTransform(ctm);
  return { x: screen.x, y: screen.y };
}

/** `marks` are in viewBox units. The radius is CSS pixels. */
export function nearestMarkAtClient<T extends ScreenPoint>(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
  marks: readonly T[],
  radiusPx: number,
): T | null {
  let best: T | null = null;
  let bestD = radiusPx;
  for (const mark of marks) {
    const at = svgUserToClient(svg, mark.x, mark.y);
    if (!at) continue;
    const d = Math.hypot(at.x - clientX, at.y - clientY);
    if (d <= radiusPx && (best === null || d < bestD)) {
      best = mark;
      bestD = d;
    }
  }
  return best;
}
