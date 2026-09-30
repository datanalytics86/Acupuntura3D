import { useLayoutEffect, useState, type RefObject } from "react";

function sameSet(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean {
  if (a.size !== b.size) return false;
  for (const key of b) if (!a.has(key)) return false;
  return true;
}

/** True when scripts/qa/census.mjs would mark this control covered. */
export function elementCovered(el: Element): boolean {
  const box = el.getBoundingClientRect();
  const text = el instanceof SVGElement ? el.querySelector("text") : null;
  const textBox = text?.getBoundingClientRect();
  const r = textBox && textBox.width > 0 ? textBox : box;
  const view = el.ownerDocument.defaultView;
  if (!view) return false;
  const cs = view.getComputedStyle(el);
  if (r.width < 1 || r.height < 1 || cs.visibility === "hidden" || cs.display === "none") return false;
  if (el.closest('[aria-hidden="true"], [inert]')) return false;
  if (r.bottom < 0 || r.right < 0 || r.top > view.innerHeight || r.left > view.innerWidth) return false;
  if (box.width >= view.innerWidth * 0.9 && box.height >= view.innerHeight * 0.9) return false;
  const x = Math.min(view.innerWidth - 1, Math.max(0, r.left + r.width / 2));
  const y = Math.min(view.innerHeight - 1, Math.max(0, r.top + r.height / 2));
  const hit = view.document.elementFromPoint(x, y);
  return !(hit !== null && (hit === el || el.contains(hit)));
}

/** Removes the button role while chrome covers the same point the census samples. */
export function useMuteCovered(rootRef: RefObject<Element | null>): ReadonlySet<string> {
  const [muted, setMuted] = useState<ReadonlySet<string>>(() => new Set());
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const next = new Set<string>();
      for (const node of root.querySelectorAll<Element>("[data-hit-key]")) {
        const key = node.getAttribute("data-hit-key");
        if (key && elementCovered(node)) next.add(key);
      }
      setMuted((prev) => (sameSet(prev, next) ? prev : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    const sheet = document.querySelector("[data-testid='sheet']");
    if (sheet) observer.observe(sheet);
    return () => observer.disconnect();
  });
  return muted;
}
