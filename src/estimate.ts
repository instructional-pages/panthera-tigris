// The estimate slider's logic (lessons 2, 5, 7, 10, 12, 14, 15): the learner sets a slider to
// a number, locks it in, then sees the answer beside it. Pure, so it is tested without a browser.

export interface EstimateSpec {
  readonly min: number;
  readonly max: number;
  readonly answer: number;
  /** "log" for spans over orders of magnitude (years ago, densities), where equal steps are equal ratios. */
  readonly scale: "linear" | "log";
  /** How many equal steps the slider has from min to max. */
  readonly steps: number;
  /** How far from the answer still counts as close, as a fraction of the slider's length. */
  readonly close: number;
  /** "atMost": the answer is an upper bound (the sources give "at most"), so any guess at or under it is close. */
  readonly bound?: "atMost";
  /**
   * The span the sources give (e.g. 15–19), when they give no single number: any guess inside it
   * is close, the reveal shows the span, and `answer` (a point inside it) is never drawn.
   */
  readonly range?: readonly [number, number];
}

export type EstimateVerdict =
  | { readonly kind: "close" }
  | { readonly kind: "low" | "high"; readonly by: number };

const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));

/** Where `value` sits along the slider, from 0 (min) to 1 (max); outside values are pinned to the ends. */
export function position(spec: EstimateSpec, value: number): number {
  if (spec.scale === "log") return clamp01(Math.log(value / spec.min) / Math.log(spec.max / spec.min));
  return clamp01((value - spec.min) / (spec.max - spec.min));
}

/** Rounds to two significant figures, so log-scale stops read as plain numbers (12,000, not 11,987). */
export function twoFigures(x: number): number {
  if (x === 0) return 0;
  const unit = 10 ** (Math.floor(Math.log10(Math.abs(x))) - 1);
  return Math.round(x / unit) * unit;
}

/** The value at slider stop `stop` (0…steps). */
export function valueAt(spec: EstimateSpec, stop: number): number {
  const p = clamp01(Math.round(stop) / spec.steps);
  if (p === 0) return spec.min;
  if (p === 1) return spec.max;
  if (spec.scale === "log") return twoFigures(spec.min * (spec.max / spec.min) ** p);
  const v = spec.min + p * (spec.max - spec.min);
  return Number(v.toPrecision(12)); // drop float noise such as 0.30000000000000004
}

/** The slider stop nearest `value`. */
export const stopOf = (spec: EstimateSpec, value: number): number => Math.round(position(spec, value) * spec.steps);

/**
 * How the guess compares with the answer. Close is measured along the slider, so on a log
 * scale "close" means within a ratio, not a fixed amount. `by` is how far off the guess is:
 * a ratio (at least 1) on a log scale, a difference on a linear one; with a span, from its nearer end.
 */
export function judgeEstimate(spec: EstimateSpec, guess: number): EstimateVerdict {
  if (spec.bound === "atMost" && guess <= spec.answer) return { kind: "close" };
  if (spec.range && guess >= spec.range[0] && guess <= spec.range[1]) return { kind: "close" };
  // With a span, a guess outside it is judged against its nearer end.
  const answer = spec.range ? (guess < spec.range[0] ? spec.range[0] : spec.range[1]) : spec.answer;
  if (Math.abs(position(spec, guess) - position(spec, answer)) <= spec.close) return { kind: "close" };
  const kind = guess < answer ? "low" : "high";
  const by = spec.scale === "log" ? Math.max(guess, answer) / Math.min(guess, answer) : Math.abs(guess - answer);
  return { kind, by };
}
