function mediaQuery(query: string): MediaQueryList | null {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return null;
  return window.matchMedia(query);
}

export function prefersReducedMotion(): boolean {
  return mediaQuery("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function mediaMatches(query: string): boolean {
  return mediaQuery(query)?.matches ?? false;
}

/** Subscribe, or call `onChange(false)` once when matchMedia does not exist. */
export function watchMedia(query: string, onChange: (matches: boolean) => void): () => void {
  const media = mediaQuery(query);
  if (!media) {
    onChange(false);
    return () => {};
  }
  const apply = () => onChange(media.matches);
  apply();
  media.addEventListener("change", apply);
  return () => media.removeEventListener("change", apply);
}
