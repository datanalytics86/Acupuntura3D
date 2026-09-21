import { useViewerStore } from "@/state/viewerStore";
import { ANTERIOR_WASHES, POSTERIOR_WASHES, PUBIS_PLANE, type Wash } from "./interiorShading";

/**
 * Goran surface plate, printed into the paper.
 * Vertex y=40, soles y=1480, midline x=400. See public/atlas/ATTRIBUTION.md.
 */
const PLATES = {
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
  const showBody = useViewerStore((s) => s.visibleLayers.body);
  if (!showBody) return null;

  const plate = PLATES[view];
  const washes = view === "anterior" ? ANTERIOR_WASHES : POSTERIOR_WASHES;

  return (
    <g>
      <defs>
        <filter id="fig-grade" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.90 0.07 0.02 0 0.02  0.03 0.88 0.04 0 0.012  0.02 0.05 0.76 0 0  0 0 0 1 0"
          />
        </filter>
        <filter id="fig-ink" x="-4%" y="-2%" width="108%" height="104%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="dilate" radius="1.35" result="edge" />
          <feComposite in="edge" in2="SourceAlpha" operator="out" result="ring" />
          <feFlood floodColor="#4a3224" floodOpacity="0.92" result="ink" />
          <feComposite in="ink" in2="ring" operator="in" />
        </filter>
        <filter id="fig-ink-heavy" x="-4%" y="-2%" width="108%" height="104%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="dilate" radius="2.4" result="edge" />
          <feComposite in="edge" in2="SourceAlpha" operator="out" result="ring" />
          <feFlood floodColor="#4a3224" floodOpacity="0.55" result="ink" />
          <feComposite in="ink" in2="ring" operator="in" />
        </filter>
        <filter id="fig-black" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
        </filter>
        <radialGradient id="wash-lo" cx="42%" cy="38%" r="68%">
          <stop offset="0%" stopColor="#8d6248" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#8d6248" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="wash-hi" cx="32%" cy="28%" r="62%">
          <stop offset="0%" stopColor="#f6e3d0" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#f6e3d0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pubis-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C89661" />
          <stop offset="72%" stopColor="#C89661" />
          <stop offset="100%" stopColor="#A67A52" />
        </linearGradient>
        <filter id="plate-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <mask id="fig-skin" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="1600">
          <image href={plate.href} x={plate.x} y={plate.y} width={plate.width} height={plate.height} />
        </mask>
        <mask id="fig-torso" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="1600">
          <rect x="180" y="280" width="440" height="540" fill="white" />
        </mask>
        <mask id="fig-paper" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="1600">
          <rect width="800" height="1600" fill="white" />
          <image
            href={plate.href}
            x={plate.x}
            y={plate.y}
            width={plate.width}
            height={plate.height}
            filter="url(#fig-black)"
          />
        </mask>
      </defs>

      <ellipse
        cx={400}
        cy={1494}
        rx={228}
        ry={15}
        fill="var(--color-ink)"
        opacity={0.08}
        style={{ mixBlendMode: "multiply" }}
      />

      <image
        href={plate.href}
        x={plate.x}
        y={plate.y}
        width={plate.width}
        height={plate.height}
        preserveAspectRatio="xMidYMid meet"
        filter="url(#fig-ink)"
        style={{ mixBlendMode: "multiply" }}
      />
      <image
        href={plate.href}
        x={plate.x}
        y={plate.y}
        width={plate.width}
        height={plate.height}
        preserveAspectRatio="xMidYMid meet"
        filter="url(#fig-ink-heavy)"
        mask="url(#fig-torso)"
        style={{ mixBlendMode: "multiply" }}
      />
      <image
        href={plate.href}
        x={plate.x}
        y={plate.y}
        width={plate.width}
        height={plate.height}
        preserveAspectRatio="xMidYMid meet"
        filter="url(#fig-grade)"
        style={{ mixBlendMode: "multiply" }}
      />

      <WashLayer items={washes} blend="multiply" />
      <WashLayer items={washes} blend="soft-light" />

      {view === "anterior" ? (
        <g mask="url(#fig-skin)">
          <path d={PUBIS_PLANE} fill="url(#pubis-skin)" />
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

      <rect
        x={0}
        y={0}
        width={800}
        height={1600}
        filter="url(#plate-grain)"
        mask="url(#fig-paper)"
        opacity={0.055}
        style={{ mixBlendMode: "multiply", pointerEvents: "none" }}
      />
    </g>
  );
}
