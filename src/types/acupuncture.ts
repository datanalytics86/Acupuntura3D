export type Laterality = "L" | "R" | "C";
export type Confidence = "low" | "medium" | "high";
export type Polaridad = "yin" | "yang";
export type Elemento = "wood" | "fire" | "earth" | "metal" | "water";
export type QualityTier = "high" | "medium" | "low";
export type Locale = "es" | "en" | "zh";

export interface Names {
  zh: string;
  pinyin: string;
  es: string;
  en: string;
}

export interface Acupoint {
  id: string;
  code: string;
  meridianId: string;
  index: number;
  names: Names;
  location: { anatomicEs: string; cunNote?: string };
  functions: string[];
  indications: string[];
  precautions: string[];
  combinations?: string[];
  element?: Elemento;
  polaridad?: Polaridad;
  laterality: Laterality;
  region: string;
  position?: { x: number; y: number; z: number };
  sources: string[];
  confidence: Confidence;
}

export type MeridianFlow =
  | "chest-to-hand"
  | "hand-to-head"
  | "head-to-foot"
  | "foot-to-chest"
  | "ascending-front"
  | "ascending-back";

export interface Meridian {
  id: string;
  code: string;
  names: Names;
  element?: Elemento;
  polaridad?: Polaridad;
  clockHour?: number;
  pointCount: number;
  pointCodes: string[];
  pathAnchors: { x: number; y: number; z: number }[];
  flow: MeridianFlow;
  laterality: "bilateral" | "midline";
  color: string;
}

export interface ViewerState {
  selectedPointId: string | null;
  hoveredPointId: string | null;
  activeMeridianId: string | null;
  visibleLayers: {
    body: boolean;
    meridians: boolean;
    points: boolean;
    qi: boolean;
    labels: boolean;
  };
  qiPlaying: boolean;
  qiSpeed: number;
  clockHour: number;
  locale: Locale;
  qualityTier: QualityTier;
  searchQuery: string;
  filters: { element?: Elemento; region?: string; starOnly: boolean };
}
