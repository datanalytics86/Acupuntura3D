import { PlateMark } from "./PlateMark";

/**
 * Dorsum of the hand. Thumb abducted so the first interosseous space holds LI4.
 * Fingers are closed paths with a knuckle waist, not capsules.
 */
export function HandPlate() {
  return (
    <g>
      <defs>
        <linearGradient id="hand-flesh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0d2b4" />
          <stop offset="60%" stopColor="#e0b48e" />
          <stop offset="100%" stopColor="#c9926c" />
        </linearGradient>
        <radialGradient id="hand-lo" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#8d6248" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#8d6248" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M300 1180C280 1280 270 1400 290 1520L520 1520C540 1400 530 1280 500 1180Z"
        fill="#e4c2a2"
        stroke="#4a3224"
        strokeWidth={1.2}
      />
      <path
        d="M250 1040C236 960 248 860 286 800L560 812C604 860 624 980 590 1120C560 1260 520 1340 450 1360L340 1360C290 1320 258 1180 250 1040Z"
        fill="url(#hand-flesh)"
        stroke="#4a3224"
        strokeWidth={1.3}
      />
      <path
        d="M286 830C274 760 270 700 292 660C276 590 272 520 290 450C300 390 314 330 330 300C348 328 356 400 348 470C340 540 348 610 334 670C352 720 360 780 356 830C332 846 302 844 286 830Z"
        fill="url(#hand-flesh)"
        stroke="#4a3224"
        strokeWidth={1.25}
      />
      <path d="M300 470C318 462 338 466 348 482" fill="none" stroke="#4a3224" strokeWidth={1.1} />
      <path d="M294 650C316 640 336 646 346 662" fill="none" stroke="#4a3224" strokeWidth={1.1} />
      <path
        d="M368 820C356 740 352 680 376 640C360 560 358 470 378 390C390 320 408 250 430 220C452 250 460 340 450 430C440 520 448 600 432 660C454 710 462 770 456 820C428 838 388 836 368 820Z"
        fill="url(#hand-flesh)"
        stroke="#4a3224"
        strokeWidth={1.25}
      />
      <path d="M392 400C414 390 434 396 448 414" fill="none" stroke="#4a3224" strokeWidth={1.1} />
      <path d="M378 630C404 618 430 624 448 642" fill="none" stroke="#4a3224" strokeWidth={1.1} />
      <path
        d="M466 824C456 750 454 690 476 650C464 580 466 500 486 420C498 360 516 310 534 292C552 320 556 400 546 490C536 570 542 640 526 690C546 740 552 790 546 828C518 844 486 840 466 824Z"
        fill="url(#hand-flesh)"
        stroke="#4a3224"
        strokeWidth={1.25}
      />
      <path d="M494 450C514 442 532 448 544 466" fill="none" stroke="#4a3224" strokeWidth={1.1} />
      <path d="M478 650C502 638 526 646 540 664" fill="none" stroke="#4a3224" strokeWidth={1.1} />
      <path
        d="M556 836C550 760 558 690 576 640C572 580 584 530 602 490C614 460 628 440 640 434C652 452 650 500 640 560C632 620 624 700 630 770C638 810 620 840 600 844C578 850 562 846 556 836Z"
        fill="url(#hand-flesh)"
        stroke="#4a3224"
        strokeWidth={1.25}
      />
      <path d="M590 560C608 552 624 558 636 572" fill="none" stroke="#4a3224" strokeWidth={1.1} />
      <path
        d="M248 1040C210 1000 150 920 132 820C122 760 150 700 196 690C230 684 262 730 270 790C278 860 300 960 286 1040C250 1080 210 1120 188 1040C170 980 200 900 236 860"
        fill="url(#hand-flesh)"
        stroke="#4a3224"
        strokeWidth={1.3}
      />
      <path d="M168 790C186 784 206 792 214 808" fill="none" stroke="#4a3224" strokeWidth={1} />
      <path d="M230 900C250 980 300 1040 340 1080" fill="none" stroke="#a67b62" strokeWidth={1.2} opacity={0.8} />
      <path d="M300 820L300 1080" fill="none" stroke="#c4a48c" strokeWidth={0.8} opacity={0.7} />
      <path d="M390 800L386 1120" fill="none" stroke="#c4a48c" strokeWidth={0.8} opacity={0.7} />
      <path d="M490 810L486 1120" fill="none" stroke="#c4a48c" strokeWidth={0.8} opacity={0.7} />
      <path d="M575 830L570 1100" fill="none" stroke="#c4a48c" strokeWidth={0.8} opacity={0.7} />
      <ellipse cx="470" cy="1180" rx="90" ry="28" fill="url(#hand-lo)" style={{ mixBlendMode: "multiply" }} />
      <ellipse cx="250" cy="980" rx="28" ry="22" fill="url(#hand-lo)" opacity={0.7} style={{ mixBlendMode: "multiply" }} />
      <PlateMark x={236} y={960} id="LI4" code="LI4" zh="合谷" meridianId="LI" />
      <PlateMark x={600} y={900} id="SI3" code="SI3" zh="后溪" meridianId="SI" />
      <PlateMark x={470} y={1240} id="TE5" code="TE5" zh="外关" meridianId="TE" />
    </g>
  );
}
