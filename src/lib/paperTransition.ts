import { prefersReducedMotion } from "@/lib/quality";

export function withPaperTransition(apply: () => void): void {
  if (
    typeof document === "undefined" ||
    prefersReducedMotion() ||
    typeof document.startViewTransition !== "function"
  ) {
    apply();
    return;
  }
  document.startViewTransition(apply);
}
