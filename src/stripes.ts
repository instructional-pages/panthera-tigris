// The stripe renderer's logic (lessons 3, 14, 15): a tiger's stripe pattern made from a seed (the
// same seed always gives the same tiger), the shapes that draw it, and how a "which tiger is in
// this photo?" task is judged. The patterns are self-made drawings, not traced from photos: they
// vary in what the dossier says makes each tiger's pattern its own (how many stripes, how wide,
// whether they split or break into spots). Pure, so it is tested without a browser.

/** The coats the course shows; told apart by the drawing itself and by a label. */
export type Coat = "orange" | "white" | "pseudomelanistic";

/** One stripe, running down from the back. Positions and sizes are fractions of the flank. */
export interface Stripe {
  /** Where it starts along the flank, 0 (rump) to 1 (shoulder). */
  readonly x: number;
  /** Its width at the back. */
  readonly width: number;
  /** How far down the flank it reaches, 0 to 1. */
  readonly length: number;
  /** How far its tip leans sideways, as a fraction of the flank's depth. */
  readonly lean: number;
  /** Where along its length it splits in two, or null if it doesn't. */
  readonly fork: number | null;
  /** How many spots it breaks into past its tip: 0, 1 or 2. */
  readonly spots: number;
}

export interface Pattern {
  readonly seed: number;
  readonly coat: Coat;
  readonly stripes: readonly Stripe[];
}

/** A small, fast seeded random number generator (mulberry32): numbers in [0, 1). */
export function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** How many stripes a flank gets by default. The dossier gives no count, so this is a drawing choice. */
export const STRIPES = 12;

/**
 * A tiger's stripe pattern from its seed. `count` stripes are spread along the flank with some
 * jitter; each gets its own width, length, lean, and maybe a fork or spots. A pseudomelanistic
 * coat has the same layout with stripes so wide they merge.
 */
export function pattern(seed: number, coat: Coat = "orange", count = STRIPES): Pattern {
  if (!Number.isInteger(count) || count < 1) throw new Error(`a pattern needs a whole number of stripes, not ${count}`);
  const r = random(seed);
  const wide = coat === "pseudomelanistic" ? 3.2 : 1;
  const stripes: Stripe[] = [];
  for (let i = 0; i < count; i++) {
    const x = (i + 0.5 + (r() - 0.5) * 0.7) / count;
    const width = ((0.25 + r() * 0.25) / count) * wide;
    const length = 0.4 + r() * 0.6;
    const lean = (r() - 0.5) * 0.5;
    const fork = r() < 0.3 ? 0.3 + r() * 0.4 : null;
    const s = r();
    const spots = s < 0.15 ? 2 : s < 0.35 ? 1 : 0;
    stripes.push({ x: round(x), width: round(width), length: round(length), lean: round(lean), fork: fork === null ? null : round(fork), spots });
  }
  return { seed, coat, stripes };
}

const round = (v: number, places = 3): number => Math.round(v * 10 ** places) / 10 ** places;

/** The part of the drawing the stripes cover: the flank, in drawing units. */
export interface Flank {
  readonly left: number;
  readonly right: number;
  /** The back line, where stripes start. */
  readonly top: number;
  /** How far down a full-length stripe reaches. */
  readonly depth: number;
}

/** What draws a pattern: tapered stripe and fork outlines as SVG path data, and spots as ellipses. */
export interface Shapes {
  readonly paths: readonly string[];
  /** [cx, cy, rx, ry] for each spot. */
  readonly spots: readonly (readonly [number, number, number, number])[];
}

const n = (v: number): string => String(Math.round(v * 10) / 10);

/** A stripe tapering from `w` wide at (x, y) to a point at (tx, ty), bowed like a brush stroke. */
function taper(x: number, y: number, w: number, tx: number, ty: number): string {
  const my = (y + ty) / 2;
  const mx = x + (tx - x) * 0.6;
  return `M${n(x - w / 2)} ${n(y)}Q${n(mx - w / 3)} ${n(my)} ${n(tx)} ${n(ty)}Q${n(mx + w / 3)} ${n(my)} ${n(x + w / 2)} ${n(y)}Z`;
}

/** The shapes that draw `p` on flank `f`. Every point stays within the flank, give or take a stripe's width. */
export function shapes(p: Pattern, f: Flank): Shapes {
  const span = f.right - f.left;
  const paths: string[] = [];
  const spots: [number, number, number, number][] = [];
  for (const s of p.stripes) {
    const x = f.left + s.x * span;
    const w = s.width * span;
    const len = s.length * f.depth;
    const tx = x + s.lean * f.depth;
    const ty = f.top + len;
    paths.push(taper(x, f.top, w, tx, ty));
    if (s.fork !== null) {
      // The branch leaves the stripe at `fork` along it and leans the other way.
      const fx = x + (tx - x) * s.fork;
      const fy = f.top + len * s.fork;
      const back = s.lean >= 0 ? -1 : 1;
      const blen = len * (1 - s.fork) * 0.8;
      paths.push(taper(fx, fy, w * 0.55, fx + back * blen * 0.45, fy + blen));
    }
    for (let k = 0; k < s.spots; k++) {
      const gap = (k + 1) * Math.max(w, 2) * 1.6;
      const room = f.top + f.depth - ty;
      if (gap > room) break;
      const r = Math.max(w * 0.45, 0.8);
      spots.push([round(tx + s.lean * gap, 1), round(ty + gap, 1), round(r, 1), round(r * 1.4, 1)]);
    }
  }
  return { paths, spots };
}

/** One photo in a matching task: which tiger it shows, and the part of the flank in view, 0 to 1. */
export interface Photo {
  readonly tiger: number;
  readonly from: number;
  readonly to: number;
}

/**
 * Checks a matching task: at least two tigers, no seed twice (two tigers mustn't look the same),
 * at least one photo, and each photo shows a real tiger and a real part of the flank.
 */
export function checkMatchTask(seeds: readonly number[], photos: readonly Photo[]): void {
  if (seeds.length < 2) throw new Error("a matching task needs at least two tigers");
  if (new Set(seeds).size !== seeds.length) throw new Error("two tigers share a seed, so they would look the same");
  if (photos.length === 0) throw new Error("a matching task needs a photo");
  for (const ph of photos) {
    if (!Number.isInteger(ph.tiger) || ph.tiger < 0 || ph.tiger >= seeds.length) throw new Error(`photo of tiger ${ph.tiger}: there is no such tiger`);
    if (!(ph.from >= 0 && ph.to <= 1 && ph.to - ph.from >= 0.2)) throw new Error(`photo [${ph.from}, ${ph.to}] must show at least a fifth of the flank`);
  }
}

/** For each photo, whether the learner's pick (a tiger's index, or null) is the tiger it shows. */
export const judgeMatch = (photos: readonly Photo[], picks: readonly (number | null)[]): boolean[] => photos.map((ph, i) => picks[i] === ph.tiger);
