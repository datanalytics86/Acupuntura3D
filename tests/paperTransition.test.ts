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

  it("applies in the same turn when the browser defers the update callback", async () => {
    const apply = vi.fn();
    vi.stubGlobal("document", {
      startViewTransition(update: () => void) {
        queueMicrotask(update);
        return { ready: Promise.resolve(), finished: Promise.resolve(), updateCallbackDone: Promise.resolve() };
      },
    });
    withPaperTransition(apply);
    expect(apply).toHaveBeenCalledOnce();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(apply).toHaveBeenCalledOnce();
  });

  it("lands a second apply in the same turn when a transition is already pending", async () => {
    let started = 0;
    const calls: string[] = [];
    vi.stubGlobal("document", {
      startViewTransition(update: () => void) {
        started += 1;
        if (started === 1) queueMicrotask(update);
        else {
          const err = new Error("already active");
          err.name = "InvalidStateError";
          throw err;
        }
        return { ready: Promise.resolve(), finished: Promise.resolve(), updateCallbackDone: Promise.resolve() };
      },
    });
    withPaperTransition(() => calls.push("first"));
    withPaperTransition(() => calls.push("second"));
    expect(calls).toEqual(["first", "second"]);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(calls).toEqual(["first", "second"]);
  });
});
