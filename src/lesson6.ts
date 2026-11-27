// Lesson 6, "A territory of her own": its content (steps, the map of neighbouring ranges, the
// scent-marking model, the odour field and the place-your-marks check). Pure data and
// functions; lesson6-view.ts draws them. Facts are in docs/research/behaviour.md and
// docs/research/life-cycle.md. The map is a drawing and the marking chances are made up: the
// study gives the pattern (more at edges, most where routes cross them), not amounts.

import { citedKeys } from "./cite.ts";
import { random } from "./stripes.ts";

export const TITLE = "6. A territory of her own";

/** What the live view shows at a step. */
export type View = "junu" | "ranges" | "marks" | "check" | "reveal" | "timing" | "odour" | "sandbox";

export interface Step {
  /** Paragraphs; `*x*` is italic, `**x**` a new term, `[@Key]` a citation. */
  readonly text: readonly string[];
  readonly view: View;
}

// ---- The map: a drawing, not real data ----

/** A cell of the map: column, row. */
export type Cell = readonly [number, number];

/**
 * The females' ranges, one letter per cell: A is Junu's mother, J is Junu, B a neighbouring
 * female, "." no tiger's range here. Females' ranges don't overlap [@Goodrich2022].
 */
export const RANGES: readonly string[] = [
  "..................",
  ".AAAAAAJJJJJ.BBBB.",
  ".AAAAAAJJJJJJBBBB.",
  ".AAAAAJJJJJJJBBBB.",
  ".AAAAAJJJJJJBBBBB.",
  ".AAAAJJJJJJJBBBBB.",
  ".AAAAAJJJJJJBBBBB.",
  ".AAAAAAJJJJJBBBBB.",
  ".AAAAAAJJJJBBBBBB.",
  "..AAAAA.JJJBBBBB..",
  "..................",
];

export const COLS = RANGES[0]!.length;
export const ROWS = RANGES.length;

/** A male's range, which overlaps two females' (a male's typically overlaps 1–3 [@Goodrich2022]): columns and rows, inclusive. */
export const MALE_BOX = { c0: 3, c1: 10, r0: 2, r1: 8 } as const;

/** The main travel routes, each a straight run of cells. */
export const PATHS: readonly (readonly Cell[])[] = [
  Array.from({ length: COLS }, (_, c) => [c, 5] as const),
  Array.from({ length: ROWS }, (_, r) => [9, r] as const),
  Array.from({ length: ROWS }, (_, r) => [14, r] as const),
];

export type Tiger = "mother" | "junu" | "neighbour" | "male";

export const TIGERS: readonly Tiger[] = ["mother", "junu", "neighbour", "male"];

export const NAMES: Readonly<Record<Tiger, string>> = {
  mother: "Junu's mother",
  junu: "Junu",
  neighbour: "A neighbouring female",
  male: "A male",
};

const LETTER: Readonly<Record<Exclude<Tiger, "male">, string>> = { mother: "A", junu: "J", neighbour: "B" };

/** The flat index of a cell. */
export const at = (c: number, r: number): number => r * COLS + c;

const onMap = (c: number, r: number): boolean => c >= 0 && c < COLS && r >= 0 && r < ROWS;

/** Whether cell (c, r) is in `t`'s range. */
export function has(t: Tiger, c: number, r: number): boolean {
  if (!onMap(c, r)) return false;
  if (t === "male") return c >= MALE_BOX.c0 && c <= MALE_BOX.c1 && r >= MALE_BOX.r0 && r <= MALE_BOX.r1;
  return RANGES[r]![c] === LETTER[t];
}

const PATH_CELLS = new Set(PATHS.flatMap((p) => p.map(([c, r]) => at(c, r))));

export const isPath = (c: number, r: number): boolean => PATH_CELLS.has(at(c, r));

/** Where a cell sits in a tiger's range: inside, at an edge, or at an edge where a route crosses it. */
export type Zone = "inside" | "edge" | "crossing";

export const ZONES: readonly Zone[] = ["inside", "edge", "crossing"];

const NEXT: readonly Cell[] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

/** The zone of cell (c, r) in `t`'s range, or null when the cell isn't in it. */
export function zone(t: Tiger, c: number, r: number): Zone | null {
  if (!has(t, c, r)) return null;
  const edge = NEXT.some(([dc, dr]) => !has(t, c + dc, r + dr));
  return !edge ? "inside" : isPath(c, r) ? "crossing" : "edge";
}

// ---- The marking model ----

/**
 * The chance of leaving a mark on a step into each zone. Made up: the study found more marking
 * at edges and most where main routes cross them, by marking more often there [@Smith1989],
 * but gives no amounts.
 */
export const MARK_CHANCE: Readonly<Record<Zone, number>> = { inside: 0.03, edge: 0.25, crossing: 0.7 };

export interface Walker {
  readonly tiger: Tiger;
  pos: Cell;
  /** Steps spent in each cell. */
  readonly steps: number[];
  /** Marks left in each cell. */
  readonly marks: number[];
  readonly rand: () => number;
}

/** Where each tiger starts a walk: a cell inside its range. */
export const HOME: Readonly<Record<Tiger, Cell>> = { mother: [3, 3], junu: [8, 4], neighbour: [15, 7], male: [6, 6] };

export function walker(tiger: Tiger, seed: number): Walker {
  return { tiger, pos: HOME[tiger], steps: new Array<number>(COLS * ROWS).fill(0), marks: new Array<number>(COLS * ROWS).fill(0), rand: random(seed) };
}

export type Dir = 0 | 1 | 2 | 3; // north, east, south, west

/**
 * One step: the tiger moves one cell in `dir` if that cell is in its range, else stays put. The
 * step counts as time spent where it ends, and it may leave a mark there. Returns whether it moved.
 */
export function stepTo(w: Walker, dir: Dir): boolean {
  const [dc, dr] = NEXT[dir]!;
  const c = w.pos[0] + dc;
  const r = w.pos[1] + dr;
  const moved = has(w.tiger, c, r);
  if (moved) w.pos = [c, r];
  const i = at(w.pos[0], w.pos[1]);
  w.steps[i]!++;
  if (w.rand() < MARK_CHANCE[zone(w.tiger, w.pos[0], w.pos[1])!]) w.marks[i]!++;
  return moved;
}

/**
 * `n` steps in random directions. A blocked step stays put, so in the long run the tiger
 * spends the same time in every cell of its range: edges get no extra time.
 */
export function wander(w: Walker, n: number): void {
  for (let k = 0; k < n; k++) stepTo(w, Math.floor(w.rand() * 4) as Dir);
}

/** Shares (0 to 1) of `counts` in each zone of `t`'s range. All zero when the counts are. */
export function byZone(t: Tiger, counts: readonly number[]): Record<Zone, number> {
  const sum = { inside: 0, edge: 0, crossing: 0 };
  let all = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const z = zone(t, c, r);
      const n = counts[at(c, r)]!;
      if (z && n) {
        sum[z] += n;
        all += n;
      }
    }
  if (all) for (const z of ZONES) sum[z] /= all;
  return sum;
}

/** How many cells of `t`'s range are in each zone. */
export function zoneSizes(t: Tiger): Record<Zone, number> {
  const n = { inside: 0, edge: 0, crossing: 0 };
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const z = zone(t, c, r);
    if (z) n[z]++;
  }
  return n;
}

/** The other three tigers' marks, from a long seeded walk each: the same every visit. */
export const OTHERS_STEPS = 500;
export function othersMarks(): number[] {
  const out = new Array<number>(COLS * ROWS).fill(0);
  TIGERS.filter((t) => t !== "junu").forEach((t, k) => {
    const w = walker(t, 101 + k);
    wander(w, OTHERS_STEPS);
    w.marks.forEach((m, i) => (out[i]! += m));
  });
  return out;
}

// ---- The odour field ----

/** Levels the field is drawn in, 0 (none) to this. */
export const FIELD_LEVELS = 4;

/**
 * The odour field: each mark's smell spread over nearby cells, fading with distance (a
 * Gaussian, one cell wide), then put in levels 0 to FIELD_LEVELS against the strongest cell.
 * A drawing of Smith et al.'s idea [@Smith1989], not a measured smell.
 */
export function odourField(marks: readonly number[]): number[] {
  const raw = new Array<number>(COLS * ROWS).fill(0);
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const m = marks[at(c, r)]!;
      if (!m) continue;
      for (let dr = -2; dr <= 2; dr++)
        for (let dc = -2; dc <= 2; dc++)
          if (onMap(c + dc, r + dr)) raw[at(c + dc, r + dr)]! += m * Math.exp(-(dc * dc + dr * dr) / 2);
    }
  const top = Math.max(...raw);
  return raw.map((v) => (top ? Math.min(FIELD_LEVELS, Math.floor((v / top) * FIELD_LEVELS + 0.5)) : 0));
}

/** The five ways tigers mark, most common first where the study says so [@Smith1989]. */
export const MARK_WAYS: readonly string[] = [
  "Spraying urine on trees and bushes",
  "Scraping the ground, and leaving urine, droppings or a scent from glands under the tail in the scrape",
  "Clawing trees",
  "Rubbing their cheeks on things",
  "Flattening plants",
];

// ---- The check: leave Junu's marks ----

export const CHECK_MARKS = 5;

/** Places or removes a check mark on cell `i`: only in Junu's range, at most CHECK_MARKS. Returns the new list. */
export function toggleMark(placed: readonly number[], i: number): number[] {
  if (placed.includes(i)) return placed.filter((p) => p !== i);
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  if (!has("junu", c, r) || placed.length >= CHECK_MARKS) return [...placed];
  return [...placed, i];
}

export const JUDGE_TEXT: Readonly<Record<Zone, string>> = {
  crossing: "✓ at an edge where a route crosses it: where tigers marked most",
  edge: "✓ at an edge: tigers marked more here than inside",
  inside: "✗ inside her range: tigers marked least here",
};

/** Each placed mark's zone in Junu's range, in the order placed. */
export const judgeMarks = (placed: readonly number[]): Zone[] => placed.map((i) => zone("junu", i % COLS, Math.floor(i / COLS))!);

export const CHECK_EXPLAIN =
  "Tigers mark more at the edges of their territories than inside them, and most of all where main travel routes cross a boundary [@Smith1989]. The signals tell where one tiger's range ends and another's begins [@SINZ].";

// ---- The timing view: two females at a shared boundary ----

/** Days each female visits the shared boundary, in a 30-day drawing of the pattern (not real data). */
export const TIMING_DAYS = 30;
export const VISITS: Readonly<Record<"mother" | "junu", readonly number[]>> = {
  mother: [2, 8, 14, 21, 27],
  junu: [5, 11, 17, 24, 29],
};

// ---- The steps ----

export const CHECK_STEP = 3;

export const STEPS: readonly Step[] = [
  {
    view: "junu",
    text: [
      "Junu is two years old, and she is leaving her mother. In Chitwan, young tigers left home at 19 to 28 months old [@Smith1993].",
      "Daughters stay close; sons go far. Of four young females followed in Chitwan, three settled next to their mothers, and twice the mother shifted over, handing much of her old range to her daughter [@Smith1993]. That is Junu's story: she settles next door, on ground that was her mother's.",
    ],
  },
  {
    view: "ranges",
    text: [
      "The area an animal uses in its normal life is its **home range**. A **territory** is a home range, or part of one, that the animal keeps others of its own sex out of [@Smith1989; @Liu2024].",
      "Adult tigers are **solitary**: they live alone, apart from a mother with her cubs and a pair together to mate [@SINZ]. Adult females' ranges seldom overlap, while a male's typically overlaps those of one to three females [@Goodrich2022]. Size depends on prey: females in Chitwan averaged about 20 km², in the Russian Far East about 400 km² [@Goodrich2022].",
    ],
  },
  {
    view: "marks",
    text: [
      "Solitary doesn't mean out of touch. Tigers call, and they leave signals behind [@SINZ]. Watching tigers in Chitwan for four years, researchers saw five ways of **scent marking**, leaving smells or scratches for other tigers to find; spraying and scraping were the most common [@Smith1989].",
      "A mark lasts: the fat in sprayed fluid lets its smell out slowly [@Burger2008]. The dotted lines on the map are the main routes tigers travel.",
    ],
  },
  {
    view: "check",
    text: [
      "Junu is new to her range, and a tiger settling in marks more than at any other time [@Smith1989].",
      "Your turn: Junu has five marks to leave. Put them where you think she would mark most, then lock them in.",
    ],
  },
  {
    view: "reveal",
    text: [
      "Tigers mark more at the edges of their territories than inside them, and most of all where main travel routes cross a boundary [@Smith1989].",
      "They don't do it by spending more time at the edges, but by marking more often when they are there. Neighbours seemed to mark in answer to each other [@Smith1989].",
    ],
  },
  {
    view: "timing",
    text: [
      "In western Thailand, GPS collars on five tigers showed two neighbouring females whose ranges touched along a shared boundary, but who rarely used it at the same time. Visiting the edge at different times lets females keep a boundary without fighting [@Liu2024].",
      "Neighbouring males avoid each other too, until a female comes into heat near their boundary [@Liu2024]. Marks carry that news: females marked heavily just before coming into heat, and males marked more while a female was in heat [@Smith1989].",
    ],
  },
  {
    view: "odour",
    text: [
      "Why mark at all? Smith and his colleagues proposed that the marks add up to an **odour field**: the smell of other tigers, which tells a tiger how likely it is to meet one [@Smith1989].",
      "A tiger can then weigh the risk of a meeting against the value of using the place [@Smith1989]. It is an explanation that fits what they saw, not a measurement. The map shades the smell of the other three tigers' marks, as Junu would meet it.",
    ],
  },
  {
    view: "sandbox",
    text: [
      "The sandbox: walk Junu through her range, a step at a time or many at once, and watch her marks build up. In this model she marks rarely inside, more often at an edge and most where a route crosses it, the pattern the study found; the chances themselves are made up.",
      "Turn on the odour field to see where a meeting with another tiger is likely. The table compares where she spends her steps with where she leaves her marks.",
    ],
  },
];

/** Every source the lesson cites, in order of first appearance: the numbering on screen. */
export function lessonSources(): string[] {
  return [...new Set([...citedKeys([...STEPS.flatMap((s) => s.text), CHECK_EXPLAIN]), "Goodrich2022"])];
}
