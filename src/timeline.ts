// A time line of years ago on a log scale, oldest on the left: each tick is ten times older than
// the next, so 10 million years and 10,000 years fit on one line. Pure, so it is tested without
// a browser; lesson2-view.ts draws it.

export interface TimeScale {
  /** Years ago at the left end. */
  readonly oldest: number;
  /** Years ago at the right end (more than 0: a log scale never reaches today). */
  readonly newest: number;
}

/** Where `yearsAgo` sits, from 0 (oldest, left) to 1 (newest, right); outside values are pinned to the ends. */
export function at(s: TimeScale, yearsAgo: number): number {
  const p = Math.log(s.oldest / yearsAgo) / Math.log(s.oldest / s.newest);
  return Math.min(1, Math.max(0, p));
}

/** The powers of ten inside the scale, oldest first. */
export function ticks(s: TimeScale): number[] {
  const out: number[] = [];
  for (let e = Math.floor(Math.log10(s.oldest)); 10 ** e >= s.newest; e--) if (10 ** e <= s.oldest) out.push(10 ** e);
  return out;
}

/** Years ago in the units the lesson teaches: "10.8 Mya" (million years ago), "73.5 kya" (thousand). */
export function short(yearsAgo: number): string {
  const n = (x: number) => String(Number(x.toPrecision(3)));
  if (yearsAgo >= 1_000_000) return `${n(yearsAgo / 1_000_000)} Mya`;
  if (yearsAgo >= 1_000) return `${n(yearsAgo / 1_000)} kya`;
  return `${Math.round(yearsAgo)} years ago`;
}

/** A label to place: its left edge and width, in the same units. */
export interface Span {
  readonly start: number;
  readonly width: number;
}

/**
 * Stacks labels into rows so none overlap: each label takes the first row (0, 1, …) where it
 * clears the one before it by `gap`. Returns each label's row, in the input's order.
 */
export function rows(spans: readonly Span[], gap: number): number[] {
  const order = spans.map((_, i) => i).sort((a, b) => spans[a]!.start - spans[b]!.start);
  const ends: number[] = [];
  const out = new Array<number>(spans.length);
  for (const i of order) {
    const s = spans[i]!;
    let row = ends.findIndex((end) => end + gap <= s.start);
    if (row < 0) row = ends.length;
    ends[row] = s.start + s.width;
    out[i] = row;
  }
  return out;
}
