import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

export function Disclaimer() {
  const locale = useViewerStore((s) => s.locale);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.4rem,env(safe-area-inset-bottom))]">
      <p className="border-t border-brass-line bg-paper px-4 py-1 text-center text-[10px] tracking-[0.14em] text-ink">
        {t(locale, "disclaimer")}
      </p>
    </div>
  );
}
