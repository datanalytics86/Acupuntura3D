import { PlateMark } from "./PlateMark";

/** Frontal face plate. Same ink and flesh as the body, not a crop of the PNG. */
export function FacePlate() {
  return (
    <g>
      <defs>
        <linearGradient id="face-flesh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0d2b4" />
          <stop offset="55%" stopColor="#e0b48e" />
          <stop offset="100%" stopColor="#c9926c" />
        </linearGradient>
        <radialGradient id="face-lo" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#8d6248" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8d6248" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M330 1080C318 1180 300 1320 292 1460L508 1460C500 1320 482 1180 470 1080Z"
        fill="#e4c2a2"
        stroke="#4a3224"
        strokeWidth={1.2}
      />
      <path
        d="M214 620C168 660 156 760 178 860C198 940 258 980 300 930C274 960 226 930 214 840C204 760 214 690 252 640Z"
        fill="url(#face-flesh)"
        stroke="#4a3224"
        strokeWidth={1.25}
      />
      <path d="M236 690C214 740 220 820 252 860" fill="none" stroke="#4a3224" strokeWidth={1} opacity={0.7} />
      <path
        d="M586 620C632 660 644 760 622 860C602 940 542 980 500 930C526 960 574 930 586 840C596 760 586 690 548 640Z"
        fill="url(#face-flesh)"
        stroke="#4a3224"
        strokeWidth={1.25}
      />
      <path d="M564 690C586 740 580 820 548 860" fill="none" stroke="#4a3224" strokeWidth={1} opacity={0.7} />
      <path
        d="M400 200C530 214 620 340 642 520C662 700 630 880 572 1020C528 1140 468 1210 400 1224C332 1210 272 1140 228 1020C170 880 138 700 158 520C180 340 270 214 400 200Z"
        fill="url(#face-flesh)"
        stroke="#4a3224"
        strokeWidth={1.35}
      />
      <path
        d="M250 470C230 340 290 210 400 186C510 210 570 340 550 470C510 400 470 368 400 360C330 368 290 400 250 470Z"
        fill="#3c2c24"
        opacity={0.88}
      />
      <path d="M268 500C320 476 370 478 404 502" fill="none" stroke="#3a2a22" strokeWidth={2.2} strokeLinecap="round" />
      <path d="M532 500C480 476 430 478 396 502" fill="none" stroke="#3a2a22" strokeWidth={2.2} strokeLinecap="round" />
      <path d="M262 575C300 552 360 550 398 576C360 598 304 600 262 575Z" fill="#f7efe4" stroke="#4a3224" strokeWidth={1.1} />
      <path d="M538 575C500 552 440 550 402 576C440 598 496 600 538 575Z" fill="#f7efe4" stroke="#4a3224" strokeWidth={1.1} />
      <path d="M278 560C304 548 346 546 378 562" fill="none" stroke="#4a3224" strokeWidth={1.5} />
      <path d="M522 560C496 548 454 546 422 562" fill="none" stroke="#4a3224" strokeWidth={1.5} />
      <path d="M286 590C310 604 346 606 372 592" fill="none" stroke="#a67b62" strokeWidth={1} />
      <path d="M514 590C490 604 454 606 428 592" fill="none" stroke="#a67b62" strokeWidth={1} />
      <path d="M392 836C396 860 400 878 400 890" fill="none" stroke="#c49a80" strokeWidth={1.2} />
      <circle cx="318" cy="578" r="16" fill="#6a3a2a" />
      <circle cx="318" cy="578" r="7" fill="#1c120e" />
      <circle cx="482" cy="578" r="16" fill="#6a3a2a" />
      <circle cx="482" cy="578" r="7" fill="#1c120e" />
      <path d="M400 520C396 620 392 700 400 748" fill="none" stroke="#a67b62" strokeWidth={1.4} />
      <path
        d="M400 748C368 760 346 786 338 812C362 796 384 788 400 790C416 788 438 796 462 812C454 786 432 760 400 748Z"
        fill="#e7b89a"
        stroke="#4a3224"
        strokeWidth={1.15}
      />
      <path d="M368 808C360 822 358 834 366 842" fill="none" stroke="#4a3224" strokeWidth={1} />
      <path d="M432 808C440 822 442 834 434 842" fill="none" stroke="#4a3224" strokeWidth={1} />
      <path d="M400 790L400 836" fill="none" stroke="#c49a80" strokeWidth={1} />
      <path
        d="M318 900C352 878 382 872 400 876C418 872 448 878 482 900C448 892 418 888 400 890C382 888 352 892 318 900Z"
        fill="#e8b8a4"
        stroke="#4a3224"
        strokeWidth={1.1}
      />
      <path
        d="M318 900C350 934 378 948 400 946C422 948 450 934 482 900C452 924 424 936 400 934C376 936 348 924 318 900Z"
        fill="#d9a090"
        stroke="#4a3224"
        strokeWidth={1.15}
      />
      <path d="M352 968C372 990 388 998 400 996C412 998 428 990 448 968" fill="none" stroke="#c49a80" strokeWidth={1.2} />
      <ellipse cx="300" cy="860" rx="36" ry="50" fill="url(#face-lo)" opacity={0.35} style={{ mixBlendMode: "multiply" }} />
      <ellipse cx="500" cy="860" rx="36" ry="50" fill="url(#face-lo)" opacity={0.35} style={{ mixBlendMode: "multiply" }} />
      <ellipse cx="400" cy="1120" rx="46" ry="22" fill="url(#face-lo)" opacity={0.4} style={{ mixBlendMode: "multiply" }} />
      <PlateMark x={400} y={196} id="GV20" code="GV20" zh="百会" meridianId="GV" />
      <PlateMark x={400} y={492} id="EX-HN3" code="EX-HN3" zh="印堂" meridianId="EX" />
    </g>
  );
}
