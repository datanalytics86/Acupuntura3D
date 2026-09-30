import { flushSync } from "react-dom";
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
  // Chromium runs the update callback after this call returns. The plate has to
  // move before the key handler returns, and that deferred callback must not
  // replay a stale view over the one that landed since.
  let landed = false;
  const run = () => {
    if (landed) return;
    landed = true;
    flushSync(apply);
  };
  run();
  try {
    const transition = document.startViewTransition(() => {
      run();
    });
    settle(transition.ready);
    settle(transition.finished);
    settle(transition.updateCallbackDone);
  } catch {
    // A second transition in the same turn throws. The camera still has to land.
    run();
  }
}
