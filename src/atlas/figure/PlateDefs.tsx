import { REGION_FOCUS } from "@/atlas/regionFrames";
import { useViewerStore } from "@/state/viewerStore";

/** Covers the plate in user space, including a little bleed past the soles. */
const MASK_BOX = { x: -400, y: -400, w: 1600, h: 2400 } as const;

/** Fraction of the drawn ellipse that stays solid. Maps onto REGION_FOCUS. */
const FOCUS_SOLID = 0.82;

/**
 * Regional loupe. Body is solid white. Face, hand and foot keep a 12% floor
 * outside the focus. The falloff ends transparent so it does not stack on
 * that floor (REGION_FOCUS at 100%, outside 12%).
 */
export function PlateDefs() {
  const region = useViewerStore((s) => s.atlasRegion);
  const focus = REGION_FOCUS[region];

  return (
    <defs>
      <radialGradient id="region-focus-falloff" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="white" />
        <stop offset={FOCUS_SOLID} stopColor="white" />
        <stop offset="100%" stopColor="white" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="contact-shadow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopOpacity={1} style={{ stopColor: "var(--color-ink)" }} />
        <stop offset="100%" stopOpacity={0} style={{ stopColor: "var(--color-ink)" }} />
      </radialGradient>
      <mask
        id="region-focus"
        maskUnits="userSpaceOnUse"
        x={MASK_BOX.x}
        y={MASK_BOX.y}
        width={MASK_BOX.w}
        height={MASK_BOX.h}
      >
        <rect x={MASK_BOX.x} y={MASK_BOX.y} width={MASK_BOX.w} height={MASK_BOX.h} fill="white" opacity={focus ? 0.12 : 1} />
        {focus ? (
          <ellipse
            cx={focus.cx}
            cy={focus.cy}
            rx={focus.rx / FOCUS_SOLID}
            ry={focus.ry / FOCUS_SOLID}
            fill="url(#region-focus-falloff)"
          />
        ) : null}
      </mask>
    </defs>
  );
}
