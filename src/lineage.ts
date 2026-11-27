// Lesson 2's family-line model: a population of females, each generation born to mothers picked
// at random from the one before. Every female carries the mark of the founding mother her line
// of mothers goes back to, the way mitochondrial DNA passes from mother to daughter only.
// Lines die out by chance until every living female descends from one founder.
// Pure and seeded, so the same choices give the same run and the tests need no browser.

export interface Population {
  /** For each living female, the founding mother (0 … founders − 1) her line goes back to. */
  readonly line: readonly number[];
  /** How many founding mothers the run started with. */
  readonly founders: number;
  /** Generations run so far; the founders are generation 0. */
  readonly generation: number;
  /** Maternal lines still alive after each generation, starting with the founders. */
  readonly history: readonly number[];
  /** The generation at which one line was left, or null while there are more. */
  readonly oneLineAt: number | null;
  /** The random generator's state. */
  readonly seed: number;
}

/** A small, fast seeded generator (mulberry32): returns a number in [0, 1) and the next state. */
export function random(seed: number): [number, number] {
  const next = (seed + 0x6d2b79f5) | 0;
  let t = next;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, next];
}

const whole = (n: number): number => Math.max(1, Math.round(n));

/** A population of `size` founding mothers, each her own line. */
export function found(size: number, seed: number): Population {
  const n = whole(size);
  return { line: Array.from({ length: n }, (_, i) => i), founders: n, generation: 0, history: [n], oneLineAt: n === 1 ? 0 : null, seed };
}

/** How many maternal lines are still alive. */
export const linesLeft = (p: Population): number => new Set(p.line).size;

/** How many living females belong to each founder's line, founder by founder. */
export function lineSizes(p: Population): number[] {
  const out = new Array<number>(p.founders).fill(0);
  for (const l of p.line) out[l]!++;
  return out;
}

/** One generation: `size` daughters, each born to a mother picked at random from the living females. */
export function breed(p: Population, size: number): Population {
  let seed = p.seed;
  const line: number[] = [];
  for (let i = 0; i < whole(size); i++) {
    const [r, s] = random(seed);
    seed = s;
    line.push(p.line[Math.floor(r * p.line.length)]!);
  }
  const generation = p.generation + 1;
  const left = new Set(line).size;
  return {
    line,
    founders: p.founders,
    generation,
    history: [...p.history, left],
    oneLineAt: p.oneLineAt ?? (left === 1 ? generation : null),
    seed,
  };
}
