import { useMemo } from "react";
import { instancesOnView } from "@/atlas/mapCoords";
import { inRegionFrame } from "@/atlas/regionFrames";
import { loadAcupoints } from "@/data";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";
import type { AtlasRegion, AtlasView, Locale } from "@/types";

const ES_NUM = [
  "cero",
  "un",
  "dos",
  "tres",
  "cuatro",
  "cinco",
  "seis",
  "siete",
  "ocho",
  "nueve",
  "diez",
  "once",
  "doce",
  "trece",
  "catorce",
  "quince",
  "dieciséis",
  "diecisiete",
  "dieciocho",
  "diecinueve",
  "veinte",
] as const;

const EN_NUM = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
] as const;

function spell(count: number, locale: Locale): string {
  const words = locale === "es" ? ES_NUM : EN_NUM;
  const word = words[count] ?? String(count);
  return word.charAt(0).toLocaleUpperCase(locale) + word.slice(1);
}

function visibleStars(view: AtlasView, region: AtlasRegion): number {
  let count = 0;
  for (const point of loadAcupoints()) {
    const hits = instancesOnView(point, view, true);
    if (hits.some((hit) => inRegionFrame(region, view, hit.position))) count += 1;
  }
  return count;
}

export function PlateTitle() {
  const view = useViewerStore((s) => s.atlasView);
  const region = useViewerStore((s) => s.atlasRegion);
  const locale = useViewerStore((s) => s.locale);
  const count = useMemo(() => visibleStars(view, region), [view, region]);
  const subtitleKey =
    region === "face"
      ? "plateSubtitleFace"
      : region === "hand"
        ? "plateSubtitleHand"
        : region === "foot"
          ? "plateSubtitleFoot"
          : "plateSubtitleBody";
  let subtitle = t(locale, subtitleKey).replaceAll("{n}", spell(count, locale));
  if (count === 1) {
    subtitle = locale === "es" ? subtitle.replace("puntos", "punto") : subtitle.replace("points", "point");
  }
  const title =
    region === "face"
      ? t(locale, "plateTitleFace")
      : region === "hand"
        ? t(locale, "plateTitleHand")
        : region === "foot"
          ? t(locale, "plateTitleFoot")
          : view === "anterior"
            ? locale === "es"
              ? "Cuerpo humano — vista anterior"
              : t(locale, "plateAnterior")
            : t(locale, "platePosterior");

  return (
    <>
      <h2 data-testid="plate-title" className="plate-heading">
        {title}
      </h2>
      <p className="plate-subtitle">{subtitle}</p>
    </>
  );
}
