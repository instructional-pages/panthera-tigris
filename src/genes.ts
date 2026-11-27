// Lesson 3's genetics models: one gene with a recessive variant (white or "black" coat).
// Breeding: each parent passes one of its two copies, at random, to each cub. Drift: a
// population's share of the variant wanders by chance from one generation to the next, and
// wanders most when the population is small. Pure, so it is tested without a browser.

/** How many copies of the variant a tiger carries: 0, 1 (a carrier, looks normal) or 2 (shows it). */
export type Copies = 0 | 1 | 2;

/** A recessive coat shows only with two copies. */
export const shows = (c: Copies): boolean => c === 2;

/** The chance that a cub of these parents has 0, 1 or 2 copies. */
export function cubOdds(mother: Copies, father: Copies): readonly [number, number, number] {
  const m = mother / 2;
  const f = father / 2;
  return [(1 - m) * (1 - f), m * (1 - f) + (1 - m) * f, m * f];
}

/** One cub: each parent passes the variant with a chance of its copies out of two. */
export function breedCub(mother: Copies, father: Copies, r: () => number): Copies {
  return ((r() < mother / 2 ? 1 : 0) + (r() < father / 2 ? 1 : 0)) as Copies;
}

/** A population in the drift model: `size` tigers, so 2 × size copies of the gene. */
export interface Drift {
  readonly size: number;
  /** The variant's share of all copies, each generation so far (the first is the start). */
  readonly history: readonly number[];
}

export function startDrift(size: number, share: number): Drift {
  if (!Number.isInteger(size) || size < 1) throw new Error(`a population needs a whole number of tigers, not ${size}`);
  if (!(share >= 0 && share <= 1)) throw new Error(`a share is between 0 and 1, not ${share}`);
  return { size, history: [Math.round(share * 2 * size) / (2 * size)] };
}

/** The variant's share now. */
export const share = (d: Drift): number => d.history.at(-1)!;

/** Lost (no copies left) or fixed (every copy is the variant): chance can no longer change it. */
export const settled = (d: Drift): boolean => share(d) === 0 || share(d) === 1;

/**
 * The next generation: each of its 2 × size copies is drawn from the parents' copies at random
 * (the textbook Wright–Fisher model), so the share moves only by chance.
 */
export function nextGeneration(d: Drift, r: () => number): Drift {
  const n = 2 * d.size;
  const p = share(d);
  let k = 0;
  for (let i = 0; i < n; i++) if (r() < p) k++;
  return { size: d.size, history: [...d.history, k / n] };
}

/** With random mating, the share of tigers carrying two copies, so showing a recessive coat. */
export const showing = (p: number): number => p * p;
