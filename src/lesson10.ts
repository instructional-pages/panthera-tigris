// Lesson 10, "Prey, rivals and the forest": its content (steps, measured tiger densities, the
// prey-to-tigers teaching model, home ranges, tigers and leopards, and the "tigers per 100 km²"
// check). Pure data and functions; lesson10-view.ts draws them. Facts are in
// docs/research/ecology.md and hunting.md.

import { citedKeys } from "./cite.ts";
import type { EstimateSpec } from "./estimate.ts";
import { random } from "./stripes.ts";

export const TITLE = "10. Prey, rivals and the forest";

/** What the live view shows at a step. */
export type View = "junu" | "habitats" | "sites" | "model" | "check" | "measured" | "ranges" | "guild" | "sandbox";

export interface Step {
  /** Paragraphs; `*x*` is italic, `**x**` a new term, `[@Key]` a citation. */
  readonly text: readonly string[];
  readonly view: View;
}

// ---- Measured densities, tigers per 100 km² ----

/** A measured tiger density: one figure, a span, or a before and after. */
export interface Site {
  readonly label: string;
  readonly lo: number;
  readonly hi: number;
  /** "span": the sources give a range; "change": lo is before, hi after. */
  readonly kind: "span" | "change";
  readonly note: string;
  readonly keys: readonly string[];
}

export const SITES: readonly Site[] = [
  { label: "Kaziranga and Corbett, India", lo: 15, hi: 19, kind: "span", note: "15–19", keys: ["Goodrich2022"] },
  { label: "11 sites across India, 1995–2003", lo: 3.2, hi: 16.8, kind: "span", note: "3.2–16.8", keys: ["Karanth2004"] },
  { label: "Rajaji, India, before and after herders left", lo: 3.31, hi: 5.81, kind: "change", note: "3.31 → 5.81", keys: ["Harihar2011"] },
  { label: "Sikhote-Alin, Russia", lo: 0.13, hi: 0.45, kind: "span", note: "0.13–0.45", keys: ["Goodrich2022"] },
];

/** The density axis: logarithmic, since the sites span more than a hundredfold. */
export const AXIS = { min: 0.1, max: 30 } as const;

/** Where `d` sits on the axis, 0 (left) to 1 (right). */
export const along = (d: number): number => Math.log(d / AXIS.min) / Math.log(AXIS.max / AXIS.min);

// ---- The teaching model: prey sets the number of tigers ----

/** A tiger kills about 50–60 large prey a year [@Goodrich2022; @Miller2013]; the model uses the low end. */
export const KILLS_PER_YEAR = 50;

/**
 * The share of the prey the tigers can take each year and still find as many next year. Made up:
 * the real share depends on the prey and the place, and no source read gives it. The learner can
 * change it in the sandbox.
 */
export const SHARES: readonly number[] = [0.05, 0.1, 0.2];
export const SHARE = 0.1;

/** Prey per km² on the sandbox slider. India's 11 sites ran 5.3 to 63.8 [@Karanth2004]. */
export const PREY_MIN = 1;
export const PREY_MAX = 70;

/**
 * Tigers per 100 km² the model forest feeds: the prey in 100 km², times the share they can take
 * a year, divided by what one tiger kills a year.
 */
export function tigersPer100(preyPerKm2: number, share = SHARE, kills = KILLS_PER_YEAR): number {
  return (preyPerKm2 * 100 * share) / kills;
}

/** The forest each tiger has to itself, on average, in km²: 100 km² shared by that many tigers. */
export function km2PerTiger(per100: number): number {
  return per100 > 0 ? 100 / per100 : Infinity;
}

/**
 * Where `n` tigers sit in a 10 km by 10 km square, in km from its top-left corner: one to a cell
 * of a grid, jittered within the cell so they don't look like a parade, and the same every visit.
 */
export function dots(n: number, seed = 10): { x: number; y: number }[] {
  const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
  const rows = Math.max(1, Math.ceil(n / cols));
  const rnd = random(seed);
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    out.push({ x: ((c + 0.2 + 0.6 * rnd()) * 10) / cols, y: ((r + 0.2 + 0.6 * rnd()) * 10) / rows });
  }
  return out;
}

// ---- Tigers and leopards ----

/**
 * What the studies say leopards do, by how much prey there is. Where the line between scarce
 * and plentiful falls is made up: no source read gives it, so the model leaves a stretch between
 * as "not known".
 */
export type Leopards = "avoid" | "unknown" | "share";
export const SCARCE_BELOW = 10;
export const PLENTY_FROM = 30;

export function leopardsAt(preyPerKm2: number): Leopards {
  if (preyPerKm2 < SCARCE_BELOW) return "avoid";
  if (preyPerKm2 >= PLENTY_FROM) return "share";
  return "unknown";
}

export const LEOPARD_TEXT: Readonly<Record<Leopards, string>> = {
  avoid:
    "Scarce prey: leopards and dholes keep away from tigers, and hunt by day while the tigers hunt at night, as in a half-empty Thai forest [@Steinmetz2013]. Where tigers recover, leopards can be pushed out, as in Rajaji [@Harihar2011].",
  unknown: "In between: somewhere here the answer changes, and the studies read don't say where.",
  share:
    "Plentiful prey: tigers, leopards and dholes share the same forest, at the same hours, by killing different prey, as in Nagarahole [@Karanth2000].",
};

/** Rajaji, before and four years after herders and their livestock were moved out [@Harihar2011]. */
export const RAJAJI = {
  tigers: { before: 3.31, after: 5.81 },
  leopards: { before: 9.76, after: 2.07 },
} as const;

// ---- Home ranges ----

/** Average female home ranges, km² [@Goodrich2022]. */
export const RANGES = { chitwan: 20, russia: 400 } as const;

// ---- The check: tigers per 100 km² ----

export const CHECK_PREY = 20;

export const CHECK_QUESTION = `A forest has **${CHECK_PREY} deer per km²**. Each year the tigers can take **1 in 10** of them, and each tiger kills **${KILLS_PER_YEAR}** a year. How many tigers can **100 km²** of it feed?`;

export const CHECK: EstimateSpec = {
  min: 0,
  max: 20,
  answer: tigersPer100(CHECK_PREY), // 4
  scale: "linear",
  steps: 20, // whole tigers
  // 3 to 5 counts as close.
  close: 0.075, // within one and a half tigers
};

export const CHECK_EXPLAIN = `100 km² holds ${CHECK_PREY} × 100 = ${(CHECK_PREY * 100).toLocaleString("en-GB")} deer. One in ten is ${CHECK_PREY * 10} a year, and ${CHECK_PREY * 10} ÷ ${KILLS_PER_YEAR} kills per tiger = ${tigersPer100(CHECK_PREY)} tigers. Double the deer and the same forest feeds twice the tigers. (The 1 in 10 is a made-up setting; the ${KILLS_PER_YEAR} kills a year is the low end of what tigers kill [@Goodrich2022; @Miller2013].)`;

// ---- The steps ----

export const STEPS: readonly Step[] = [
  {
    view: "junu",
    text: [
      "Junu is seven. Her range in Chitwan is home to more than tigers: a leopard walks her paths too, mostly when she is somewhere else.",
      "This lesson is about what sets how many tigers a forest holds, and how tigers share it with the other big hunters.",
    ],
  },
  {
    view: "habitats",
    text: [
      "A **habitat** is the kind of place an animal can live in: its plants, its climate, its food [@Goodrich2022].",
      "Tigers are **habitat generalists**. They live in tropical rainforest, in the mangrove swamps of the Sundarbans, in the semi-dry forests of western India, in Himalayan forest up to about 4,500 m, and in the temperate forests of Russia and north-east China [@Goodrich2022].",
      "What every one of these places needs is enough large prey: deer, wild pigs, wild cattle. These hoofed animals are **ungulates**, and the Red List calls a good population of them the tiger's main need [@Goodrich2022].",
    ],
  },
  {
    view: "sites",
    text: [
      "**Density** is how many animals live in a given area. For tigers it is counted per 100 km², a square 10 km on each side [@Karanth2004].",
      "It varies enormously. In Kaziranga and Corbett, in India, 15 to 19 tigers share each 100 km². In Russia's Sikhote-Alin mountains, it is 0.13 to 0.45: about one tiger for every 220 to 770 km² [@Goodrich2022].",
      "Densities are generally highest on river floodplains and in tropical forest that loses its leaves in the dry season, and lower in evergreen rainforest and in the cold north [@Goodrich2022]. The scale is stretched so the small numbers still show: each mark on it is about three times the one before.",
    ],
  },
  {
    view: "model",
    text: [
      "Why so different? Because of the prey. Here is the reasoning, as a simple model.",
      "A tiger kills about 50 to 60 large animals a year [@Goodrich2022; @Miller2013]. The prey can't lose more each year than they can replace, or they dwindle and the tigers starve. So a forest feeds only as many tigers as its prey can spare.",
      "Tigers per 100 km² = prey in 100 km² × the share the prey can spare each year ÷ kills per tiger each year.",
      "The share the prey can spare is the model's made-up setting: the real one depends on the prey and the place, and no source read here gives it.",
    ],
  },
  {
    view: "check",
    text: ["Try the model before you see it run."],
  },
  {
    view: "measured",
    text: [
      "Does real life follow the reasoning? A study of 11 sites across India, from 1995 to 2003, counted both. Prey ran from 5.3 to 63.8 ungulates per km², tigers from 3.2 to 16.8 per 100 km², and a model predicting tigers from prey fitted the sites reasonably well [@Karanth2004]. More prey, more tigers.",
      "The study's own fitted numbers aren't shown here: its full text couldn't be read for this course, only its summary. The lesson's model is a simpler one that only shows the reasoning.",
      "Where the prey is matters too, not just how much. A computer model of Chitwan's tigers found that people taking prey evenly over a wide area, rather than heavily in a few places, made females' ranges bigger and the tiger population smaller [@Carter2019].",
    ],
  },
  {
    view: "ranges",
    text: [
      "A tiger's **home range**, the area it lives and hunts in, follows the same rule. Where prey is rich, a small range is enough.",
      "Females in Chitwan, Junu's park, used about 20 km² on average. In the Russian Far East, about 400 km²: twenty times more [@Goodrich2022].",
    ],
  },
  {
    view: "guild",
    text: [
      "Tigers are not the only big hunters. Across much of South and South-East Asia they share the forest with leopards and **dholes**, Asian wild dogs. Species living on the same kind of food in one place form a **guild**; when they need the same scarce thing, they are in **competition** [@Steinmetz2013; @Harihar2011].",
      "With plenty of prey, they share. In Nagarahole, southern India, the three used the same areas at similar hours, and killed different prey: different species, sizes and ages [@Karanth2000].",
      "With little prey, the tiger wins. In a Thai forest short of prey, leopards and dholes were found less where tigers were, and hunted by day while tigers hunted at night [@Steinmetz2013]. In Rajaji, India, as tigers recovered from 3.31 to 5.81 per 100 km² in four years, leopards fell from 9.76 to 2.07, and ate more livestock and small prey. The authors note their sample was small [@Harihar2011].",
      "GPS collars in Thailand found leopards often using the tigers' best places, just at other times [@Liu2026]. That is how Junu's leopard lives beside her.",
    ],
  },
  {
    view: "sandbox",
    text: [
      "The sandbox: set how many prey live in each km² of the forest, and see how many tigers 100 km² of it feeds, how much forest each one has, and what the leopards do.",
      "Change the share the prey can spare to see how much the model's one made-up setting moves the answer. The chart below sets the model's forest (the dashed square) beside the densities measured in real ones [@Karanth2004].",
    ],
  },
];

/** Every source the lesson cites, in order of first appearance: the numbering on screen. */
export function lessonSources(): string[] {
  return [
    ...new Set([
      ...citedKeys([...STEPS.flatMap((s) => s.text), CHECK_EXPLAIN, ...Object.values(LEOPARD_TEXT)]),
      ...SITES.flatMap((s) => s.keys),
    ]),
  ];
}
