// Lesson 15, "Final quiz": mixed hands-on tasks from across the course, each answered first, then
// revealed and explained, with a link back to the lesson it comes from. No score. Pure data;
// lesson15-view.ts draws it with the shared pieces (stripes, order, estimate, map). The facts are
// the earlier lessons' own, with the same sources.

import { citedKeys } from "./cite.ts";
import type { EstimateSpec } from "./estimate.ts";
import { CHECK as KILLS, CHECK_EXPLAIN as KILLS_EXPLAIN, HUNT, HUNT_EXPLAIN } from "./lesson5.ts";
import { ORDER_EXPLAIN as STAGES_EXPLAIN, STAGES } from "./lesson7.ts";
import { PLACES } from "./lesson9.ts";
import { WORLD } from "./lesson14.ts";
import type { Photo } from "./stripes.ts";

export const TITLE = "15. Final quiz";

/** What the live view shows at a step: Junu, one task, or the closing list. */
export type View = "junu" | "stripes" | "hunt" | "kills" | "stages" | "density" | "map" | "range" | "world" | "end";

export interface Step {
  /** Paragraphs; `*x*` is italic, `**x**` a new term, `[@Key]` a citation. */
  readonly text: readonly string[];
  readonly view: View;
  /** The lessons a task comes from, linked once it is answered. */
  readonly from?: readonly number[];
}

// ---- Stripes: which tiger is in each photo? ----

/** Four tigers new to the course (seeds are drawing choices), so the learner can't remember lesson 3's. */
export const MATCH_TIGERS: readonly { readonly name: string; readonly seed: number }[] = [
  { name: "Tiger P", seed: 404 },
  { name: "Tiger Q", seed: 505 },
  { name: "Tiger R", seed: 606 },
  { name: "Tiger S", seed: 707 },
];

/** Five photos of four tigers: one tiger twice, so the last can't be matched by elimination. */
export const MATCH_PHOTOS: readonly Photo[] = [
  { tiger: 2, from: 0.1, to: 0.5 },
  { tiger: 0, from: 0.45, to: 0.9 },
  { tiger: 3, from: 0.25, to: 0.7 },
  { tiger: 2, from: 0.55, to: 0.98 },
  { tiger: 1, from: 0.02, to: 0.45 },
];

export const MATCH_EXPLAIN =
  "Tiger R was in two photos, of different parts of its side. Each part's stripes (how many, how wide, which split or break into spots) belong to one tiger alone [@CATSG]. Matching them is how camera traps count tigers [@Karanth1995].";

// ---- The order tasks: shown in a new order, not lesson 5's or 7's ----

export { HUNT, HUNT_EXPLAIN, STAGES, STAGES_EXPLAIN };
export const HUNT_START: readonly number[] = [1, 0, 3, 2];
export const STAGES_START: readonly number[] = [1, 3, 4, 2, 0];

// ---- The estimates ----

export { KILLS, KILLS_EXPLAIN };
export const KILLS_QUESTION = "On average, how many days pass between one tiger's kills?";

/** Tigers per 100 km² in Kaziranga and Corbett, the densest the course shows: 15–19 [@Goodrich2022]. */
export const DENSITY: EstimateSpec = {
  min: 0.1,
  max: 100,
  answer: 17, // a point inside the span; never drawn
  range: [15, 19],
  scale: "log",
  steps: 30,
  // A ratio of about 1.5 past either end still counts as close: 10 to 29 or so.
  close: 0.06,
};
export const DENSITY_QUESTION = "In Kaziranga and Corbett, in India, prey is plentiful. How many tigers share each **100 km²** there (a square 10 km on a side)?";
export const DENSITY_EXPLAIN =
  "In Kaziranga and Corbett, 15 to 19 tigers share each 100 km². In Russia's Sikhote-Alin mountains, with far less prey, it is 0.13 to 0.45 [@Goodrich2022]: a hundredfold difference. Across 11 sites in India, more prey meant more tigers [@Karanth2004].";

/** The share of the old range that is still a Tiger Conservation Landscape, about 8% [@Sanderson2023]. */
export const RANGE_LEFT: EstimateSpec = {
  min: 0,
  max: 100,
  answer: 8,
  scale: "linear",
  steps: 50, // stops of 2%
  close: 0.05, // 3% to 13% counts as close
};
export const RANGE_QUESTION =
  "Before people changed things much, tigers lived from Turkey to Bali and the Russian Far East: their old range. What share of that old range is still a **Tiger Conservation Landscape**: habitat where tigers live and can still meet and breed?";
export const RANGE_EXPLAIN =
  "In 2020, 63 Tiger Conservation Landscapes covered 911,920 km², about 8% of the old range: less than a tenth [@Sanderson2023]. About 60% of the old range is no longer habitat at all: farms, plantations and towns [@Sanderson2023].";

/** The world's wild tigers, not counting cubs: 3,726–5,578 [@Goodrich2022]. */
export const WORLD_COUNT: EstimateSpec = {
  min: 100,
  max: 100_000,
  answer: 4_600, // a point inside the span; never drawn
  range: [WORLD.lo, WORLD.hi],
  scale: "log",
  steps: 30, // each stop about a quarter more than the one before
  // A ratio of about 1.3 past either end still counts as close: about 2,800 to 7,400.
  close: 0.04,
};
export const WORLD_QUESTION = "How many wild tigers are there in the world today, not counting cubs?";
export const WORLD_EXPLAIN =
  "The Red List puts them at 3,726 to 5,578, in ten countries: its first reasonably rigorous estimate [@Goodrich2022]. India holds about three-quarters of them [@NTCA2023].";

// ---- The map: which places lost their tigers since 2000? ----

/** The choices: South-East Asia's places in the old range, from Myanmar to Bali. */
export const MAP_CHOICES: readonly string[] = ["mmr", "tha", "lao", "vnm", "khm", "malaya", "sumatra", "java", "bali"];

/** Lost since 2000: lesson 9's dated losses after that year [@Sanderson2023]. */
export const LOST_SINCE_2000: readonly string[] = PLACES.filter((p) => MAP_CHOICES.includes(p.id) && p.lostBy !== undefined && p.lostBy > 2000).map((p) => p.id);

/** South-East Asia, in map units: [left, top, width, height]. */
export const MAP_CROP = [440, 262, 420, 366] as const;

export const MAP_QUESTION = "Which **three** of these places have lost their tigers since 2000? Pick them on the map, then lock in.";
export const MAP_EXPLAIN =
  "Vietnam lost its tigers about 2004, Cambodia about 2008 and Laos about 2014 [@Sanderson2023]; the Red List counts all three as gone [@Goodrich2022]. Java and Bali lost theirs decades earlier. Myanmar, Thailand, peninsular Malaysia and Sumatra still have breeding tigers, though Malaysia's appear to be in steep decline [@Goodrich2022].";

// ---- The steps ----

export const STEPS: readonly Step[] = [
  {
    view: "junu",
    text: [
      "Junu has walked through every lesson, from a cub in Chitwan to an old tigress photographed by the count's cameras. This last lesson looks back over what she showed.",
      "Eight tasks from across the course. In each, answer first and lock it in; then see the answer, why, and a link back to the lesson it comes from. There is no score.",
    ],
  },
  {
    view: "stripes",
    from: [3, 14],
    text: ["A camera trap photographs part of a tiger's side. Which tiger is in each photo? One tiger appears twice."],
  },
  {
    view: "hunt",
    from: [5],
    text: ["How does a tiger hunt? Put the steps in order."],
  },
  {
    view: "kills",
    from: [5],
    text: ["A tiger needs a large meal regularly. How often does it kill?"],
  },
  {
    view: "stages",
    from: [7],
    text: ["A daughter like Junu grows up in stages. Put them in order."],
  },
  {
    view: "density",
    from: [10],
    text: ["How many tigers a forest holds depends on its prey. Where prey is plentiful, how crowded can tigers get?"],
  },
  {
    view: "map",
    from: [9, 14],
    text: ["The tiger's range is still shrinking in places. Find where tigers have disappeared most recently."],
  },
  {
    view: "range",
    from: [9],
    text: ["How much of the tiger's old range is left?"],
  },
  {
    view: "world",
    from: [14],
    text: ["And how many tigers are left in it?"],
  },
  {
    view: "end",
    text: [
      "That is the course. Junu is fictional, but every event in her life is a typical one from the studies the lessons cite.",
      "Beside this is every lesson, to go back to any of them. Each one ends in a sandbox to try again.",
    ],
  },
];

/** The checks' explanations, in step order, for the source numbering. */
const EXPLAINS: readonly string[] = [MATCH_EXPLAIN, HUNT_EXPLAIN, KILLS_EXPLAIN, STAGES_EXPLAIN, DENSITY_EXPLAIN, MAP_EXPLAIN, RANGE_EXPLAIN, WORLD_EXPLAIN];

/** Every source the lesson cites, in order of first appearance: the numbering on screen. */
export function lessonSources(): string[] {
  return citedKeys([...STEPS.flatMap((s) => s.text), ...EXPLAINS]);
}
