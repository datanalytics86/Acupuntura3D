import { useEffect, useRef, useState } from "react";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

const FLAG = "acu3d.disclaimer.v1";

const COPY = {
  es: "Herramienta educativa. No es un dispositivo médico y no sustituye el criterio de un profesional de Medicina Tradicional China.",
  en: "Educational tool. Not a medical device and not a substitute for a Traditional Chinese Medicine professional.",
} as const;

export function LegalModal() {
  const locale = useViewerStore((s) => s.locale);
  const [open, setOpen] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);

  function accept() {
    try {
      window.localStorage.setItem(FLAG, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  useEffect(() => {
    try {
      setOpen(window.localStorage.getItem(FLAG) !== "1");
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    acceptRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        accept();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const text = locale === "en" ? COPY.en : COPY.es;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(42,33,24,0.45)" }}
      id="legal-gate"
      role="dialog"
      aria-modal="true"
    >
      <div className="marginalia max-w-lg p-6 text-ink">
        <p className="display mb-2 text-2xl">{t(locale, "title")}</p>
        <p className="text-sm leading-relaxed">{text}</p>
        <button ref={acceptRef} type="button" className="stamp-btn mt-5 w-full" onClick={accept}>
          {locale === "en" ? "I understand, enter the atlas" : "Entiendo, entrar al atlas"}
        </button>
      </div>
    </div>
  );
}
