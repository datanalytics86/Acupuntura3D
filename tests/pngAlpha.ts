import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";

const PNG_SIG = "89504e470d0a1a0a";

export interface PngAlpha {
  width: number;
  height: number;
  alpha: Uint8Array;
}

/** RGBA8, non-interlaced PNG. Alpha plane only, via IHDR + concatenated IDAT. */
export function decodePngAlpha(filePath: string): PngAlpha {
  const buf = readFileSync(filePath);
  if (buf.subarray(0, 8).toString("hex") !== PNG_SIG) {
    throw new Error(`not a png: ${filePath}`);
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = -1;
  let colorType = -1;
  let interlace = -1;
  const idats: Buffer[] = [];

  while (offset + 12 <= buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString("ascii", offset + 4, offset + 8);
    const data = buf.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8] ?? -1;
      colorType = data[9] ?? -1;
      interlace = data[12] ?? -1;
    } else if (type === "IDAT") {
      idats.push(data);
    } else if (type === "IEND") {
      break;
    }
    offset += 12 + length;
  }

  if (width < 1 || height < 1 || bitDepth !== 8 || colorType !== 6 || interlace !== 0) {
    throw new Error(
      `unsupported png ${filePath}: ${width}x${height} depth=${bitDepth} color=${colorType} interlace=${interlace}`,
    );
  }

  const bpp = 4;
  const inflated = inflateSync(Buffer.concat(idats));
  const stride = width * bpp;
  const alpha = new Uint8Array(width * height);
  let prev = new Uint8Array(stride);
  let src = 0;

  for (let y = 0; y < height; y++) {
    const filter = inflated[src];
    if (filter === undefined) throw new Error("truncated png scanline");
    src += 1;
    const row = new Uint8Array(stride);
    for (let x = 0; x < stride; x++) {
      const filt = inflated[src];
      if (filt === undefined) throw new Error("truncated png idat");
      src += 1;
      const left = x >= bpp ? (row[x - bpp] ?? 0) : 0;
      const up = prev[x] ?? 0;
      const ul = x >= bpp ? (prev[x - bpp] ?? 0) : 0;
      let value = filt;
      if (filter === 1) value = (filt + left) & 255;
      else if (filter === 2) value = (filt + up) & 255;
      else if (filter === 3) value = (filt + ((left + up) >> 1)) & 255;
      else if (filter === 4) {
        const predict = left + up - ul;
        const pa = Math.abs(predict - left);
        const pb = Math.abs(predict - up);
        const pc = Math.abs(predict - ul);
        const pred = pa <= pb && pa <= pc ? left : pb <= pc ? up : ul;
        value = (filt + pred) & 255;
      } else if (filter !== 0) {
        throw new Error(`bad png filter ${filter}`);
      }
      row[x] = value;
    }
    for (let x = 0; x < width; x++) {
      alpha[y * width + x] = row[x * bpp + 3] ?? 0;
    }
    prev = row;
  }

  if (src !== inflated.length) {
    throw new Error(`png inflate size mismatch: ${src} != ${inflated.length}`);
  }
  return { width, height, alpha };
}
