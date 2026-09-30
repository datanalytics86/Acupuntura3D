import { inflateSync } from "node:zlib";

export type Raster = { w: number; h: number; rgba: Uint8Array };

function paeth(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

/** Decode an 8-bit RGB or RGBA PNG. Enough for the empty-paper bands. */
export function decodePng(buf: Buffer): Raster {
  if (buf.toString("hex", 0, 8) !== "89504e470d0a1a0a") throw new Error("not a png");
  let offset = 8;
  let w = 0;
  let h = 0;
  let color = 0;
  const idat: Buffer[] = [];
  while (offset + 8 <= buf.length) {
    const len = buf.readUInt32BE(offset);
    offset += 4;
    const type = buf.toString("ascii", offset, offset + 4);
    offset += 4;
    const data = buf.subarray(offset, offset + len);
    offset += len + 4;
    if (type === "IHDR") {
      w = data.readUInt32BE(0);
      h = data.readUInt32BE(4);
      color = data[9] ?? 0;
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
  }
  const bpp = color === 6 ? 4 : color === 2 ? 3 : 0;
  if (w === 0 || h === 0 || bpp === 0) throw new Error(`unsupported png ${w}x${h} color ${color}`);
  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * bpp;
  const rgba = new Uint8Array(w * h * 4);
  let src = 0;
  let prev = new Uint8Array(stride);
  for (let y = 0; y < h; y += 1) {
    const filter = raw[src] ?? 0;
    src += 1;
    const recon = new Uint8Array(stride);
    for (let i = 0; i < stride; i += 1) {
      const x = raw[src + i] ?? 0;
      const left = i >= bpp ? (recon[i - bpp] ?? 0) : 0;
      const up = prev[i] ?? 0;
      const ul = i >= bpp ? (prev[i - bpp] ?? 0) : 0;
      let value = x;
      if (filter === 1) value = (x + left) & 255;
      else if (filter === 2) value = (x + up) & 255;
      else if (filter === 3) value = (x + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) value = (x + paeth(left, up, ul)) & 255;
      else if (filter !== 0) throw new Error(`png filter ${filter}`);
      recon[i] = value;
    }
    src += stride;
    prev = recon;
    for (let x = 0; x < w; x += 1) {
      const s = x * bpp;
      const d = (y * w + x) * 4;
      rgba[d] = recon[s] ?? 0;
      rgba[d + 1] = recon[s + 1] ?? 0;
      rgba[d + 2] = recon[s + 2] ?? 0;
      rgba[d + 3] = bpp === 4 ? (recon[s + 3] ?? 255) : 255;
    }
  }
  return { w, h, rgba };
}

export function patchStats(
  raster: Raster,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): { mean: [number, number, number]; stdev: [number, number, number] } {
  const left = Math.max(0, Math.floor(x0));
  const top = Math.max(0, Math.floor(y0));
  const right = Math.min(raster.w, Math.ceil(x1));
  const bottom = Math.min(raster.h, Math.ceil(y1));
  let n = 0;
  const sum = [0, 0, 0];
  const sumSq = [0, 0, 0];
  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const i = (y * raster.w + x) * 4;
      for (let c = 0; c < 3; c += 1) {
        const v = raster.rgba[i + c] ?? 0;
        sum[c] = (sum[c] ?? 0) + v;
        sumSq[c] = (sumSq[c] ?? 0) + v * v;
      }
      n += 1;
    }
  }
  if (n === 0) throw new Error("empty patch");
  const mean = sum.map((s) => s / n) as [number, number, number];
  const stdev = sumSq.map((s, c) => Math.sqrt(Math.max(0, s / n - (mean[c] ?? 0) ** 2))) as [
    number,
    number,
    number,
  ];
  return { mean, stdev };
}
