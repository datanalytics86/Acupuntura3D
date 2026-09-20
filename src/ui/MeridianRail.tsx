import { useMemo } from "react";
import { loadAcupoints, loadMeridians } from "@/data";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

const ELEMENTS = ["wood", "fire", "earth", "metal", "water"] as const;
const ELEMENT_DOT: Record<(typeof ELEMENTS)[number], string> = {
  wood: "#3D8B40",
  fire: "#E23B3B",
  earth: "#C4A35A",
  metal: "#C0C8D0",
  water: "#2B6CB0",
};

export function MeridianRail() {
  const meridians = useMemo(() => loadMeridians(), []);
  const points = useMemo(() => loadAcupoints(), []);
  const locale = useViewerStore((s) => s.locale);
  const active = useViewerStore((s) => s.activeMeridianId);
  const selected = useViewerStore((s) => s.selectedPointId);
  const setActive = useViewerStore((s) => s.setActiveMeridian);
  const setSelected = useViewerStore((s) => s.setSelected);
  const query = useViewerStore((s) => s.searchQuery);
  const starOnly = useViewerStore((s) => s.filters.starOnly);
  const element = useViewerStore((s) => s.filters.element);
  const setStarOnly = useViewerStore((s) => s.setStarOnly);
  const setElementFilter = useViewerStore((s) => s.setElementFilter);
  const railOpen = useViewerStore((s) => s.railOpen);

  const q = query.trim().toLowerCase();
  const filtered = points.filter((p) => {
    if (element && p.element !== element) return false;
    if (!q) return true;
    return (
      p.code.toLowerCase().includes(q) ||
      p.names.pinyin.toLowerCase().includes(q) ||
      p.names.es.toLowerCase().includes(q) ||
      p.names.en.toLowerCase().includes(q) ||
      p.names.zh.includes(query.trim())
    );
  });

  return (
    <aside
      className={`panel scroll-thin absolute top-24 bottom-32 left-3 z-20 w-[18.5rem] overflow-y-auto rounded-2xl p-3 transition-transform md:translate-x-0 ${
        railOpen ? "translate-x-0" : "-translate-x-[120%]"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[10px] font-semibold tracking-[0.2em] text-[#8A6A3B] uppercase">
          {t(locale, "meridians")}
        </h2>
        <label className="flex items-center gap-1.5 text-[11px] text-[#2A2118]">
          <input
            type="checkbox"
            checked={starOnly}
            onChange={(e) => setStarOnly(e.target.checked)}
            className="accent-[#8A6A3B]"
          />
          {t(locale, "stars")}
        </label>
      </div>
      <div className="mb-3 flex flex-wrap gap-1">
        {ELEMENTS.map((el) => (
          <button
            key={el}
            type="button"
            onClick={() => setElementFilter(element === el ? undefined : el)}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${
              element === el
                ? "bg-[#8A6A3B] text-[#F7F1E4]"
                : "border border-[#8A6A3B]/35 text-[#2A2118]"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: ELEMENT_DOT[el] }} />
            {t(locale, el)}
          </button>
        ))}
      </div>
      <ul className="space-y-1.5">
        {meridians.map((m) => {
          const kids = filtered.filter((p) => p.meridianId === m.id);
          if (starOnly && kids.length === 0) return null;
          if (element && m.element !== element && kids.length === 0) return null;
          const open = active === m.id || Boolean(q);
          return (
            <li
              key={m.id}
              className={`overflow-hidden rounded-xl border ${
                active === m.id
                  ? "border-[#8A6A3B]/50 bg-[#F3EBD8]"
                  : "border-[#8A6A3B]/25 bg-[#F7F1E4]"
              }`}
            >
              <button
                type="button"
                onClick={() => setActive(active === m.id ? null : m.id)}
                className="flex w-full items-center gap-2 px-2.5 py-2 text-left"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />
                <span className="text-xs font-semibold tracking-wide text-[#2A2118]">{m.id}</span>
                <span className="truncate text-[11px] text-[#8A6A3B]">
                  {locale === "en" ? m.names.en : m.names.es}
                </span>
                <span className="ml-auto text-[10px] text-[#8A6A3B]">{m.pointCount}</span>
              </button>
              {open && kids.length > 0 ? (
                <ul className="border-t border-[#8A6A3B]/25 px-1 py-1">
                  {kids.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(p.id);
                          setActive(p.meridianId);
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] ${
                          selected === p.id ? "bg-[#8A6A3B]/15" : "hover:bg-[#8A6A3B]/10"
                        }`}
                      >
                        <span className="font-mono text-[#8A6A3B]">{p.code}</span>
                        <span className="text-[#2A2118]">{p.names.pinyin}</span>
                        <span className="hanzi ml-auto truncate text-[#8A6A3B]">{p.names.zh}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
        {filtered.some((p) => p.meridianId.startsWith("EX")) ? (
          <li className="rounded-xl border border-[#8A6A3B]/25 bg-[#F7F1E4] p-2">
            <div className="mb-1 text-[10px] tracking-widest text-[#8A6A3B] uppercase">Extras</div>
            {filtered
              .filter((p) => p.meridianId.startsWith("EX"))
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p.id)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] text-[#2A2118] hover:bg-[#8A6A3B]/10"
                >
                  <span className="font-mono text-[#8A6A3B]">{p.code}</span>
                  <span>{p.names.pinyin}</span>
                  <span className="hanzi ml-auto text-[#8A6A3B]">{p.names.zh}</span>
                </button>
              ))}
          </li>
        ) : null}
      </ul>
    </aside>
  );
}
