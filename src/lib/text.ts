const TRADITIONAL_PREFIX =
  /^\s*(?:uso\s+tradicional\s+educativo|traditional\s+educational\s+use)\s*:\s*/i;

/** Drops a leading educational-use label. Strings without it are returned unchanged. */
export function stripTraditionalPrefix(s: string): string {
  const match = TRADITIONAL_PREFIX.exec(s);
  if (!match) return s;
  return s.slice(match[0].length).replace(/\s+$/, "");
}
