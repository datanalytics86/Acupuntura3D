import { useEffect, type RefObject } from "react";

/** While `open`, every sibling of `ref` is inert. The dialog itself stays active. */
export function useInertSiblings(open: boolean, ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    if (!open) return;
    const node = ref.current;
    const parent = node?.parentElement;
    if (!node || !parent) return;
    const changed: HTMLElement[] = [];
    for (const child of parent.children) {
      if (child === node || !(child instanceof HTMLElement) || child.inert) continue;
      child.inert = true;
      changed.push(child);
    }
    return () => {
      for (const el of changed) el.inert = false;
    };
  }, [open, ref]);
}
