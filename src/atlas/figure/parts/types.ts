export type FillShape = {
  id: string;
  d: string;
  fill: string;
  opacity?: number;
};

export type StrokeShape = {
  id: string;
  d: string;
  stroke: string;
  strokeWidth: number;
  opacity?: number;
  linecap?: "round" | "butt";
  linejoin?: "round" | "miter";
};
