import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

export function Disclaimer() {
  const locale = useViewerStore((s) => s.locale);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.4rem,env(safe-area-inset-bottom))]">
      <p className="mx-auto max-w-3xl rounded-full bg-black/55 px-4 py-1.5 text-center text-xs leading-snug tracking-wide text-zinc-400 backdrop-blur-md">
        {t(locale, "disclaimer")}
      </p>
    </div>
  );
}
