// Lesson 2's live view: the time line, the check and the family-line sandbox, drawn from
// lesson2.ts (content), timeline.ts (the scale) and lineage.ts (the model).

import { h, pressed } from "./dom.ts";
import { type Estimate, estimateView, freshEstimate } from "./estimate-view.ts";
import { valueAt } from "./estimate.ts";
import {
  BOTTLENECK,
  CHECK,
  CHECK_EXPLAIN,
  CHECK_STEP,
  EVENTS,
  lessonSources,
  SCALE,
  SIZES,
  START_SIZE,
  STEPS,
  type TimeEvent,
  TITLE,
} from "./lesson2.ts";
import { breed, found, lineSizes, linesLeft, type Population } from "./lineage.ts";
import type { Lesson, Ui } from "./shell.ts";
import { at, rows, short, ticks } from "./timeline.ts";

const SVG = "http://www.w3.org/2000/svg";

/** An SVG element with attributes and children. */
function s(tag: string, attrs: Record<string, string | number> = {}, ...kids: (Node | string)[]): SVGElement {
  const e = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  e.append(...kids);
  return e;
}

let ui: Ui;

// ---- The check ----

const check: Estimate = {
  ...CHECK,
  key: "mrca",
  question: "When did the most recent common ancestor of all living tigers live?",
  format: (v) => `${v.toLocaleString("en")} years ago`,
  explain: CHECK_EXPLAIN,
  // Not the slider's middle, which is the answer itself on this scale.
  start: 1_000_000,
  words: { low: "Too recent", high: "Too long ago" },
  reverse: true,
};
const checkState = freshEstimate(check);

// ---- The time line ----

const W = 720;
const PAD = 16;
const AXIS = 34;
const ROW = 30;
const CHAR = 6.6; // average width of a 12px label character, for keeping labels apart
const xOf = (yearsAgo: number): number => PAD + at(SCALE, yearsAgo) * (W - 2 * PAD);

interface Placed {
  readonly e: TimeEvent;
  readonly x0: number;
  readonly x1: number;
  readonly labelX: number;
  readonly anchor: "start" | "end";
}

/** Each event's place and label side, and its row: fixed for the lesson, so nothing moves as events appear. */
const PLACED: readonly (Placed & { readonly row: number })[] = (() => {
  const placed = EVENTS.map((e): Placed => {
    const x0 = xOf(e.from);
    const x1 = e.open ? W - PAD : xOf(e.to ?? e.from);
    const right = (e.bounds ? xOf(e.bounds[1]) : x1) + 8;
    const width = e.label.length * CHAR;
    const left = (e.bounds ? xOf(e.bounds[0]) : x0) - 8;
    return right + width <= W ? { e, x0, x1, labelX: right, anchor: "start" } : { e, x0, x1, labelX: left, anchor: "end" };
  });
  const spans = placed.map((p) => {
    const width = p.e.label.length * CHAR;
    const left = Math.min(p.e.bounds ? xOf(p.e.bounds[0]) : p.x0, p.anchor === "end" ? p.labelX - width : p.x0);
    const right = Math.max(p.x1, p.anchor === "start" ? p.labelX + width : p.x1);
    return { start: left, width: right - left };
  });
  const r = rows(spans, 10);
  return placed.map((p, i) => ({ ...p, row: r[i]! }));
})();

// The last row leaves room below it for the learner's estimate, once it is shown.
const HEIGHT = AXIS + 46 + (Math.max(...PLACED.map((p) => p.row)) + 1) * ROW;

const rowY = (p: { row: number }): number => AXIS + 30 + p.row * ROW;

/** The dotted line from the axis down to an event's row; drawn under every mark and label. */
const guide = (p: Placed & { row: number }): SVGElement => s("line", { class: "tl-guide", x1: p.x0, y1: AXIS, x2: p.x0, y2: rowY(p) });

function eventMark(p: Placed & { row: number }): SVGElement {
  const { e, x0, x1 } = p;
  const y = rowY(p);
  const g = s("g", { class: `tl-event ${e.kind}` });
  if (e.bounds) {
    const [b0, b1] = e.bounds.map(xOf) as [number, number];
    g.append(s("line", { class: "tl-bounds", x1: b0, y1: y, x2: b1, y2: y }), s("line", { class: "tl-bounds", x1: b0, y1: y - 5, x2: b0, y2: y + 5 }), s("line", { class: "tl-bounds", x1: b1, y1: y - 5, x2: b1, y2: y + 5 }));
  }
  if (e.open) g.append(s("line", { class: "tl-open", x1: x0, y1: y, x2: x1 - 6, y2: y }), s("path", { class: "tl-arrow", d: `M${x1 - 8},${y - 4} L${x1},${y} L${x1 - 8},${y + 4}` }));
  switch (e.kind) {
    case "fossil":
      g.append(x1 - x0 > 3 ? s("rect", { class: "tl-solid", x: x0, y: y - 5, width: x1 - x0, height: 10 }) : s("rect", { class: "tl-solid", x: x0 - 5, y: y - 5, width: 10, height: 10 }));
      break;
    case "dna":
      g.append(x1 - x0 > 3 && !e.open ? s("rect", { class: "tl-solid", x: x0, y: y - 4, width: x1 - x0, height: 8, rx: 4 }) : s("circle", { class: "tl-solid", cx: x0, cy: y, r: 5 }));
      break;
    case "boundary":
      g.append(s("line", { class: "tl-boundary", x1: x0, y1: AXIS, x2: x0, y2: y + 6 }));
      break;
    case "hypothesis":
      g.append(s("line", { class: "tl-hypothesis", x1: x0, y1: AXIS, x2: x0, y2: y + 6 }), s("circle", { class: "tl-hollow", cx: x0, cy: y, r: 5 }));
      break;
  }
  g.append(s("text", { class: "tl-label", x: p.labelX, y: y + 4, "text-anchor": p.anchor }, e.label));
  g.append(s("title", {}, `${e.label}: ${e.to ? `${short(e.from)} to ${short(e.to)}` : e.open ? `from ${short(e.from)} on` : short(e.from)}`));
  return g;
}

function timeline(shown: readonly string[], guess: number | null): HTMLElement {
  const svg = s("svg", { class: "timeline", viewBox: `0 0 ${W} ${HEIGHT}`, role: "img" });
  const visible = PLACED.filter((p) => shown.includes(p.e.id));
  svg.setAttribute(
    "aria-label",
    `Time line of years ago, oldest on the left, each tick ten times older than the next. ${visible
      .map((p) => `${p.e.label}: ${p.e.to ? `${short(p.e.from)} to ${short(p.e.to)}` : short(p.e.from)}`)
      .join(". ")}`,
  );
  svg.append(s("line", { class: "tl-axis", x1: PAD, y1: AXIS, x2: W - PAD, y2: AXIS }));
  for (const t of ticks(SCALE)) {
    const x = xOf(t);
    svg.append(s("line", { class: "tl-tick", x1: x, y1: AXIS - 5, x2: x, y2: AXIS + 5 }), s("text", { class: "tl-tick-label", x, y: AXIS - 10, "text-anchor": "middle" }, short(t)));
  }
  svg.append(s("text", { class: "tl-tick-label", x: W - PAD, y: AXIS + 18, "text-anchor": "end" }, "today →"));
  if (guess !== null) {
    // Under the events' marks and labels, so it never hides them.
    const x = xOf(guess);
    svg.append(
      s("line", { class: "tl-guess-line", x1: x, y1: AXIS, x2: x, y2: HEIGHT - 16 }),
      s("path", { class: "tl-guess", d: `M${x - 6},${AXIS + 14} L${x + 6},${AXIS + 14} L${x},${AXIS + 4} Z` }),
      s("text", { class: "tl-guess-label", x, y: HEIGHT - 4, "text-anchor": x > W - 120 ? "end" : x < 120 ? "start" : "middle" }, `▲ your estimate, ${short(guess)}`),
    );
  }
  for (const p of visible) svg.append(guide(p));
  for (const p of visible) svg.append(eventMark(p));
  const legend = h(
    "p",
    { cls: "tl-legend" },
    "■ fossil · ● DNA date, – – its widest bounds · │ start of a stage · ┆ hypothesis · Mya: million years ago · kya: thousand years ago",
  );
  const cites = [...new Set(visible.flatMap((p) => p.e.cites))];
  return h("figure", { cls: "tl-figure" }, svg as unknown as HTMLElement, h("figcaption", {}, legend, cites.length ? h("span", { cls: "tl-sources" }, "Sources: ", ui.cite(cites)) : ""));
}

// ---- The sandbox: maternal lines dying out ----

interface Run {
  readonly size: number;
  readonly squeezed: boolean;
  readonly at: number;
}

let seed = 1;
let size = START_SIZE;
let pop: Population = found(size, seed);
let squeezeLeft = 0;
let squeezed: number[] = []; // generations bred at bottleneck size
const runs: Run[] = [];

function restart(n = size): void {
  size = n;
  seed++;
  pop = found(size, seed);
  squeezeLeft = 0;
  squeezed = [];
  ui.render();
}

function advance(generations: number): void {
  for (let i = 0; i < generations; i++) {
    const squeeze = squeezeLeft > 0;
    pop = breed(pop, squeeze ? BOTTLENECK.size : size);
    if (squeeze) {
      squeezeLeft--;
      squeezed.push(pop.generation);
    }
    if (pop.oneLineAt === pop.generation) {
      runs.unshift({ size, squeezed: squeezed.length > 0, at: pop.generation });
      runs.splice(6);
      break;
    }
  }
  ui.render();
}

const CW = 720;

function lineBars(): SVGElement {
  const H = 120;
  const sizes = lineSizes(pop);
  const top = Math.max(size, ...sizes);
  const w = (CW - 2 * PAD) / pop.founders;
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${CW} ${H + 10}`, role: "img" });
  svg.setAttribute("aria-label", `Females in each founder's line: ${linesLeft(pop)} of ${pop.founders} lines left.`);
  svg.append(s("line", { class: "tl-axis", x1: PAD, y1: H, x2: CW - PAD, y2: H }));
  sizes.forEach((n, i) => {
    const x = PAD + i * w;
    if (n > 0) svg.append(s("rect", { class: "line-bar", x: x + w * 0.15, y: H - (n / top) * (H - 6), width: Math.max(1, w * 0.7), height: (n / top) * (H - 6) }));
    else svg.append(s("line", { class: "line-gone", x1: x + w * 0.15, y1: H + 4, x2: x + w * 0.85, y2: H + 4 }));
  });
  return svg;
}

function linesChart(): SVGElement {
  const H = 110;
  const L = 34;
  const span = Math.max(50, pop.generation);
  const x = (g: number) => L + (g / span) * (CW - L - PAD);
  const y = (n: number) => 8 + (1 - n / pop.founders) * (H - 8);
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${CW} ${H + 22}`, role: "img" });
  svg.setAttribute("aria-label", `Maternal lines left, generation by generation: from ${pop.founders} to ${linesLeft(pop)} after ${pop.generation} generations.`);
  for (const g of squeezed) svg.append(s("rect", { class: "squeeze", x: x(g - 1), y: 8, width: Math.max(2, x(g) - x(g - 1)), height: H - 8 }));
  svg.append(
    s("line", { class: "tl-axis", x1: L, y1: H, x2: CW - PAD, y2: H }),
    s("line", { class: "tl-axis", x1: L, y1: 8, x2: L, y2: H }),
    s("text", { class: "tl-tick-label", x: L - 6, y: 12, "text-anchor": "end" }, String(pop.founders)),
    s("text", { class: "tl-tick-label", x: L - 6, y: H, "text-anchor": "end" }, "0"),
    s("text", { class: "tl-tick-label", x: L, y: H + 18 }, "generations →"),
    s("text", { class: "tl-tick-label", x: CW - PAD, y: H + 18, "text-anchor": "end" }, String(span)),
    s("polyline", { class: "lines-left", points: pop.history.map((n, g) => `${x(g)},${y(n)}`).join(" ") }),
  );
  if (squeezed.length) svg.append(s("text", { class: "tl-tick-label", x: x(squeezed[0]!) + 4, y: 22 }, "▒ bottleneck"));
  return svg;
}

function sandboxPanel(): HTMLElement {
  const done = pop.oneLineAt !== null;
  const btn = (key: string, label: string, onclick: () => void, disabled = false) => h("button", { type: "button", key, onclick, disabled }, label);
  const sizes = h(
    "div",
    { cls: "traits", attrs: { role: "group", "aria-label": "Females per generation (starts over)" } },
    h("span", { cls: "muted" }, "Females per generation: "),
    ...SIZES.map((n) => pressed(h("button", { type: "button", key: `size-${n}`, onclick: () => restart(n) }, String(n)), n === size)),
  );
  const controls = h(
    "div",
    { cls: "traits" },
    btn("gen-1", "Next generation", () => advance(1), done),
    btn("gen-10", "10 generations", () => advance(10), done),
    btn("gen-all", "Run until one line is left", () => advance(100_000), done),
    btn(
      "squeeze",
      !done && squeezeLeft > 0 ? `Bottleneck: ${squeezeLeft} to go` : "Bottleneck",
      () => {
        squeezeLeft = BOTTLENECK.generations;
        advance(1);
      },
      done || squeezeLeft > 0,
    ),
    btn("restart", "Start over", () => restart()),
  );
  const left = linesLeft(pop);
  const status = done
    ? `One line left since generation ${pop.oneLineAt}: every female alive descends, mother to mother, from founder ${pop.line[0]! + 1}. The other founders' lines are gone, though they may have had daughters.`
    : `Generation ${pop.generation}: ${pop.line.length} females, ${left} of ${pop.founders} maternal lines left.`;
  const history = runs.length
    ? [
        h("p", { cls: "muted" }, "Your runs (newest first):"),
        h("ul", { cls: "runs" }, ...runs.map((r) => h("li", {}, `${r.size} females${r.squeezed ? ", with a bottleneck" : ""}: one line after ${r.at} generations`))),
      ]
    : [];
  return h(
    "div",
    { cls: "panel" },
    sizes,
    controls,
    h("p", { cls: "verdict", attrs: { "aria-live": "polite" } }, status),
    h("p", { cls: "chart-title" }, `Each founding mother's line: one column per founder; the bar is how many living females descend from her, mother to mother. A dash means her line is gone.`),
    lineBars() as unknown as HTMLElement,
    h("p", { cls: "chart-title" }, "Maternal lines left, generation by generation"),
    linesChart() as unknown as HTMLElement,
    h("p", { cls: "muted small" }, `Bottleneck: ${BOTTLENECK.size} females for ${BOTTLENECK.generations} generations, then back to full size. A model, so its numbers are not tigers'.`),
    ...history,
  );
}

// ---- The lesson ----

export const lesson2: Lesson = {
  title: TITLE,
  steps: STEPS,
  sources: lessonSources(),
  view(i, u) {
    ui = u;
    const step = STEPS[i]!;
    const guess = i > CHECK_STEP && checkState.locked ? valueAt(check, checkState.stop) : null;
    if (step.mode === "check") return [estimateView(check, checkState, ui), timeline(step.shown, null)];
    if (step.mode === "sandbox") return [sandboxPanel()];
    return [timeline(step.shown, guess)];
  },
  hold: (i) => (STEPS[i]!.mode === "check" && !checkState.locked ? "Lock in your estimate to go on." : null),
};
