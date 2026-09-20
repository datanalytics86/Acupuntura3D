import { useEffect, useState } from "react";
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

  useEffect(() => {
    try {
      setOpen(window.localStorage.getItem(FLAG) !== "1");
    } catch {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  const text = locale === "en" ? COPY.en : COPY.es;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(42,33,24,0.45)" }}
      role="dialog"
      aria-modal="true"
    >
      <div className="panel max-w-lg rounded-2xl p-6 text-[#2A2118]">
        <p className="display mb-2 text-2xl text-[#2A2118]">{t(locale, "title")}</p>
        <p className="text-sm leading-relaxed text-[#2A2118]">{text}</p>
        <button
          type="button"
          className="mt-5 w-full rounded-full bg-[#8A6A3B] px-4 py-2.5 text-sm text-[#F7F1E4]"
          onClick={() => {
            try {
              window.localStorage.setItem(FLAG, "1");
            } catch {
              /* ignore */
            }
            setOpen(false);
          }}
        >
          {locale === "en" ? "I understand, enter the atlas" : "Entiendo, entrar al atlas"}
        </button>
      </div>
    </div>
  );
}
