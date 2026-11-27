// Lesson 12, "The trade in tiger parts": its content (steps, the price chain, the sourced figures
// drawn as bars, the poacher's-share check, and the seizure data the sandbox filters). Pure data
// and functions; lesson12-view.ts draws them. Facts are in docs/research/trade.md. Poaching is
// covered factually, never graphically.

import { citedKeys } from "./cite.ts";
import type { EstimateSpec } from "./estimate.ts";

export const TITLE = "12. The trade in tiger parts";

/** What the live view shows at a step. */
export type View = "junu" | "demand" | "check" | "money" | "law" | "penalties" | "seizures" | "captive" | "farms" | "korea" | "sandbox";

export interface Step {
  /** Paragraphs; `*x*` is italic, `**x**` a new term, `[@Key]` a citation. */
  readonly text: readonly string[];
  readonly view: View;
}

// ---- Prices along the chain, in US dollars ----

/** A price, or a span of prices; `chain` marks the four links from poacher to buyer. */
export interface Price {
  readonly label: string;
  readonly lo: number;
  readonly hi: number;
  readonly note: string;
  readonly chain: boolean;
}

/** Each from a different study, place and year, gathered by the Red List [@Goodrich2022]. */
export const PRICES: readonly Price[] = [
  { label: "What the poacher was paid", lo: 100, hi: 200, note: "at most USD 100–200", chain: true },
  { label: "A skin, sold in India", lo: 1500, hi: 1500, note: "USD 1,500", chain: true },
  { label: "A skin, sold in China", lo: 16000, hi: 16000, note: "USD 16,000", chain: true },
  { label: "All the parts of one tiger", lo: 10000, hi: 70000, note: "USD 10,000–70,000", chain: true },
  { label: "A bottle of tiger wine", lo: 80, hi: 1000, note: "USD 80–1,000", chain: false },
  { label: "A 100 g bar of tiger glue, Vietnam", lo: 1000, hi: 1000, note: "USD 1,000", chain: false },
];

/** The price scale's ends: USD 10 to 100,000, logarithmic. */
export const PRICE_MIN = 10;
export const PRICE_MAX = 100_000;

/** Where a price sits along the log scale, 0 to 1. */
export const pricePos = (usd: number): number => Math.log10(usd / PRICE_MIN) / Math.log10(PRICE_MAX / PRICE_MIN);

/** The poacher's share of the final price, in percent: the lesson's own division of two of the Red List's figures. */
export function poacherShare(): { readonly most: number; readonly least: number } {
  const pay = PRICES[0]!;
  const all = PRICES[3]!;
  return { most: (100 * pay.hi) / all.lo, least: (100 * pay.lo) / all.hi };
}

// ---- The check: the poacher's share ----

export const CHECK: EstimateSpec = {
  min: 0.1,
  max: 100,
  answer: poacherShare().most, // 2
  scale: "log",
  steps: 30, // each stop about a quarter more than the last
  close: 0.1, // up to about 3% still counts
  bound: "atMost",
};

export const CHECK_QUESTION = "A poacher kills a tiger, and its parts pass from hand to hand until buyers pay for them. Of what the buyers pay in the end, **what share went to the poacher?**";

export const CHECK_EXPLAIN = `The poacher was paid at most USD 100–200; all the parts of one tiger sold for USD 10,000–70,000 [@Goodrich2022]. 200 ÷ 10,000 is 2%, and 100 ÷ 70,000 is about ${poacherShare().least.toFixed(2)}%: at most 2%, perhaps much less. The figures come from different studies, places and years; the division is this course's.`;

// ---- Sourced figures, drawn as rows of bars ----

export interface Bar {
  readonly label: string;
  readonly value: number;
  readonly note: string;
  readonly bright?: boolean;
}

export interface Bars {
  readonly rows: readonly Bar[];
  readonly max: number;
  readonly caption: string;
  readonly keys: readonly string[];
}

export const BARS: Readonly<Partial<Record<View, readonly Bars[]>>> = {
  penalties: [
    {
      max: 1167,
      caption: "People arrested in tiger cases, 2000–2018, and how many were prosecuted.",
      keys: ["Wong2019"],
      rows: [
        { label: "Arrested", value: 1167, note: "1,167" },
        { label: "Prosecuted", value: 429, note: "at least 429", bright: true },
      ],
    },
    {
      max: 8.9,
      caption: "Average jail term, where known, in years.",
      keys: ["Wong2019"],
      rows: [
        { label: "All countries", value: 3.8, note: "3.8 years", bright: true },
        { label: "China", value: 8.9, note: "8.9 years" },
        { label: "India", value: 3.4, note: "3.4 years" },
        { label: "Indonesia", value: 1.7, note: "1.7 years" },
      ],
    },
  ],
  captive: [
    {
      max: 100,
      caption: "Wild tigers seized in 2016–2018 (known or suspected captive tigers left out), as a share of the wild population declared in 2016. Seizures catch only part of the trade.",
      keys: ["Wong2019"],
      rows: [
        { label: "All tiger range countries", value: 5.5, note: "at least 5.5%", bright: true },
        { label: "Indonesia", value: 11.9, note: "11.9%" },
      ],
    },
  ],
};

// ---- Seizures, 2000–2018 [@Wong2019] ----

export const FIRST_YEAR = 2000;

/** Each year from 2000: incidents in tiger range countries, incidents outside them, tigers seized (all countries). Read from the report's Figure 2. */
export const BY_YEAR: readonly (readonly [inRange: number, outside: number, tigers: number])[] = [
  [45, 1, 92], [59, 1, 125], [29, 0, 56], [31, 1, 84], [32, 0, 77], [47, 1, 122], [57, 0, 96], [52, 0, 77], [84, 1, 198], [103, 1, 262],
  [75, 2, 123], [56, 5, 97], [71, 5, 187], [57, 9, 101], [52, 3, 104], [71, 2, 85], [66, 4, 288], [53, 8, 86], [46, 12, 101],
];

/** The single biggest seizure: 187 captive tigers from a temple in Thailand, in 2016. */
export const TEMPLE = { year: 2016, tigers: 187 } as const;

/** One country's seizures and tigers in 2000–2014 and 2015–2018 (the report's Table 5); `null` where it had too little data. */
export interface Country {
  readonly name: string;
  readonly seizures: readonly [number, number | null];
  readonly tigers: readonly [number, number | null];
}

export const PERIODS = [
  { label: "2000–2014", years: 15 },
  { label: "2015–2018", years: 4 },
] as const;

export const BY_COUNTRY: readonly Country[] = [
  { name: "India", seizures: [379, 84], tigers: [527.6, 98.2] },
  { name: "China", seizures: [107, 19], tigers: [223.2, 23.6] },
  { name: "Indonesia", seizures: [64, 55], tigers: [194, 72.2] },
  { name: "Nepal", seizures: [88, 6], tigers: [189.2, 8.7] },
  { name: "Viet Nam", seizures: [60, 29], tigers: [163.1, 53.2] },
  { name: "Thailand", seizures: [39, 10], tigers: [151, 218] },
  { name: "Malaysia", seizures: [43, 10], tigers: [94.4, 8.8] },
  { name: "Russia", seizures: [28, 6], tigers: [92.9, 15] },
  { name: "Bangladesh", seizures: [22, 11], tigers: [38.8, 12.6] },
  { name: "Lao PDR", seizures: [9, null], tigers: [39, null] },
  { name: "Bhutan", seizures: [6, 1], tigers: [5, 1] },
  { name: "Cambodia", seizures: [3, 2], tigers: [7, 1] },
  { name: "Myanmar", seizures: [2, 3], tigers: [1.2, 3] },
  { name: "Outside the range", seizures: [30, 26], tigers: [74, 44.2] },
];

/** A period's total as a yearly average, so a 15-year and a 4-year period compare fairly. */
export const perYear = (total: number, period: 0 | 1): number => total / PERIODS[period].years;

/** Tigers seized, as equivalent whole tigers, by the kind of item (the report's Figure 4). One tiger can be counted under several kinds, so they don't add up. */
export const BY_PART: readonly Bar[] = [
  { label: "Skins", value: 1099, note: "1,099 (40%)", bright: true },
  { label: "Bones", value: 535, note: "535 (19%)" },
  { label: "Carcasses", value: 416, note: "416 (15%)" },
  { label: "Live tigers", value: 382, note: "382 (14%)" },
  { label: "Claws and teeth", value: 215, note: "215 (8%)" },
];

export type Measure = "seizures" | "tigers";

/** The bars of the by-year chart: incidents (in range and outside) or tigers, optionally without the temple seizure. */
export function yearBars(measure: Measure, withoutTemple: boolean): { year: number; main: number; extra: number }[] {
  return BY_YEAR.map(([inRange, outside, tigers], i) => {
    const year = FIRST_YEAR + i;
    if (measure === "seizures") return { year, main: inRange, extra: outside };
    return { year, main: tigers - (withoutTemple && year === TEMPLE.year ? TEMPLE.tigers : 0), extra: 0 };
  });
}

// ---- The steps ----

export const STEPS: readonly Step[] = [
  {
    view: "junu",
    text: [
      "Junu is nine. Rangers walking the edge of her range find a wire snare, set for deer, and take it away. A snare catches whatever steps into it. In parts of South-East Asia, snares and poison have emptied forests of tigers and their prey alike [@Goodrich2022].",
      "The hunting of tigers and their prey is the main cause of the tiger's decline since 1991 [@Goodrich2022]. This lesson follows what happens to a poached tiger: who buys it, for how much, and what the law does about it. It covers poaching factually, without graphic detail.",
    ],
  },
  {
    view: "demand",
    text: [
      "Why would anyone buy a tiger? Four reasons, from the Red List [@Goodrich2022]:",
      "**Medicine.** In Traditional Chinese Medicine, bones, meat and organs are believed to heal various ailments. Bones are steeped in alcohol as a \"tonic\", tiger bone wine, or boiled into a glue. **Status.** Tiger wine is a gift and a status symbol; skins, claws and teeth are prestige items. **Belief.** Claws and teeth are worn as protective charms. **Meat**, eaten by the wealthy in the Golden Triangle, where Myanmar, Laos and Thailand meet.",
      "The demand is mainly in Vietnam and China, and it rises with wealth: a 2017 study suggested up to 11% of people in Hanoi and Ho Chi Minh City had consumed tiger products. Demand for tiger bone also drives trade in the bones of lions, jaguars and leopards as substitutes [@Goodrich2022].",
    ],
  },
  {
    view: "check",
    text: ["Before the prices: set the slider to your estimate, then lock it in."],
  },
  {
    view: "money",
    text: [
      "The prices climb at each step from the forest to the buyer. A skin sold for about USD 1,500 in India, where tigers live, and USD 16,000 in China, where buyers are; all the parts of one tiger can fetch USD 10,000–70,000 [@Goodrich2022].",
      "The poacher, who takes the risk in the forest, was paid at most USD 100–200: no more than 2% of what the parts finally sell for. The rest of the price is made further along the chain.",
      "The scale is stretched so the small prices still show: each mark is ten times the one before. These prices come from different studies, places and years, before about 2010 for the skins, so read them as an order of size, not one tiger's journey.",
    ],
  },
  {
    view: "law",
    text: [
      "**CITES**, the Convention on International Trade in Endangered Species of Wild Fauna and Flora, is the treaty that governs trade in wild species between countries [@Goodrich2022].",
      "Its strictest list is **Appendix I**: for a species on it, international commercial trade in the animals and their parts is effectively banned. All tigers have been on it since 1975, except the Amur tiger, added in 1987 [@Goodrich2022].",
      "So the trade has been illegal across borders for decades. It goes on because enforcing the ban is hard, especially in places outside any government's control, such as northern Myanmar on the Chinese border [@Goodrich2022].",
    ],
  },
  {
    view: "penalties",
    text: [
      "And the penalties are weak. TRAFFIC, a network that monitors the wildlife trade, followed the tiger cases of 2000–2018. Of 1,167 people arrested, at least 429 were prosecuted. Where the jail term is known, it averaged 3.8 years: 8.9 in China, 3.4 in India, 1.7 in Indonesia [@Wong2019].",
      "In Vietnam, Indonesia and India, many fines were under USD 500. Set that beside a tiger's parts at tens of thousands of dollars: the profit far outweighs the risk [@Wong2019].",
    ],
  },
  {
    view: "seizures",
    text: [
      "A **seizure** is an animal or product confiscated by the authorities. Seizures show only the trade that was caught, a fraction of the whole [@Wong2019].",
      "From 2000 to 2018, at least 2,359 tigers were seized in 1,142 incidents across 32 countries and territories: about 124 tigers a year. 95% of the incidents were in the 13 **tiger range countries**, where tigers live. India had the most (463 incidents, 626 tigers), then Thailand (369 tigers) and Indonesia (266) [@Wong2019].",
      "Skins were 40% of the seized parts: about 58 tigers a year poached for their skins alone [@Wong2019].",
    ],
  },
  {
    view: "captive",
    text: [
      "Whole tigers, alive (382) and dead (416), rose sharply after 2016, mostly from captive sources, largely in Thailand and Vietnam. The biggest single seizure, 187 tigers, was at a Thai temple in 2016 [@Wong2019].",
      "Wild tigers seized in 2016–2018 equalled at least 5.5% of the wild population the range countries declared in 2016; in Indonesia, 11.9%. Since seizures catch only part of the trade, the real loss is probably much greater [@Wong2019].",
    ],
  },
  {
    view: "farms",
    text: [
      "There are an estimated 15,000–20,000 captive tigers in the world, at least five times as many as in the wild. Fewer than 1% are in regulated places such as accredited zoos; most are farmed or privately owned with little regulation [@Armstrong2024].",
      "A **tiger farm** breeds tigers commercially. The argument for farms: farmed parts could meet demand and take the pressure off wild tigers. The evidence runs against it [@Wong2019; @Goodrich2022]. Buyers in Vietnam and China prefer wild tigers. Farm tigers leak into the illegal trade, and seizures go on in the wild tigers' strongholds. Almost 90% of Vietnam's known trafficking routes came from Laos, which has almost no wild tigers left, so those tigers most plausibly came from captive places [@Wong2019].",
      "No source read for this course makes the case for farms with evidence; the course shows the argument and the evidence against it. TRAFFIC recommends registering every captive tiger with DNA profiles and photographs, and closing farms that breed for trade [@Wong2019].",
    ],
  },
  {
    view: "korea",
    text: [
      "Can a ban work? **South Korea** did it. In the early 1990s it was one of the world's largest importers of tiger bone. It joined CITES in 1993 and banned commercial trade in big cats the next year [@ElvesPowell2024].",
      "Experts surveyed for a 2024 study judged that the trade had shrunk substantially, through the ban, strict customs, regulating medicines, and the country growing richer. Small illegal sales go on, mainly skins and tiger bone wine [@ElvesPowell2024].",
      "Both are true at once: demand collapsed in Korea, while in Vietnam and China it rises with wealth [@ElvesPowell2024; @Goodrich2022].",
    ],
  },
  {
    view: "sandbox",
    text: [
      "The sandbox: TRAFFIC's seizure data, 2000–2018. Look at it by year, by country or by part, count incidents or tigers, and take out the temple seizure to see what is left [@Wong2019].",
      "Watch for what the data can't say. A rise in seizures can mean more trade, or better policing; a country with no seizures may have no trade, or no one looking.",
    ],
  },
];

/** Every source the lesson cites, in order of first appearance: the numbering on screen. */
export function lessonSources(): string[] {
  return [...new Set([...citedKeys([...STEPS.flatMap((s) => s.text), CHECK_EXPLAIN]), ...Object.values(BARS).flatMap((b) => b.flatMap((x) => x.keys))])];
}
