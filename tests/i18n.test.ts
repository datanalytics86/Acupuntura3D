import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { MESSAGES } from "@/i18n";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function walkTsx(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkTsx(path));
    else if (entry.name.endsWith(".tsx")) out.push(path);
  }
  return out;
}

/** Hanzi, códigos de punto (ST36) y la tecla Esc pueden vivir fuera de t(). */
function allowedUiText(text: string): boolean {
  if (text === "Esc") return true;
  if (/^[\u4e00-\u9fff]+$/.test(text)) return true;
  if (/^[A-Z]{1,3}\d{1,3}$/.test(text)) return true;
  return false;
}

describe("i18n", () => {
  it("keeps the same keys in es and en, with no empty copy", () => {
    const esKeys = Object.keys(MESSAGES.es).sort();
    const enKeys = Object.keys(MESSAGES.en).sort();
    expect(enKeys).toEqual(esKeys);
    for (const key of esKeys) {
      const typed = key as keyof typeof MESSAGES.es;
      expect(MESSAGES.es[typed].trim().length).toBeGreaterThan(0);
      expect(MESSAGES.en[typed].trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps src/ui copy behind t()", () => {
    const offenders: string[] = [];
    for (const file of walkTsx(join(root, "src", "ui"))) {
      const lines = readFileSync(file, "utf8").split(/\r?\n/);
      lines.forEach((line, index) => {
        const re = />([^<>{}]+)</g;
        for (let match = re.exec(line); match; match = re.exec(line)) {
          const text = (match[1] ?? "").trim();
          if (!/[A-Za-zÁÉÍÓÚáéíóúñÑ]{3,}/.test(text)) continue;
          if (allowedUiText(text)) continue;
          offenders.push(`${file}:${index + 1} ${text}`);
        }
      });
    }
    expect(offenders).toEqual([]);
  });
});
