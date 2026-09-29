import { useViewerStore } from "@/state/viewerStore";
import { ANTERIOR_WASHES, POSTERIOR_WASHES, PUBIS_PLANE, type Wash } from "./interiorShading";

/**
 * Goran surface plate, printed into the paper.
 * Vertex y=40, soles y=1480, midline x=400. See public/atlas/ATTRIBUTION.md.
 * Framing of the PNGs is fixed; do not resize these rectangles.
 */
export const BODY_PLATE = {
  anterior: {
    href: "/atlas/body-anterior.png",
    x: 97.61,
    y: 40,
    width: 604.79,
    height: 1440,
  },
  posterior: {
    href: "/atlas/body-posterior.png",
    x: 97.47,
    y: 40,
    width: 605.06,
    height: 1440,
  },
} as const;

function WashLayer({ items, blend }: { items: Wash[]; blend: "multiply" | "soft-light" }) {
  const tone = blend === "multiply" ? "lo" : "hi";
  const list = items.filter((w) => w.tone === tone);
  if (list.length === 0) return null;
  return (
    <g mask="url(#fig-skin)" style={{ mixBlendMode: blend }}>
      {list.map((w) => (
        <ellipse
          key={w.id}
          cx={w.cx}
          cy={w.cy}
          rx={w.rx}
          ry={w.ry}
          fill={tone === "hi" ? "url(#wash-hi)" : "url(#wash-lo)"}
          opacity={w.opacity}
        />
      ))}
    </g>
  );
}

export function Figure() {
  const view = useViewerStore((s) => s.atlasView);
  const zoom = useViewerStore((s) => s.atlasZoom);
  const showBody = useViewerStore((s) => s.visibleLayers.body);
  if (!showBody) return null;

  const plate = BODY_PLATE[view];
  const washes = view === "anterior" ? ANTERIOR_WASHES : POSTERIOR_WASHES;

  return (
    <g>
      <defs>
        <filter id="fig-grade" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.86 0.04 0.02 0 0.06  0.05 0.78 0.03 0 0.08  0.02 0.06 0.70 0 0.08  0 0 0 1 0"
          />
        </filter>
        <filter id="fig-shade" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0"
          />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.28 0.48 0.92 1 1" />
            <feFuncG type="table" tableValues="0.24 0.42 0.88 1 1" />
            <feFuncB type="table" tableValues="0.14 0.30 0.84 1 1" />
          </feComponentTransfer>
        </filter>
        <filter id="fig-pubis" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <filter id="fig-edge" colorInterpolationFilters="sRGB" x="-3%" y="-1%" width="106%" height="102%">
          <feColorMatrix type="matrix" values="0 0 0 0 0.420  0 0 0 0 0.290  0 0 0 0 0.212  0 0 0 1 0" />
          <feMorphology operator="dilate" radius="0.75" />
        </filter>
        <radialGradient id="wash-lo" cx="42%" cy="38%" r="68%">
          <stop offset="0%" stopColor="#6B5344" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#6B5344" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="wash-hi" cx="32%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#F3D7C0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F3D7C0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pubis-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E3C5AC" stopOpacity="0.04" />
          <stop offset="24%" stopColor="#E3C5AC" stopOpacity="0.7" />
          <stop offset="76%" stopColor="#D9BBA0" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#CDB59A" stopOpacity="0.06" />
        </linearGradient>
        <mask id="fig-skin" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="1600">
          <image href={plate.href} x={plate.x} y={plate.y} width={plate.width} height={plate.height} />
        </mask>
      </defs>

      <g mask="url(#region-focus)">
        {zoom <= 1.3 ? (
          <ellipse cx={400} cy={1492} rx={240} ry={12} fill="url(#contact-shadow)" opacity={0.14} />
        ) : null}

        <image
          href={plate.href}
          x={plate.x}
          y={plate.y}
          width={plate.width}
          height={plate.height}
          preserveAspectRatio="xMidYMid meet"
          filter="url(#fig-edge)"
          opacity={0.32}
          style={{ pointerEvents: "none" }}
        />
        <image
          href={plate.href}
          x={plate.x}
          y={plate.y}
          width={plate.width}
          height={plate.height}
          preserveAspectRatio="xMidYMid meet"
          filter="url(#fig-grade)"
        />
        <image
          href={plate.href}
          x={plate.x}
          y={plate.y}
          width={plate.width}
          height={plate.height}
          preserveAspectRatio="xMidYMid meet"
          filter="url(#fig-shade)"
          opacity={0.34}
          style={{ mixBlendMode: "multiply", pointerEvents: "none" }}
        />

        <WashLayer items={washes} blend="multiply" />
        <WashLayer items={washes} blend="soft-light" />

        {view === "anterior" ? (
          <g mask="url(#fig-skin)">
            <path d={PUBIS_PLANE} fill="url(#pubis-skin)" filter="url(#fig-pubis)" />
            <path
              d="M356 758C372 786 386 808 398 820"
              fill="none"
              stroke="#a67b62"
              strokeWidth={1.15}
              opacity={0.45}
              style={{ mixBlendMode: "multiply" }}
            />
            <path
              d="M444 758C428 786 414 808 402 820"
              fill="none"
              stroke="#a67b62"
              strokeWidth={1.15}
              opacity={0.45}
              style={{ mixBlendMode: "multiply" }}
            />
          </g>
        ) : null}
      </g>
    </g>
  );
}
