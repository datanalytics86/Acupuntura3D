import { useEffect, useRef, useState } from "react";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

const FLAG = "acu3d.disclaimer.v1";

const ITEMS = [
  ["legalWhatTitle", "legalWhatBody"],
  ["legalNotTitle", "legalNotBody"],
  ["legalSourcesTitle", "legalSourcesBody"],
] as const;

function disclaimerAccepted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(FLAG) === "1";
  } catch {
    return false;
  }
}

export function LegalModal() {
  const locale = useViewerStore((s) => s.locale);
  const [open, setOpen] = useState(() => !disclaimerAccepted());
  const acceptRef = useRef<HTMLButtonElement>(null);

  function accept() {
    try {
      window.localStorage.setItem(FLAG, "1");
    } catch {
      /* ignore quota */
    }
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    acceptRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        accept();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="legal-gate"
      id="legal-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-title"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="legal-card" onPointerDown={(e) => e.stopPropagation()}>
        <p className="t-meta legal-kicker">{t(locale, "subtitle")}</p>
        <h1 id="legal-title" className="t-title">
          {t(locale, "title")}
        </h1>
        <p className="legal-lede t-body">{t(locale, "legalIntro")}</p>
        <ul className="legal-list">
          {ITEMS.map(([titleKey, bodyKey]) => (
            <li key={titleKey}>
              <h2>{t(locale, titleKey)}</h2>
              <p className="t-body">{t(locale, bodyKey)}</p>
            </li>
          ))}
        </ul>
        <button
          ref={acceptRef}
          type="button"
          className="btn btn-primary"
          data-testid="legal-accept"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={accept}
        >
          {t(locale, "legalAccept")}
        </button>
      </div>
    </div>
  );
}
