// Lesson 11, "Tigers and people": its content (steps, the sourced figures drawn as bars, the
// "which carried more risk?" check, and the villager sandbox's ranking). Pure data and functions;
// lesson11-view.ts draws them. Facts are in docs/research/people.md. Attacks are covered
// factually, never graphically.

import { citedKeys } from "./cite.ts";

export const TITLE = "11. Tigers and people";

/** What the live view shows at a step. */
export type View = "junu" | "conflict" | "check" | "counts" | "where" | "who" | "tigers" | "rise" | "livestock" | "tolerance" | "helps" | "sandbox";

export interface Step {
  /** Paragraphs; `*x*` is italic, `**x**` a new term, `[@Key]` a citation. */
  readonly text: readonly string[];
  readonly view: View;
}

// ---- Sourced figures, drawn as rows of bars ----

/** One bar: `value` against the figure's `max`; `note` is the figure as the source words it. */
export interface Bar {
  readonly label: string;
  readonly value: number;
  readonly note: string;
  /** The bar the text points at: bright. Others are grey. */
  readonly bright?: boolean;
}

export interface Bars {
  readonly rows: readonly Bar[];
  readonly max: number;
  readonly caption: string;
  readonly keys: readonly string[];
}

/**
 * Each bar view's figures. A figure the source gives only as a bound ("more than 90%", "over
 * half", "fewer than 1%") is drawn at that bound and labelled with the source's words.
 */
export const BARS: Readonly<Partial<Record<View, Bars>>> = {
  counts: {
    max: 245,
    caption: "Recorded attacks on people in Nepal's lowlands, 2010–2024.",
    keys: ["Dhakal2026"],
    rows: [
      { label: "Attacks", value: 245, note: "245", bright: true },
      { label: "of which fatal", value: 141, note: "141" },
    ],
  },
  where: {
    max: 100,
    caption: "Share of recorded attacks on people, Nepal's lowlands, 2010–2024; and of people killed in Chitwan, 1979–2006.",
    keys: ["Dhakal2026", "Gurung2008"],
    rows: [
      { label: "In buffer zones", value: 69, note: "69%", bright: true },
      { label: "Outside protected areas", value: 24, note: "24%" },
      { label: "Inside national parks", value: 6.5, note: "6.5%" },
      { label: "Inside forests", value: 90, note: "more than 90%", bright: true },
      { label: "Collecting fodder or firewood", value: 50, note: "over half" },
      { label: "Chitwan killings: within 1 km of the forest edge", value: 200 / 3, note: "two-thirds" },
    ],
  },
  who: {
    max: 100,
    caption: "Victims who were alone, around Chitwan and Parsa; and, across Nepal, the share of people attacked who died, by posture.",
    keys: ["Shrestha2026", "Dhakal2026"],
    rows: [
      { label: "Victims who were alone", value: 69, note: "69%", bright: true },
      { label: "Died: bending or sitting", value: 75, note: "75% of those attacked", bright: true },
      { label: "Died: standing or walking", value: 41, note: "41% of those attacked" },
    ],
  },
  tigers: {
    max: 100,
    caption: "Attacks that followed people provoking or surprising a tiger, around Chitwan and Parsa; and the human-killing tigers examined in Chitwan that had physical deformities.",
    keys: ["Shrestha2026", "Gurung2008"],
    rows: [
      { label: "Attacks after a tiger was provoked or surprised", value: 20, note: "about a fifth" },
      { label: "Examined killers with deformities, Chitwan", value: 56, note: "56%", bright: true },
    ],
  },
  rise: {
    max: 7.2,
    caption: "People killed by tigers each year in Chitwan, on average.",
    keys: ["Gurung2008"],
    rows: [
      { label: "Before 1998", value: 1.2, note: "about 1.2 a year" },
      { label: "1998–2006, after the buffer zone's forests were restored", value: 7.2, note: "7.2 a year", bright: true },
    ],
  },
  tolerance: {
    max: 100,
    caption: "What 2,386 villagers around Kerinci Seblat, Sumatra, wanted; and support for conservation among people attacked around Chitwan and Parsa.",
    keys: ["Struebig2018", "Shrestha2026"],
    rows: [
      { label: "Kerinci Seblat: fewer or no tigers", value: 28, note: "28%" },
      { label: "Kerinci Seblat: the same number", value: 48, note: "48%" },
      { label: "Kerinci Seblat: more tigers", value: 19, note: "19%" },
      { label: "Chitwan and Parsa: attacked, still support conservation", value: 85, note: "85%", bright: true },
    ],
  },
  helps: {
    max: 100,
    caption: "What people attacked in Nepal, or their families, recommended most often.",
    keys: ["Dhakal2026"],
    rows: [
      { label: "Go into the forest in groups and stay alert", value: 56, note: "56%", bright: true },
      { label: "Avoid risky places and times", value: 31, note: "31%" },
      { label: "Kill problem tigers", value: 0, note: "fewer than 1%" },
    ],
  },
};

// ---- The check: which of two situations carried more risk? ----

export interface Pair {
  readonly question: string;
  readonly options: readonly [string, string];
  /** The index of the option the study's figures favour. */
  readonly answer: 0 | 1;
  /** The study's figures, shown once the answer is locked in. */
  readonly reveal: string;
}

export const CHECK: readonly Pair[] = [
  {
    question: "Nepal's lowlands, 2010–2024: where were more people attacked by tigers?",
    options: ["Inside national parks", "In the buffer zones around them"],
    answer: 1,
    reveal: "Buffer zones: 69% of attacks, against 6.5% inside national parks (and 24% outside protected areas). That is where people and tigers share the forest [@Dhakal2026].",
  },
  {
    question: "Once a tiger attacked, who was more likely to die?",
    options: ["Someone bending or sitting, as when cutting grass", "Someone standing or walking"],
    answer: 0,
    reveal: "Bending or sitting: 75% died, against 41% of those standing or walking. Why posture matters was not tested [@Dhakal2026].",
  },
];

/** Whether each pick matches the study; an unanswered pick is wrong. */
export function judgePairs(picks: readonly (number | null)[]): boolean[] {
  return CHECK.map((p, i) => picks[i] === p.answer);
}

// ---- The sandbox: a villager in the buffer zone ----

export type Place = "forest" | "edge" | "far";
export type Company = "alone" | "group";
export type Posture = "bending" | "upright";

export interface Villager {
  readonly place: Place;
  readonly company: Company;
  readonly posture: Posture;
}

export const PLACES: readonly Place[] = ["forest", "edge", "far"];
export const PLACE_LABEL: Readonly<Record<Place, string>> = {
  forest: "In the buffer-zone forest",
  edge: "In the fields, within 1 km of the forest",
  far: "In the village, farther away",
};

/** Which way a choice moves the risk, and what the studies say about it. */
export interface Effect {
  readonly up: boolean;
  readonly text: string;
}

export const PLACE_EFFECT: Readonly<Record<Place, Effect>> = {
  forest: { up: true, text: "More than 90% of Nepal's attacks were inside forests [@Dhakal2026]." },
  edge: { up: true, text: "Near the forest: in Chitwan, two-thirds of killings were within 1 km of the forest edge [@Gurung2008]." },
  far: { up: false, text: "Farther than 1 km from the forest: the other third of Chitwan's killings [@Gurung2008]." },
};

export const COMPANY_EFFECT: Readonly<Record<Company, Effect>> = {
  alone: { up: true, text: "Alone: 69% of victims around Chitwan and Parsa were alone [@Shrestha2026]." },
  group: { up: false, text: "In a group: across Nepal, the strongest factor reducing the chance of death. Companions have driven tigers off by shouting, or with sticks and tools [@Dhakal2026; @Shrestha2026]." },
};

export const POSTURE_EFFECT: Readonly<Record<Posture, Effect>> = {
  bending: { up: true, text: "Bending or sitting, cutting grass: 75% of people attacked this way died [@Dhakal2026]." },
  upright: { up: false, text: "Standing or walking: 41% of people attacked this way died [@Dhakal2026]." },
};

/**
 * The sandbox's ranking: how many steps up the ladder the choices put the villager, from 0
 * (far from the forest, in a group, standing) to 4 (in the forest, alone, bending). Place counts
 * two steps because the studies order its three choices: forest, then near it, then far. How the
 * factors really combine is not known; the ranking only orders, it doesn't measure.
 */
export function rank(v: Villager): number {
  return (v.place === "forest" ? 2 : v.place === "edge" ? 1 : 0) + (v.company === "alone" ? 1 : 0) + (v.posture === "bending" ? 1 : 0);
}

export const RANK_MAX = 4;

// ---- The steps ----

export const STEPS: readonly Step[] = [
  {
    view: "junu",
    text: [
      "Junu is eight. Her range runs out of the park into the **buffer zone**: the belt of forest, farms and villages around a national park, where people live and use the forest under rules meant to protect the park [@Dhakal2026].",
      "Villagers come into that forest to cut grass and fodder for their animals and to collect firewood [@Dhakal2026]. This lesson is about what happens when tigers and people share the same ground. It covers attacks on people factually, without graphic detail.",
    ],
  },
  {
    view: "conflict",
    text: [
      "**Human–tiger conflict** is tigers attacking people or their animals, and people killing tigers in return [@Goodrich2010].",
      "Across wild cats, a predator killing domestic animals, **livestock depredation**, is more common than attacks on people. Only cats heavier than about 50 kg attack people with any frequency, and leopards, lions and tigers cause most of those attacks [@Inskip2009].",
      "**Retaliatory killing** is people killing a tiger because it attacked them, their family or their animals, or because they fear it will [@Goodrich2022; @Inskip2009]. And conflict turns people against the tiger, which costs it the support it needs [@Goodrich2010].",
    ],
  },
  {
    view: "check",
    text: ["Before the figures: two questions about Nepal's tiger attacks. Pick an answer to each, then lock them in."],
  },
  {
    view: "counts",
    text: [
      "How many? Counts are local and incomplete, so there is no reliable world figure.",
      "In Nepal's lowlands, 245 attacks on people were recorded from 2010 to 2024, 141 of them fatal: about 16 attacks a year [@Dhakal2026]. In Chitwan, Junu's park, 36 tigers killed 88 people from 1979 to 2006 [@Gurung2008].",
      "Across wild cats, attacks have generally fallen over the past century, probably because there are fewer cats, but they remain common in parts of Asia and Africa [@Inskip2009].",
    ],
  },
  {
    view: "where",
    text: [
      "Where: most attacks happen in or near forest, where people gather grass, fodder, firewood and wild foods, or herd their animals.",
      "In Nepal, more than 90% of attacks were inside forests, and over half happened while people collected fodder and firewood [@Dhakal2026]. In Chitwan, two-thirds of the killings were within 1 km of the forest edge, and nearly half of the people killed were cutting grass or fodder [@Gurung2008].",
      "When: mostly by day, the hours people are in the forest [@Dhakal2026; @Shrestha2026].",
    ],
  },
  {
    view: "who",
    text: [
      "Who: people alone. Around Chitwan and Parsa, 69% of victims were alone [@Shrestha2026]. Across Nepal, being in a group was the strongest factor reducing the chance of death; companions have driven tigers off by shouting, or with sticks and tools [@Dhakal2026; @Shrestha2026].",
      "Posture mattered too: 75% of people attacked while bending or sitting died, against 41% of those standing or walking. Why was not tested [@Dhakal2026].",
    ],
  },
  {
    view: "tigers",
    text: [
      "Which tigers? Most attacks are attempts to hunt, usually an ambush from behind; about a fifth followed people provoking or surprising a tiger [@Shrestha2026].",
      "Old, injured and young dispersing tigers, like Junu's brother looking for a range of his own, are over-represented [@Shrestha2026]. In Chitwan, 56% of the human-killing tigers that were examined had physical deformities, and males and females killed people equally [@Gurung2008].",
      "Tigers may also attack to defend themselves or their cubs, especially where people persecute them [@Dhakal2026].",
    ],
  },
  {
    view: "rise",
    text: [
      "**Success brings conflict.** As tigers recover, meetings with people, livestock losses and retaliation are expected to rise; a 2010 review warned that the plan to double wild tigers would increase conflict unless it was planned for [@Goodrich2010].",
      "In Chitwan, deaths rose from about 1.2 a year before 1998 to 7.2 a year in 1998–2006, mostly a tenfold rise in the buffer zone after its forests were restored [@Gurung2008]. Across Nepal, attacks peaked in 2022, after COVID-19 sent many people back into the forest for a living, and fell after 2023 [@Dhakal2026].",
      "Do more tigers simply mean more attacks? Around Chitwan and Parsa, casualties rose with tiger numbers, but with only four counts the authors call it a hint, not proof [@Shrestha2026]. Across Nepal, tiger numbers alone predict attacks poorly: how much people depend on the forest matters too [@Dhakal2026]. More tigers in shared land raise the risk; how people use the forest decides much of it.",
    ],
  },
  {
    view: "livestock",
    text: [
      "Livestock: around Chitwan in 2012–2016, tigers and leopards caused more than 90% of the farm animals lost to wildlife, according to an earlier study quoted by the 2026 Chitwan–Parsa study [@Shrestha2026]. A lost cow or goat threatens a farming family's income, and the fear of attack adds stress [@Dhakal2026].",
      "Yet a tiger can also protect a farm. In western Bhutan, where a tiger lived in the forest near a village, leopards and dholes kept closer to the fields and ate more of the wild animals that raid crops, and farmers lost significantly fewer crops and livestock. Where no tiger was present, leopards and dholes stayed deeper in the forest and killed more free-ranging livestock [@Thinley2018].",
    ],
  },
  {
    view: "tolerance",
    text: [
      "People kill tigers in return. Retaliatory killing is common and widely assumed to drive declines, but it has never been systematically recorded [@Goodrich2022]. In Kerinci Seblat, Sumatra, 27 tigers were hunted in 2000–2013 [@Struebig2018].",
      "**Tolerance** is how far people accept living near an animal. Of 2,386 villagers asked around Kerinci Seblat, 28% wanted fewer or no tigers, 48% the same number and 19% more. What predicted tolerance was not ethnicity but attitudes, emotions, social norms and spiritual beliefs about the tiger [@Struebig2018].",
      "Around Chitwan and Parsa, 85% of people whose families or animals had been attacked still supported tiger conservation [@Shrestha2026].",
    ],
  },
  {
    view: "helps",
    text: [
      "What helps? Reviews list fences (some electric), trenches, predator-proof pens for livestock, patrols, compensation, and awareness and training [@Shrestha2026; @Inskip2009]. By 2009, only 31% of such measures for wild cats had been scientifically tested [@Inskip2009].",
      "In Nepal, people attacked, or their families, most often recommended going into the forest in groups and staying alert (56%), and avoiding risky places and times (31%); fewer than 1% asked for problem tigers to be killed [@Dhakal2026].",
      "Around Bardia, capturing 21 tigers that had caused conflict (2019–2024), campaigns to change risky habits, and clearing undergrowth in buffer zones were followed by fewer attacks after 2023. The government pays relief to victims and their families [@Dhakal2026].",
    ],
  },
  {
    view: "sandbox",
    text: [
      "The sandbox: a villager in Junu's buffer zone. Choose where they are, whether they are alone, and what they are doing, and see which way each choice moves the risk, with the study's figure beside it.",
      "The studies give directions more often than numbers, and none says how the factors combine. So the ladder only puts the choices in order; it is not a measured risk.",
    ],
  },
];

/** Every source the lesson cites, in order of first appearance: the numbering on screen. */
export function lessonSources(): string[] {
  const effects = [PLACE_EFFECT, COMPANY_EFFECT, POSTURE_EFFECT].flatMap((e) => Object.values(e).map((x: Effect) => x.text));
  return [
    ...new Set([
      ...citedKeys([...STEPS.flatMap((s) => s.text), ...CHECK.map((p) => p.reveal), ...effects]),
      ...Object.values(BARS).flatMap((b) => b.keys),
    ]),
  ];
}
