// Usage: node scripts/fonts-hanzi.mjs
// Self-hosts Noto Serif SC (SIL OFL 1.1) as a subset holding exactly the hanzi the atlas uses.
// Writes src/assets/fonts/noto-serif-sc-{500,600}.woff2 (Vite hashes them) and hanzi-subset.txt.
// Re-run whenever data/ or src/ gain a new hanzi (tests/fonts.test.ts fails until you do).
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const HAN = /[\u3400-\u4dbf\u4e00-\u9fff]/gu;
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(json|ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

export function atlasHanzi() {
  const set = new Set();
  for (const file of [...walk(join(root, "data")), ...walk(join(root, "src"))]) {
    for (const ch of readFileSync(file, "utf8").match(HAN) ?? []) set.add(ch);
  }
  return [...set].sort().join("");
}

async function fetchOk(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
}

const isMain = import.meta.url === pathToFileURL(process.argv[1] ?? "").href;

if (isMain) {
  const text = atlasHanzi();
  const outDir = join(root, "src/assets/fonts");
  mkdirSync(outDir, { recursive: true });
  for (const weight of [500, 600]) {
    const css = await (
      await fetchOk(
        `https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@${weight}&display=swap&text=${encodeURIComponent(text)}`,
        { headers: { "user-agent": UA } },
      )
    ).text();
    const url = css.match(/url\((https:[^)]+)\)\s*format\('woff2'\)/)?.[1];
    if (!url) throw new Error(`no woff2 for ${weight}`);
    const buf = Buffer.from(await (await fetchOk(url)).arrayBuffer());
    writeFileSync(join(outDir, `noto-serif-sc-${weight}.woff2`), buf);
    console.log(`noto-serif-sc-${weight}.woff2 ${buf.length} bytes`);
  }
  writeFileSync(join(outDir, "hanzi-subset.txt"), `${text}\n`);
  console.log(`${[...text].length} hanzi → src/assets/fonts/hanzi-subset.txt`);
}
