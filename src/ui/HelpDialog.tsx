import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

const HELP_KEYS = [
  "helpSearch",
  "helpView",
  "helpRegion",
  "helpCenters",
  "helpZoom",
  "helpPoint",
  "helpDismiss",
  "helpAgain",
] as const;

function focusableIn(root: HTMLElement): HTMLElement[] {
  const nodes = root.querySelectorAll<HTMLElement>("button, [href], input, select, textarea");
  return [...nodes].filter((el) => !el.hasAttribute("disabled"));
}

export function HelpDialog() {
  const open = useViewerStore((s) => s.helpOpen);
  const setHelpOpen = useViewerStore((s) => s.setHelpOpen);
  const locale = useViewerStore((s) => s.locale);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    returnTo.current = previous instanceof HTMLElement ? previous : null;
    headingRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      setHelpOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      const back = returnTo.current;
      returnTo.current = null;
      back?.focus();
    };
  }, [open, setHelpOpen]);

  if (!open) return null;

  function onTab(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const items = focusableIn(e.currentTarget);
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    const atStart = document.activeElement === first || document.activeElement === headingRef.current;
    if (e.shiftKey && atStart) {
      e.preventDefault();
      last.focus();
      return;
    }
    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="help-layer">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        data-testid="help-dialog"
        className="help-card"
        onKeyDown={onTab}
      >
        <h2 id="help-title" ref={headingRef} tabIndex={-1} className="t-title">
          {t(locale, "helpTitle")}
        </h2>
        <ul className="help-list t-body">
          {HELP_KEYS.map((key) => (
            <li key={key}>{t(locale, key)}</li>
          ))}
        </ul>
        <p className="help-colophon">{t(locale, "plateColophon")}</p>
        <button type="button" className="btn" onClick={() => setHelpOpen(false)}>
          {t(locale, "close")}
        </button>
      </div>
    </div>
  );
}
