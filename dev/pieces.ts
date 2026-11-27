// A dev-only gallery of the shared lesson pieces, mounted with the real shell, for checking
// them in a browser before a lesson uses them (`npm run dev`, then /dev/pieces.html).
// Not part of the build. Values are demos, not facts, so nothing here is cited.

import "../src/style.css";
import { type Estimate, estimateView, freshEstimate } from "../src/estimate-view.ts";
import { type OrderTask, freshOrder, orderView } from "../src/order-view.ts";
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

const gallery: Lesson = {
  title: "Shared pieces",
  steps: [
    ...estimates.map((e) => ({ text: [`**Estimate slider**: ${e.question}`] })),
    { text: [`**Ordering task**: ${morning.question}`] },
  ],
  sources: [],
  view: (i, ui) => [i < estimates.length ? estimateView(estimates[i]!, states[i]!, ui) : orderView(morning, orderState, ui)],
  hold: (i) => {
    if (i < estimates.length) return states[i]!.locked ? null : "Lock in the estimate to go on.";
    return orderState.locked ? null : "Lock in the order to go on.";
  },
};

mount(gallery);
