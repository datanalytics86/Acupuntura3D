import { CX } from "../landmarks";

export function ellipseD(cx: number, cy: number, rx: number, ry: number): string {
  return `M ${cx} ${cy - ry} A ${rx} ${ry} 0 1 1 ${cx} ${cy + ry} A ${rx} ${ry} 0 1 1 ${cx} ${cy - ry} Z`;
}

/** Stadium / limb segment with round caps of radius r. */
export function capsuleD(x1: number, y1: number, x2: number, y2: number, r: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * r;
  const ny = (dx / len) * r;
  return [
    `M ${x1 + nx} ${y1 + ny}`,
    `L ${x2 + nx} ${y2 + ny}`,
    `A ${r} ${r} 0 0 1 ${x2 - nx} ${y2 - ny}`,
    `L ${x1 - nx} ${y1 - ny}`,
    `A ${r} ${r} 0 0 1 ${x1 + nx} ${y1 + ny}`,
    "Z",
  ].join(" ");
}

/** Tapered finger / toe: width at base, slightly narrower round tip. */
export function fingerD(
  bx: number,
  by: number,
  angle: number,
  length: number,
  width: number,
): string {
  const tipW = width * 0.7;
  const x2 = bx + Math.cos(angle) * length;
  const y2 = by + Math.sin(angle) * length;
  const nx1 = -Math.sin(angle) * (width / 2);
  const ny1 = Math.cos(angle) * (width / 2);
  const nx2 = -Math.sin(angle) * (tipW / 2);
  const ny2 = Math.cos(angle) * (tipW / 2);
  const r = Math.max(tipW / 2, 2.2);
  const br = width / 2;
  return [
    `M ${bx + nx1} ${by + ny1}`,
    `L ${x2 + nx2} ${y2 + ny2}`,
    `A ${r} ${r} 0 0 1 ${x2 - nx2} ${y2 - ny2}`,
    `L ${bx - nx1} ${by - ny1}`,
    `A ${br} ${br} 0 0 1 ${bx + nx1} ${by + ny1}`,
    "Z",
  ].join(" ");
}

/** Mirror an x coordinate across the atlas midline. */
export function X(x: number, side: 1 | -1): number {
  return side === 1 ? x : 2 * CX - x;
}

/** Mirror an angle so contralateral limbs point the right way. */
export function A(angle: number, side: 1 | -1): number {
  return side === 1 ? angle : Math.PI - angle;
}

export function polyD(pts: { x: number; y: number }[], closed = true): string {
  if (pts.length === 0) return "";
  const [first, ...rest] = pts;
  const d = [`M ${first!.x} ${first!.y}`, ...rest.map((p) => `L ${p.x} ${p.y}`)];
  if (closed) d.push("Z");
  return d.join(" ");
}
