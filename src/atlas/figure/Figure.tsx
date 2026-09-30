import { memo, useEffect, useState } from "react";
import { useUnitsPerPx } from "@/atlas/screen";
import { t } from "@/i18n";
import { INK } from "@/lib/colors";
import { useViewerStore } from "@/state/viewerStore";
import { PUBIS_PLANE } from "./interiorShading";

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

type Silhouette = { readonly anterior: string; readonly posterior: string };

/** Kept off the initial bundle: the traced contour is ~38 KB. */
function useSilhouette(): Silhouette | null {
  const [paths, setPaths] = useState<Silhouette | null>(null);
  useEffect(() => {
    let live = true;
    void import("./silhouette").then((mod) => {
      if (live) setPaths(mod.SILHOUETTE);
    });
    return () => {
      live = false;
    };
  }, []);
  return paths;
}

export const Figure = memo(function Figure() {
  const view = useViewerStore((s) => s.atlasView);
  // Contact shadow only toggles at this threshold. A continuous zoom (or pan) must not repaint the plate.
  const showShadow = useViewerStore((s) => s.atlasZoom <= 1.3);
  const showBody = useViewerStore((s) => s.visibleLayers.body);
  const locale = useViewerStore((s) => s.locale);
  const k = useUnitsPerPx();
  const silhouette = useSilhouette();
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    setFailed(false);
  }, [view]);
  if (!showBody) return null;

  const plate = BODY_PLATE[view];
  const contour = silhouette?.[view];

  return (
    <g>
      <defs>
        <filter id="fig-duo" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0"
          />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.23 0.45 0.66 0.80 0.89 0.95 0.985" />
            <feFuncG type="table" tableValues="0.15 0.31 0.50 0.65 0.78 0.87 0.94" />
            <feFuncB type="table" tableValues="0.10 0.21 0.37 0.51 0.65 0.77 0.86" />
          </feComponentTransfer>
        </filter>
        <filter id="fig-pubis" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <linearGradient id="pubis-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E2C8A9" stopOpacity="0.04" />
          <stop offset="24%" stopColor="#E2C8A9" stopOpacity="0.7" />
          <stop offset="76%" stopColor="#D5BC9E" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#D3B08D" stopOpacity="0.06" />
        </linearGradient>
        <mask id="fig-skin" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="1600">
          <image href={plate.href} x={plate.x} y={plate.y} width={plate.width} height={plate.height} />
        </mask>
      </defs>

      <g mask="url(#region-focus)">
        {showShadow ? (
          <ellipse cx={400} cy={1492} rx={240} ry={12} fill="url(#contact-shadow)" opacity={0.1} />
        ) : null}

        <image
          key={retry}
          href={plate.href}
          x={plate.x}
          y={plate.y}
          width={plate.width}
          height={plate.height}
          preserveAspectRatio="xMidYMid meet"
          filter="url(#fig-duo)"
          onError={() => setFailed(true)}
        />
        {failed ? (
          <g>
            <text x={400} y={760} textAnchor="middle" fill={INK} fontSize={16 * k}>
              {t(locale, "plateFailed")}
            </text>
            <foreignObject x={300} y={790} width={200} height={48}>
              <button type="button" className="btn" onClick={() => { setFailed(false); setRetry((n) => n + 1); }}>
                {t(locale, "plateRetry")}
              </button>
            </foreignObject>
          </g>
        ) : null}

        {contour ? (
          <path
            d={contour}
            fill="none"
            stroke="#3A2A1E"
            strokeOpacity={0.85}
            strokeWidth={1.1 * k}
            strokeLinejoin="round"
          />
        ) : null}

        {view === "anterior" ? (
          <g mask="url(#fig-skin)">
            <path d={PUBIS_PLANE} fill="url(#pubis-skin)" filter="url(#fig-pubis)" />
            <path
              d="M356 758C372 786 386 808 398 820"
              fill="none"
              stroke="#3A2A1E"
              strokeOpacity={0.35}
              strokeWidth={0.9 * k}
            />
            <path
              d="M444 758C428 786 414 808 402 820"
              fill="none"
              stroke="#3A2A1E"
              strokeOpacity={0.35}
              strokeWidth={0.9 * k}
            />
          </g>
        ) : null}
      </g>
    </g>
  );
});
