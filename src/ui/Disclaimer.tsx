import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

export function Disclaimer() {
  const locale = useViewerStore((s) => s.locale);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <p className="mx-auto max-w-4xl rounded-md bg-black/70 px-3 py-1.5 text-center text-[11px] leading-snug text-zinc-300 backdrop-blur-sm">
        {t(locale, "disclaimer")}
      </p>
    </div>
  );
}
