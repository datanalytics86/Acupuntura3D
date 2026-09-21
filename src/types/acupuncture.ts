export type Laterality = "L" | "R" | "C";
export type Confidence = "low" | "medium" | "high";
export type Polaridad = "yin" | "yang";
export type Elemento = "wood" | "fire" | "earth" | "metal" | "water";
export type QualityTier = "high" | "medium" | "low";
export type Locale = "es" | "en" | "zh";
export type AtlasView = "anterior" | "posterior";
export type AtlasRegion = "body" | "face" | "hand" | "foot";

export interface Point2D {
  x: number;
  y: number;
}

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
  position2d?: {
    anterior?: Point2D;
    posterior?: Point2D;
  };
  views?: AtlasView[];
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
  anchors2d?: { anterior?: Point2D[]; posterior?: Point2D[] };
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
  atlasView: AtlasView;
  atlasRegion: AtlasRegion;
  atlasZoom: number;
  atlasPan: Point2D;
  bothSides: boolean;
}
