// Step navigation for a lesson: short text steps advanced with Back and Next.
// Pure, so it is tested without a browser.

export interface StepState {
  /** Index of the step on screen, 0-based. */
  readonly index: number;
  /** How many steps the lesson has (at least 1). */
  readonly count: number;
}

/** Starts at the first step. A count below 1 (or not an integer) is treated as 1. */
export function start(count: number): StepState {
  return { index: 0, count: Number.isInteger(count) && count > 0 ? count : 1 };
}

/** Moves to the next step; stays on the last. */
export function next(s: StepState): StepState {
  return s.index < s.count - 1 ? { ...s, index: s.index + 1 } : s;
}

/** Moves to the previous step; stays on the first. */
export function back(s: StepState): StepState {
  return s.index > 0 ? { ...s, index: s.index - 1 } : s;
}

export const isFirst = (s: StepState): boolean => s.index === 0;
export const isLast = (s: StepState): boolean => s.index === s.count - 1;

/** The position as people read it, e.g. "Step 2 of 5". */
export function label(s: StepState): string {
  return `Step ${s.index + 1} of ${s.count}`;
}
