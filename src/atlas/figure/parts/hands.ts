import { A, X, fingerD } from "./geom";
import { FILL } from "./palette";
import type { FillShape } from "./types";

/**
 * Encyclopedia hand: palm + thumb in opposition + four fingers.
 * Canvas-left (side=1) is the figure's right hand in anterior view.
 * LI4 lives near (168, 800) in the first web — keep that webbing.
 */
export function handShapes(side: 1 | -1, suffix: string): FillShape[] {
  const x = (v: number) => X(v, side);
  const a = (v: number) => A(v, side);
  const fill = side === 1 ? FILL.skinL : FILL.skinR;
  const id = (name: string) => `${name}${suffix}`;

  const palm = [
    `M ${x(152)} 802`,
    `C ${x(144)} 814, ${x(144)} 830, ${x(154)} 842`,
    `C ${x(164)} 850, ${x(178)} 848, ${x(186)} 838`,
    `C ${x(192)} 828, ${x(190)} 814, ${x(184)} 804`,
    `C ${x(176)} 796, ${x(162)} 794, ${x(152)} 802`,
    "Z",
  ].join(" ");

  return [
    { id: id("palm"), d: palm, fill },
    {
      id: id("thumb"),
      d: fingerD(x(182), 800, a(-0.48), 32, 13),
      fill,
    },
    {
      id: id("index"),
      d: fingerD(x(176), 836, a(1.42), 38, 11),
      fill,
    },
    {
      id: id("middle"),
      d: fingerD(x(164), 842, a(1.55), 42, 11.5),
      fill,
    },
    {
      id: id("ring"),
      d: fingerD(x(152), 838, a(1.72), 36, 10),
      fill,
    },
    {
      id: id("pinky"),
      d: fingerD(x(144), 826, a(1.95), 28, 8.2),
      fill,
    },
  ];
}

export function handOutlines(side: 1 | -1): string[] {
  return handShapes(side, "").map((s) => s.d);
}
