// Lesson 7's live view: Junu, the mating months, one breeding cycle, the growing-up order check,
// the stages time line, the leaving-home map, the cubs-at-two check with its survival figures,
// and the cohort sandbox, drawn from lesson7.ts.

import { h, pressed } from "./dom.ts";
import { type Estimate, estimateView, freshEstimate } from "./estimate-view.ts";
import {
  AGE_MAX,
  alive,
  AREAS,
  BIRTH_GAP,
  BIRTH_GAP_RUSSIA,
  CHECK,
  CHECK_CUBS,
  CHECK_EXPLAIN,
  CHITWAN_DEATHS,
  cohort,
  COHORT_STAGES,
  counts,
  type Cub,
  expected,
  JUNU_EVENTS,
  lessonSources,
  MATING_PEAK,
  MONTHS,
  ORDER_EXPLAIN,
  PATHS,
  type Place,
  PREGNANCY_MONTHS,
  RUSSIA_LITTER,
  type Sex,
  SEXES,
  SPANS,
  STAGES,
  STAGES_START,
  STEPS,
  TITLE,
  WITH_MOTHER,
} from "./lesson7.ts";
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

const one = (x: number): string => x.toFixed(1);

function junu(): HTMLElement {
  return h(
    "figure",
    { cls: "coat-figure" },
    asEl(tigerView({ key: "junu", seed: JUNU, title: "Junu, side view" })),
    h("figcaption", {}, "Junu, nearly four. A drawing: her pattern is made up, but it is hers in every lesson."),
  );
}

// ---- The mating months ----

function mating(): HTMLElement {
  const L = 20;
  const cw = (W - 2 * L) / 12;
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} 96`, role: "img" });
  svg.setAttribute("aria-label", `The twelve months. Mating can happen in any of them; most happens in ${MATING_PEAK.map((m) => MONTHS[m]).join(", ")}, shown solid.`);
  MONTHS.forEach((m, i) => {
    const peak = MATING_PEAK.includes(i);
    const x = L + i * cw;
    svg.append(
      s("rect", { class: peak ? "life-peak" : "life-month", x: x + 2, y: 20, width: cw - 4, height: 34 }),
      s("text", { class: "tl-tick-label", x: x + cw / 2, y: 72, "text-anchor": "middle" }, m),
    );
  });
  svg.append(
    s("text", { class: "tl-label", x: L + 2 * cw, y: 12, "text-anchor": "middle" }, "most matings"),
    s("text", { class: "tl-label", x: L + 7 * cw, y: 12, "text-anchor": "middle" }, "fewer, but any month"),
  );
  return h("figure", { cls: "tl-figure" }, asEl(svg), h("figcaption", {}, "Solid: November to April, when most mating happens. Outlined: the rest of the year. Sources: ", ui.cite(["SINZ", "CATSG"])));
}

// ---- One breeding cycle ----

function cycle(): HTMLElement {
  const L = 170;
  const R = W - 20;
  const lo = -4;
  const hi = 30;
  const x = (m: number) => L + ((m - lo) / (hi - lo)) * (R - L);
  const axis = 150;
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} ${axis + 34}`, role: "img" });
  svg.setAttribute(
    "aria-label",
    `One breeding cycle, in months from the litter's birth: pregnancy for about ${one(PREGNANCY_MONTHS)} months before it; cubs with their mother until ${WITH_MOTHER[0]}–${WITH_MOTHER[1]} months; the next litter ${BIRTH_GAP[0]}–${BIRTH_GAP[1]} months after, ${BIRTH_GAP_RUSSIA} on average in the Russian Far East.`,
  );
  const row = (y: number, label: string) => {
    svg.append(s("text", { class: "tl-label", x: L - 12, y: y + 4, "text-anchor": "end" }, label), s("line", { class: "tl-guide", x1: L, y1: y, x2: R, y2: y }));
  };
  row(30, "pregnant");
  svg.append(s("rect", { class: "life-bar", x: x(-PREGNANCY_MONTHS), y: 24, width: x(0) - x(-PREGNANCY_MONTHS), height: 12 }));
  row(70, "cubs with her");
  svg.append(
    s("rect", { class: "life-bar", x: x(0), y: 64, width: x(WITH_MOTHER[0]) - x(0), height: 12 }),
    s("rect", { class: "life-spread", x: x(WITH_MOTHER[0]), y: 64, width: x(WITH_MOTHER[1]) - x(WITH_MOTHER[0]), height: 12 }),
  );
  row(110, "next litter");
  svg.append(
    s("rect", { class: "life-spread", x: x(BIRTH_GAP[0]), y: 104, width: x(BIRTH_GAP[1]) - x(BIRTH_GAP[0]), height: 12 }),
    s("circle", { class: "tl-hollow", cx: x(BIRTH_GAP_RUSSIA), cy: 110, r: 5 }),
    s("line", { class: "tl-hypothesis", x1: x(0), y1: 14, x2: x(0), y2: axis }),
    s("text", { class: "tl-label", x: x(0) + 6, y: 14 }, "cubs born"),
  );
  for (let m = 0; m <= hi; m += 6)
    svg.append(
      s("line", { class: "tl-tick", x1: x(m), y1: axis, x2: x(m), y2: axis + 6 }),
      s("text", { class: "tl-tick-label", x: x(m), y: axis + 20, "text-anchor": "middle" }, m === 0 ? "0 months" : String(m)),
    );
  svg.append(s("line", { class: "tl-axis", x1: L, y1: axis, x2: R, y2: axis }));
  return h(
    "figure",
    { cls: "tl-figure" },
    asEl(svg),
    h(
      "figcaption",
      {},
      `Solid: a typical span. Outlined: where a span ends, somewhere in this range. Hollow dot: the Russian Far East's average, ${BIRTH_GAP_RUSSIA} months. Sources: `,
      ui.cite(["SINZ", "CATSG", "Kerley2003"]),
    ),
  );
}

// ---- The growing-up order check ----

const stages: OrderTask = {
  key: "stages",
  question: "Put the stages of a young female's life in order, first at the top.",
  items: STAGES,
  start: STAGES_START,
  explain: ORDER_EXPLAIN,
};
const stagesState = freshOrder(stages);

// ---- The stages time line ----

function timeline(): HTMLElement {
  const L = 250;
  const R = W - 20;
  const x = (m: number) => L + (m / AGE_MAX) * (R - L);
  const ROW = 34;
  const rows = SPANS.length + 1;
  const axis = 20 + rows * ROW;
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} ${axis + 34}`, role: "img" });
  const said = SPANS.map((sp) => `${sp.label}: ${one(sp.from / 12)} to ${one(sp.to / 12)} years${sp.mean ? `, ${one(sp.mean / 12)} on average` : ""}`);
  svg.setAttribute("aria-label", `Ages from birth to seven years. ${said.join("; ")}. Junu: ${JUNU_EVENTS.map(([m, e]) => `${e} at ${m} months`).join(", ")}.`);
  SPANS.forEach((sp, k) => {
    const y = 26 + k * ROW;
    svg.append(
      s("text", { class: "tl-label", x: L - 12, y: y + 4, "text-anchor": "end" }, sp.label),
      s("line", { class: "tl-guide", x1: L, y1: y, x2: R, y2: y }),
      s("rect", { class: "life-bar", x: x(sp.from), y: y - 6, width: Math.max(2, x(sp.to) - x(sp.from)), height: 12 }),
    );
    if (sp.mean !== undefined) svg.append(s("circle", { class: "tl-hollow", cx: x(sp.mean), cy: y, r: 5 }));
  });
  const jy = 26 + SPANS.length * ROW;
  svg.append(s("text", { class: "tl-label", x: L - 12, y: jy + 4, "text-anchor": "end" }, "Junu"), s("line", { class: "tl-guide", x1: L, y1: jy, x2: R, y2: jy }));
  JUNU_EVENTS.forEach(([m, e], k) =>
    svg.append(
      s("line", { class: "kill ref", x1: x(m), y1: jy - 8, x2: x(m), y2: jy + 8 }),
      s("text", { class: "tl-tick-label", x: x(m) + 4, y: jy + (k % 2 ? 20 : -10) }, e),
    ),
  );
  for (let m = 0; m <= AGE_MAX; m += 12)
    svg.append(
      s("line", { class: "tl-tick", x1: x(m), y1: axis, x2: x(m), y2: axis + 6 }),
      s("text", { class: "tl-tick-label", x: x(m), y: axis + 20, "text-anchor": "middle" }, m === 0 ? "birth" : `${m / 12} yr`),
    );
  svg.append(s("line", { class: "tl-axis", x1: L, y1: axis, x2: R, y2: axis }));
  return h(
    "figure",
    { cls: "tl-figure" },
    asEl(svg),
    h(
      "figcaption",
      {},
      "Bars: each source's span. Black dots: Chitwan's averages. Dashed ticks: Junu's own life, a typical one. Sources: ",
      ui.cite([...new Set(SPANS.flatMap((sp) => sp.keys))]),
    ),
  );
}

// ---- Leaving home: the map ----

const MX = 7.2; // map units to pixels

function leavingMap(): HTMLElement {
  const H = 60 * MX;
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} ${H}`, role: "img" });
  svg.setAttribute(
    "aria-label",
    "A drawing: Junu's mother's range, and Junu's next to it. Junu's path, solid, is a short step next door. Her brother's path, dashed, runs far east through degraded forest to a temporary range on poorer ground. Hatched farmland runs along the south; neither path crosses it.",
  );
  svg.append(
    s(
      "defs",
      {},
      s("pattern", { id: "life-hatch", width: 6, height: 6, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, s("line", { x1: 0, y1: 0, x2: 0, y2: 6, stroke: "#6a6a6a", "stroke-width": 2 })),
      s("marker", { id: "life-arrow", viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, s("path", { d: "M0,0 L10,5 L0,10 z", fill: "#e6e6e6" })),
    ),
  );
  for (const a of AREAS) {
    svg.append(s("rect", { class: `life-area ${a.kind}`, x: a.x * MX, y: a.y * MX, width: a.w * MX, height: a.h * MX }));
    svg.append(s("text", { class: "tl-label", x: (a.x + a.w / 2) * MX, y: (a.y + (a.kind === "farm" ? a.h / 2 : 3.5)) * MX + 4, "text-anchor": "middle" }, a.label));
  }
  const line = (p: readonly (readonly [number, number])[]) => p.map(([px, py]) => `${px * MX},${py * MX}`).join(" ");
  svg.append(
    s("polyline", { class: "life-path brother", points: line(PATHS.brother), "marker-end": "url(#life-arrow)" }),
    s("polyline", { class: "life-path junu", points: line(PATHS.junu), "marker-end": "url(#life-arrow)" }),
    s("circle", { class: "tl-solid", cx: PATHS.junu[0]![0] * MX, cy: PATHS.junu[0]![1] * MX, r: 5 }),
    s("text", { class: "tl-label", x: PATHS.junu[0]![0] * MX, y: 31.5 * MX, "text-anchor": "middle" }, "where they grew up"),
  );
  return h(
    "figure",
    { cls: "tl-figure" },
    asEl(svg),
    h(
      "figcaption",
      {},
      "Solid arrow: Junu settles next door. Dashed arrow: her brother goes far, through degraded forest, to a temporary range; neither crosses the hatched farmland. A drawing of the pattern, not real data or to scale. Source: ",
      ui.cite(["Smith1993"]),
    ),
  );
}

// ---- The cubs-at-two check ----

const check: Estimate = {
  ...CHECK,
  key: "cubs",
  question: `Of ${CHECK_CUBS} cubs born in Chitwan, how many are still alive two years later?`,
  format: (v) => `${Number.isInteger(v) ? v : `about ${one(v)}`} of ${CHECK_CUBS} cubs`,
  explain: CHECK_EXPLAIN,
  start: 9,
  words: { low: "Too few", high: "Too many" },
};
const checkState = freshEstimate(check);

function survival(): HTMLElement {
  const L = 200;
  const R = W - 70;
  const x = (n: number) => L + (n / CHECK_CUBS) * (R - L);
  const chitwan = alive(CHECK_CUBS, CHITWAN_DEATHS);
  const russia = CHECK_CUBS * (RUSSIA_LITTER[1] / RUSSIA_LITTER[0]);
  const rows: { label: string; n: number | null; cls: string }[] = [
    { label: "born", n: CHECK_CUBS, cls: "life-bar" },
    { label: "Chitwan, at 1 year", n: chitwan[1]!, cls: "life-bar" },
    { label: "Chitwan, at 2 years", n: chitwan[2]!, cls: "life-bar" },
    { label: "Russian Far East, at 1 year", n: russia, cls: "life-spread" },
  ];
  const ROW = 32;
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} ${20 + rows.length * ROW}`, role: "img" });
  svg.setAttribute("aria-label", `Of ${CHECK_CUBS} cubs: ${rows.map((r) => `${r.label}, ${one(r.n!)}`).join("; ")}.`);
  rows.forEach((r, k) => {
    const y = 22 + k * ROW;
    svg.append(
      s("text", { class: "tl-label", x: L - 12, y: y + 4, "text-anchor": "end" }, r.label),
      s("rect", { class: r.cls, x: L, y: y - 8, width: x(r.n!) - L, height: 16 }),
      s("text", { class: "tl-label", x: x(r.n!) + 8, y: y + 4 }, one(r.n!)),
    );
  });
  return h(
    "figure",
    { cls: "tl-figure" },
    asEl(svg),
    h(
      "figcaption",
      {},
      `Of ${CHECK_CUBS} cubs. Solid: Chitwan, from its yearly death rates (the multiplying is this lesson's). Outlined: the Russian Far East, from litters shrinking from ${RUSSIA_LITTER[0]} to ${RUSSIA_LITTER[1]} cubs. Sources: `,
      ui.cite(["CATSG", "Kerley2003"]),
    ),
  );
}

// ---- The cohort sandbox ----

const sand = { size: 10, place: "chitwan" as Place, seed: 1 };
let cubs: Cub[] = cohort(sand.size, sand.place, sand.seed);
const rerun = () => {
  cubs = cohort(sand.size, sand.place, sand.seed);
  ui.render();
};

const SEX_WORD: Readonly<Record<Sex, string>> = { daughter: "Daughters", son: "Sons" };

function cohortSvg(): SVGElement {
  const L = 200;
  const half = (W - L - 20) / 2;
  const side = sand.size / 2;
  const cols = Math.min(25, side);
  const gap = Math.min(28, (half - 20) / cols);
  const r = Math.min(8, gap * 0.38);
  const lines = Math.ceil(side / cols);
  const ROW = 18 + lines * gap;
  const top = 30;
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} ${top + COHORT_STAGES.length * ROW}`, role: "img" });
  const d = counts(cubs, "daughter");
  const so = counts(cubs, "son");
  svg.setAttribute("aria-label", `${sand.size} cubs. ${COHORT_STAGES.map((st, i) => `${st}: ${d[i]} daughters, ${so[i]} sons`).join("; ")}.`);
  SEXES.forEach((sex, k) => svg.append(s("text", { class: "tl-label", x: L + k * half + 6, y: 16 }, `${SEX_WORD[sex]} (${sex === "daughter" ? "circles" : "squares"})`)));
  COHORT_STAGES.forEach((st, i) => {
    const y = top + i * ROW;
    svg.append(s("text", { class: "tl-label", x: L - 12, y: y + gap / 2 + 4, "text-anchor": "end" }, st), s("line", { class: "tl-guide", x1: 20, y1: y - 6, x2: W - 20, y2: y - 6 }));
    SEXES.forEach((sex, k) => {
      const n = (sex === "daughter" ? d : so)[i]!;
      for (let j = 0; j < side; j++) {
        const cx = L + k * half + 6 + (j % cols) * gap + gap / 2;
        const cy = y + Math.floor(j / cols) * gap + gap / 2;
        const cls = j < n ? "tl-solid" : "life-gone";
        svg.append(sex === "daughter" ? s("circle", { class: cls, cx, cy, r }) : s("rect", { class: cls, x: cx - r, y: cy - r, width: 2 * r, height: 2 * r }));
      }
    });
  });
  return svg;
}

function sandbox(): HTMLElement {
  const choice = (label: string, on: boolean, key: string, set: () => void) =>
    pressed(
      h(
        "button",
        {
          type: "button",
          key,
          onclick: () => {
            set();
            rerun();
          },
        },
        label,
      ),
      on,
    );
  const d = counts(cubs, "daughter");
  const so = counts(cubs, "son");
  const ed = expected(sand.size / 2, sand.place, "daughter");
  const es = expected(sand.size / 2, sand.place, "son");
  const avg = (v: number) => (Number.isInteger(v) ? String(v) : one(v));
  return h(
    "div",
    { cls: "panel" },
    h(
      "div",
      { cls: "traits", attrs: { role: "group", "aria-label": "How many cubs" } },
      choice("10 cubs", sand.size === 10, "size-10", () => (sand.size = 10)),
      choice("100 cubs", sand.size === 100, "size-100", () => (sand.size = 100)),
    ),
    h(
      "div",
      { cls: "traits", attrs: { role: "group", "aria-label": "Whose first year" } },
      choice("First year: Chitwan", sand.place === "chitwan", "place-chitwan", () => (sand.place = "chitwan")),
      choice("First year: Russian Far East", sand.place === "russia", "place-russia", () => (sand.place = "russia")),
      h(
        "button",
        {
          type: "button",
          key: "run-again",
          onclick: () => {
            sand.seed++;
            rerun();
          },
        },
        "Run again",
      ),
    ),
    h(
      "figure",
      { cls: "tl-figure" },
      asEl(cohortSvg()),
      h(
        "figcaption",
        {},
        "Solid: still alive at that stage. Faint outline: lost before it. A model: each cub gets through each stage by chance, with the studies' figures; half daughters and half sons is a setting of the model. Sources: ",
        ui.cite([sand.place === "chitwan" ? "CATSG" : "Kerley2003", "CATSG", "Smith1993"].filter((k, i, a) => a.indexOf(k) === i)),
      ),
    ),
    h(
      "table",
      { cls: "cats" },
      h("caption", { cls: "muted small", attrs: { "aria-live": "polite" } }, `Run ${sand.seed}: ${sand.size} cubs, first year from ${sand.place === "chitwan" ? "Chitwan" : "the Russian Far East"}.`),
      h(
        "thead",
        {},
        h(
          "tr",
          {},
          h("th", { attrs: { scope: "col" } }, "Stage"),
          h("th", { attrs: { scope: "col" } }, "Daughters, this run"),
          h("th", { attrs: { scope: "col" } }, "on average"),
          h("th", { attrs: { scope: "col" } }, "Sons, this run"),
          h("th", { attrs: { scope: "col" } }, "on average"),
        ),
      ),
      h(
        "tbody",
        {},
        ...COHORT_STAGES.map((st, i) =>
          h("tr", {}, h("th", { attrs: { scope: "row" } }, st), h("td", {}, String(d[i])), h("td", { cls: "muted" }, avg(ed[i]!)), h("td", {}, String(so[i])), h("td", { cls: "muted" }, avg(es[i]!))),
        ),
      ),
    ),
  );
}

// ---- The lesson ----

export const lesson7: Lesson = {
  title: TITLE,
  steps: STEPS,
  sources: lessonSources(),
  view(i, u) {
    ui = u;
    switch (STEPS[i]!.view) {
      case "junu":
        return [junu()];
      case "mating":
        return [mating()];
      case "cycle":
        return [cycle()];
      case "order":
        return [orderView(stages, stagesState, ui)];
      case "stages":
        return [timeline()];
      case "map":
        return [leavingMap()];
      case "estimate":
        return [estimateView(check, checkState, ui)];
      case "survival":
        return [estimateView(check, checkState, ui), survival()];
      case "sandbox":
        return [sandbox()];
    }
  },
  hold(i) {
    const v = STEPS[i]!.view;
    if (v === "order" && !stagesState.locked) return "Lock in your order to go on.";
    if (v === "estimate" && !checkState.locked) return "Lock in your estimate to go on.";
    return null;
  },
};
