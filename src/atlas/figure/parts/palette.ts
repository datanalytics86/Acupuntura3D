export const SKIN = {
  light: "#F6D7C0",
  mid: "#E8C4A8",
  shadow: "#C48A6A",
  deep: "#A56B50",
  outline: "#6B4A36",
} as const;

export const HAIR = {
  light: "#5A4036",
  dark: "#3D2A22",
} as const;

export const FEATURE = {
  brow: "#4A342C",
  eye: "#3A2A24",
  lip: "#C4786A",
  nose: "#B07A62",
} as const;

export const FILL = {
  skin: "url(#encSkin)",
  skinL: "url(#encSkinL)",
  skinR: "url(#encSkinR)",
  muscle: "url(#encMuscle)",
  hair: "url(#encHair)",
  shadow: "url(#encGround)",
} as const;
