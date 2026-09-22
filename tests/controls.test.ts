import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadAcupoints } from "@/data";
import { useViewerStore } from "@/state/viewerStore";
import type { Acupoint, AtlasRegion, Locale } from "@/types";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function fold(s: string): string {
  return s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function exactPoints(points: readonly Acupoint[], value: string): Acupoint[] {
  const raw = value.trim();
  const q = fold(raw);
  if (!q) return [];
  return points.filter(
    (p) =>
      p.names.zh === raw ||
      fold(p.code) === q ||
      fold(p.names.pinyin.replace(/\s/g, "")) === q,
  );
}

describe("viewer store", () => {
  it("persiste posterior y vuelve a anterior", () => {
    useViewerStore.getState().setAtlasView("posterior");
    expect(useViewerStore.getState().atlasView).toBe("posterior");
    useViewerStore.getState().setAtlasView("anterior");
    expect(useViewerStore.getState().atlasView).toBe("anterior");
  });

  it("persiste las regiones del atlas", () => {
    const regions = ["face", "hand", "foot", "body"] as const satisfies readonly AtlasRegion[];
    for (const region of regions) {
      useViewerStore.getState().setAtlasRegion(region);
      expect(useViewerStore.getState().atlasRegion).toBe(region);
    }
  });

  it("persiste es y en, y no define locale zh", () => {
    useViewerStore.getState().setLocale("en");
    expect(useViewerStore.getState().locale).toBe("en");
    useViewerStore.getState().setLocale("es");
    expect(useViewerStore.getState().locale).toBe("es");

    const locales = { es: true, en: true } satisfies Record<Locale, true>;
    expect(Object.keys(locales).sort()).toEqual(["en", "es"]);
    expect(locales).not.toHaveProperty("zh");

    const types = readFileSync(join(root, "src/types/acupuncture.ts"), "utf8");
    expect(types).toMatch(/export type Locale = "es" \| "en";/);
  });

  it("invierte visibleLayers.qi", () => {
    const before = useViewerStore.getState().visibleLayers.qi;
    useViewerStore.getState().toggleLayer("qi");
    expect(useViewerStore.getState().visibleLayers.qi).toBe(!before);
    useViewerStore.getState().toggleLayer("qi");
    expect(useViewerStore.getState().visibleLayers.qi).toBe(before);
  });

  it("setLocale no tira si document no existe", () => {
    expect(typeof document).toBe("undefined");
    expect(() => useViewerStore.getState().setLocale("en")).not.toThrow();
    expect(useViewerStore.getState().locale).toBe("en");
    expect(() => useViewerStore.getState().setLocale("es")).not.toThrow();
    expect(useViewerStore.getState().locale).toBe("es");
  });
});

describe("search", () => {
  const points = loadAcupoints();

  it.each(["ST36", "zusanli", "足三里"])("resuelve %s a un solo ST36", (query) => {
    const exact = exactPoints(points, query);
    expect(exact).toHaveLength(1);
    expect(exact[0]?.code).toBe("ST36");
  });
});

describe("aviso legal", () => {
  it("oculta el modal cerrado y guarda acu3d.disclaimer.v1", () => {
    const src = readFileSync(join(root, "src/ui/LegalModal.tsx"), "utf8");
    expect(src).toContain("if (!open) return null");
    expect(src).toContain("acu3d.disclaimer.v1");
  });

  it("declara las cuatro regiones y setAtlasRegion", () => {
    const src = readFileSync(join(root, "src/ui/Topbar.tsx"), "utf8");
    for (const id of ["face", "hand", "foot", "body"]) {
      expect(src).toContain(id);
    }
    expect(src).toContain("setAtlasRegion");
  });

  it("sigue mapeando las teclas 1 a 4", () => {
    const src = readFileSync(join(root, "src/app/App.tsx"), "utf8");
    expect(src).toContain('e.key >= "1" && e.key <= "4"');
    expect(src).toContain('["body", "face", "hand", "foot"]');
  });
});
