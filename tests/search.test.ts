import { describe, expect, it } from "vitest";
import { CENTERS } from "@/atlas/centers";
import { loadAcupoints, loadMeridians } from "@/data";
import { searchAll, type SearchCommand } from "@/lib/search";

const commands: readonly SearchCommand[] = [
  {
    id: "view:anterior",
    nameEs: "Ir a Anterior",
    nameEn: "Go to Anterior",
    aliases: ["anterior", "vista anterior"],
    section: "nav",
  },
  {
    id: "view:posterior",
    nameEs: "Ir a Posterior",
    nameEn: "Go to Posterior",
    aliases: ["posterior", "vista posterior", "posterior view"],
    section: "nav",
  },
  {
    id: "region:hand",
    nameEs: "Región Mano",
    nameEn: "Hand region",
    aliases: ["mano", "hand"],
    section: "nav",
  },
  {
    id: "action:layers",
    nameEs: "Mostrar capas",
    nameEn: "Show layers",
    aliases: ["capas", "layers"],
    section: "action",
  },
];

describe("searchAll", () => {
  const sources = {
    points: loadAcupoints(),
    meridians: loadMeridians(),
    centers: CENTERS,
    commands,
  };

  it.each(["st36", "ST36", "zusanli", "Zúsānlǐ", "足三里"])("%s pone ST36 primero", (query) => {
    const hits = searchAll(query, sources);
    expect(hits[0]?.kind).toBe("point");
    expect(hits[0]?.id).toBe("ST36");
    expect(hits[0]?.code).toBe("ST36");
  });

  it("dantian medio abre el centro middle", () => {
    const hits = searchAll("dantian medio", sources);
    expect(hits[0]?.kind).toBe("center");
    expect(hits[0]?.id).toBe("middle");
  });

  it("estomago abre el meridiano ST", () => {
    const hits = searchAll("estomago", sources);
    expect(hits[0]?.kind).toBe("meridian");
    expect(hits[0]?.id).toBe("ST");
  });

  it("hegu abre LI4", () => {
    const hits = searchAll("hegu", sources);
    expect(hits[0]?.kind).toBe("point");
    expect(hits[0]?.id).toBe("LI4");
  });

  it("posterior abre el comando de vista", () => {
    const hits = searchAll("posterior", sources);
    expect(hits[0]?.kind).toBe("command");
    expect(hits[0]?.id).toBe("view:posterior");
  });

  it("una query vacía no devuelve filas", () => {
    expect(searchAll("   ", sources)).toEqual([]);
  });
});
