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
  { id: "delt-l", cx: 258, cy: 354, rx: 28, ry: 52, opacity: 0.09, tone: "hi" },
  { id: "pec-l", cx: 340, cy: 398, rx: 42, ry: 26, opacity: 0.09, tone: "hi" },
  { id: "rect-l", cx: 378, cy: 588, rx: 15, ry: 100, opacity: 0.08, tone: "hi" },
  { id: "vast-l", cx: 326, cy: 968, rx: 36, ry: 98, opacity: 0.09, tone: "hi" },
  { id: "gast-l", cx: 328, cy: 1268, rx: 18, ry: 58, opacity: 0.08, tone: "hi" },
  { id: "delt-r", cx: 542, cy: 358, rx: 26, ry: 48, opacity: 0.07, tone: "lo" },
  { id: "pec-r", cx: 462, cy: 404, rx: 36, ry: 24, opacity: 0.07, tone: "lo" },
  { id: "vast-r", cx: 472, cy: 984, rx: 32, ry: 88, opacity: 0.07, tone: "lo" },
];

export const POSTERIOR_WASHES: Wash[] = [
  { id: "trap-l", cx: 324, cy: 306, rx: 46, ry: 22, opacity: 0.09, tone: "hi" },
  { id: "scap-l", cx: 336, cy: 422, rx: 28, ry: 52, opacity: 0.08, tone: "hi" },
  { id: "erector", cx: 388, cy: 545, rx: 14, ry: 116, opacity: 0.08, tone: "hi" },
  { id: "glute-l", cx: 334, cy: 748, rx: 50, ry: 34, opacity: 0.06, tone: "hi" },
  { id: "ham-l", cx: 328, cy: 990, rx: 30, ry: 88, opacity: 0.08, tone: "hi" },
  { id: "gast-l", cx: 326, cy: 1260, rx: 20, ry: 60, opacity: 0.08, tone: "hi" },
  { id: "trap-r", cx: 476, cy: 312, rx: 42, ry: 20, opacity: 0.07, tone: "lo" },
  { id: "ham-r", cx: 472, cy: 998, rx: 28, ry: 80, opacity: 0.07, tone: "lo" },
];

/** Academic pubic plane: smooth cover over wiki linework, inside the silhouette. */
export const PUBIS_PLANE =
  "M342 746C356 772 370 796 380 818C372 854 362 886 376 898C388 908 412 908 424 898C438 886 428 854 420 818C430 796 444 772 458 746C444 730 356 730 342 746Z";
