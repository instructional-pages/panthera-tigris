// Lesson 5's live view: Junu, the hunt-order check, the prey by body mass, the GPS clusters,
// the days-between-kills check and the kill-rate sandbox, drawn from lesson5.ts.

import { h, pressed } from "./dom.ts";
import { type Estimate, estimateView, freshEstimate } from "./estimate-view.ts";
import {
  BAND,
  type Case,
  CASES,
  CHECK,
  CHECK_EXPLAIN,
  CHOICE_TEXT,
  HUNT,
  HUNT_EXPLAIN,
  HUNT_START,
  inBand,
  killDays,
  lessonSources,
  logPos,
  MASS_KG,
  MASS_TICKS,
  PREY,
  SPAN_DAYS,
  STEPS,
  TITLE,
} from "./lesson5.ts";
import { freshOrder, type OrderTask, orderView } from "./order-view.ts";
import type { Lesson, Ui } from "./shell.ts";
import { JUNU } from "./junu.ts";
import { tigerView } from "./stripes-view.ts";

const SVG = "http://www.w3.org/2000/svg";

function s(tag: string, attrs: Record<string, string | number> = {}, ...kids: (Node | string)[]): SVGElement {
  const e = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  e.append(...kids);
  return e;
}

const asEl = (n: SVGElement): HTMLElement => n as unknown as HTMLElement;

let ui: Ui;

const W = 720;

function junu(): HTMLElement {
  return h(
    "figure",
    { cls: "coat-figure" },
    asEl(tigerView({ key: "junu", seed: JUNU, title: "Junu, side view" })),
    h("figcaption", {}, "Junu at eighteen months. A drawing: her pattern is made up, but it is hers in every lesson."),
  );
}

// ---- The hunt-order check ----

const hunt: OrderTask = {
  key: "hunt",
  question: "Put the steps of a tiger's hunt in order, first at the top.",
  items: HUNT,
  start: HUNT_START,
  explain: HUNT_EXPLAIN,
};
const huntState = freshOrder(hunt);

// ---- The prey, by body mass ----

function preyChart(band: boolean, chosen: boolean): HTMLElement {
  const L = 300;
  const R = W - 20;
  const x = (kg: number) => L + logPos(kg, MASS_KG[0], MASS_KG[1]) * (R - L);
  const ROW = 30;
  const top = 34;
  const axis = top + PREY.length * ROW;
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} ${axis + 40}`, role: "img" });
  const said = PREY.map((p) => `${p.name}${p.livestock ? " (livestock)" : ""}, ${p.kg} kg, ${p.share}% of prey items${chosen && p.choice ? `, ${CHOICE_TEXT[p.choice]}` : ""}`);
  svg.setAttribute(
    "aria-label",
    `Prey found in Chitwan tigers' scats, by the study's estimated weight on a scale from ${MASS_KG[0]} to ${MASS_KG[1]} kg: ${said.join("; ")}.${band ? ` Shaded: ${BAND[0]}–${BAND[1]} kg, the range tigers prefer range-wide.` : ""}`,
  );
  if (band)
    svg.append(
      s("rect", { class: "prey-band", x: x(BAND[0]), y: top - 8, width: x(BAND[1]) - x(BAND[0]), height: axis - top + 8 }),
      s("text", { class: "tl-label", x: (x(BAND[0]) + x(BAND[1])) / 2, y: top - 14, "text-anchor": "middle" }, `preferred range-wide: ${BAND[0]}–${BAND[1]} kg`),
    );
  for (const t of MASS_TICKS)
    svg.append(
      s("line", { class: "tl-guide", x1: x(t), y1: top - 8, x2: x(t), y2: axis }),
      s("line", { class: "tl-tick", x1: x(t), y1: axis, x2: x(t), y2: axis + 6 }),
      s("text", { class: "tl-tick-label", x: x(t), y: axis + 20, "text-anchor": "middle" }, `${t} kg`),
    );
  svg.append(
    s("line", { class: "tl-axis", x1: L, y1: axis, x2: R, y2: axis }),
    s("text", { class: "tl-tick-label", x: R, y: axis + 36, "text-anchor": "end" }, "heavier →"),
  );
  PREY.forEach((p, i) => {
    const y = top + i * ROW + 10;
    const mark = chosen && p.choice ? (p.choice === "more" ? "▲ " : p.choice === "less" ? "▼ " : "– ") : "";
    svg.append(
      s("text", { class: "tl-label", x: 10, y: y + 4 }, `${mark}${p.name}${p.livestock ? " (livestock)" : ""}`),
      s("text", { class: "tl-tick-label", x: L - 12, y: y + 4, "text-anchor": "end" }, chosen && p.choice ? CHOICE_TEXT[p.choice] : `${p.share}% of items`),
      s("circle", { class: p.livestock ? "tl-hollow" : "tl-solid", cx: x(p.kg), cy: y, r: 5 }),
      s("text", { class: "tl-tick-label halo", x: x(p.kg) + 10, y: y + 4 }, `${p.kg} kg${band && inBand(p.kg) ? " · in the band" : ""}`),
    );
  });
  const cites = band ? ["Bhandari2017", "Hayward2012"] : ["Bhandari2017"];
  return h(
    "figure",
    { cls: "tl-figure" },
    asEl(svg),
    h(
      "figcaption",
      {},
      chosen
        ? "▲ taken more than expected from how common it is, ▼ less, – no clear difference; no mark where the study gives no test. "
        : "A logarithmic scale: each tick is about double or 2.5 times the one before. Wild prey solid, livestock hollow. ",
      "Weights are the Chitwan study's estimates. Sources: ",
      ui.cite(cites),
    ),
  );
}

// ---- GPS clusters ----

/** A drawn track: scattered fixes, then a tight cluster where the tiger stayed. Not real data. */
const TRACK: readonly (readonly [number, number])[] = [
  [40, 150], [95, 120], [150, 135], [205, 100], [255, 115], [300, 90],
  [340, 82], [348, 90], [336, 94], [344, 78], [352, 86], [338, 86], [346, 96], [342, 84],
  [400, 110], [455, 95], [510, 130], [565, 115], [620, 140], [675, 120],
];

function gps(): HTMLElement {
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} 190`, role: "img" });
  svg.setAttribute("aria-label", "A drawing of a GPS track: locations spread out along the tiger's path, then many bunched in one spot, circled as a cluster where a kill is likely, then spread out again.");
  svg.append(s("polyline", { class: "gps-path", points: TRACK.map((p) => p.join(",")).join(" ") }));
  for (const [cx, cy] of TRACK) svg.append(s("circle", { class: "tl-solid", cx, cy, r: 3.5 }));
  svg.append(
    s("circle", { class: "tl-open-ring", cx: 344, cy: 87, r: 26 }),
    s("text", { class: "tl-label", x: 344, y: 40, "text-anchor": "middle" }, "a cluster: many hours in one spot"),
    s("text", { class: "tl-tick-label", x: 344, y: 54, "text-anchor": "middle" }, "researchers walk here and look for a carcass"),
    s("text", { class: "tl-tick-label", x: 40, y: 178 }, "each dot: one location from the collar"),
  );
  return h("figure", { cls: "tl-figure" }, asEl(svg), h("figcaption", {}, "A drawing of the method, not real data. Source: ", ui.cite(["Miller2013"])));
}

// ---- The days-between-kills check ----

const check: Estimate = {
  ...CHECK,
  key: "days",
  question: "On average, how many days pass between one kill and the next?",
  format: (v) => `${v} ${v === 1 ? "day" : "days"}`,
  explain: CHECK_EXPLAIN,
  start: 20,
  words: { low: "Too few days", high: "Too many days" },
};
const checkState = freshEstimate(check);

// ---- The strip of days ----

const SL = 150;
const SR = W - 20;
const dayX = (d: number): number => SL + (d / SPAN_DAYS) * (SR - SL);

/** One row of kills, `cls` "kill" (solid) or "kill ref" (dashed). */
function killRow(svg: SVGElement, c: Case, y: number, cls: string, name: string): void {
  svg.append(s("text", { class: "tl-label", x: SL - 12, y: y + 4, "text-anchor": "end" }, name));
  svg.append(s("line", { class: "tl-guide", x1: SL, y1: y, x2: SR, y2: y }));
  for (const d of killDays(c.days, SPAN_DAYS)) svg.append(s("line", { class: cls, x1: dayX(d), y1: y - 9, x2: dayX(d), y2: y + 9 }));
}

function strip(rows: readonly { c: Case; cls: string; name: string }[]): SVGElement {
  const ROW = 40;
  const top = 24;
  const axis = top + rows.length * ROW;
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} ${axis + 30}`, role: "img" });
  svg.setAttribute(
    "aria-label",
    `${SPAN_DAYS} days: ${rows.map((r) => `${r.name}, a kill every ${r.c.days} days, ${killDays(r.c.days, SPAN_DAYS).length} kills`).join("; ")}.`,
  );
  rows.forEach((r, i) => killRow(svg, r.c, top + i * ROW + 10, r.cls, r.name));
  for (let d = 0; d <= SPAN_DAYS; d += 10)
    svg.append(
      s("line", { class: "tl-tick", x1: dayX(d), y1: axis, x2: dayX(d), y2: axis + 6 }),
      s("text", { class: "tl-tick-label", x: dayX(d), y: axis + 20, "text-anchor": "middle" }, d === 0 ? "day 0" : String(d)),
    );
  svg.append(s("line", { class: "tl-axis", x1: SL, y1: axis, x2: SR, y2: axis }));
  return svg;
}

const YEAR = CASES[0]!;

function rate(): HTMLElement {
  return h(
    "figure",
    { cls: "tl-figure" },
    asEl(strip([{ c: YEAR, cls: "kill", name: "All year" }])),
    h("figcaption", {}, `Each mark is a kill, drawn evenly at the average of 6.5 days: ${killDays(YEAR.days, SPAN_DAYS).length} in ${SPAN_DAYS} days. Source: `, ui.cite(["Miller2013"])),
  );
}

// ---- The sandbox ----

let picked: Case = YEAR;

function sandbox(): HTMLElement {
  const rows = picked === YEAR ? [{ c: YEAR, cls: "kill", name: "All year" }] : [{ c: picked, cls: "kill", name: picked.label }, { c: YEAR, cls: "kill ref", name: "All year" }];
  const n = killDays(picked.days, SPAN_DAYS).length;
  const meat = picked.kgPerDay === null ? "The study gives no meat per day for this case." : `About ${picked.kgPerDay} kg of meat a day.`;
  return h(
    "div",
    { cls: "panel" },
    h(
      "div",
      { cls: "traits", attrs: { role: "group", "aria-label": "Which average" } },
      h("span", { cls: "muted" }, "Show: "),
      ...CASES.map((c) =>
        pressed(
          h(
            "button",
            {
              type: "button",
              key: `case-${c.key}`,
              onclick: () => {
                picked = c;
                ui.render();
              },
            },
            c.label,
          ),
          c === picked,
        ),
      ),
    ),
    h("figure", { cls: "tl-figure" }, asEl(strip(rows)), h("figcaption", {}, picked === YEAR ? "Each mark is a kill, drawn evenly at the average." : "Solid marks: the case you picked. Dashed marks: the year's average, for comparison.")),
    h(
      "div",
      { cls: "verdict", attrs: { "aria-live": "polite" } },
      h("p", {}, h("strong", {}, `${picked.label}: a kill every ${picked.days} days, ${n} in ${SPAN_DAYS} days. `), meat),
      h("p", {}, ...ui.rich(picked.note)),
    ),
    h("p", { cls: "muted small" }, "Averages from three GPS-collared Amur tigers in Russia, 2009–2012. Small and large prey are split at 40 kg, as the study splits them."),
  );
}

// ---- The lesson ----

export const lesson5: Lesson = {
  title: TITLE,
  steps: STEPS,
  sources: lessonSources(),
  view(i, u) {
    ui = u;
    switch (STEPS[i]!.view) {
      case "junu":
        return [junu()];
      case "order":
        return [orderView(hunt, huntState, ui), junu()];
      case "prey":
        return [preyChart(false, false)];
      case "prey-band":
        return [preyChart(true, false)];
      case "prey-chosen":
        return [preyChart(true, true)];
      case "gps":
        return [gps()];
      case "estimate":
        return [estimateView(check, checkState, ui)];
      case "rate":
        return [estimateView(check, checkState, ui), rate()];
      case "sandbox":
        return [sandbox()];
    }
  },
  hold(i) {
    const v = STEPS[i]!.view;
    if (v === "order" && !huntState.locked) return "Lock in your order to go on.";
    if (v === "estimate" && !checkState.locked) return "Lock in your estimate to go on.";
    return null;
  },
};
