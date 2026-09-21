import { useMemo } from "react";
import { loadAcupoints, loadMeridians } from "@/data";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

const ELEMENTS = ["wood", "fire", "earth", "metal", "water"] as const;

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
      className={`scroll-thin absolute top-28 bottom-24 left-3 z-20 w-[18.5rem] overflow-y-auto border border-brass-line bg-paper px-3 py-3 transition-transform duration-200 md:top-20 ${
        railOpen ? "translate-x-0" : "-translate-x-[120%]"
      }`}
      style={{ borderRadius: "var(--radius-plate)", transitionTimingFunction: "var(--ease-paper)" }}
    >
      <div className="mb-3 flex items-center justify-between border-b border-brass-line pb-2">
        <h2 className="text-[10px] font-semibold tracking-[0.22em] text-brass uppercase">{t(locale, "meridians")}</h2>
        <label className="flex items-center gap-1.5 text-[11px] tracking-[0.12em] text-ink uppercase">
          <input
            type="checkbox"
            checked={starOnly}
            onChange={(e) => setStarOnly(e.target.checked)}
            className="accent-brass"
          />
          {t(locale, "stars")}
        </label>
      </div>
      <div className="mb-3 flex flex-wrap gap-x-3 gap-y-1">
        {ELEMENTS.map((el) => (
          <button
            key={el}
            type="button"
            onClick={() => setElementFilter(element === el ? undefined : el)}
            className={`file-link ${element === el ? "is-on" : ""}`}
          >
            {t(locale, el)}
          </button>
        ))}
      </div>
      <ul>
        {meridians.map((m) => {
          const kids = filtered.filter((p) => p.meridianId === m.id);
          if (starOnly && kids.length === 0) return null;
          if (element && m.element !== element && kids.length === 0) return null;
          const open = active === m.id || Boolean(q);
          const on = active === m.id;
          return (
            <li key={m.id} className={`index-row ${on ? "is-on" : ""}`} style={{ boxShadow: `inset 2px 0 0 ${m.color}` }}>
              <button
                type="button"
                onClick={() => setActive(active === m.id ? null : m.id)}
                className="flex w-full items-baseline gap-2 px-3 py-1.5 text-left"
              >
                <span className="w-8 font-mono text-[11px] tracking-wide text-ink">{m.id}</span>
                <span className="truncate text-[12px] text-brass">{locale === "en" ? m.names.en : m.names.es}</span>
                <span className="ml-auto text-[10px] text-brass">{m.pointCount}</span>
              </button>
              {open && kids.length > 0 ? (
                <ul className="border-t border-brass-line pb-1">
                  {kids.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(p.id);
                          setActive(p.meridianId);
                        }}
                        className={`flex w-full items-baseline gap-2 px-3 py-1 text-left text-[12px] ${
                          selected === p.id ? "bg-paper-inset" : ""
                        }`}
                      >
                        <span className="w-12 font-mono text-brass">{p.code}</span>
                        <span className="text-ink">{p.names.pinyin}</span>
                        <span className="hanzi ml-auto text-brass">{p.names.zh}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
        {filtered.some((p) => p.meridianId.startsWith("EX")) ? (
          <li className="index-row mt-2 px-3 py-2">
            <div className="mb-1 text-[10px] tracking-[0.18em] text-brass uppercase">Extras</div>
            {filtered
              .filter((p) => p.meridianId.startsWith("EX"))
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p.id)}
                  className="flex w-full items-baseline gap-2 py-1 text-left text-[12px] text-ink"
                >
                  <span className="font-mono text-brass">{p.code}</span>
                  <span>{p.names.pinyin}</span>
                  <span className="hanzi ml-auto text-brass">{p.names.zh}</span>
                </button>
              ))}
          </li>
        ) : null}
      </ul>
    </aside>
  );
}
