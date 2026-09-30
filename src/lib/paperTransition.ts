import { prefersReducedMotion } from "@/lib/quality";

function isAbort(err: unknown): boolean {
  return err instanceof Error && err.name === "AbortError";
}

/** A skipped transition rejects. Only that rejection is expected. */
function settle(promise: Promise<unknown> | undefined): void {
  void promise?.catch((err: unknown) => {
    if (isAbort(err)) return;
    throw err;
  });
}

export function withPaperTransition(apply: () => void): void {
  if (
    typeof document === "undefined" ||
    prefersReducedMotion() ||
    typeof document.startViewTransition !== "function"
  ) {
    apply();
    return;
  }
  const transition = document.startViewTransition(apply);
  settle(transition.ready);
  settle(transition.finished);
  settle(transition.updateCallbackDone);
}
