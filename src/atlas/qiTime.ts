/** One clock hour of the organ clock, at speed 1. */
export const CLOCK_HOUR_SECONDS = 8;

export function meridianAtHour(
  hour: number,
  meridians: { id: string; clockHour?: number }[],
): string | null {
  const h = ((hour % 24) + 24) % 24;
  const hit = meridians.find((m) => {
    if (m.clockHour === undefined) return false;
    const start = m.clockHour;
    const end = (start + 2) % 24;
    return start < end ? h >= start && h < end : h >= start || h < end;
  });
  return hit?.id ?? null;
}
