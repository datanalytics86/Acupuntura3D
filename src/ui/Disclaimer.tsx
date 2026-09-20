import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

export function Disclaimer() {
  const locale = useViewerStore((s) => s.locale);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.4rem,env(safe-area-inset-bottom))]">
      <p className="mx-auto max-w-3xl rounded-full border border-[#8A6A3B]/35 bg-[#F7F1E4] px-4 py-1.5 text-center text-xs leading-snug tracking-wide text-[#2A2118] shadow-[0_4px_16px_rgba(42,33,24,0.08)]">
        {t(locale, "disclaimer")}
      </p>
    </div>
  );
}
