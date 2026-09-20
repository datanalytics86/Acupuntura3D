import { useEffect, useState } from "react";
import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

const FLAG = "acu3d.disclaimer.v1";

const COPY = {
  es: "Herramienta educativa. No es un dispositivo médico y no sustituye el criterio de un profesional de Medicina Tradicional China. Las coordenadas 3D del MVP tienen confianza baja y no son un atlas clínico.",
  en: "Educational tool. Not a medical device and not a substitute for a Traditional Chinese Medicine professional. MVP 3D coordinates have low confidence and are not a clinical atlas.",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4" role="dialog" aria-modal="true">
      <div className="panel max-w-lg rounded-2xl p-6 text-zinc-200">
        <p className="display mb-2 text-2xl text-amber-100">{t(locale, "title")}</p>
        <p className="text-sm leading-relaxed text-zinc-300">{text}</p>
        <button
          type="button"
          className="mt-5 w-full rounded-full bg-amber-300/20 px-4 py-2.5 text-sm text-amber-100"
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
