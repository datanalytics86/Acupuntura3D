import { useMemo } from "react";
import { loadAcupoints, loadMeridians } from "@/data";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

export function MeridianRail() {
  const meridians = useMemo(() => loadMeridians(), []);
  const points = useMemo(() => loadAcupoints(), []);
  const locale = useViewerStore((s) => s.locale);
  const active = useViewerStore((s) => s.activeMeridianId);
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
      className={`absolute top-20 bottom-24 left-0 z-20 w-72 overflow-y-auto border-r border-white/10 bg-black/55 p-3 backdrop-blur-md transition-transform md:translate-x-0 ${
        railOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{t(locale, "meridians")}</h2>
        <label className="flex items-center gap-1 text-[11px] text-zinc-400">
          <input type="checkbox" checked={starOnly} onChange={(e) => setStarOnly(e.target.checked)} />
          {t(locale, "stars")}
        </label>
      </div>
      <div className="mb-3 flex flex-wrap gap-1">
        {(["wood", "fire", "earth", "metal", "water"] as const).map((el) => (
          <button
            key={el}
            type="button"
            onClick={() => setElementFilter(element === el ? undefined : el)}
            className={`rounded-full px-2 py-0.5 text-[10px] ${element === el ? "bg-white/20" : "bg-white/5 text-zinc-500"}`}
          >
            {t(locale, el)}
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {meridians.map((m) => {
          const kids = filtered.filter((p) => p.meridianId === m.id);
          if (starOnly && kids.length === 0) return null;
          if (element && m.element !== element && kids.length === 0) return null;
          return (
            <li key={m.id} className="rounded-md border border-white/5">
              <button
                type="button"
                onClick={() => setActive(active === m.id ? null : m.id)}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-left"
              >
                <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
                <span className="text-xs font-medium text-zinc-100">{m.id}</span>
                <span className="truncate text-[11px] text-zinc-400">
                  {locale === "en" ? m.names.en : m.names.es}
                </span>
                <span className="ml-auto text-[10px] text-zinc-500">
                  {m.pointCount} {t(locale, "omsPoints")}
                </span>
              </button>
              {(active === m.id || q) && kids.length > 0 ? (
                <ul className="border-t border-white/5 px-1 py-1">
                  {kids.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(p.id);
                          setActive(p.meridianId);
                        }}
                        className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-[12px] hover:bg-white/5"
                      >
                        <span className="font-mono text-amber-200">{p.code}</span>
                        <span className="text-zinc-300">{p.names.pinyin}</span>
                        <span className="truncate text-zinc-500">{p.names.zh}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
        {filtered.some((p) => p.meridianId.startsWith("EX")) ? (
          <li className="rounded-md border border-white/5 p-2">
            <div className="mb-1 text-[11px] uppercase text-zinc-500">Extras</div>
            {filtered
              .filter((p) => p.meridianId.startsWith("EX"))
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p.id)}
                  className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-[12px] hover:bg-white/5"
                >
                  <span className="font-mono text-amber-200">{p.code}</span>
                  <span>{p.names.pinyin}</span>
                </button>
              ))}
          </li>
        ) : null}
      </ul>
    </aside>
  );
}
