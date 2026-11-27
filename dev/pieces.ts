// A dev-only gallery of the shared lesson pieces, mounted with the real shell, for checking
// them in a browser before a lesson uses them (`npm run dev`, then /dev/pieces.html).
// Not part of the build. Values are demos, not facts, so nothing here is cited.

import "../src/style.css";
import { type Estimate, estimateView, freshEstimate } from "../src/estimate-view.ts";
import { type PickTask, freshPick, mapView, pickView } from "../src/map-view.ts";
import { type OrderTask, freshOrder, orderView } from "../src/order-view.ts";
import { type MatchTask, freshMatch, matchView, tigerView } from "../src/stripes-view.ts";
import { h } from "../src/dom.ts";
import { type Lesson, mount } from "../src/shell.ts";

const years: Estimate = {
  key: "years",
  question: "Demo, log scale: how long ago?",
  min: 1_000,
  max: 10_000_000,
  answer: 100_000,
  scale: "log",
  steps: 200,
  close: 0.05,
  format: (v) => `${v.toLocaleString("en")} years ago`,
  explain: "Each quarter of the slider is ten times older.",
  words: { low: "Too recent", high: "Too long ago" },
};

const cubs: Estimate = {
  key: "cubs",
  question: "Demo, linear scale: how many of ten?",
  min: 0,
  max: 10,
  answer: 4,
  scale: "linear",
  steps: 10,
  close: 0.05,
  start: 0,
  format: (v) => `${v} of 10`,
  explain: "Equal steps are equal amounts.",
};

const estimates = [years, cubs];
const states = estimates.map(freshEstimate);

const morning: OrderTask = {
  key: "morning",
  question: "Demo: put a morning in order.",
  items: ["Wake up", "Get out of bed", "Make **coffee**", "Drink it"],
  start: [1, 3, 0, 2],
  explain: "Each step needs the one before it.",
};
const orderState = freshOrder(morning);

const pick: PickTask = {
  key: "pick",
  question: "Demo: pick the countries whose names start with **B**.",
  choices: ["bgd", "btn", "ind", "npl", "mmr", "tha", "bali", "sgp", "java"],
  answer: ["bgd", "btn", "bali"],
  explain: "Bali is an island, not a country, but it is a region on this map.",
};
const pickState = freshPick(pick);

const shades: Record<string, "solid" | "hatched" | "dim"> = { ind: "solid", npl: "solid", bgd: "hatched", mmr: "hatched", chn: "dim", tha: "dim" };

const match: MatchTask = {
  key: "match",
  question: "Demo: which tiger is in each camera-trap photo?",
  tigers: [
    { name: "Tiger A", seed: 11 },
    { name: "Tiger B", seed: 22 },
    { name: "Tiger C", seed: 33 },
  ],
  photos: [
    { tiger: 1, from: 0.1, to: 0.55 },
    { tiger: 2, from: 0.5, to: 0.95 },
    { tiger: 0, from: 0.3, to: 0.75 },
  ],
  explain: "Compare where stripes split and break into spots.",
};
const matchState = freshMatch(match);

const coats = (["orange", "white", "pseudomelanistic"] as const).map((coat) =>
  h("li", {}, tigerView({ key: `coat-${coat}`, seed: 7, coat, title: `Demo: ${coat} coat` }) as unknown as HTMLElement, h("span", { cls: "match-name" }, coat)),
);

const gallery: Lesson = {
  title: "Shared pieces",
  steps: [
    ...estimates.map((e) => ({ text: [`**Estimate slider**: ${e.question}`] })),
    { text: [`**Ordering task**: ${morning.question}`] },
    { text: [`**Range map, pick task**: ${pick.question}`] },
    { text: ["**Range map, shaded and cropped**: solid, hatched and dim regions, and two marks placed by longitude and latitude."] },
    { text: ["**Stripe renderer**: one seed in three coats (the same layout each time), and a camera-trap crop of the first."] },
    { text: [`**Stripe matching task**: ${match.question}`] },
  ],
  sources: [],
  view: (i, ui) => {
    if (i < estimates.length) return [estimateView(estimates[i]!, states[i]!, ui)];
    if (i === estimates.length) return [orderView(morning, orderState, ui)];
    if (i === estimates.length + 1) return [pickView(pick, pickState, ui)];
    if (i === estimates.length + 3) return [h("ul", { cls: "match-known" }, ...coats), h("div", { cls: "match-photo" }, tigerView({ key: "crop", seed: 7, title: "Demo: crop", crop: [0.2, 0.7] }) as unknown as HTMLElement)];
    if (i === estimates.length + 4) return [matchView(match, matchState, ui)];
    return [
      mapView({
        key: "shaded",
        title: "Demo: shaded regions",
        shade: (id) => shades[id],
        crop: [400, 150, 400, 260],
        marks: [
          { lon: 77.2, lat: 28.6, label: "Delhi" },
          { lon: 85.3, lat: 27.7, label: "Kathmandu" },
        ],
      }),
    ];
  },
  hold: (i) => {
    if (i < estimates.length) return states[i]!.locked ? null : "Lock in the estimate to go on.";
    if (i === estimates.length) return orderState.locked ? null : "Lock in the order to go on.";
    if (i === estimates.length + 1) return pickState.locked ? null : "Lock in your picks to go on.";
    if (i === estimates.length + 4) return matchState.locked ? null : "Lock in your matches to go on.";
    return null;
  },
};

mount(gallery);
