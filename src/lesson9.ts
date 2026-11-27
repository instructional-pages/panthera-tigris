// Lesson 9, "Where tigers live": its content (steps, the old range place by place, when each
// place lost its tigers, the three layers of loss, the landscapes left, and the "which places
// still have breeding tigers?" check). Pure data and functions; lesson9-view.ts draws them.
// Facts are in docs/research/range.md.

import { citedKeys } from "./cite.ts";

export const TITLE = "9. Where tigers live";

/** What the live view shows at a step. */
export type View = "junu" | "indigenous" | "check" | "losses" | "layers" | "now" | "trend" | "sandbox";

export interface Step {
  /** Paragraphs; `*x*` is italic, `**x**` a new term, `[@Key]` a citation. */
  readonly text: readonly string[];
  readonly view: View;
}

// ---- The old range, place by place ----

/**
 * A place in the tiger's indigenous range, as drawn: a region of the map (a country, or the part
 * of one the course tells apart). `lostBy` is the first year on the slider (a decade's start) by
 * which it had lost its tigers; none means it still has them. `disputed` is the span of years
 * the sources disagree about; `noDate` means the sources read don't say when.
 */
export interface Place {
  /** A map region id (map-data.ts). */
  readonly id: string;
  readonly lostBy?: number;
  readonly disputed?: readonly [number, number];
  readonly noDate?: boolean;
  /** When it was lost, in words, for the table. */
  readonly when?: string;
  readonly keys: readonly string[];
}

const G = ["Goodrich2022"];
const S = ["Sanderson2023"];

/**
 * The 30 countries of the indigenous range [@Sanderson2023], with Indonesia drawn as Sumatra, Java
 * and Bali, Malaysia as the peninsula, and Hong Kong apart from China, as the sources tell them.
 */
export const PLACES: readonly Place[] = [
  // Breeding tigers in 2020 [@Goodrich2022].
  ...["ind", "npl", "btn", "bgd", "mmr", "tha", "malaya", "sumatra", "chn", "rus"].map((id): Place => ({ id, keys: G })),
  { id: "sgp", lostBy: 1940, when: "1930s", keys: G },
  { id: "bali", lostBy: 1950, when: "1940s", keys: [...G, ...S] },
  { id: "prk", lostBy: 1960, when: "1950s", keys: S },
  { id: "kor", lostBy: 1960, when: "1950s", keys: S },
  { id: "hkg", lostBy: 1970, when: "1960s", keys: G },
  { id: "java", lostBy: 1990, disputed: [1970, 1990], when: "1960s or 1980s (the sources disagree)", keys: [...G, ...S] },
  ...["kaz", "kgz", "tjk", "tkm", "uzb"].map((id): Place => ({ id, lostBy: 1980, when: "1970s", keys: G })),
  { id: "aze", lostBy: 1980, when: "1970s", keys: S },
  { id: "vnm", lostBy: 2010, when: "about 2004", keys: S },
  { id: "khm", lostBy: 2010, when: "about 2008", keys: S },
  { id: "lao", lostBy: 2020, when: "about 2014", keys: S },
  ...["tur", "irn", "irq", "syr", "geo", "arm", "afg", "pak"].map((id): Place => ({ id, noDate: true, keys: S })),
];

/** The places with breeding tigers today: the check's answer. */
export const BREEDING: readonly string[] = PLACES.filter((p) => p.lostBy === undefined && !p.noDate).map((p) => p.id);

/** What the map says about a place in a given year. */
export type State = "tigers" | "gone" | "unsure";

export const FIRST_YEAR = 1900;
export const LAST_YEAR = 2020;
export const YEAR_STEP = 10;

/** A place's state at the start of `year`: "unsure" when the sources don't say, or disagree. */
export function stateAt(p: Place, year: number): State {
  if (p.noDate) return "unsure";
  if (p.disputed && year >= p.disputed[0] && year < p.disputed[1]) return "unsure";
  return p.lostBy !== undefined && year >= p.lostBy ? "gone" : "tigers";
}

/** The places that lost their tigers in the ten years before `year` (none for the first year). */
export function lostIn(year: number): Place[] {
  return PLACES.filter((p) => p.lostBy !== undefined && p.lostBy > year - YEAR_STEP && p.lostBy <= year && year > FIRST_YEAR);
}

/** How many places are in each state in `year`. */
export function countAt(year: number): Record<State, number> {
  const out: Record<State, number> = { tigers: 0, gone: 0, unsure: 0 };
  for (const p of PLACES) out[stateAt(p, year)]++;
  return out;
}

/** The years on the slider. */
export const YEARS: readonly number[] = Array.from({ length: (LAST_YEAR - FIRST_YEAR) / YEAR_STEP + 1 }, (_, i) => FIRST_YEAR + i * YEAR_STEP);

// ---- The check: which places still have breeding tigers? ----

export const CHECK_QUESTION = "Which **ten** places still have breeding tigers? Pick them on the map, then lock in.";

export const CHECK_EXPLAIN =
  "Breeding tigers are confirmed in Bangladesh, Bhutan, China, India, Indonesia (only on Sumatra), Malaysia (only on the peninsula), Myanmar, Nepal, Russia and Thailand [@Goodrich2022]. Every other country of the old range has lost them.";

// ---- Why the range shrank: the three layers, and what is left ----

/** One share of the indigenous range in 2020 [@Sanderson2023]. */
export interface Layer {
  readonly key: "converted" | "unusable" | "empty" | "survey" | "tcl";
  readonly label: string;
  readonly km2: number;
  /** The share the source gives, in percent. */
  readonly pct: number;
}

/** The indigenous range, in km² [@Sanderson2023]. */
export const INDIGENOUS_KM2 = 11_123_576;

export const LAYERS: readonly Layer[] = [
  { key: "converted", label: "1. No longer habitat: farms, plantations, towns", km2: 6_700_000, pct: 60 },
  { key: "unusable", label: "2. Habitat, but too crowded, broken up or short of prey", km2: 2_500_000, pct: 23 },
  { key: "empty", label: "3. Good habitat, but no tigers left in it", km2: 711_634, pct: 6 },
  { key: "survey", label: "Habitat where it isn't known if tigers live", km2: 188_364, pct: 2 },
  { key: "tcl", label: "Where tigers live: 63 landscapes", km2: 911_920, pct: 8.2 },
];

/** The part of the range the figures read don't split out (rounding, mostly). */
export const unsplitKm2 = (): number => INDIGENOUS_KM2 - LAYERS.reduce((t, l) => t + l.km2, 0);

/** Tiger Conservation Landscape area by country on 1 January 2020, km² [@Sanderson2023]. */
export const TCL_BY_COUNTRY: readonly { readonly id: string; readonly km2: number }[] = [
  { id: "ind", km2: 300_519 },
  { id: "rus", km2: 195_822 },
  { id: "mmr", km2: 168_415 },
  { id: "chn", km2: 100_368 },
  { id: "sumatra", km2: 51_286 },
  { id: "malaya", km2: 34_647 },
  { id: "btn", km2: 26_765 },
  { id: "tha", km2: 14_030 },
  { id: "npl", km2: 11_762 },
  { id: "bgd", km2: 8_308 },
];

/** The total the source gives; its table's rows add up to 2 km² more, from rounding. */
export const TCL_TOTAL_KM2 = 911_920;

/** Where Junu lives: Chitwan National Park, Nepal (longitude, latitude). */
export const CHITWAN = { lon: 84.4, lat: 27.5 } as const;

// ---- The steps ----

export const STEPS: readonly Step[] = [
  {
    view: "junu",
    text: [
      "Junu is six, and still in Chitwan, where she was born. Her mother's range is next door; her brother left long ago.",
      "Chitwan is one small dot on a very large map. This lesson is about where tigers once lived, where they live now, and why so much of the space in between is empty.",
    ],
  },
  {
    view: "indigenous",
    text: [
      "A species' **range** is the area where it lives. The **indigenous range** is where it lived before people changed things much; a country with wild tigers in it today is a **range state** [@Goodrich2022; @Sanderson2023].",
      "At its widest, the tiger lived from eastern Turkey and the Black Sea to the Pacific coast of Russia, and from the edge of the Siberian forest to the islands of Java and Bali: about 11.1 million km², in what are now 30 countries [@Goodrich2022; @Sanderson2023]. The extinct Caspian tigers of the far west lived along rivers and lakes, as far as the Tigris and Euphrates valleys [@Goodrich2022].",
      "The map shades whole countries, though tigers never lived in every part of each: a sketch of where, not an outline of the range.",
    ],
  },
  {
    view: "check",
    text: [
      "When tigers vanish from one area but live on elsewhere, they are **extirpated** there. (**Extinct** means gone everywhere.) [@Sanderson2023]",
      "Over the last hundred years, tigers were extirpated from most of these countries. Before you see the losses: which places do you think still have tigers that breed there?",
    ],
  },
  {
    view: "losses",
    text: [
      "Decade by decade, they went: Singapore in the 1930s, Bali in the 1940s, Korea in the 1950s, Hong Kong in the 1960s, Java in the 1960s or later, Central Asia in the 1970s, then most of China [@Goodrich2022; @Sanderson2023]. The last were Vietnam (about 2004), Cambodia (about 2008) and Laos (about 2014) [@Sanderson2023].",
      "Two sources disagree on Java: the Red List says the 1960s, the 2023 habitat study \"into the 1980s\" [@Goodrich2022; @Sanderson2023]. And for Turkey, Iran and the rest of the far west, the sources read here give no dates at all. The map hatches both kinds.",
      "China stays bright on the map because it still has tigers in its north-east, though it lost them from the south and the temperate middle in the 1980s and 1990s [@Goodrich2022].",
    ],
  },
  {
    view: "layers",
    text: [
      "Why did the range shrink? A 2023 study mapped the whole indigenous range and found three layers of loss [@Sanderson2023].",
      "**One:** about 60% is no longer tiger habitat at all; the forest and grassland became farms, plantations and cities. **Two:** another 23% still has the right plants, but is too crowded with people, too broken up, or too short of prey. **Three:** another 6% is good, quiet habitat with no tigers in it. They were killed, or their prey was, until none were left [@Sanderson2023].",
      "That third layer is why the Red List names poaching of tigers and their prey as the main reason tigers vanished from places that still look suitable [@Goodrich2022].",
    ],
  },
  {
    view: "now",
    text: [
      "What is left: on 1 January 2020, 63 **Tiger Conservation Landscapes**, blocks of habitat with tigers known to have lived in them recently, each big enough for a population that can still meet and breed. Together, 911,920 km², about 8% of the old range: less than a tenth [@Sanderson2023]. Over 60% of tiger populations are probably in protected areas [@Goodrich2022].",
      "The largest, the \"Northern Triangle\" shared by India, Myanmar, China, Bhutan and Bangladesh, is about a third of the total, though tigers probably don't live all through it. And only about a third of the area had been surveyed in the five years before [@Sanderson2023].",
      "Nepal's tigers all live in a single landscape, 11,762 km² [@Sanderson2023]. Junu lives in it.",
      "The numbers moved as the study was finished: the 2022 Red List, using a draft, gives 71 landscapes and 978,293 km² [@Goodrich2022]. The course uses the published study [@Sanderson2023].",
    ],
  },
  {
    view: "trend",
    text: [
      "Is it still shrinking? Between 2001 and 2020 the landscapes' area fell by 11%, most of it in Southeast Asia and southern China. But it grew in India, Nepal, Bhutan, northern China and south-eastern Russia, and after about 150 years of decline, the habitat tigers could use seems to have levelled off at about 16% of the old range [@Sanderson2023].",
      "The empty layer is also a chance. The study names 226 **Restoration Landscapes**: good habitat without tigers. With enough prey, and if tigers could reach them, the area tigers live in could grow by about half [@Sanderson2023].",
      "There is a warning too: where tigers were lost, the forest left was lost faster afterwards, about four times faster in Vietnam and Laos. The authors suggest that habitat without tigers is more easily cut up and cleared [@Sanderson2023].",
    ],
  },
  {
    view: "sandbox",
    text: [
      "The sandbox: move the slider from 1900 to 2020 and watch the map empty, decade by decade. Under the map, the places lost in the ten years before the year you're on are named.",
      "Press \"Why: the three layers\" to set the 2020 map beside what became of the old range. The decades are the sources' own, so a loss \"in the 1930s\" shows up at 1940; hatched places are those the sources don't date, or disagree about.",
    ],
  },
];

/** Every source the lesson cites, in order of first appearance: the numbering on screen. */
export function lessonSources(): string[] {
  return [...new Set([...citedKeys([...STEPS.flatMap((s) => s.text), CHECK_EXPLAIN]), ...PLACES.flatMap((p) => p.keys)])];
}
