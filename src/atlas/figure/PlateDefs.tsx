import { focusEllipse } from "@/atlas/regionAnatomy";
import { useUnitsPerPx } from "@/atlas/screen";
import { useViewerStore } from "@/state/viewerStore";

/** Covers the plate in user space, including a little bleed past the soles. */
const MASK_BOX = { x: -400, y: -400, w: 1600, h: 2400 } as const;

/** Floor outside the loupe. The falloff ends transparent so it does not stack on this. */
const FOCUS_FLOOR = 0.14;

/** Feather is at least this many CSS pixels on the shorter axis. */
const MIN_FEATHER_PX = 120;

/**
 * Regional loupe. Body is solid white. Face, hand and foot keep a 14% floor
 * outside the focus. focusEllipse is the solid ellipse; the drawn ellipse is
 * that divided by the solid stop, so the fade stays ≥ 120 screen px.
 */
export function PlateDefs() {
  const region = useViewerStore((s) => s.atlasRegion);
  const view = useViewerStore((s) => s.atlasView);
  const k = useUnitsPerPx();
  const focus = region === "body" ? null : focusEllipse(region, view);
  const minR = focus ? Math.min(focus.rx, focus.ry) : 1;
  const solid = minR / (minR + MIN_FEATHER_PX * (k > 0 ? k : 1));

  return (
    <defs>
      <radialGradient id="region-focus-falloff" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="white" />
        <stop offset={solid} stopColor="white" />
        <stop offset="100%" stopColor="white" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="contact-shadow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3A2A1E" stopOpacity={1} />
        <stop offset="100%" stopColor="#3A2A1E" stopOpacity={0} />
      </radialGradient>
      <mask
        id="region-focus"
        maskUnits="userSpaceOnUse"
        x={MASK_BOX.x}
        y={MASK_BOX.y}
        width={MASK_BOX.w}
        height={MASK_BOX.h}
      >
        <rect
          x={MASK_BOX.x}
          y={MASK_BOX.y}
          width={MASK_BOX.w}
          height={MASK_BOX.h}
          fill="white"
          opacity={focus ? FOCUS_FLOOR : 1}
        />
        {focus ? (
          <ellipse
            cx={focus.cx}
            cy={focus.cy}
            rx={focus.rx / solid}
            ry={focus.ry / solid}
            fill="url(#region-focus-falloff)"
          />
        ) : null}
      </mask>
    </defs>
  );
}
