import { A, X, ellipseD, fingerD } from "./geom";
import { FILL } from "./palette";
import type { FillShape } from "./types";

/**
 * Heel + medial arch + forefoot + five toes.
 * Canvas-left (side=1) is the figure's right foot. ST ends near (362, 1478).
 */
export function footShapes(side: 1 | -1, suffix: string): FillShape[] {
  const x = (v: number) => X(v, side);
  const a = (v: number) => A(v, side);
  const fill = side === 1 ? FILL.skinL : FILL.skinR;
  const id = (name: string) => `${name}${suffix}`;

  const sole = [
    `M ${x(328)} 1448`,
    `C ${x(318)} 1462, ${x(318)} 1478, ${x(330)} 1488`,
    `C ${x(344)} 1498, ${x(362)} 1500, ${x(376)} 1494`,
    `C ${x(388)} 1488, ${x(392)} 1476, ${x(386)} 1464`,
    `C ${x(378)} 1452, ${x(368)} 1444, ${x(352)} 1442`,
    `C ${x(340)} 1442, ${x(332)} 1444, ${x(328)} 1448`,
    "Z",
  ].join(" ");

  const heel = ellipseD(x(340), 1468, 14, 12);
  const arch = ellipseD(x(366), 1472, 12, 8);

  return [
    { id: id("sole"), d: sole, fill },
    { id: id("heel"), d: heel, fill },
    { id: id("arch"), d: arch, fill, opacity: 0.45 },
    { id: id("toe1"), d: fingerD(x(378), 1488, a(1.35), 16, 7.2), fill },
    { id: id("toe2"), d: fingerD(x(366), 1492, a(1.5), 15, 6.6), fill },
    { id: id("toe3"), d: fingerD(x(354), 1493, a(1.58), 13.5, 6.2), fill },
    { id: id("toe4"), d: fingerD(x(344), 1491, a(1.7), 12, 5.6), fill },
    { id: id("toe5"), d: fingerD(x(334), 1486, a(1.88), 10, 5), fill },
  ];
}

/** Posterior: Achilles taper into the heel, less toe spread from behind. */
export function footShapesPosterior(side: 1 | -1, suffix: string): FillShape[] {
  const x = (v: number) => X(v, side);
  const fill = side === 1 ? FILL.skinL : FILL.skinR;
  const id = (name: string) => `${name}${suffix}`;
  const heel = ellipseD(x(348), 1468, 20, 18);
  const sole = ellipseD(x(352), 1486, 28, 12);
  const achilles = [
    `M ${x(350)} 1408`,
    `C ${x(346)} 1430, ${x(344)} 1448, ${x(348)} 1466`,
    `C ${x(352)} 1472, ${x(360)} 1472, ${x(364)} 1466`,
    `C ${x(368)} 1448, ${x(366)} 1430, ${x(362)} 1408`,
    "Z",
  ].join(" ");
  return [
    { id: id("achilles"), d: achilles, fill },
    { id: id("heel"), d: heel, fill },
    { id: id("sole"), d: sole, fill },
    { id: id("toe1"), d: ellipseD(x(372), 1494, 5, 4), fill },
    { id: id("toe2"), d: ellipseD(x(362), 1496, 4.6, 3.8), fill },
    { id: id("toe3"), d: ellipseD(x(352), 1496, 4.4, 3.6), fill },
    { id: id("toe4"), d: ellipseD(x(342), 1495, 4, 3.4), fill },
    { id: id("toe5"), d: ellipseD(x(334), 1492, 3.6, 3.2), fill },
  ];
}
