// Lesson 15's live view: Junu, then one task per step (stripe matching, two orderings, three
// estimates and a map), each with a link back to its lesson once it is answered, and the list of
// every lesson to close. Drawn with the shared pieces from lesson15.ts's data.

import { h } from "./dom.ts";
import { type Estimate, type EstimateState, estimateView, freshEstimate } from "./estimate-view.ts";
import { JUNU } from "./junu.ts";
import {
  DENSITY,
  DENSITY_EXPLAIN,
  DENSITY_QUESTION,
  HUNT,
  HUNT_EXPLAIN,
  HUNT_START,
  KILLS,
  KILLS_EXPLAIN,
  KILLS_QUESTION,
  lessonSources,
  LOST_SINCE_2000,
  MAP_CHOICES,
  MAP_CROP,
  MAP_EXPLAIN,
  MAP_QUESTION,
  MATCH_EXPLAIN,
  MATCH_PHOTOS,
  MATCH_TIGERS,
  RANGE_EXPLAIN,
  RANGE_LEFT,
  RANGE_QUESTION,
  STAGES,
  STAGES_EXPLAIN,
  STAGES_START,
  STEPS,
  TITLE,
  type View,
  WORLD_COUNT,
  WORLD_EXPLAIN,
  WORLD_QUESTION,
} from "./lesson15.ts";
import { href, TITLES } from "./lessons.ts";
import { freshPick, type PickTask, pickView } from "./map-view.ts";
import { freshOrder, type OrderTask, orderView } from "./order-view.ts";
import type { Lesson, Ui } from "./shell.ts";
import { freshMatch, type MatchTask, matchView, tigerView } from "./stripes-view.ts";

let ui: Ui;

const asEl = (n: Element): HTMLElement => n as unknown as HTMLElement;
const num = (x: number): string => x.toLocaleString("en-GB", { maximumFractionDigits: 2 });

// ---- The tasks and their state (fresh on every visit) ----

const match: MatchTask = { key: "l15-match", question: "Which tiger is in each camera-trap photo?", tigers: MATCH_TIGERS, photos: MATCH_PHOTOS, explain: MATCH_EXPLAIN };
const hunt: OrderTask = { key: "l15-hunt", question: "Put the steps of a tiger's hunt in order, first at the top.", items: HUNT, start: HUNT_START, explain: HUNT_EXPLAIN };
const stages: OrderTask = { key: "l15-stages", question: "Put the stages of a young female's life in order, first at the top.", items: STAGES, start: STAGES_START, explain: STAGES_EXPLAIN };
const map: PickTask = { key: "l15-map", question: MAP_QUESTION, choices: MAP_CHOICES, answer: LOST_SINCE_2000, explain: MAP_EXPLAIN, crop: MAP_CROP };

const kills: Estimate = { ...KILLS, key: "l15-kills", question: KILLS_QUESTION, format: (v) => `${num(v)} ${v === 1 ? "day" : "days"}`, explain: KILLS_EXPLAIN, start: 15 };
const density: Estimate = {
  ...DENSITY,
  key: "l15-density",
  question: DENSITY_QUESTION,
  format: (v) => `${num(v)} ${v === 1 ? "tiger" : "tigers"}`,
  formatRange: (lo, hi) => `${num(lo)}–${num(hi)} tigers`,
  explain: DENSITY_EXPLAIN,
  start: 1,
};
const rangeLeft: Estimate = { ...RANGE_LEFT, key: "l15-range", question: RANGE_QUESTION, format: (v) => `${num(v)}%`, explain: RANGE_EXPLAIN, start: 50 };
const world: Estimate = {
  ...WORLD_COUNT,
  key: "l15-world",
  question: WORLD_QUESTION,
  format: (v) => `${Math.round(v).toLocaleString("en-GB")} tigers`,
  formatRange: (lo, hi) => `${lo.toLocaleString("en-GB")}–${hi.toLocaleString("en-GB")} tigers`,
  explain: WORLD_EXPLAIN,
  start: 1_000,
};

const matchState = freshMatch(match);
const huntState = freshOrder(hunt);
const stagesState = freshOrder(stages);
const mapState = freshPick(map);
const estimates: Partial<Record<View, [Estimate, EstimateState]>> = {
  kills: [kills, freshEstimate(kills)],
  density: [density, freshEstimate(density)],
  range: [rangeLeft, freshEstimate(rangeLeft)],
  world: [world, freshEstimate(world)],
};

/** Whether the task on view `v` is answered; true for a step with no task. */
function locked(v: View): boolean {
  if (v === "stripes") return matchState.locked;
  if (v === "hunt") return huntState.locked;
  if (v === "stages") return stagesState.locked;
  if (v === "map") return mapState.locked;
  const e = estimates[v];
  return e ? e[1].locked : true;
}

/** The task drawn for view `v`. */
function task(v: View): HTMLElement {
  if (v === "stripes") return matchView(match, matchState, ui);
  if (v === "hunt") return orderView(hunt, huntState, ui);
  if (v === "stages") return orderView(stages, stagesState, ui);
  if (v === "map") return pickView(map, mapState, ui);
  const [e, st] = estimates[v]!;
  return estimateView(e, st, ui);
}

/** "Back to lesson 5, Hunting", for each lesson the task comes from. */
function backLinks(from: readonly number[]): HTMLElement {
  const links = from.flatMap((n, i) => [...(i ? [" and "] : []), h("a", { href: href(n) }, TITLES[n - 1]!)]);
  return h("p", { cls: "muted small quiz-back" }, from.length > 1 ? "From the lessons " : "From the lesson ", ...links, ".");
}

function junu(): HTMLElement {
  return h(
    "figure",
    { cls: "coat-figure" },
    asEl(tigerView({ key: "l15-junu", seed: JUNU, title: "Junu, side view" })),
    h("figcaption", {}, "Junu. A drawing: her pattern is made up, but it is hers in every lesson."),
  );
}

function end(): HTMLElement {
  return h(
    "nav",
    { cls: "panel quiz-end", attrs: { "aria-label": "Every lesson" } },
    h("p", { cls: "chart-title" }, "Every lesson"),
    h("ol", {}, ...TITLES.slice(0, -1).map((t, i) => h("li", {}, h("a", { href: href(i + 1) }, t.replace(/^\d+\. /, ""))))),
  );
}

// ---- The lesson ----

export const lesson15: Lesson = {
  title: TITLE,
  steps: STEPS,
  sources: lessonSources(),
  view(i, u) {
    ui = u;
    const step = STEPS[i]!;
    if (step.view === "junu") return [junu()];
    if (step.view === "end") return [end()];
    return [task(step.view), ...(locked(step.view) && step.from ? [backLinks(step.from)] : [])];
  },
  hold(i) {
    return locked(STEPS[i]!.view) ? null : "Answer and lock in to go on.";
  },
};
