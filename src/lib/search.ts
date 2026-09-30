export type SearchKind = "point" | "meridian" | "center" | "command";
export type SearchSection = "" | "nav" | "action";

export interface SearchPoint {
  id: string;
  code: string;
  meridianId: string;
  names: { zh: string; pinyin: string; es: string; en: string };
}

export interface SearchMeridian {
  id: string;
  code: string;
  names: { zh: string; pinyin: string; es: string; en: string };
}

export interface SearchCenter {
  id: string;
  zh: string;
  pinyin: string;
  es: string;
  en: string;
  aliases?: readonly string[];
}

export interface SearchCommand {
  id: string;
  code?: string;
  hanzi?: string;
  pinyin?: string;
  nameEs: string;
  nameEn: string;
  aliases?: readonly string[];
  section?: "nav" | "action";
}

export interface SearchSources {
  points: readonly SearchPoint[];
  meridians: readonly SearchMeridian[];
  centers: readonly SearchCenter[];
  commands: readonly SearchCommand[];
}

export interface SearchHit {
  kind: SearchKind;
  id: string;
  score: number;
  code: string;
  hanzi: string;
  pinyin: string;
  nameEs: string;
  nameEn: string;
  meridianId: string;
  section: SearchSection;
}

const KIND_RANK: Record<SearchKind, number> = {
  point: 0,
  meridian: 1,
  center: 2,
  command: 3,
};

const FIELD_CODE = 5;
const FIELD_HANZI = 4;
const FIELD_PINYIN = 3;
const FIELD_NAME = 2;
const FIELD_ALIAS = 1;

/** NFD fold without combining marks. Exact code/hanzi/pinyin stay comparable. */
export function fold(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function matchRank(field: string, query: string): number {
  if (!field || !query) return 0;
  if (field === query) return 3;
  if (field.startsWith(query)) return 2;
  if (field.includes(query)) return 1;
  return 0;
}

function fieldScore(
  values: readonly (string | undefined)[],
  query: string,
  queryTight: string,
  weight: number,
): number {
  let best = 0;
  for (const value of values) {
    if (!value) continue;
    const folded = fold(value);
    if (!folded) continue;
    const tight = folded.replace(/\s+/g, "");
    const rank = Math.max(matchRank(folded, query), matchRank(tight, queryTight));
    if (rank > best) best = rank;
  }
  if (best === 0) return 0;
  return best * 10 + weight;
}

function bestScore(
  query: string,
  queryTight: string,
  fields: readonly { weight: number; values: readonly (string | undefined)[] }[],
): number {
  let best = 0;
  for (const field of fields) {
    const score = fieldScore(field.values, query, queryTight, field.weight);
    if (score > best) best = score;
  }
  return best;
}

function pointHit(point: SearchPoint, score: number): SearchHit {
  return {
    kind: "point",
    id: point.id,
    score,
    code: point.code,
    hanzi: point.names.zh,
    pinyin: point.names.pinyin,
    nameEs: point.names.es,
    nameEn: point.names.en,
    meridianId: point.meridianId,
    section: "",
  };
}

function meridianHit(meridian: SearchMeridian, score: number): SearchHit {
  return {
    kind: "meridian",
    id: meridian.id,
    score,
    code: meridian.code,
    hanzi: meridian.names.zh,
    pinyin: meridian.names.pinyin,
    nameEs: meridian.names.es,
    nameEn: meridian.names.en,
    meridianId: meridian.id,
    section: "",
  };
}

function centerHit(center: SearchCenter, score: number): SearchHit {
  return {
    kind: "center",
    id: center.id,
    score,
    code: "",
    hanzi: center.zh,
    pinyin: center.pinyin,
    nameEs: center.es,
    nameEn: center.en,
    meridianId: "",
    section: "",
  };
}

function commandHit(command: SearchCommand, score: number): SearchHit {
  return {
    kind: "command",
    id: command.id,
    score,
    code: command.code ?? "",
    hanzi: command.hanzi ?? "",
    pinyin: command.pinyin ?? "",
    nameEs: command.nameEs,
    nameEn: command.nameEn,
    meridianId: "",
    section: command.section === "action" ? "action" : "nav",
  };
}

function scorePoint(point: SearchPoint, query: string, queryTight: string): number {
  return bestScore(query, queryTight, [
    { weight: FIELD_CODE, values: [point.code, point.id] },
    { weight: FIELD_HANZI, values: [point.names.zh] },
    { weight: FIELD_PINYIN, values: [point.names.pinyin] },
    { weight: FIELD_NAME, values: [point.names.es, point.names.en] },
  ]);
}

function scoreMeridian(meridian: SearchMeridian, query: string, queryTight: string): number {
  return bestScore(query, queryTight, [
    { weight: FIELD_CODE, values: [meridian.code, meridian.id] },
    { weight: FIELD_HANZI, values: [meridian.names.zh] },
    { weight: FIELD_PINYIN, values: [meridian.names.pinyin] },
    { weight: FIELD_NAME, values: [meridian.names.es, meridian.names.en] },
  ]);
}

function scoreCenter(center: SearchCenter, query: string, queryTight: string): number {
  return bestScore(query, queryTight, [
    { weight: FIELD_HANZI, values: [center.zh] },
    { weight: FIELD_PINYIN, values: [center.pinyin] },
    { weight: FIELD_NAME, values: [center.es, center.en] },
    { weight: FIELD_ALIAS, values: center.aliases ?? [] },
  ]);
}

function scoreCommand(command: SearchCommand, query: string, queryTight: string): number {
  return bestScore(query, queryTight, [
    { weight: FIELD_CODE, values: [command.code] },
    { weight: FIELD_HANZI, values: [command.hanzi] },
    { weight: FIELD_PINYIN, values: [command.pinyin] },
    { weight: FIELD_NAME, values: [command.nameEs, command.nameEn] },
    { weight: FIELD_ALIAS, values: command.aliases ?? [] },
  ]);
}

function byRank(a: SearchHit, b: SearchHit): number {
  if (b.score !== a.score) return b.score - a.score;
  const kind = KIND_RANK[a.kind] - KIND_RANK[b.kind];
  if (kind !== 0) return kind;
  return a.id.localeCompare(b.id);
}

/** Ranked hits. Exact beats prefix beats contains; code beats hanzi beats pinyin beats name beats alias. */
export function searchAll(query: string, sources: SearchSources): SearchHit[] {
  const q = fold(query.trim());
  if (!q) return [];
  const queryTight = q.replace(/\s+/g, "");
  const hits: SearchHit[] = [];
  for (const point of sources.points) {
    const score = scorePoint(point, q, queryTight);
    if (score > 0) hits.push(pointHit(point, score));
  }
  for (const meridian of sources.meridians) {
    const score = scoreMeridian(meridian, q, queryTight);
    if (score > 0) hits.push(meridianHit(meridian, score));
  }
  for (const center of sources.centers) {
    const score = scoreCenter(center, q, queryTight);
    if (score > 0) hits.push(centerHit(center, score));
  }
  for (const command of sources.commands) {
    const score = scoreCommand(command, q, queryTight);
    if (score > 0) hits.push(commandHit(command, score));
  }
  hits.sort(byRank);
  return hits;
}

export function listCorpus(sources: SearchSources): SearchHit[] {
  return [
    ...sources.points.map((point) => pointHit(point, 0)),
    ...sources.meridians.map((meridian) => meridianHit(meridian, 0)),
    ...sources.centers.map((center) => centerHit(center, 0)),
    ...sources.commands.map((command) => commandHit(command, 0)),
  ];
}
