// Assumes a fresh `dist` from `npm run build`. Does not rebuild.
// CI runs this after the build step.
// Limits (decimal, same 8_000_000 B gate as the old du check; Vite prints kB as /1000):
//   dist >= 8 MB, index-*.js gzip > 130 KB, index-*.css gzip > 14 KB → exit 1.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const DIST_MAX = 8_000_000;
const JS_GZIP_MAX = 130_000;
const CSS_GZIP_MAX = 14_000;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const assetsDir = join(distDir, "assets");

function dirBytes(dir) {
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) total += dirBytes(path);
    else if (entry.isFile()) total += statSync(path).size;
  }
  return total;
}

function assetGzip(ext) {
  const files = readdirSync(assetsDir)
    .filter((name) => name.startsWith("index-") && name.endsWith(ext))
    .sort();
  if (files.length === 0) {
    throw new Error(`no dist/assets/index-*${ext}`);
  }
  let total = 0;
  for (const name of files) {
    total += gzipSync(readFileSync(join(assetsDir, name))).length;
  }
  return total;
}

const failures = [];
let distBytes = 0;
let jsGzip = 0;
let cssGzip = 0;

try {
  distBytes = dirBytes(distDir);
  jsGzip = assetGzip(".js");
  cssGzip = assetGzip(".css");
} catch (error) {
  console.log(`dist bytes=${distBytes}`);
  console.log(`js gzip=${jsGzip}`);
  console.log(`css gzip=${cssGzip}`);
  console.error(error instanceof Error ? error.message : error);
  console.error("budget assumes a fresh dist; run npm run build first");
  process.exit(1);
}

console.log(`dist bytes=${distBytes}`);
console.log(`js gzip=${jsGzip}`);
console.log(`css gzip=${cssGzip}`);

if (distBytes >= DIST_MAX) failures.push(`dist ${distBytes} >= ${DIST_MAX}`);
if (jsGzip > JS_GZIP_MAX) failures.push(`js gzip ${jsGzip} > ${JS_GZIP_MAX}`);
if (cssGzip > CSS_GZIP_MAX) failures.push(`css gzip ${cssGzip} > ${CSS_GZIP_MAX}`);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
