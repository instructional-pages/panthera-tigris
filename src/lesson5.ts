// Lesson 5, "Hunting": its content (steps, the hunt-order check, the prey by body mass, the
// days-between-kills check and the kill-rate sandbox). Pure data and functions; lesson5-view.ts
// draws them. Facts are in docs/research/hunting.md.

import { citedKeys } from "./cite.ts";
import type { EstimateSpec } from "./estimate.ts";

export const TITLE = "5. Hunting";

/** What the live view shows at a step. */
export type View = "junu" | "order" | "prey" | "prey-band" | "prey-chosen" | "gps" | "estimate" | "rate" | "sandbox";

export interface Step {
  /** Paragraphs; `*x*` is italic, `**x**` a new term, `[@Key]` a citation. */
  readonly text: readonly string[];
  readonly view: View;
}

// ---- The hunt-order check ----

/** The steps of a hunt, in their right order [@SINZ]. */
export const HUNT: readonly string[] = ["Wait in cover, or stalk closer", "Pounce", "Pull the prey down", "Bite the neck"];

/** The order the steps are shown in first: nothing in its right place. */
export const HUNT_START: readonly number[] = [2, 3, 0, 1];

export const HUNT_EXPLAIN =
  "The striped coat hides a tiger while it waits or stalks. At the right moment it pounces, pulls the prey down and kills it with a bite to the neck [@SINZ]. Stealth and strength do the work, not a long chase [@SINZ].";

// ---- The prey, by body mass ----

/** How a study's prey choice compares with how common the prey is. */
export type Choice = "more" | "less" | "neither";

export interface Prey {
  readonly name: string;
  /** The study's estimated weight, in kg. */
  readonly kg: number;
  /** Share of the prey items found in the scats, in %. */
  readonly share: number;
  readonly livestock: boolean;
  /** Taken more or less than expected from how common it is; absent where the study gives no test. */
  readonly choice?: Choice;
}

/** Chitwan National Park, from 85 scats collected in 2014 [@Bhandari2017]. Lightest first. */
export const PREY: readonly Prey[] = [
  { name: "Barking deer", kg: 20, share: 4, livestock: false, choice: "neither" },
  { name: "Hog deer", kg: 33, share: 9, livestock: false, choice: "more" },
  { name: "Wild boar", kg: 38, share: 15, livestock: false, choice: "more" },
  { name: "Chital", kg: 45, share: 45, livestock: false, choice: "less" },
  { name: "Sambar", kg: 125, share: 23, livestock: false, choice: "more" },
  { name: "Cow", kg: 180, share: 1, livestock: true },
  { name: "Buffalo", kg: 273, share: 2, livestock: true },
  { name: "Gaur", kg: 450, share: 2, livestock: false },
];

/** The body masses tigers prefer range-wide, in kg [@Hayward2012]. */
export const BAND = [60, 250] as const;

export const inBand = (kg: number): boolean => kg >= BAND[0] && kg <= BAND[1];

/** The mass axis's ends and ticks, in kg: a logarithmic scale. */
export const MASS_KG = [10, 1000] as const;
export const MASS_TICKS: readonly number[] = [10, 20, 50, 100, 200, 500, 1000];

/** Where `kg` sits along a logarithmic scale from `lo` to `hi`, as 0 to 1 (clamped). */
export function logPos(kg: number, lo: number, hi: number): number {
  if (!(lo > 0 && hi > lo)) throw new Error("the scale needs 0 < lo < hi");
  return Math.min(1, Math.max(0, Math.log(kg / lo) / Math.log(hi / lo)));
}

export const CHOICE_TEXT: Readonly<Record<Choice, string>> = {
  more: "taken more than expected",
  less: "taken less than expected",
  neither: "no clear preference",
};

// ---- The days-between-kills check ----

export const CHECK: EstimateSpec = {
  min: 1,
  max: 30,
  answer: 6.5,
  scale: "linear",
  steps: 58, // half-day stops
  // Within about 1.5 days: 5 to 8 days counts as close.
  close: 0.052,
};

export const CHECK_EXPLAIN =
  "Three GPS-collared Amur tigers in the Russian Far East killed about once every 6.5 days (most likely between 5.9 and 7.2), about 56 animals a year [@Miller2013]. The Smithsonian's round figure is about once a week [@SINZ].";

// ---- The kill-rate sandbox ----

export interface Case {
  readonly key: string;
  /** The button's words. */
  readonly label: string;
  /** Average days between kills. */
  readonly days: number;
  /** Meat eaten per day, in kg, where the study gives it. */
  readonly kgPerDay: number | null;
  /** Why it differs, in rich text with citations. */
  readonly note: string;
}

/** Amur tigers, from GPS collars, 2009–2012 [@Miller2013]. The study gives each factor on its own, never the two together. */
export const CASES: readonly Case[] = [
  {
    key: "year",
    label: "All year",
    days: 6.5,
    kgPerDay: 8.9,
    note: "The average over the whole year: about 56 kills, and 8.9 kg of meat a day once the inedible parts and what scavengers take are allowed for [@Miller2013].",
  },
  {
    key: "summer",
    label: "Summer",
    days: 7.4,
    kgPerDay: 7.9,
    note: "In summer the tigers took more young deer and boar and more small prey, and killed less often [@Miller2013].",
  },
  {
    key: "winter",
    label: "Winter",
    days: 5.7,
    kgPerDay: 10.3,
    note: "In winter they killed more often, and more of their kills were large: 75% against 64.2% in summer. They ate more too, which the authors link to the energy it takes to keep warm [@Miller2013].",
  },
  {
    key: "small",
    label: "After a small kill",
    days: 5.75,
    kgPerDay: null,
    note: "After a kill under 40 kg, the next one came sooner [@Miller2013]. A small animal is soon eaten.",
  },
  {
    key: "large",
    label: "After a large kill",
    days: 8.12,
    kgPerDay: null,
    note: "After a kill of 40 kg or more, the next one came later. The authors suggest a full stomach, or the time spent eating a big carcass [@Miller2013].",
  },
];

/** The sandbox's strip: this many days. */
export const SPAN_DAYS = 60;

/** The days a kill falls on in `span` days when kills come every `days` days, evenly spaced. */
export function killDays(days: number, span: number): number[] {
  if (!(days > 0)) throw new Error("days between kills must be positive");
  const out: number[] = [];
  for (let k = 1; k * days <= span + 1e-9; k++) out.push(Number((k * days).toFixed(6)));
  return out;
}

// ---- The steps ----

export const ORDER_STEP = 1;
export const ESTIMATE_STEP = 6;

export const STEPS: readonly Step[] = [
  {
    view: "junu",
    text: [
      "Junu is eighteen months old and hunts beside her mother now. This lesson is about how a tiger hunts, what it eats and how often.",
      "Tigers are **ambush predators**: they rely on stealth and strength, not on a long chase [@SINZ]. They hunt mostly at night, and they swim well: tigers have been recorded hunting in water [@SINZ].",
    ],
  },
  {
    view: "order",
    text: [
      "An ambush ends a hunt in a few moves. Think about what has to come first for a hunter that relies on stealth rather than a chase.",
      "Your turn: put the steps of a hunt in order, then lock it in.",
    ],
  },
  {
    view: "prey",
    text: [
      "What does a tiger catch? Mostly **ungulates**, hoofed mammals such as deer and wild pigs [@Miller2013]. Tigers also take monkeys, buffalo, sloth bears, leopards and crocodiles, and livestock where they live near people [@SINZ].",
      "To find out what tigers eat in one place, researchers collect their droppings (**scats**) and identify the prey remains in them. In Junu's park, Chitwan, 85 scats held 109 prey items from eight species. Here each is placed by the study's estimated weight; chital, a spotted deer, made up almost half [@Bhandari2017].",
    ],
  },
  {
    view: "prey-band",
    text: [
      "Eating a lot of one prey doesn't mean a tiger prefers it: it may just be the commonest. A predator **prefers** a prey when it kills more of it than its share of the animals around would predict [@Hayward2012].",
      "A review of 3,187 kills or scats of 32 prey species, from studies across the tiger's range, found that body mass was the only trait that predicted preference. Tigers preferred prey of **60–250 kg**, about their own weight, and above all wild boar and sambar [@Hayward2012]. The shaded band shows it.",
    ],
  },
  {
    view: "prey-chosen",
    text: [
      "In Chitwan, chital was eaten most but taken *less* than expected for how common it is; sambar, wild boar and hog deer were taken *more* than expected [@Bhandari2017]. Earlier Chitwan studies also found chital under-used; one suggested reason is that chital live in herds [@Bhandari2017].",
      "Notice that wild boar and hog deer sit below the band at this study's weights. The band is a pattern across the whole range, and studies weigh prey differently, so one park need not match it.",
    ],
  },
  {
    view: "gps",
    text: [
      "How often does a tiger kill? Researchers fit tigers with **GPS collars** that record where they are every 1.5 to 6 hours. A tiger that stays in one spot for many hours is often eating, so researchers walk to each **cluster** of locations and look for a carcass [@Miller2013].",
      "Counting the kills over months gives the **kill rate**, here the days between one kill and the next, and from the prey's weights, the meat eaten per day [@Miller2013].",
    ],
  },
  {
    view: "estimate",
    text: [
      "A tiger can eat up to 34 kg in one night [@SINZ], so one large deer feeds it for days.",
      "Your turn: on average, how many days pass between one kill and the next? Set the slider, then lock it in.",
    ],
  },
  {
    view: "rate",
    text: [
      "About once a week. The strip shows 60 days with a kill every 6.5 days on average; real kills come unevenly. That works out to about 8.9 kg of meat a day [@Miller2013].",
      "These numbers rest on three Amur tigers in Russia, and earlier studies there, tracking tigers in snow, found from about 5 to 9 days between kills, partly because snow-tracking missed small kills [@Miller2013]. Junu's own rate in Chitwan isn't in the sources this course has read.",
    ],
  },
  {
    view: "sandbox",
    text: [
      "The sandbox: pick a season, or the size of the last kill, and see the days between kills and the meat eaten per day, beside the year's average.",
      "Each choice is one of the study's own averages. The study reports season and prey size separately, so the sandbox doesn't combine them.",
    ],
  },
];

/** Every source the lesson cites, in order of first appearance: the numbering on screen. */
export function lessonSources(): string[] {
  return [
    ...new Set([
      ...citedKeys([...STEPS.flatMap((s) => s.text), HUNT_EXPLAIN, CHECK_EXPLAIN, ...CASES.map((c) => c.note)]),
      "Bhandari2017",
      "Hayward2012",
    ]),
  ];
}
