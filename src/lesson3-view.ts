// Lesson 3's live view: the size scene, the coats, the stripe-matching check and the two
// genetics sandboxes, drawn from lesson3.ts (content), stripes-view.ts (the tigers) and
// genes.ts (the models).

import { h, pressed } from "./dom.ts";
import { breedCub, type Copies, cubOdds, type Drift, nextGeneration, settled, share, shows, startDrift } from "./genes.ts";
import {
  CHECK_EXPLAIN,
  COPIES_LABEL,
  type Gene,
  GENES,
  JUNU,
  lessonSources,
  MATCH_PHOTOS,
  MATCH_TIGERS,
  MAX_CUBS,
  MAX_GENERATIONS,
  PERSON_M,
  POPULATIONS,
  RUNS,
  scaled,
  SIMILIPAL_SHARE,
  SIZES,
  START_POPULATION,
  START_SHARE,
  STEPS,
  THREE,
  TITLE,
} from "./lesson3.ts";
import type { Lesson, Ui } from "./shell.ts";
import { random } from "./stripes.ts";
import { type MatchTask, DRAWING, freshMatch, matchView, tigerView } from "./stripes-view.ts";

const SVG = "http://www.w3.org/2000/svg";

function s(tag: string, attrs: Record<string, string | number> = {}, ...kids: (Node | string)[]): SVGElement {
  const e = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  e.append(...kids);
  return e;
}

const asEl = (n: SVGElement): HTMLElement => n as unknown as HTMLElement;

let ui: Ui;

/** A tiger drawing with a caption under it. */
function figure(svg: SVGElement, ...caption: (Node | string)[]): HTMLElement {
  return h("figure", { cls: "coat-figure" }, asEl(svg), h("figcaption", {}, ...caption));
}

// ---- The size scene: the largest and smallest tigers beside a person, to scale ----

const SW = 720;
const PX = 105; // pixels per metre
const GROUND = 200;

function person(x: number): SVGElement {
  const t = PERSON_M * PX;
  const head = t * 0.13;
  const top = GROUND - t;
  const w = t * 0.26;
  return s(
    "g",
    { class: "person" },
    s("circle", { cx: x + w / 2, cy: top + head / 2, r: head / 2 }),
    s("path", {
      d: `M${x + w * 0.1},${top + head * 1.15} L${x + w * 0.9},${top + head * 1.15} L${x + w},${top + t * 0.5} L${x + w * 0.75},${top + t * 0.5} L${x + w * 0.72},${GROUND} L${x + w * 0.54},${GROUND} L${x + w / 2},${top + t * 0.56} L${x + w * 0.46},${GROUND} L${x + w * 0.28},${GROUND} L${x + w * 0.25},${top + t * 0.5} L${x},${top + t * 0.5} Z`,
    }),
  );
}

function sizeScene(): HTMLElement {
  const svg = s("svg", { class: "size-scene", viewBox: `0 0 ${SW} ${GROUND + 70}`, role: "img" });
  svg.setAttribute(
    "aria-label",
    `To scale beside a person ${PERSON_M} m tall: ${SIZES.map((z) => `${z.name}, ${z.detail}, drawn ${z.length} m from nose to tail tip`).join("; ")}.`,
  );
  let x = 14;
  svg.append(person(x));
  svg.append(s("text", { class: "tl-tick-label", x: 6, y: GROUND + 34 }, `a person, ${PERSON_M} m`));
  x += PERSON_M * 0.26 * PX + 24;
  for (const [i, z] of SIZES.entries()) {
    const { width, height } = scaled(DRAWING, z.length);
    const left = x - DRAWING.tail * (width / DRAWING.width) * PX;
    const tiger = tigerView({ key: `size-${i}`, seed: 500 + i, title: z.name });
    tiger.setAttribute("x", String(left));
    tiger.setAttribute("y", String(GROUND - DRAWING.ground * (height / DRAWING.height) * PX));
    tiger.setAttribute("width", String(width * PX));
    tiger.setAttribute("height", String(height * PX));
    tiger.removeAttribute("class");
    tiger.classList.add("coat-orange");
    const end = x + z.length * PX;
    // The tiger's length, nose to tail tip, as a bracket under it.
    svg.append(
      tiger,
      s("path", { class: "size-bracket", d: `M${x},${GROUND + 8} v6 H${end} v-6` }),
      s("text", { class: "size-name", x: (x + end) / 2, y: GROUND + 34, "text-anchor": "middle" }, z.name),
      s("text", { class: "tl-tick-label", x: (x + end) / 2, y: GROUND + 50, "text-anchor": "middle" }, z.detail),
    );
    x = end + 34;
  }
  svg.append(s("line", { class: "tl-axis", x1: 6, y1: GROUND, x2: SW - 6, y2: GROUND }));
  // A one-metre bar, for reading the scale.
  svg.append(
    s("line", { class: "tl-axis", x1: SW - 14 - PX, y1: 20, x2: SW - 14, y2: 20 }),
    s("line", { class: "tl-axis", x1: SW - 14 - PX, y1: 15, x2: SW - 14 - PX, y2: 25 }),
    s("line", { class: "tl-axis", x1: SW - 14, y1: 15, x2: SW - 14, y2: 25 }),
    s("text", { class: "tl-tick-label", x: SW - 14 - PX / 2, y: 12, "text-anchor": "middle" }, "1 m"),
  );
  return h(
    "figure",
    { cls: "tl-figure" },
    asEl(svg),
    h(
      "figcaption",
      {},
      "Drawn to length, nose to tail tip, at each source's maximum; the height follows the drawing. A person is drawn for scale. Females are smaller, but the sources give no figures for them. Sources: ",
      ui.cite([...new Set(SIZES.flatMap((z) => z.cites))]),
    ),
  );
}

// ---- Coats ----

function coatView(): HTMLElement[] {
  return [figure(tigerView({ key: "junu", seed: JUNU, title: "Junu, side view" }), "Junu, from her left side. A drawing: her pattern is made up, but it is hers in every lesson.")];
}

function uniqueView(): HTMLElement[] {
  return [
    h(
      "ul",
      { cls: "match-known" },
      ...THREE.map((t, i) => h("li", {}, asEl(tigerView({ key: `three-${i}`, seed: t.seed, title: `${t.name}, side view` })), h("span", { cls: "match-name" }, t.name))),
    ),
    h("p", { cls: "muted small" }, "Three drawn tigers: the same kind of coat, three different patterns of stripes."),
  ];
}

function cameraView(): HTMLElement[] {
  return [
    h(
      "div",
      { cls: "coat-pair" },
      figure(tigerView({ key: "cam-junu", seed: JUNU, title: "Junu, side view" }), "Junu, photographed in full."),
    figure(tigerView({ key: "cam-photo", seed: JUNU, title: "A camera-trap photo: part of a tiger's flank", crop: [0.35, 0.8] }), "A camera-trap photo: part of one side. Its stripes match Junu's, so it is Junu."),
    ),
  ];
}

function variantView(coat: "white" | "pseudomelanistic", seed: number, label: string): HTMLElement[] {
  return [
    h(
      "div",
      { cls: "coat-pair" },
      figure(tigerView({ key: `${coat}-orange`, seed, title: "An orange tiger" }), "Orange: no changed copies, or one (a carrier)."),
      figure(tigerView({ key: `${coat}-variant`, seed, coat, title: label }), `${label}: two changed copies.`),
    ),
  ];
}

// ---- The check ----

const task: MatchTask = {
  key: "l3",
  question: "Which tiger is in each camera-trap photo?",
  tigers: MATCH_TIGERS,
  photos: MATCH_PHOTOS,
  explain: CHECK_EXPLAIN,
};
const matchState = freshMatch(task);

// ---- Sandbox 1: breeding ----

let gene: Gene = "white";
let mother: Copies = 1;
let father: Copies = 1;
let cubs: Copies[] = [];
let cubSeed = 1;
const cubRandom = random(4);

function setParents(change: () => void): void {
  change();
  cubs = [];
  ui.render();
}

function breed(n: number): void {
  for (let i = 0; i < n; i++) cubs.push(breedCub(mother, father, cubRandom));
  cubSeed += n;
  if (cubs.length > MAX_CUBS) cubs = cubs.slice(-MAX_CUBS);
  ui.render();
}

const pct = (p: number): string => `${Math.round(p * 100)}%`;

function copiesPicker(who: string, value: Copies, set: (c: Copies) => void): HTMLElement {
  return h(
    "div",
    { cls: "traits", attrs: { role: "group", "aria-label": `${who}'s changed copies (clears the cubs)` } },
    h("span", { cls: "muted" }, `${who}: `),
    ...([0, 1, 2] as Copies[]).map((c) => pressed(h("button", { type: "button", key: `${who}-${c}`, onclick: () => setParents(() => set(c)) }, COPIES_LABEL[c]), c === value)),
  );
}

function breedPanel(): HTMLElement {
  const coat = gene === "white" ? "white" : "pseudomelanistic";
  const name = gene === "white" ? "white" : "\"black\"";
  const odds = cubOdds(mother, father);
  const showingCubs = cubs.filter(shows).length;
  const first = cubSeed - cubs.length;
  const list = h(
    "ul",
    { cls: "cubs" },
    ...cubs.map((c, i) =>
      h(
        "li",
        { cls: shows(c) ? "shows" : "" },
        asEl(tigerView({ key: `cub-${i}`, seed: 1000 + first + i, coat: shows(c) ? coat : "orange", title: `Cub ${i + 1}: ${COPIES_LABEL[c]}` })),
        h("span", { cls: "small" }, `${c} ${c === 1 ? "copy" : "copies"}`),
      ),
    ),
  );
  const status = cubs.length
    ? `${showingCubs} of ${cubs.length} cubs ${showingCubs === 1 ? "is" : "are"} ${name}. With these parents, each cub's chance is ${pct(odds[2])} of two changed copies (${name}), ${pct(odds[1])} of one (a carrier, orange), ${pct(odds[0])} of none.`
    : "No cubs yet.";
  return h(
    "div",
    { cls: "panel" },
    h(
      "div",
      { cls: "traits", attrs: { role: "group", "aria-label": "Gene (clears the cubs)" } },
      h("span", { cls: "muted" }, "Gene: "),
      ...GENES.map((g) => pressed(h("button", { type: "button", key: `gene-${g.id}`, onclick: () => setParents(() => (gene = g.id)) }, g.label), g.id === gene)),
    ),
    copiesPicker("Mother", mother, (c) => (mother = c)),
    copiesPicker("Father", father, (c) => (father = c)),
    h(
      "div",
      { cls: "traits" },
      h("button", { type: "button", key: "breed-1", onclick: () => breed(1) }, "Breed a cub"),
      h("button", { type: "button", key: "breed-10", onclick: () => breed(10) }, "Breed 10 cubs"),
      h("button", { type: "button", key: "breed-clear", onclick: () => setParents(() => {}), disabled: cubs.length === 0 }, "Clear"),
    ),
    h("p", { cls: "verdict", attrs: { "aria-live": "polite" } }, status),
    list,
    h("p", { cls: "muted small" }, `Each cub's coat is drawn with its copies under it. A model: real litters are small, so these are many litters' cubs together. The last ${MAX_CUBS} are kept.`),
  );
}

// ---- Sandbox 2: drift, in many populations at once ----

let size = START_POPULATION;
let batch = 0;
let pops: Drift[] = [];
let rnd = random(1);
const batches: string[] = [];

function newRuns(n = size): void {
  if (pops.length && pops[0]!.history.length > 1) {
    batches.unshift(`${pops[0]!.size.toLocaleString("en")} tigers: ${summary(pops)}`);
    batches.splice(6);
  }
  size = n;
  batch++;
  rnd = random(batch * 7919);
  pops = Array.from({ length: RUNS }, () => startDrift(size, START_SHARE));
}
newRuns();

const generation = (): number => pops[0]!.history.length - 1;
const over = (): boolean => generation() >= MAX_GENERATIONS || pops.every(settled);

function run(generations: number): void {
  for (let i = 0; i < generations && !over(); i++) pops = pops.map((d) => (settled(d) ? { ...d, history: [...d.history, share(d)] } : nextGeneration(d, rnd)));
  ui.render();
}

const plural = (n: number, one: string, many = `${one}s`): string => `${n} ${n === 1 ? one : many}`;

function summary(ps: readonly Drift[]): string {
  const lost = ps.filter((d) => share(d) === 0).length;
  const everywhere = ps.filter((d) => share(d) === 1).length;
  const reached = ps.filter((d) => d.history.some((p) => p >= SIMILIPAL_SHARE)).length;
  return `after ${plural(ps[0]!.history.length - 1, "generation")}, lost in ${lost} of ${ps.length} populations; reached Similipal's ${SIMILIPAL_SHARE} in ${reached}${everywhere ? `, in every tiger in ${everywhere}` : ""}.`;
}

function driftChart(): SVGElement {
  const H = 160;
  const L = 40;
  const x = (g: number) => L + (g / MAX_GENERATIONS) * (SW - L - 16);
  const y = (p: number) => 8 + (1 - p) * (H - 8);
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${SW} ${H + 22}`, role: "img" });
  svg.setAttribute("aria-label", `The changed copy's share of all copies in ${RUNS} populations of ${size} tigers, ${summary(pops)}`);
  svg.append(
    s("line", { class: "tl-axis", x1: L, y1: H, x2: SW - 16, y2: H }),
    s("line", { class: "tl-axis", x1: L, y1: 8, x2: L, y2: H }),
    s("text", { class: "tl-tick-label", x: L - 6, y: 12, "text-anchor": "end" }, "100%"),
    s("text", { class: "tl-tick-label", x: L - 6, y: H, "text-anchor": "end" }, "0%"),
    s("text", { class: "tl-tick-label", x: L, y: H + 18 }, "generations →"),
    s("text", { class: "tl-tick-label", x: SW - 16, y: H + 18, "text-anchor": "end" }, String(MAX_GENERATIONS)),
    s("line", { class: "ref-line", x1: L, y1: y(SIMILIPAL_SHARE), x2: SW - 16, y2: y(SIMILIPAL_SHARE) }),
    s("text", { class: "tl-tick-label", x: SW - 16, y: y(SIMILIPAL_SHARE) - 5, "text-anchor": "end" }, `Similipal today: ${SIMILIPAL_SHARE}`),
  );
  for (const d of pops) svg.append(s("polyline", { class: "drift-line", points: d.history.map((p, g) => `${x(g)},${y(p)}`).join(" ") }));
  return svg;
}

function driftPanel(): HTMLElement {
  const done = over();
  const g = generation();
  const status = g === 0 ? `${RUNS} populations of ${size.toLocaleString("en")} tigers, each starting with the changed copy at ${pct(START_SHARE)}.` : `${done ? "Done" : "So far"}: ${summary(pops)}`;
  return h(
    "div",
    { cls: "panel" },
    h(
      "div",
      { cls: "traits", attrs: { role: "group", "aria-label": "Tigers in each population (starts new runs)" } },
      h("span", { cls: "muted" }, "Tigers in each population: "),
      ...POPULATIONS.map((n) =>
        pressed(
          h(
            "button",
            {
              type: "button",
              key: `pop-${n}`,
              onclick: () => {
                newRuns(n);
                ui.render();
              },
            },
            n.toLocaleString("en"),
          ),
          n === size,
        ),
      ),
    ),
    h(
      "div",
      { cls: "traits" },
      h("button", { type: "button", key: "drift-1", onclick: () => run(1), disabled: done }, "Next generation"),
      h("button", { type: "button", key: "drift-10", onclick: () => run(10), disabled: done }, "10 generations"),
      h("button", { type: "button", key: "drift-all", onclick: () => run(MAX_GENERATIONS), disabled: done }, `Run to ${MAX_GENERATIONS}`),
      h(
        "button",
        {
          type: "button",
          key: "drift-new",
          onclick: () => {
            newRuns();
            ui.render();
          },
        },
        "New runs",
      ),
    ),
    h("p", { cls: "verdict", attrs: { "aria-live": "polite" } }, status),
    h("p", { cls: "chart-title" }, `The changed copy's share of all copies, one line per population; the dotted line is Similipal's share today. Source: `, ui.cite(["Sagar2021"])),
    asEl(driftChart()),
    h("p", { cls: "muted small" }, `Each population is cut off from the others, and every copy in a generation is drawn at random from the one before. A model, so its numbers are not tigers'.`),
    ...(batches.length ? [h("p", { cls: "muted" }, "Earlier runs (newest first):"), h("ul", { cls: "runs" }, ...batches.map((b) => h("li", {}, b)))] : []),
  );
}

// ---- The lesson ----

export const lesson3: Lesson = {
  title: TITLE,
  steps: STEPS,
  sources: lessonSources(),
  view(i, u) {
    ui = u;
    switch (STEPS[i]!.view) {
      case "size":
        return [sizeScene()];
      case "coat":
        return coatView();
      case "unique":
        return uniqueView();
      case "camera":
        return cameraView();
      case "check":
        return [matchView(task, matchState, ui)];
      case "white":
        return variantView("white", JUNU, "White");
      case "black":
        return variantView("pseudomelanistic", JUNU, "Pseudomelanistic");
      case "breed":
        return [breedPanel()];
      case "drift":
        return [driftPanel()];
    }
  },
  hold: (i) => (STEPS[i]!.view === "check" && !matchState.locked ? "Lock in your matches to go on." : null),
};
