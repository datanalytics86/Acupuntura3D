import { describe, expect, it } from "vitest";
import { stripTraditionalPrefix } from "@/lib/text";

describe("stripTraditionalPrefix", () => {
  it("removes the Spanish prefix regardless of case and extra spaces", () => {
    expect(stripTraditionalPrefix("Uso tradicional educativo: cefalea")).toBe("cefalea");
    expect(stripTraditionalPrefix("USO TRADICIONAL EDUCATIVO: cefalea")).toBe("cefalea");
    expect(stripTraditionalPrefix("  uso   tradicional   educativo  :   cefalea  ")).toBe("cefalea");
  });

  it("removes the English prefix regardless of case and extra spaces", () => {
    expect(stripTraditionalPrefix("Traditional educational use: headache")).toBe("headache");
    expect(stripTraditionalPrefix("TRADITIONAL   EDUCATIONAL   USE: headache")).toBe("headache");
  });

  it("leaves a string without the prefix unchanged", () => {
    const raw = "cefalea, dolor dental";
    expect(stripTraditionalPrefix(raw)).toBe(raw);
    expect(stripTraditionalPrefix("  sin prefijo")).toBe("  sin prefijo");
  });
});
