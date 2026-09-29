import { t } from "@/i18n";
import { useViewerStore } from "@/state/viewerStore";

export function Disclaimer() {
  const locale = useViewerStore((s) => s.locale);
  return <p className="disclaimer">{t(locale, "disclaimer")}</p>;
}
