import type { KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CENTERS, type CenterId } from "@/atlas/centers";
import { loadAcupoints, loadMeridians } from "@/data";
import { MESSAGES, t } from "@/i18n";
import { getMeridianColor } from "@/lib/colors";
import { listCorpus, searchAll, type SearchCommand, type SearchHit, type SearchKind } from "@/lib/search";
import { useViewerStore } from "@/state/viewerStore";
import type { AtlasRegion, AtlasView } from "@/types";
import { IconClose } from "./icons";
import "./palette.css";

const RECENT_KEY = "acu3d.recent.v1";
const RECENT_MAX = 8;

interface RecentRef {
  kind: SearchKind;
  id: string;
}

type GroupId = "recent" | "point" | "meridian" | "center" | "nav" | "action";

function isKind(value: unknown): value is SearchKind {
  return value === "point" || value === "meridian" || value === "center" || value === "command";
}

function readRecent(): RecentRef[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: RecentRef[] = [];
    for (const item of parsed) {
      if (typeof item !== "object" || item === null) continue;
      const kind = "kind" in item ? item.kind : undefined;
      const id = "id" in item ? item.id : undefined;
      if (!isKind(kind) || typeof id !== "string" || id.length === 0) continue;
      out.push({ kind, id });
      if (out.length >= RECENT_MAX) break;
    }
    return out;
  } catch {
    return [];
  }
}

function rememberRecent(hit: SearchHit): void {
  try {
    const prev = readRecent().filter((item) => item.kind !== hit.kind || item.id !== hit.id);
    const next = [{ kind: hit.kind, id: hit.id }, ...prev].slice(0, RECENT_MAX);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    return;
  }
}

function resolveRecent(refs: readonly RecentRef[], corpus: readonly SearchHit[]): SearchHit[] {
  const map = new Map<string, SearchHit>();
  for (const hit of corpus) map.set(`${hit.kind}:${hit.id}`, hit);
  const out: SearchHit[] = [];
  for (const ref of refs) {
    const hit = map.get(`${ref.kind}:${ref.id}`);
    if (hit) out.push(hit);
  }
  return out;
}

function buildCommands(playing: boolean): SearchCommand[] {
  return [
    {
      id: "view:anterior",
      nameEs: MESSAGES.es.cmdGoAnterior,
      nameEn: MESSAGES.en.cmdGoAnterior,
      aliases: ["anterior", "vista anterior", "anterior view"],
      section: "nav",
    },
    {
      id: "view:posterior",
      nameEs: MESSAGES.es.cmdGoPosterior,
      nameEn: MESSAGES.en.cmdGoPosterior,
      aliases: ["posterior", "vista posterior", "posterior view"],
      section: "nav",
    },
    {
      id: "region:body",
      nameEs: MESSAGES.es.cmdRegionBody,
      nameEn: MESSAGES.en.cmdRegionBody,
      aliases: ["cuerpo", "body", "región cuerpo", "body region"],
      section: "nav",
    },
    {
      id: "region:face",
      nameEs: MESSAGES.es.cmdRegionFace,
      nameEn: MESSAGES.en.cmdRegionFace,
      aliases: ["rostro", "face", "región rostro", "face region"],
      section: "nav",
    },
    {
      id: "region:hand",
      nameEs: MESSAGES.es.cmdRegionHand,
      nameEn: MESSAGES.en.cmdRegionHand,
      aliases: ["mano", "hand", "región mano", "hand region"],
      section: "nav",
    },
    {
      id: "region:foot",
      nameEs: MESSAGES.es.cmdRegionFoot,
      nameEn: MESSAGES.en.cmdRegionFoot,
      aliases: ["pie", "foot", "región pie", "foot region"],
      section: "nav",
    },
    {
      id: "action:qi",
      nameEs: playing ? MESSAGES.es.pause : MESSAGES.es.play,
      nameEn: playing ? MESSAGES.en.pause : MESSAGES.en.play,
      aliases: [MESSAGES.es.pause, MESSAGES.es.play, MESSAGES.en.pause, MESSAGES.en.play, "qi"],
      section: "action",
    },
    {
      id: "action:layers",
      nameEs: MESSAGES.es.cmdShowLayers,
      nameEn: MESSAGES.en.cmdShowLayers,
      aliases: ["capas", "layers", "mostrar capas", "show layers"],
      section: "action",
    },
  ];
}

function isCenterId(id: string): id is CenterId {
  return id === "lower" || id === "middle" || id === "upper";
}

function isView(id: string): id is AtlasView {
  return id === "anterior" || id === "posterior";
}

function isRegion(id: string): id is AtlasRegion {
  return id === "body" || id === "face" || id === "hand" || id === "foot";
}

function groupId(hit: SearchHit, recent: boolean): GroupId {
  if (recent) return "recent";
  if (hit.kind === "point" || hit.kind === "meridian" || hit.kind === "center") return hit.kind;
  return hit.section === "action" ? "action" : "nav";
}

interface Chunk {
  id: GroupId;
  start: number;
  hits: SearchHit[];
}

function chunkHits(hits: readonly SearchHit[], recent: boolean): Chunk[] {
  const chunks: Chunk[] = [];
  for (let index = 0; index < hits.length; index += 1) {
    const hit = hits[index];
    if (!hit) continue;
    const id = groupId(hit, recent);
    const last = chunks[chunks.length - 1];
    if (!last || last.id !== id) chunks.push({ id, start: index, hits: [hit] });
    else last.hits.push(hit);
  }
  return chunks;
}

function PaletteDialog() {
  const locale = useViewerStore((s) => s.locale);
  const qiPlaying = useViewerStore((s) => s.qiPlaying);
  const showPoint = useViewerStore((s) => s.showPoint);
  const focusCenter = useViewerStore((s) => s.focusCenter);
  const setAtlasView = useViewerStore((s) => s.setAtlasView);
  const setAtlasRegion = useViewerStore((s) => s.setAtlasRegion);
  const setActiveMeridian = useViewerStore((s) => s.setActiveMeridian);
  const setQiPlaying = useViewerStore((s) => s.setQiPlaying);
  const setRailOpen = useViewerStore((s) => s.setRailOpen);
  const setPaletteOpen = useViewerStore((s) => s.setPaletteOpen);
  const inputRef = useRef<HTMLInputElement>(null);
  const seenKey = useRef(-1);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recent] = useState(readRecent);
  const points = useMemo(() => loadAcupoints(), []);
  const meridians = useMemo(() => loadMeridians(), []);
  const commands = useMemo(() => buildCommands(qiPlaying), [qiPlaying]);
  const sources = useMemo(
    () => ({ points, meridians, centers: CENTERS, commands }),
    [points, meridians, commands],
  );
  const corpus = useMemo(() => listCorpus(sources), [sources]);
  const recentHits = useMemo(() => resolveRecent(recent, corpus), [recent, corpus]);
  const trimmed = query.trim();
  const results = useMemo(() => (trimmed ? searchAll(query, sources) : []), [query, sources, trimmed]);
  const showingRecent = trimmed.length === 0;
  const shown = showingRecent ? recentHits : results;
  const safeActive = shown.length === 0 ? -1 : Math.min(active, shown.length - 1);
  const activeId = safeActive >= 0 ? `palette-opt-${safeActive}` : undefined;
  const nameOf = locale === "en" ? "nameEn" : "nameEs";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (safeActive < 0) return;
    document.getElementById(`palette-opt-${safeActive}`)?.scrollIntoView({ block: "nearest" });
  }, [safeActive, shown.length, query]);

  function runCommand(id: string): void {
    if (id.startsWith("view:")) {
      const view = id.slice(5);
      if (isView(view)) setAtlasView(view);
      return;
    }
    if (id.startsWith("region:")) {
      const region = id.slice(7);
      if (isRegion(region)) setAtlasRegion(region);
      return;
    }
    if (id === "action:qi") {
      setQiPlaying(!qiPlaying);
      return;
    }
    if (id === "action:layers") setRailOpen(true);
  }

  function activate(hit: SearchHit): void {
    rememberRecent(hit);
    if (hit.kind === "point") showPoint(hit.id);
    else if (hit.kind === "center" && isCenterId(hit.id)) focusCenter(hit.id);
    else if (hit.kind === "meridian") setActiveMeridian(hit.id);
    else if (hit.kind === "command") runCommand(hit.id);
    setPaletteOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>): void {
    if (event.nativeEvent.timeStamp === seenKey.current) return;
    seenKey.current = event.nativeEvent.timeStamp;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setPaletteOpen(false);
      return;
    }
    const inField = event.target instanceof HTMLInputElement;
    if (inField && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      event.stopPropagation();
      const count = shown.length;
      if (count === 0) return;
      const down = event.key === "ArrowDown";
      setActive((current) => {
        const base = current < 0 || current >= count ? 0 : current;
        if (down) return base >= count - 1 ? 0 : base + 1;
        return base <= 0 ? count - 1 : base - 1;
      });
      return;
    }
    if (inField && event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      const count = shown.length;
      if (count === 0) return;
      const index = active < 0 || active >= count ? 0 : active;
      const hit = shown[index];
      if (hit) activate(hit);
      return;
    }
    if (event.key !== "Tab") return;
    const root = event.currentTarget.closest(".palette");
    if (!(root instanceof HTMLElement)) return;
    const nodes = root.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled])");
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (!first || !last) return;
    const focused = document.activeElement;
    if (event.shiftKey && focused === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && focused === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const groupLabel: Record<GroupId, string> = {
    recent: t(locale, "groupRecent"),
    point: t(locale, "groupPoints"),
    meridian: t(locale, "groupMeridians"),
    center: t(locale, "groupCenters"),
    nav: t(locale, "groupNav"),
    action: t(locale, "groupActions"),
  };
  const chunks = chunkHits(shown, showingRecent);

  return (
    <div
      className="palette-scrim"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setPaletteOpen(false);
      }}
    >
      <div
        className="palette"
        id="command-palette"
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-palette-title"
        onKeyDown={onKeyDown}
      >
        <div className="palette-head">
          <h2 id="command-palette-title" className="palette-title" tabIndex={-1}>
            {t(locale, "paletteLabel")}
          </h2>
          <button
            type="button"
            className="palette-close"
            aria-label={t(locale, "close")}
            onClick={() => setPaletteOpen(false)}
          >
            <IconClose />
          </button>
        </div>
        <input
          ref={inputRef}
          id="palette-input-field"
          className="palette-input"
          data-testid="palette-input"
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-expanded={shown.length > 0}
          aria-controls="command-palette-list"
          aria-activedescendant={activeId}
          aria-labelledby="command-palette-title"
          placeholder={t(locale, "palettePlaceholder")}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
        />
        {shown.length === 0 ? (
          <p className="palette-status" role="status">
            {trimmed ? t(locale, "paletteEmpty") : t(locale, "paletteHint")}
          </p>
        ) : (
          <div className="palette-list" id="command-palette-list" role="listbox" aria-label={t(locale, "paletteLabel")}>
            {chunks.map((chunk) => (
              <div key={`${chunk.id}-${chunk.start}`} role="group" aria-label={groupLabel[chunk.id]}>
                <div className="palette-group-label" role="presentation" aria-hidden="true">
                  {groupLabel[chunk.id]}
                </div>
                {chunk.hits.map((hit, offset) => {
                  const index = chunk.start + offset;
                  const pigment =
                    hit.kind === "point" || hit.kind === "meridian" ? getMeridianColor(hit.meridianId) : "";
                  return (
                    <div
                      key={`${hit.kind}:${hit.id}`}
                      id={`palette-opt-${index}`}
                      role="option"
                      data-testid="palette-option"
                      aria-selected={index === safeActive}
                      className="palette-option"
                      onMouseEnter={() => setActive(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => activate(hit)}
                    >
                      {pigment ? <span className="palette-swatch" style={{ background: pigment }} /> : null}
                      {hit.code ? <span className="palette-code">{hit.code}</span> : null}
                      {hit.hanzi ? <span className="palette-hanzi">{hit.hanzi}</span> : null}
                      {hit.pinyin ? <span className="palette-pinyin">{hit.pinyin}</span> : null}
                      <span className="palette-name">{hit[nameOf]}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CommandPalette() {
  const open = useViewerStore((s) => s.paletteOpen);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (wasOpen.current && !open) {
      document.querySelector<HTMLElement>('[data-testid="search-trigger"]')?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(<PaletteDialog />, document.body);
}
