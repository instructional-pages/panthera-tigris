// Lesson 11's live view: the buffer-zone map, the conflict cycle, the two-question check, the
// sourced figures as bars, the Bhutan comparison, and the villager sandbox, drawn from
// lesson11.ts.

import { h, pressed } from "./dom.ts";
import {
  BARS,
  type Bars,
  CHECK,
  COMPANY_EFFECT,
  type Company,
  type Effect,
  judgePairs,
  lessonSources,
  PLACE_EFFECT,
  PLACE_LABEL,
  PLACES,
  type Place,
  POSTURE_EFFECT,
  type Posture,
  rank,
  RANK_MAX,
  STEPS,
  TITLE,
  type Villager,
} from "./lesson11.ts";
import type { Lesson, Ui } from "./shell.ts";

const SVG = "http://www.w3.org/2000/svg";

function s(tag: string, attrs: Record<string, string | number> = {}, ...kids: (Node | string)[]): SVGElement {
  const e = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  e.append(...kids);
  return e;
}

const asEl = (n: SVGElement): HTMLElement => n as unknown as HTMLElement;

let ui: Ui;

// ---- The buffer-zone map: a drawing ----

const W = 720;
const H = 340;
const PARK = 120; // the park boundary's y
const EDGE = 210; // the forest edge's y
const ONE_KM = 262; // "1 km from the forest", not to scale

/** Where the sandbox's villager stands for each place. */
const SPOT: Readonly<Record<Place, [number, number]>> = { forest: [440, 200], edge: [440, 252], far: [450, 326] };

/** A person, standing or bent over to cut grass: legs, a back, a head. */
function person(x: number, y: number, bending: boolean): SVGElement {
  const hip = y - 9;
  const legs = [s("line", { x1: x, y1: hip, x2: x - 4, y2: y }), s("line", { x1: x, y1: hip, x2: x + 4, y2: y })];
  return bending
    ? s("g", { class: "person" }, ...legs, s("line", { x1: x, y1: hip, x2: x + 13, y2: hip - 8 }), s("circle", { cx: x + 19, cy: hip - 6, r: 5 }))
    : s("g", { class: "person" }, ...legs, s("line", { x1: x, y1: hip, x2: x, y2: hip - 13 }), s("circle", { cx: x, cy: hip - 19, r: 5 }));
}

function hatch(id: string, gap: number, cls: string): SVGElement {
  return s(
    "pattern",
    { id, width: gap, height: gap, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" },
    s("line", { class: cls, x1: 0, y1: 0, x2: 0, y2: gap }),
  );
}

function village(x: number, y: number): SVGElement {
  const g = s("g", { class: "village" });
  for (const [dx, dy] of [[0, 0], [18, -6], [34, 2], [10, 14], [28, 16]] as const) g.append(s("rect", { x: x + dx, y: y + dy, width: 11, height: 9 }));
  g.append(s("text", { class: "tl-label", x: x - 2, y: y + 40 }, "Village"));
  return g;
}

/** The map; `who` adds the sandbox's villager, `junu` the grass cutters of the opening step. */
function map(opts: { who?: Villager; cutters?: boolean } = {}): HTMLElement {
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} ${H}`, role: "img" });
  svg.setAttribute(
    "aria-label",
    `A drawing of a buffer zone: the national park's forest at the top; below its boundary, the buffer-zone forest, with Junu's range reaching into it; then the forest edge, fields and two villages, with paths from the villages into the forest.${opts.who ? ` A villager, ${PLACE_LABEL[opts.who.place].toLowerCase()}, ${opts.who.company === "alone" ? "alone" : "in a group"}, ${opts.who.posture === "bending" ? "bending to cut grass" : "standing"}.` : ""}`,
  );
  svg.append(
    s("defs", {}, hatch("l11-park", 6, "hatch-park"), hatch("l11-buffer", 12, "hatch-buffer")),
    s("rect", { x: 0, y: 0, width: W, height: PARK, fill: "url(#l11-park)" }),
    s("rect", { x: 0, y: PARK, width: W, height: EDGE - PARK, fill: "url(#l11-buffer)" }),
    s("line", { class: "tl-bounds", x1: 0, x2: W, y1: PARK, y2: PARK }),
    s("line", { class: "forest-edge", x1: 0, x2: W, y1: EDGE, y2: EDGE }),
    s("line", { class: "tl-guide", x1: 0, x2: W, y1: ONE_KM, y2: ONE_KM }),
    // Paths from the villages into the forest.
    s("path", { class: "map-path", d: `M140 300 C 150 250, 210 220, 230 ${PARK + 20}` }),
    s("path", { class: "map-path", d: `M590 300 C 560 250, 520 220, 500 ${PARK + 20}` }),
    village(110, 290),
    village(575, 290),
    s("ellipse", { class: "junu-range", cx: 330, cy: 112, rx: 150, ry: 70 }),
    s("text", { class: "tl-label", x: 260, y: 90 }, "Junu's range"),
    s("text", { class: "tl-label", x: 10, y: 22 }, "National park: forest"),
    s("text", { class: "tl-label", x: W - 10, y: PARK - 6, "text-anchor": "end" }, "Park boundary (dashed)"),
    s("text", { class: "tl-label", x: 10, y: PARK + 22 }, "Buffer-zone forest: grass, fodder, firewood"),
    s("text", { class: "tl-label", x: W - 10, y: EDGE - 6, "text-anchor": "end" }, "Forest edge"),
    s("text", { class: "tl-label", x: 10, y: EDGE + 22 }, "Fields"),
    s("text", { class: "tl-tick-label", x: W - 10, y: ONE_KM - 5, "text-anchor": "end" }, "1 km from the forest edge"),
  );
  if (opts.cutters) for (const x of [420, 460, 500]) svg.append(person(x, 200, true));
  if (opts.who) {
    const [x, y] = SPOT[opts.who.place];
    const xs = opts.who.company === "alone" ? [x] : [x - 36, x, x + 36];
    for (const px of xs) svg.append(person(px, y, opts.who.posture === "bending"));
  }
  return h(
    "figure",
    { cls: "tl-figure" },
    asEl(svg),
    h("figcaption", {}, "A drawing, not a real place, and not to scale. Hatched: forest, denser inside the park. Buffer zones: ", ui.cite(["Dhakal2026"])),
  );
}

// ---- The conflict cycle ----

function conflict(): HTMLElement {
  const box = (top: string, bottom: string) => h("div", { cls: "formula-box" }, h("strong", {}, top), h("span", { cls: "muted small" }, bottom));
  const arrow = () => h("span", { cls: "formula-op", attrs: { "aria-hidden": "true" } }, "→");
  return h(
    "figure",
    { cls: "tl-figure" },
    h(
      "div",
      { cls: "formula", attrs: { role: "img", "aria-label": "Tigers kill livestock and sometimes people; people kill tigers in return or from fear; support for saving tigers falls." } },
      box("Tigers kill", "livestock, sometimes people"),
      arrow(),
      box("People kill tigers", "in return, or from fear"),
      arrow(),
      box("Support falls", "for saving tigers"),
    ),
    h("figcaption", {}, "Human–tiger conflict, in three links. Sources: ", ui.cite(["Goodrich2010", "Inskip2009"])),
  );
}

// ---- The check ----

const checkState: { picks: (0 | 1 | null)[]; locked: boolean } = { picks: CHECK.map(() => null), locked: false };

function checkView(): HTMLElement {
  const right = checkState.locked ? judgePairs(checkState.picks) : undefined;
  const list = h("ol", { cls: "match-photos" });
  CHECK.forEach((p, i) => {
    const row = h("li", { cls: "match-photo pair-row" }, h("strong", {}, p.question));
    const pick = checkState.picks[i];
    if (!right) {
      const group = h("span", { cls: "match-buttons", attrs: { role: "group", "aria-label": p.question } });
      p.options.forEach((o, k) =>
        group.append(
          pressed(
            h(
              "button",
              {
                type: "button",
                key: `pair-${i}-${k}`,
                onclick: () => {
                  checkState.picks[i] = k as 0 | 1;
                  ui.render();
                },
              },
              o,
            ),
            pick === k,
          ),
        ),
      );
      row.append(group);
    } else {
      row.classList.add(right[i] ? "right" : "wrong");
      row.append(
        h("span", { cls: "match-verdict" }, right[i] ? `✓ You said: ${p.options[pick!]}` : `✗ You said: ${p.options[pick!]}`),
        h("span", { cls: "pair-reveal" }, ...ui.rich(p.reveal)),
      );
    }
    list.append(row);
  });
  const box = h("div", { cls: "panel match" }, h("p", { cls: "match-question" }, "Which of the two carried more risk?"), list);
  if (!right)
    box.append(
      h(
        "button",
        {
          type: "button",
          key: "pair-lock",
          disabled: checkState.picks.some((x) => x === null),
          onclick: () => {
            checkState.locked = true;
            ui.render();
            ui.focusNext();
          },
        },
        "Lock in my answers",
      ),
    );
  return box;
}

// ---- Sourced figures as bars ----

function bars(b: Bars): HTMLElement {
  const list = h("ul", { cls: "share-rows", attrs: { "aria-label": b.caption } });
  for (const r of b.rows) {
    const bar = h("span", { cls: r.bright ? "share-bar bright" : "share-bar", attrs: { "aria-hidden": "true" } });
    bar.style.width = `${(100 * r.value) / b.max}%`;
    list.append(h("li", {}, h("span", { cls: "share-label" }, r.label), h("span", { cls: "share-track" }, bar), h("span", { cls: "share-value" }, r.note)));
  }
  return h("figure", { cls: "tl-figure" }, list, h("figcaption", {}, `${b.caption} Sources: `, ui.cite(b.keys)));
}

// ---- Bhutan: a tiger near the village ----

function livestock(): HTMLElement {
  const side = (cls: string, title: string, items: string[]) => h("div", { cls: `compare-side ${cls}` }, h("strong", {}, title), h("ul", {}, ...items.map((t) => h("li", {}, t))));
  return h(
    "figure",
    { cls: "tl-figure" },
    h(
      "div",
      { cls: "compare" },
      side("solid", "A tiger in the forest near the village", [
        "Leopards and dholes kept closer to the fields",
        "They ate more of the wild animals that raid crops",
        "Farmers lost significantly fewer crops and livestock",
      ]),
      side("dashed", "No tiger present", ["Leopards and dholes stayed deeper in the forest", "They killed more free-ranging livestock"]),
    ),
    h("figcaption", {}, "Western Bhutan. Solid border: with a tiger; dashed: without. Source: ", ui.cite(["Thinley2018"])),
  );
}

// ---- The sandbox ----

const sand: { place: Place; company: Company; posture: Posture } = { place: "forest", company: "alone", posture: "bending" };

function choices<T extends string>(label: string, key: string, options: readonly T[], names: Readonly<Record<T, string>>, current: T, set: (v: T) => void): HTMLElement {
  return h(
    "div",
    { cls: "choice-row", attrs: { role: "group", "aria-label": label } },
    h("span", { cls: "muted small choice-label" }, `${label}: `),
    ...options.map((o) =>
      pressed(
        h(
          "button",
          {
            type: "button",
            key: `${key}-${o}`,
            onclick: () => {
              set(o);
              ui.render();
            },
          },
          names[o],
        ),
        current === o,
      ),
    ),
  );
}

function effect(e: Effect): HTMLElement {
  return h("li", { cls: e.up ? "effect up" : "effect down" }, h("span", { cls: "effect-arrow" }, e.up ? "▲ riskier" : "▼ safer"), h("span", {}, ...ui.rich(e.text)));
}

function ladder(r: number): HTMLElement {
  const rungs = h("ol", { cls: "ladder", attrs: { "aria-label": `Ranking: ${r} of ${RANK_MAX} riskier steps. An order, not a measured risk.` } });
  for (let i = 0; i <= RANK_MAX; i++) rungs.append(h("li", { cls: i === r ? "rung here" : "rung", attrs: { "aria-hidden": "true" } }));
  return h(
    "div",
    { cls: "ladder-box" },
    h("p", { cls: "small" }, h("strong", {}, "The ladder"), " (an order, not a measured risk)"),
    h("div", { cls: "ladder-row" }, h("span", { cls: "muted small" }, "lower"), rungs, h("span", { cls: "muted small" }, "higher")),
  );
}

function sandbox(): HTMLElement {
  const v: Villager = { ...sand };
  return h(
    "div",
    { cls: "panel" },
    choices("Where", "place", PLACES, PLACE_LABEL, sand.place, (x) => (sand.place = x)),
    choices("With", "company", ["alone", "group"] as const, { alone: "Alone", group: "In a group" }, sand.company, (x) => (sand.company = x)),
    choices("Doing", "posture", ["bending", "upright"] as const, { bending: "Bending to cut grass", upright: "Standing or walking" }, sand.posture, (x) => (sand.posture = x)),
    h("div", { attrs: { "aria-live": "polite" } }, h("ul", { cls: "effects" }, effect(PLACE_EFFECT[v.place]), effect(COMPANY_EFFECT[v.company]), effect(POSTURE_EFFECT[v.posture])), ladder(rank(v))),
    map({ who: v }),
    h(
      "p",
      { cls: "muted small" },
      "The ladder counts the riskier choices, with place counting two steps because the studies order its three choices: in the forest, near it, farther away. How the factors really combine is not known. Posture's figures are the chance of dying once attacked; the others are shares of attacks or of victims, not chances.",
    ),
  );
}

// ---- The lesson ----

export const lesson11: Lesson = {
  title: TITLE,
  steps: STEPS,
  sources: lessonSources(),
  view(i, u) {
    ui = u;
    const view = STEPS[i]!.view;
    switch (view) {
      case "junu":
        return [map({ cutters: true })];
      case "conflict":
        return [conflict()];
      case "check":
        return [checkView()];
      case "livestock":
        return [livestock()];
      case "sandbox":
        return [sandbox()];
      default:
        return [bars(BARS[view]!)];
    }
  },
  hold(i) {
    return STEPS[i]!.view === "check" && !checkState.locked ? "Lock in your answers to go on." : null;
  },
};
