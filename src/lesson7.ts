// Lesson 7, "A life: mating, cubs, leaving home": its content (steps, the breeding cycle, the
// growing-up order check, the stages time line, the leaving-home map, the cubs-at-two check and
// the cohort model). Pure data and functions; lesson7-view.ts draws them. Facts are in
// docs/research/life-cycle.md. The map is a drawing; the cohort model's survival chances are the
// studies' own, and the one setting no study gives (half the cubs are daughters) is named.

import { citedKeys } from "./cite.ts";
import type { EstimateSpec } from "./estimate.ts";
import { random } from "./stripes.ts";

export const TITLE = "7. A life: mating, cubs, leaving home";

/** What the live view shows at a step. */
export type View = "junu" | "mating" | "cycle" | "order" | "stages" | "map" | "estimate" | "survival" | "sandbox";

export interface Step {
  /** Paragraphs; `*x*` is italic, `**x**` a new term, `[@Key]` a citation. */
  readonly text: readonly string[];
  readonly view: View;
}

// ---- Mating: the months ----

export const MONTHS: readonly string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Months (0 = January) when most mating happens: November to April [@SINZ]. */
export const MATING_PEAK: readonly number[] = [10, 11, 0, 1, 2, 3];

// ---- One breeding cycle, in months from mating ----

/** Pregnancy: about 100 days [@SINZ], about 103 [@CATSG]; in months (30.4 days each). */
export const PREGNANCY_MONTHS = 103 / 30.4;

/** Cubs stay with their mother until they can hunt well, 18–24 months old [@SINZ]. */
export const WITH_MOTHER: readonly [number, number] = [18, 24];

/** Births average 20–24 months apart [@CATSG]; 21.4 in the Russian Far East [@Kerley2003]. */
export const BIRTH_GAP: readonly [number, number] = [20, 24];
export const BIRTH_GAP_RUSSIA = 21.4;

// ---- The growing-up order check ----

/** The stages of a young female's life, in their right order [@Smith1993; @SINZ; @CATSG]. */
export const STAGES: readonly string[] = [
  "Travels with her mother, learning to hunt",
  "Lives on her own in her mother's area, once her mother has a new litter",
  "Leaves her mother's area for good",
  "Settles in a territory of her own",
  "Has her first litter",
];

/** The order the stages are shown in first: nothing in its right place. */
export const STAGES_START: readonly number[] = [2, 4, 3, 0, 1];

export const ORDER_EXPLAIN =
  "Cubs begin to travel with their mother at about two months old [@Smith1993] and stay with her until they can hunt well, at 18–24 months [@SINZ]. In Chitwan, they became semi-independent when their mother's next litter was born, but stayed in her area for a while; they left at 19–28 months [@Smith1993]. A daughter settles, and in Chitwan had her first litter at 3.4 years on average [@CATSG].";

// ---- The stages time line, in months of age ----

export interface Span {
  readonly label: string;
  /** Months of age: a span's ends, or a single average as [x, x]. */
  readonly from: number;
  readonly to: number;
  /** An average marked inside the span, when the source gives one. */
  readonly mean?: number;
  readonly keys: readonly string[];
}

export const AGE_MAX = 84; // seven years

export const SPANS: readonly Span[] = [
  { label: "travels with her mother", from: 2, to: 24, keys: ["Smith1993", "SINZ"] },
  { label: "independent", from: 18, to: 28, keys: ["CATSG"] },
  { label: "leaves her mother's area (Chitwan)", from: 19, to: 28, keys: ["Smith1993"] },
  { label: "female's first litter", from: 36, to: 48, mean: 3.4 * 12, keys: ["SINZ", "CATSG"] },
  { label: "male's first breeding", from: 3.4 * 12, to: 6.8 * 12, mean: 4.8 * 12, keys: ["CATSG"] },
];

/** Junu's own life so far, in months: the course's story, every age a typical one. */
export const JUNU_EVENTS: readonly (readonly [number, string])[] = [
  [0, "born"],
  [2, "travels with her mother"],
  [24, "settles next door"],
  [46, "first litter"],
];

// ---- Leaving home: the map, a drawing ----

/** A box on the drawing, in map units (0–100 across, 0–60 down). */
export interface Area {
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly kind: "mother" | "junu" | "forest" | "brother" | "farm";
}

export const AREAS: readonly Area[] = [
  { label: "farmland", x: 0, y: 48, w: 100, h: 12, kind: "farm" },
  { label: "her mother", x: 6, y: 14, w: 16, h: 20, kind: "mother" },
  { label: "Junu", x: 22, y: 14, w: 14, h: 20, kind: "junu" },
  { label: "degraded forest", x: 42, y: 8, w: 26, h: 34, kind: "forest" },
  { label: "brother's temporary range", x: 72, y: 16, w: 22, h: 18, kind: "brother" },
];

export type Point = readonly [number, number];

/** Where each young tiger went from the den: short for Junu, long for her brother. */
export const PATHS: Readonly<Record<"junu" | "brother", readonly Point[]>> = {
  junu: [
    [14, 24],
    [29, 24],
  ],
  brother: [
    [14, 24],
    [38, 30],
    [55, 22],
    [66, 36],
    [83, 25],
  ],
};

// ---- The cubs-at-two check ----

/** Cub deaths in Chitwan: about 34% in the first year, 17% in the second [@CATSG]. */
export const CHITWAN_DEATHS: readonly [number, number] = [0.34, 0.17];

/** Russian Far East: litters shrank from 2.4 cubs to 1.3 by 12 months [@Kerley2003]. */
export const RUSSIA_LITTER: readonly [number, number] = [2.4, 1.3];

/** How many of `n` cubs are alive after each year, at Chitwan's rates (this lesson's arithmetic). */
export function alive(n: number, deaths: readonly number[]): number[] {
  const out = [n];
  for (const d of deaths) out.push(out[out.length - 1]! * (1 - d));
  return out;
}

export const CHECK_CUBS = 10;

export const CHECK: EstimateSpec = {
  min: 0,
  max: CHECK_CUBS,
  answer: alive(CHECK_CUBS, CHITWAN_DEATHS)[2]!, // about 5.5
  scale: "linear",
  steps: CHECK_CUBS, // whole cubs
  // 5 or 6 counts as close.
  close: 0.06,
};

export const CHECK_EXPLAIN =
  "In Chitwan, about 34% of cubs died in their first year and 17% in their second [@CATSG]. Of ten cubs, that leaves about 6.6 after one year and 6.6 × 0.83 ≈ 5.5 after two: about half, the Smithsonian's round figure [@SINZ]. (The multiplying is this lesson's, from the two rates.)";

// ---- The cohort model ----

export type Place = "chitwan" | "russia";
export type Sex = "daughter" | "son";
export const SEXES: readonly Sex[] = ["daughter", "son"];

/** The stages a cub must get through, in order. */
export const COHORT_STAGES: readonly string[] = ["born", "alive at one year", "alive at two, leaving home", "settled in a territory"];

/**
 * The chance of getting through each stage after birth. Chitwan's first two years [@CATSG];
 * the Russian Far East's first year from its litters shrinking from 2.4 to 1.3 cubs by 12
 * months [@Kerley2003], with Chitwan's second year. Settling, from Chitwan's dispersers: all 4
 * daughters set up breeding territories; of 8 sons that held temporary territories first, 4
 * survived [@Smith1993]. Tiny samples, and the model says so.
 */
export function chances(place: Place, sex: Sex): readonly [number, number, number] {
  const first = place === "chitwan" ? 1 - CHITWAN_DEATHS[0] : RUSSIA_LITTER[1] / RUSSIA_LITTER[0];
  return [first, 1 - CHITWAN_DEATHS[1], sex === "daughter" ? 4 / 4 : 4 / 8];
}

/** One cub's fate: how many stages after birth it got through (0 to 3). */
export interface Cub {
  readonly sex: Sex;
  readonly reached: number;
}

/**
 * A cohort of `n` cubs, half daughters and half sons (a model setting: the sources read give
 * no sex ratio at birth), each getting through each stage with its chance, seeded so a run is
 * repeatable.
 */
export function cohort(n: number, place: Place, seed: number): Cub[] {
  const rand = random(seed);
  return Array.from({ length: n }, (_, i) => {
    const sex: Sex = i % 2 === 0 ? "daughter" : "son";
    const p = chances(place, sex);
    let reached = 0;
    while (reached < p.length && rand() < p[reached]!) reached++;
    return { sex, reached };
  });
}

/** How many cubs of `sex` are at or past each stage (born first). */
export function counts(cubs: readonly Cub[], sex: Sex): number[] {
  const mine = cubs.filter((c) => c.sex === sex);
  return COHORT_STAGES.map((_, s) => mine.filter((c) => c.reached >= s).length);
}

/** The expected number at each stage for `born` cubs of `sex`: what many runs average to. */
export function expected(born: number, place: Place, sex: Sex): number[] {
  const out = [born];
  for (const p of chances(place, sex)) out.push(out[out.length - 1]! * p);
  return out;
}

// ---- The steps ----

export const STEPS: readonly Step[] = [
  {
    view: "junu",
    text: [
      "Junu is nearly four, and she has her first cubs. A female can breed from about three or four years old, a male from four or five [@SINZ]. In Chitwan, females had their first litter at 3.4 years on average, and males first bred at 4.8 [@CATSG].",
      "Her brother isn't here. When they left their mother, she settled next door; he went far. This lesson follows a tiger's life from mating to leaving home, and asks why sons and daughters fare so differently.",
    ],
  },
  {
    view: "mating",
    text: [
      "A female will mate only during **heat** (*oestrus*), a short spell of days [@Smith1989]. Tigers are **induced ovulators**: a female releases eggs only after mating, not on a fixed cycle [@SINZ].",
      "Her marks spread the news. Females marked heavily just before coming into heat, and males marked more while a female was in heat [@Smith1989]. Mating can happen in any month, but most often from November to April, the cooler months [@SINZ].",
    ],
  },
  {
    view: "cycle",
    text: [
      "Pregnancy lasts about 100 days [@SINZ; @CATSG]. A litter is usually two to four cubs [@SINZ]; in the Russian Far East, litters averaged 2.4 cubs when first counted [@Kerley2003]. Junu has three.",
      "Then come about two years of care. Cubs stay with their mother until they can hunt well, at 18–24 months, and she breeds again once they are independent [@SINZ]. So births are about 20–24 months apart [@CATSG]: 21.4 on average in the Russian Far East [@Kerley2003].",
    ],
  },
  {
    view: "order",
    text: [
      "Junu's cubs will grow up in steps, as she did.",
      "Your turn: put the stages of a young female's life in order, first at the top, then lock it in.",
    ],
  },
  {
    view: "stages",
    text: [
      "Cubs begin to travel with their mother at about two months old [@Smith1993] and stay with her until they can hunt well [@SINZ]. In Chitwan, a young tiger became semi-independent when its mother's next litter was born, yet stayed in her area until the new cubs began to travel with her; then it left, at 19 to 28 months old [@Smith1993].",
      "Sources give different ages for \"independence\": 18–28 months [@CATSG], or with the mother until 18–24 months and fully independent at 2–3 years [@SINZ]. They time different steps: leaving her side, then leaving her area. The time line shows each source's span.",
    ],
  },
  {
    view: "map",
    text: [
      "Why leave at all? Young tigers had wounds before they left, which suggests that adults pushed them out: after a fight, the young one always left the resident's area [@Smith1993].",
      "**Daughters stay close; sons go far.** In Chitwan, three of four young females settled next to their mothers, and all four set up breeding territories. Males went farther and settled in poorer ground; eight of ten held temporary territories first, and only four of those eight survived. They crossed degraded forest, but not farmland [@Smith1993]. DNA in central India [@Gour2013] and GPS collars in Thailand [@Liu2024] show the same pattern.",
    ],
  },
  {
    view: "estimate",
    text: [
      "Not every cub gets that far. Junu's three cubs are part of a bigger story: how many cubs live to leave home at all?",
      "Your turn: of ten cubs born in Chitwan, how many are still alive two years later? Set the slider, then lock it in.",
    ],
  },
  {
    view: "survival",
    text: [
      "About half. In Chitwan, about 34% of cubs died in their first year and 17% in their second; most first-year losses (73%) were whole litters at once [@CATSG].",
      "Place matters. In the Russian Far East, litters shrank from 2.4 cubs to 1.3 by the time the cubs were a year old, and people caused at least 57% of the deaths [@Kerley2003]. A mother who loses a litter can come into heat again within weeks [@CATSG], which is why the gap between births can be much shorter than two years.",
    ],
  },
  {
    view: "sandbox",
    text: [
      "The sandbox: follow a group of cubs through the stages, half daughters and half sons. Each cub gets through each stage by chance, with the studies' figures: Chitwan's first two years [@CATSG] and, for settling, Chitwan's young tigers [@Smith1993].",
      "Run it a few times, with 10 cubs and with 100, and switch the first year to the Russian Far East's [@Kerley2003]. The settling figures come from just 4 daughters and 8 sons, so read them as a pattern, not a precise rate.",
    ],
  },
];

/** Every source the lesson cites, in order of first appearance: the numbering on screen. */
export function lessonSources(): string[] {
  return [...new Set([...citedKeys([...STEPS.flatMap((s) => s.text), ORDER_EXPLAIN, CHECK_EXPLAIN]), ...SPANS.flatMap((s) => s.keys)])];
}
