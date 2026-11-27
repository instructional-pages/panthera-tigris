// The ordering task's logic (lessons 5, 7, 15): the learner puts a few items in order (the steps
// of a hunt, the stages of a life), locks it in, then sees each item's right place. An order is a
// list of item indices, where item i belongs at place i. Pure, so it is tested without a browser.

/** True when `order` holds each of 0…n-1 exactly once. */
export function isPermutation(order: readonly number[], n: number): boolean {
  if (order.length !== n) return false;
  const seen = new Set(order);
  return seen.size === n && order.every((i) => Number.isInteger(i) && i >= 0 && i < n);
}

/**
 * Checks a task's starting order: every item once, and no item already in its right place, so
 * every item must be moved and no part of the answer is given away.
 */
export function checkStart(start: readonly number[], n: number): void {
  if (n < 2) throw new Error("an ordering task needs at least two items");
  if (!isPermutation(start, n)) throw new Error(`start [${start}] is not an order of ${n} items`);
  const placed = start.findIndex((item, place) => item === place);
  if (placed >= 0) throw new Error(`start [${start}] already has item ${placed} in its right place`);
}

/** The order with the item at `place` moved by `by` places (−1 up, +1 down); unchanged at the ends. */
export function move(order: readonly number[], place: number, by: -1 | 1): number[] {
  const to = place + by;
  const out = [...order];
  if (place < 0 || place >= out.length || to < 0 || to >= out.length) return out;
  [out[place], out[to]] = [out[to]!, out[place]!];
  return out;
}

/** For each place, whether the item there belongs there. */
export const rightPlaces = (order: readonly number[]): boolean[] => order.map((item, place) => item === place);

/** True when every item is in its right place. */
export const inOrder = (order: readonly number[]): boolean => order.every((item, place) => item === place);
