// Lesson 14, "Counting tigers, and saving them": its content (steps, the national counts, the
// capture–recapture check and survey model, the recovery check and population model). Pure data
// and functions; lesson14-view.ts draws them. Facts are in docs/research/conservation.md. Every
// model setting no source gives is named as made up, on screen and here.

import { citedKeys } from "./cite.ts";
import type { EstimateSpec } from "./estimate.ts";
import { random } from "./stripes.ts";

export const TITLE = "14. Counting tigers, and saving them";

/** What the live view shows at a step. */
export type View = "junu" | "redlist" | "camera" | "estimate" | "counts" | "split" | "threats" | "recover" | "fifteen" | "doubling" | "protection" | "survey" | "model";

export interface Step {
  /** Paragraphs; `*x*` is italic, `**x**` a new term, `[@Key]` a citation. */
  readonly text: readonly string[];
  readonly view: View;
}

// ---- The Red List ----

/** The Red List's categories, least to most threatened [@Goodrich2022]. */
export const CATEGORIES: readonly string[] = ["Least Concern", "Near Threatened", "Vulnerable", "Endangered", "Critically Endangered", "Extinct in the Wild", "Extinct"];
export const TIGER_CATEGORY = "Endangered";

// ---- The counts ----

/** A count: its year, best estimate, and range where the source gives one. */
export interface Count {
  readonly year: number;
  readonly n: number;
  readonly lo?: number;
  readonly hi?: number;
}

/** India's estimates, every four years; the low end is the tigers actually photographed [@NTCA2023]. */
export const INDIA: readonly Count[] = [
  { year: 2006, n: 1411, lo: 1165, hi: 1657 },
  { year: 2010, n: 1706, lo: 1507, hi: 1896 },
  { year: 2014, n: 2226, lo: 1945, hi: 2491 },
  { year: 2018, n: 2967, lo: 2603, hi: 3346 },
  { year: 2022, n: 3682, lo: 3167, hi: 3925 },
];

/** Nepal's counts, with IUCN's years (some reports date the first two 2010 and 2014) [@IUCN2026Nepal]. */
export const NEPAL: readonly Count[] = [
  { year: 2009, n: 121 },
  { year: 2013, n: 198 },
  { year: 2018, n: 235 },
  { year: 2022, n: 355 },
  { year: 2026, n: 429 },
];

/** The world's wild tigers, not counting cubs: the Red List's first rigorous estimate [@Goodrich2022]. */
export const WORLD = { lo: 3726, hi: 5578 } as const;

/** Each count as a multiple of the first. */
export const growth = (counts: readonly Count[]): number[] => counts.map((c) => c.n / counts[0]!.n);

// ---- Capture–recapture ----

/**
 * The simplest capture–recapture estimate (Lincoln–Petersen): if `m` of the `n2` tigers in the
 * second session were already photographed in the first, the first caught about m/n2 of all
 * tigers, so there are about n1 × n2 / m. Null when no tiger was photographed twice. The course's
 * own arithmetic: real surveys use more sessions and statistical models [@Karanth1995].
 */
export function estimatePopulation(n1: number, n2: number, m: number): number | null {
  return m > 0 ? (n1 * n2) / m : null;
}

export const CHECK_SESSIONS = { n1: 20, n2: 15, m: 6 } as const;

export const CHECK: EstimateSpec = {
  min: 10,
  max: 150,
  answer: estimatePopulation(CHECK_SESSIONS.n1, CHECK_SESSIONS.n2, CHECK_SESSIONS.m)!, // 50
  scale: "linear",
  steps: 28, // stops of 5 tigers
  close: 0.05, // 45 to 55 counts as close
};

export const CHECK_QUESTION = `Cameras in a reserve photograph **${CHECK_SESSIONS.n1}** different tigers in the first session. In the second session they photograph **${CHECK_SESSIONS.n2}**, and their stripes show that **${CHECK_SESSIONS.m}** of them were photographed in the first. About how many tigers live there?`;

export const CHECK_EXPLAIN = `${CHECK_SESSIONS.m} of the second session's ${CHECK_SESSIONS.n2} tigers had been seen before: 6 in 15, or 40%. So the first session probably photographed about 40% of all the tigers, and its ${CHECK_SESSIONS.n1} are 40% of about ${CHECK_SESSIONS.n1} × ${CHECK_SESSIONS.n2} ÷ ${CHECK_SESSIONS.m} = 50. This is the simplest version of capture–recapture, and the arithmetic is this course's; real surveys run more sessions and use statistical models [@Karanth1995].`;

// ---- The survey sandbox: a model reserve ----

/** The model reserve, in grid squares. A drawing, not a real place or scale. */
export const AREA = { w: 12, h: 8 } as const;
/** Made-up settings: how many tigers a survey's reserve holds (seeded), and how photographable they are. */
export const TIGERS_MIN = 20;
export const TIGERS_MAX = 40;
/** The chance one camera photographs a tiger living right beside it in one session (made up). */
export const P_NEAR = 0.5;
/** How fast that chance falls with distance, in squares (made up). */
export const REACH = 1.6;

export type Layout = "spread" | "bunched";
export const CAMERA_COUNTS: readonly number[] = [4, 9, 16];

export type Point = readonly [number, number];

/** Where the cameras stand: a square grid of `count`, spread over the reserve or bunched in its middle. */
export function cameras(count: number, layout: Layout): Point[] {
  const side = Math.round(Math.sqrt(count));
  const out: Point[] = [];
  for (let i = 0; i < side; i++)
    for (let j = 0; j < side; j++) {
      if (layout === "spread") out.push([((i + 0.5) * AREA.w) / side, ((j + 0.5) * AREA.h) / side]);
      else out.push([AREA.w / 2 + (i - (side - 1) / 2), AREA.h / 2 + (j - (side - 1) / 2)]);
    }
  return out;
}

/** The chance a tiger living at `at` is photographed in one session by any of `cams`. */
export function photoChance(at: Point, cams: readonly Point[]): number {
  let missed = 1;
  for (const [x, y] of cams) {
    const d2 = (x - at[0]) ** 2 + (y - at[1]) ** 2;
    missed *= 1 - P_NEAR * Math.exp(-d2 / (2 * REACH * REACH));
  }
  return 1 - missed;
}

/** The reserve's tigers for a survey: where each lives, seeded so a survey can be rerun. */
export function reserve(seed: number): Point[] {
  const rand = random(seed);
  const n = TIGERS_MIN + Math.floor(rand() * (TIGERS_MAX - TIGERS_MIN + 1));
  return Array.from({ length: n }, () => [rand() * AREA.w, rand() * AREA.h] as const);
}

/** The tigers (by index) photographed in session `session` (1 or 2). */
export function session(seed: number, tigers: readonly Point[], cams: readonly Point[], which: 1 | 2): number[] {
  const rand = random(seed * 31 + which);
  return tigers.flatMap((t, i) => (rand() < photoChance(t, cams) ? [i] : []));
}

export interface SurveyResult {
  readonly n1: number;
  readonly n2: number;
  readonly m: number;
  readonly estimate: number | null;
}

export function surveyResult(first: readonly number[], second: readonly number[]): SurveyResult {
  const m = second.filter((i) => first.includes(i)).length;
  return { n1: first.length, n2: second.length, m, estimate: estimatePopulation(first.length, second.length, m) };
}

// ---- The recovery check and the population model ----

export type Prey = "scarce" | "some" | "plentiful";
export const PREYS: readonly Prey[] = ["scarce", "some", "plentiful"];

/**
 * Made-up model settings. Births: new tigers a year per tiger, when there is room; more prey,
 * more young raised. Room: how many tigers the prey can feed. Only the pattern follows the
 * study: with plentiful prey, a population stops recovering once deaths reach about 15% a year
 * [@Chapron2008]; the plentiful birth rate is set to 15% to show that line.
 */
export const BIRTHS: Readonly<Record<Prey, number>> = { scarce: 0.08, some: 0.12, plentiful: 0.15 };
export const ROOM: Readonly<Record<Prey, number>> = { scarce: 40, some: 80, plentiful: 120 };
export const START = 20;
export const YEARS = 40;
/** Fewer than this and the model population is gone: no pair left to breed. */
export const GONE = 2;

/** The model population each year for `years` years, from `start`, losing `deaths` (a share) a year. */
export function population(deaths: number, prey: Prey, start = START, years = YEARS): number[] {
  const out = [start];
  for (let y = 0; y < years; y++) {
    const n = out[out.length - 1]!;
    const next = n < GONE ? 0 : n + BIRTHS[prey] * n * (1 - n / ROOM[prey]) - deaths * n;
    out.push(Math.max(0, next));
  }
  return out;
}

/** Whether the model population grows from a few: only while births outpace deaths. */
export const recovers = (deaths: number, prey: Prey): boolean => deaths < BIRTHS[prey] - 1e-9;

/** Where it levels off when it recovers: the room the prey gives, less what the deaths take. */
export const levelsAt = (deaths: number, prey: Prey): number => Math.max(0, ROOM[prey] * (1 - deaths / BIRTHS[prey]));

export const RECOVER_QUESTION = "A tiger population has been cut down by poaching. Rangers restore its prey to plenty, but every year **20%** of its tigers still die. Does it recover?";
export const RECOVER_CHOICES = ["It recovers: plenty of prey means plenty of cubs", "It keeps shrinking"] as const;
export const RECOVER_ANSWER = 1;
export const RECOVER_EXPLAIN =
  "It keeps shrinking. A study modelling tiger populations found that if deaths reach about 15% a year, restoring prey is not enough; tigers breed late and wait long between litters, so they can't make up the losses [@Chapron2008].";

// ---- Protection ----

export interface Bar {
  readonly label: string;
  readonly value: number;
  readonly note: string;
  readonly bound?: boolean;
}

/** Shares from the Red List [@Goodrich2022]; "over 60%" is drawn at its bound and says so. */
export const PROTECTION: readonly Bar[] = [
  { label: "Tiger landscapes legally protected", value: 21, note: "21%" },
  { label: "…strictly protected", value: 9, note: "about 9%" },
  { label: "Tiger populations probably in protected areas", value: 60, note: "over 60%", bound: true },
];

// ---- The steps ----

export const STEPS: readonly Step[] = [
  {
    view: "junu",
    text: [
      "Junu is twelve, an old tigress now. Her daughter holds part of what was once her territory, and Junu keeps to the rest.",
      "This year is a count year. Cameras strapped to trees along the trails photograph every tiger that passes, and Junu walks past one. Her stripes say who she is: no other tiger has her pattern.",
    ],
  },
  {
    view: "redlist",
    text: [
      "The **IUCN Red List** is the world's reference list of how close species are to extinction. Its categories run from Least Concern to Extinct [@Goodrich2022].",
      "The tiger is **Endangered**, as it has been in every assessment since 1986. The latest, dated December 2021, calls the choice between Endangered and Vulnerable \"marginal\": depending on which 1990s estimate it compares with, tigers fell by 22–68% over three generations (about 21–30 years). It lists the trend as **decreasing** [@Goodrich2022].",
    ],
  },
  {
    view: "camera",
    text: [
      "How do you count an animal that hides? Lesson 3 showed that every tiger's stripes are its own. Cameras photograph passing tigers, and each photo is matched to a tiger by its stripes [@Karanth1995].",
      "This is **capture–recapture**: a camera \"captures\" a tiger, and a later photo of the same tiger \"recaptures\" it. Run the cameras twice. If most tigers in the second session were already seen in the first, the first must have caught most of them; if few were, many were missed [@Karanth1995].",
    ],
  },
  {
    view: "estimate",
    text: ["Try it before the numbers are given: estimate a population from two sessions."],
  },
  {
    view: "counts",
    text: [
      "Counted this way, with surveys of where tigers are found, the Red List puts the world's wild tigers at **3,726–5,578**, not counting cubs, in ten countries. It calls this the first reasonably rigorous global estimate [@Goodrich2022].",
      "India counts its tigers every four years: about 1,411 in 2006 and 3,682 in 2022. Each range's low end is the number of different tigers actually photographed [@NTCA2023]. India puts its share of the world's wild tigers at about three-quarters [@NTCA2023].",
      "Nepal counts every four years too: about 120 around 2010, 355 in 2022 and 429 in 2026. Chitwan, Junu's park, has 145 [@IUCN2026Nepal].",
    ],
  },
  {
    view: "split",
    text: [
      "Yet the Red List calls the world's trend decreasing. Two things explain it. First, a higher count is not always more tigers: the global estimate is higher than earlier ones partly because counting got better, and the Red List warns it **cannot be read as an increase** [@Goodrich2022].",
      "Second, the world's trend hides a split. India's and Nepal's rises are real counts, but tigers are gone from Vietnam, Cambodia and Laos, and appear to be in steep decline in Malaysia [@Goodrich2022]. In Thailand's largest population, intensive patrols began in 2005; from 2006 to 2012 the tigers there swung between 35 and 58, at densities 82–90% below comparable Indian sites. Low-density populations may recover more slowly than plans assume [@Duangchantrasiri2016].",
    ],
  },
  {
    view: "threats",
    text: [
      "The Red List ranks the threats [@Goodrich2022]. First, **hunting** of tigers and of their prey: the main cause of decline since 1991, and the only threat it scores as high impact. In South-East Asia, snares and poison have emptied forests of tigers and prey alike.",
      "Second, **habitat loss**: forest cut into farms and plantations, and split by roads and railways, leaving small populations that grow inbred. Third, **conflict** with people, often assumed important but never recorded systematically. Fourth, **disease**, little studied [@Goodrich2022].",
    ],
  },
  {
    view: "recover",
    text: ["Before the next step: if prey is restored but tigers keep dying, does a population come back?"],
  },
  {
    view: "fifteen",
    text: [
      "A study modelling tiger populations found that tigers need larger populations to persist than leopards or cougars, are quite sensitive to modest rises in deaths, and recover more slowly: they breed later and wait longer between litters [@Chapron2008].",
      "Its conclusion: plenty of prey is essential, but if deaths reach about **15% a year**, restoring prey will not be enough. The most urgent step is to stop people killing tigers, above all the resident breeding females [@Chapron2008].",
      "The curves beside this are this course's model, not the study's: its birth rates are made up, set so that with plentiful prey the line falls at 15%.",
    ],
  },
  {
    view: "doubling",
    text: [
      "In 2010, at a Tiger Summit in St Petersburg, the 13 countries where tigers live adopted the Global Tiger Recovery Program, aiming to **double wild tiger numbers by 2022**: protect habitat, end poaching and trade, work across borders, involve local communities, and return tigers to their former range [@Goodrich2022].",
      "India reports that it reached the goal before 2022 [@NTCA2023]; Nepal's count more than tripled [@IUCN2026Nepal]. The chart shows each count as a multiple of the country's first.",
    ],
  },
  {
    view: "protection",
    text: [
      "**Protection** matters most, and there is too little of it: only 21% of tiger landscapes are legally protected, about 9% strictly, and many protected areas lack money and enforcement. Yet over 60% of tiger populations are probably in them [@Goodrich2022].",
      "Most land tigers could use lies outside: **corridors** of forest between reserves, working forests, and land shared with people. Tigers have been returned to several protected areas in India and Russia, and returns to Kazakhstan and Cambodia are planned [@Goodrich2022]. 226 landscapes still hold habitat without tigers [@Sanderson2023].",
    ],
  },
  {
    view: "survey",
    text: [
      "The first sandbox: a camera-trap survey of a model reserve. Choose how many cameras and where they stand, run two sessions, and see the estimate. Then show how many tigers there really are.",
      "Try a few cameras bunched in the middle. A tiger that lives far from every camera is never photographed, so the estimate counts only the tigers the cameras can reach. Real surveys spread cameras so that every tiger has some chance [@Karanth1995].",
    ],
  },
  {
    view: "model",
    text: [
      "The second sandbox: a model population of 20 tigers. Set how much prey there is and what share of tigers die each year, and see whether it recovers over 40 years.",
      "Find where it stops recovering at each level of prey. With plentiful prey, it is the study's 15% [@Chapron2008]; with less prey, the model's line falls lower. The model's numbers are made up; only that pattern is the study's.",
    ],
  },
];

/** Every source the lesson cites, in order of first appearance: the numbering on screen. */
export function lessonSources(): string[] {
  return citedKeys([...STEPS.flatMap((s) => s.text), CHECK_EXPLAIN, RECOVER_EXPLAIN]);
}
