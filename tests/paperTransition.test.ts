import { afterEach, describe, expect, it, vi } from "vitest";
import { prefersReducedMotion } from "@/lib/quality";
import { withPaperTransition } from "@/lib/paperTransition";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("prefersReducedMotion", () => {
  it("returns false when matchMedia is missing", () => {
    vi.stubGlobal("window", {});
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe("withPaperTransition", () => {
  it("swallows AbortError when a new view transition skips the previous one", async () => {
    let rejectReady: (err: unknown) => void = () => {};
    const ready = new Promise((_, reject) => {
      rejectReady = reject;
    });
    const apply = vi.fn();
    vi.stubGlobal("document", {
      startViewTransition(update: () => void) {
        update();
        return { ready, finished: Promise.resolve(), updateCallbackDone: Promise.resolve() };
      },
    });
    withPaperTransition(apply);
    expect(apply).toHaveBeenCalledOnce();
    const abort = new Error("Transition was skipped");
    abort.name = "AbortError";
    rejectReady(abort);
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
});
