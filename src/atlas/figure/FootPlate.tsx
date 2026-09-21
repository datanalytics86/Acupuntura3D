import { PlateMark } from "./PlateMark";

/**
 * Medial view: leg, malleolus, heel, arch, hallux and four dorsal toes.
 * SP6 is above the malleolus. LR3 is in the first metatarsal space.
 */
export function FootPlate() {
  return (
    <g>
      <defs>
        <linearGradient id="foot-flesh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0d2b4" />
          <stop offset="70%" stopColor="#e0b48e" />
          <stop offset="100%" stopColor="#c9926c" />
        </linearGradient>
        <radialGradient id="foot-lo" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#8d6248" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#8d6248" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M300 160C270 160 248 220 246 340C244 480 250 620 268 720L392 720C410 600 414 460 410 320C406 220 380 160 340 160Z"
        fill="url(#foot-flesh)"
        stroke="#4a3224"
        strokeWidth={1.3}
      />
      <path
        d="M268 700C220 760 180 860 188 980C196 1080 250 1160 330 1140C300 1080 292 980 320 900C348 820 390 760 430 730"
        fill="#e7c4a4"
        stroke="#4a3224"
        strokeWidth={1.3}
      />
      <path
        d="M360 720C430 700 500 760 560 900C600 1000 680 1080 760 1060C800 1050 820 1000 800 960C760 900 680 900 640 960C680 860 700 780 660 720C620 680 540 700 480 760C430 700 390 710 360 720Z"
        fill="url(#foot-flesh)"
        stroke="#4a3224"
        strokeWidth={1.35}
      />
      <path
        d="M760 1000C820 980 880 1000 900 1060C910 1100 880 1140 830 1130C790 1120 760 1080 750 1040Z"
        fill="url(#foot-flesh)"
        stroke="#4a3224"
        strokeWidth={1.25}
      />
      <path d="M800 990C830 960 860 970 868 1000C860 1030 830 1036 808 1016" fill="#e7c4a4" stroke="#4a3224" strokeWidth={1.05} />
      <path d="M790 1040C824 1024 856 1036 860 1068C848 1090 816 1088 792 1068" fill="#e7c4a4" stroke="#4a3224" strokeWidth={1.05} />
      <path d="M770 1088C800 1076 828 1088 830 1116C816 1134 788 1130 768 1112" fill="#e7c4a4" stroke="#4a3224" strokeWidth={1} />
      <path d="M748 1130C774 1122 798 1132 796 1156C782 1170 756 1164 744 1148" fill="#e7c4a4" stroke="#4a3224" strokeWidth={1} />
      <circle cx="390" cy="760" r="28" fill="#e8c2a4" stroke="#4a3224" strokeWidth={1.2} />
      <path d="M250 480C310 450 360 470 390 520" fill="none" stroke="#c4a48c" strokeWidth={1.2} />
      <path d="M330 1040C430 1120 560 1140 700 1080" fill="none" stroke="#a67b62" strokeWidth={1.4} />
      <ellipse cx="360" cy="820" rx="26" ry="18" fill="url(#foot-lo)" style={{ mixBlendMode: "multiply" }} />
      <ellipse cx="520" cy="1040" rx="80" ry="16" fill="url(#foot-lo)" opacity={0.75} style={{ mixBlendMode: "multiply" }} />
      <PlateMark x={330} y={480} id="SP6" code="SP6" zh="三阴交" meridianId="SP" />
      <PlateMark x={300} y={980} id="KI3" code="KI3" zh="太溪" meridianId="KI" />
      <PlateMark x={640} y={900} id="LR3" code="LR3" zh="太冲" meridianId="LR" />
    </g>
  );
}
