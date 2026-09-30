import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { loadMeridians } from "@/data";
import { meridianAtHour } from "@/atlas/qiTime";
import { meridianPigment } from "@/lib/tokens";
import { useViewerStore } from "@/state/viewerStore";
import { QiClock, sectorAngle, sectorPaint } from "@/ui/QiClock";

function sectorTags(html: string): string[] {
  return [...html.matchAll(/<path\b([^>]*)>/g)]
    .map((match) => match[1] ?? "")
    .filter((attrs) => attrs.includes("data-sector="));
}

function attr(attrs: string, name: string): string | undefined {
  return new RegExp(`${name}="([^"]*)"`).exec(attrs)?.[1];
}

describe("reloj de organos", () => {
  it("sectorAngle(3) es 45 y sectorAngle(7) es 105", () => {
    expect(sectorAngle(3)).toBe(45);
    expect(sectorAngle(7)).toBe(105);
  });

  it("meridianAtHour sigue en LU a las 3 y ST a las 7", () => {
    const meridians = loadMeridians();
    expect(meridianAtHour(3, meridians)).toBe("LU");
    expect(meridianAtHour(4, meridians)).toBe("LU");
    expect(meridianAtHour(7, meridians)).toBe("ST");
    expect(meridianAtHour(8, meridians)).toBe("ST");
  });

  it("solo el sector de la hora va relleno", () => {
    const meridians = loadMeridians();
    const samples = [
      [3, "LU"],
      [4, "LU"],
      [7, "ST"],
      [8, "ST"],
    ] as const;
    for (const [hour, id] of samples) {
      const paint = sectorPaint(hour, meridians);
      const on = paint.filter((sector) => sector.on);
      const hit = on[0];
      expect(paint).toHaveLength(12);
      expect(on).toHaveLength(1);
      expect(hit?.meridian.id).toBe(id);
      expect(hit?.fill).toBe(meridianPigment(hit?.meridian ?? { id }));
      expect(hit?.fill).not.toBe("none");
      expect(hit?.fillOpacity).toBe(0.85);
      expect(paint.filter((sector) => !sector.on).every((sector) => sector.fill === "none" && sector.fillOpacity === undefined)).toBe(true);
    }

    const hour = useViewerStore.getInitialState().clockHour;
    const active = meridianAtHour(hour, meridians);
    const current = meridians.find((m) => m.id === active);
    const start = current?.clockHour ?? hour;
    const html = renderToStaticMarkup(createElement(QiClock));
    const sectors = sectorTags(html);
    const marked = sectors.filter((attrs) => attr(attrs, "data-on") === "true");
    const markedAttrs = marked[0] ?? "";
    expect(sectors).toHaveLength(12);
    expect(marked).toHaveLength(1);
    expect(attr(markedAttrs, "data-sector")).toBe(active);
    expect(attr(markedAttrs, "fill")).toBe(current ? meridianPigment(current) : undefined);
    expect(attr(markedAttrs, "fill")).not.toBe("none");
    expect(attr(markedAttrs, "fill-opacity")).toBe("0.85");
    for (const attrs of sectors) {
      if (attr(attrs, "data-on") === "true") continue;
      expect(attr(attrs, "fill")).toBe("none");
      expect(attr(attrs, "fill-opacity")).toBeUndefined();
    }
    expect(html).toContain('data-testid="plate-clock"');
    expect(html).toContain('data-testid="clock-dial"');
    expect(html).toContain('data-testid="clock-play"');
    expect(html).toContain(
      `${String(start).padStart(2, "0")}:00\u2013${String((start + 2) % 24).padStart(2, "0")}:00 \u00b7 ${current?.code ?? ""} ${current?.names.es ?? ""}`,
    );
    expect(html).toContain("\u00bd\u00d7");
    expect(html).toContain("1\u00d7");
    expect(html).toContain("2\u00d7");
    expect(html).toContain("4\u00d7");
  });
});
