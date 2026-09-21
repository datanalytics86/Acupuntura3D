/** Local volume on the Goran plate. Coordinates are the 800×1600 atlas frame. */

export type Wash = {
  id: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  opacity: number;
  tone: "lo" | "hi";
};

export const ANTERIOR_WASHES: Wash[] = [
  { id: "ax-l", cx: 304, cy: 352, rx: 34, ry: 14, opacity: 0.2, tone: "lo" },
  { id: "ax-r", cx: 496, cy: 352, rx: 34, ry: 14, opacity: 0.2, tone: "lo" },
  { id: "subpec-l", cx: 352, cy: 458, rx: 46, ry: 9, opacity: 0.2, tone: "lo" },
  { id: "subpec-r", cx: 448, cy: 458, rx: 46, ry: 9, opacity: 0.2, tone: "lo" },
  { id: "abd-l", cx: 378, cy: 575, rx: 12, ry: 88, opacity: 0.16, tone: "lo" },
  { id: "abd-r", cx: 422, cy: 575, rx: 12, ry: 88, opacity: 0.16, tone: "lo" },
  { id: "groin-l", cx: 328, cy: 752, rx: 36, ry: 12, opacity: 0.22, tone: "lo" },
  { id: "groin-r", cx: 472, cy: 752, rx: 36, ry: 12, opacity: 0.22, tone: "lo" },
  { id: "cub-l", cx: 252, cy: 512, rx: 12, ry: 22, opacity: 0.1, tone: "lo" },
  { id: "cub-r", cx: 548, cy: 512, rx: 12, ry: 22, opacity: 0.1, tone: "lo" },
  { id: "scm-l", cx: 380, cy: 248, rx: 9, ry: 26, opacity: 0.15, tone: "lo" },
  { id: "scm-r", cx: 420, cy: 248, rx: 9, ry: 26, opacity: 0.15, tone: "lo" },
  { id: "neck", cx: 400, cy: 234, rx: 18, ry: 12, opacity: 0.12, tone: "lo" },
  { id: "delt-l", cx: 230, cy: 330, rx: 16, ry: 36, opacity: 0.08, tone: "lo" },
  { id: "delt-r", cx: 570, cy: 330, rx: 16, ry: 36, opacity: 0.08, tone: "lo" },
  { id: "pec-l", cx: 346, cy: 372, rx: 28, ry: 18, opacity: 0.12, tone: "hi" },
  { id: "pec-r", cx: 456, cy: 378, rx: 24, ry: 16, opacity: 0.08, tone: "hi" },
  { id: "vast-l", cx: 328, cy: 980, rx: 32, ry: 74, opacity: 0.2, tone: "hi" },
  { id: "vast-r", cx: 472, cy: 992, rx: 30, ry: 70, opacity: 0.12, tone: "hi" },
  { id: "tib-l", cx: 330, cy: 1272, rx: 14, ry: 50, opacity: 0.16, tone: "hi" },
  { id: "tib-r", cx: 470, cy: 1282, rx: 14, ry: 46, opacity: 0.1, tone: "hi" },
  { id: "brow", cx: 372, cy: 100, rx: 26, ry: 12, opacity: 0.2, tone: "hi" },
];

export const POSTERIOR_WASHES: Wash[] = [
  { id: "occ", cx: 400, cy: 148, rx: 34, ry: 22, opacity: 0.15, tone: "lo" },
  { id: "trap", cx: 400, cy: 322, rx: 80, ry: 28, opacity: 0.16, tone: "lo" },
  { id: "trap-hi", cx: 368, cy: 300, rx: 36, ry: 16, opacity: 0.16, tone: "hi" },
  { id: "scap-l", cx: 336, cy: 412, rx: 34, ry: 48, opacity: 0.18, tone: "lo" },
  { id: "scap-r", cx: 464, cy: 412, rx: 34, ry: 48, opacity: 0.18, tone: "lo" },
  { id: "lumbar", cx: 400, cy: 592, rx: 34, ry: 38, opacity: 0.16, tone: "lo" },
  { id: "glute-l", cx: 338, cy: 752, rx: 40, ry: 34, opacity: 0.17, tone: "lo" },
  { id: "glute-r", cx: 462, cy: 752, rx: 40, ry: 34, opacity: 0.17, tone: "lo" },
  { id: "glute-hi", cx: 356, cy: 728, rx: 22, ry: 16, opacity: 0.14, tone: "hi" },
  { id: "fold", cx: 400, cy: 808, rx: 80, ry: 11, opacity: 0.2, tone: "lo" },
  { id: "ham-l", cx: 328, cy: 1000, rx: 26, ry: 64, opacity: 0.16, tone: "lo" },
  { id: "ham-r", cx: 472, cy: 1000, rx: 26, ry: 64, opacity: 0.16, tone: "lo" },
  { id: "gast-l", cx: 330, cy: 1268, rx: 18, ry: 54, opacity: 0.18, tone: "lo" },
  { id: "gast-r", cx: 470, cy: 1268, rx: 18, ry: 54, opacity: 0.18, tone: "lo" },
  { id: "ach-l", cx: 332, cy: 1394, rx: 8, ry: 26, opacity: 0.16, tone: "lo" },
  { id: "ach-r", cx: 468, cy: 1394, rx: 8, ry: 26, opacity: 0.16, tone: "lo" },
];

/** Academic pubic plane: smooth cover over wiki linework, inside the silhouette. */
export const PUBIS_PLANE =
  "M358 736C348 776 352 830 366 878C376 902 392 908 400 906C408 908 424 902 434 878C448 830 452 776 442 736C426 718 374 718 358 736Z";
