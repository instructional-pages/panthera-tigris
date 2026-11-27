// Lesson 10's live view: measured tiger densities on a log scale, the prey-to-tigers model,
// the check, home ranges to scale, tigers and leopards in Rajaji, and the prey sandbox, drawn
// from lesson10.ts.

import { h, pressed } from "./dom.ts";
import { type Estimate, estimateView, freshEstimate } from "./estimate-view.ts";
import {
  along,
  AXIS,
  CHECK,
  CHECK_EXPLAIN,
  CHECK_QUESTION,
  dots,
  KILLS_PER_YEAR,
  km2PerTiger,
  LEOPARD_TEXT,
  leopardsAt,
  lessonSources,
  PLENTY_FROM,
  PREY_MAX,
  PREY_MIN,
  RAJAJI,
  RANGES,
  SCARCE_BELOW,
  SHARE,
  SHARES,
  SITES,
  STEPS,
  tigersPer100,
  TITLE,
} from "./lesson10.ts";
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

const fmt = (n: number): string => n.toLocaleString("en-GB", { maximumFractionDigits: 1 });

// ---- Habitats ----

const HABITATS: readonly string[] = [
  "Tropical rainforest",
  "Mangrove swamps (the Sundarbans of India and Bangladesh)",
  "Semi-dry forests of western India",
  "Himalayan forests, up to about 4,500 m",
  "Temperate forests of Russia and north-east China",
];

function habitats(): HTMLElement {
  return h(
    "figure",
    { cls: "tl-figure" },
    h("ul", { cls: "habitat-list" }, ...HABITATS.map((t) => h("li", {}, t))),
    h("p", { cls: "habitat-need" }, "All of them: enough deer, wild pigs and wild cattle."),
    h("figcaption", {}, "Where tigers live, and the one thing every place needs. Source: ", ui.cite(["Goodrich2022"])),
  );
}

// ---- Measured densities, on a log axis ----

const W = 720;
const LABEL_W = 270;
const ROW = 34;
const x = (d: number): number => LABEL_W + along(d) * (W - LABEL_W - 20);
const TICKS = [0.1, 0.3, 1, 3, 10, 30];

/** The sites as bars on a log axis; `bright` names the row the text points at, `extra` adds the model's value. */
function sites(opts: { bright?: string; model?: { per100: number } } = {}): HTMLElement {
  const rows = SITES.length + (opts.model ? 1 : 0);
  const H = rows * ROW + 40;
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} ${H}`, role: "img" });
  svg.setAttribute(
    "aria-label",
    `Tigers per 100 km², on a stretched scale: ${SITES.map((r) => `${r.label}, ${r.note}`).join("; ")}${opts.model ? `; the model, ${fmt(opts.model.per100)}` : ""}.`,
  );
  const axisY = rows * ROW + 6;
  svg.append(s("line", { class: "tl-axis", x1: x(AXIS.min), x2: x(AXIS.max), y1: axisY, y2: axisY }));
  for (const t of TICKS) {
    svg.append(
      s("line", { class: "tl-guide", x1: x(t), x2: x(t), y1: 0, y2: axisY }),
      s("line", { class: "tl-tick", x1: x(t), x2: x(t), y1: axisY, y2: axisY + 5 }),
      s("text", { class: "tl-tick-label", x: x(t), y: axisY + 18, "text-anchor": "middle" }, String(t)),
    );
  }
  SITES.forEach((r, i) => {
    const y = i * ROW + ROW / 2;
    const dim = opts.bright !== undefined && opts.bright !== r.label;
    const g = s("g", { opacity: dim ? 0.45 : 1 });
    g.append(s("text", { class: "tl-label", x: 0, y: y + 4 }, r.label));
    if (r.kind === "span") {
      g.append(s("rect", { class: "tl-solid", x: x(r.lo), y: y - 6, width: Math.max(3, x(r.hi) - x(r.lo)), height: 12 }));
    } else {
      // Before as a hollow dot, after as a solid one, joined by an arrow.
      g.append(
        s("line", { class: "tl-arrow", x1: x(r.lo) + 6, x2: x(r.hi) - 8, y1: y, y2: y }),
        s("path", { class: "tl-arrow", d: `M${x(r.hi) - 13} ${y - 4} L${x(r.hi) - 8} ${y} L${x(r.hi) - 13} ${y + 4}` }),
        s("circle", { class: "tl-hollow", cx: x(r.lo), cy: y, r: 5 }),
        s("circle", { class: "tl-solid", cx: x(r.hi), cy: y, r: 5 }),
      );
    }
    g.append(s("text", { class: "tl-tick-label", x: Math.min(x(r.hi) + 10, W - 60), y: y - 9 }, r.note));
    svg.append(g);
  });
  if (opts.model) {
    const y = SITES.length * ROW + ROW / 2;
    svg.append(
      s("text", { class: "tl-label", x: 0, y: y + 4 }, "The model forest (dashed: not a real place)"),
      s("rect", { class: "tl-bounds", fill: "none", x: x(Math.max(AXIS.min, opts.model.per100)) - 6, y: y - 6, width: 12, height: 12 }),
    );
  }
  return h(
    "figure",
    { cls: "tl-figure" },
    asEl(svg),
    h(
      "figcaption",
      {},
      "Tigers per 100 km². Bars: the span a source gives. Hollow dot then solid: before and after. The scale is stretched: each mark is about three times the one before it. Sources: ",
      ui.cite(["Goodrich2022", "Karanth2004", "Harihar2011"]),
    ),
  );
}

// ---- The model, as words ----

function model(): HTMLElement {
  const box = (top: string, bottom: string) => h("div", { cls: "formula-box" }, h("strong", {}, top), h("span", { cls: "muted small" }, bottom));
  return h(
    "figure",
    { cls: "tl-figure" },
    h(
      "div",
      { cls: "formula", attrs: { role: "img", "aria-label": "Tigers per 100 km² equals prey in 100 km², times the share they can spare a year, divided by kills per tiger a year." } },
      box("Tigers", "per 100 km²"),
      h("span", { cls: "formula-op" }, "="),
      box("Prey", "in 100 km²"),
      h("span", { cls: "formula-op" }, "×"),
      box("Share spared", "a year; made up"),
      h("span", { cls: "formula-op" }, "÷"),
      box(`${KILLS_PER_YEAR} kills`, "a tiger a year"),
    ),
    h("figcaption", {}, "A teaching model, not a published one. Kills per year: ", ui.cite(["Goodrich2022", "Miller2013"])),
  );
}

// ---- The check ----

const check: Estimate = {
  ...CHECK,
  key: "density",
  question: CHECK_QUESTION,
  format: (v) => `${v} tiger${v === 1 ? "" : "s"}`,
  explain: CHECK_EXPLAIN,
  start: 10,
};
const checkState = freshEstimate(check);

// ---- Home ranges, to scale ----

function ranges(): HTMLElement {
  const KM = 12; // px per km
  const big = Math.sqrt(RANGES.russia) * KM;
  const small = Math.sqrt(RANGES.chitwan) * KM;
  const H = big + 50;
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} ${H}`, role: "img" });
  svg.setAttribute("aria-label", `Two squares to scale: a Chitwan female's home range, about ${RANGES.chitwan} km², and a Russian Far East female's, about ${RANGES.russia} km².`);
  const left = 40;
  svg.append(
    s("rect", { class: "tl-hollow", x: left, y: 10, width: big, height: big }),
    s("text", { class: "tl-label", x: left + 10, y: 30 }, `Russian Far East: about ${RANGES.russia} km²`),
    s("rect", { class: "tl-solid", x: left + big + 40, y: 10 + big - small, width: small, height: small }),
    s("text", { class: "tl-label", x: left + big + 40, y: 10 + big - small - 8 }, `Chitwan: about ${RANGES.chitwan} km²`),
    s("line", { class: "tl-axis", x1: left, x2: left + 10 * KM, y1: big + 30, y2: big + 30 }),
    s("text", { class: "tl-tick-label", x: left + 10 * KM + 8, y: big + 34 }, "10 km"),
  );
  return h(
    "figure",
    { cls: "tl-figure" },
    asEl(svg),
    h("figcaption", {}, "Average female home ranges, drawn as squares to scale (real ranges have no such shape). Source: ", ui.cite(["Goodrich2022"])),
  );
}

// ---- Tigers and leopards in Rajaji ----

function rajaji(): HTMLElement {
  const max = RAJAJI.leopards.before;
  const rows = [
    { label: "Tigers, before", v: RAJAJI.tigers.before, bright: true },
    { label: "Tigers, four years after", v: RAJAJI.tigers.after, bright: true },
    { label: "Leopards, before", v: RAJAJI.leopards.before, bright: false },
    { label: "Leopards, four years after", v: RAJAJI.leopards.after, bright: false },
  ];
  const list = h("ul", { cls: "share-rows", attrs: { "aria-label": "Tiger and leopard densities in Rajaji, before and after" } });
  for (const r of rows) {
    const bar = h("span", { cls: r.bright ? "share-bar bright" : "share-bar hatched", attrs: { "aria-hidden": "true" } });
    bar.style.width = `${(100 * r.v) / max}%`;
    list.append(h("li", {}, h("span", { cls: "share-label" }, r.label), h("span", { cls: "share-track" }, bar), h("span", { cls: "share-value" }, `${r.v} per 100 km²`)));
  }
  return h(
    "figure",
    { cls: "tl-figure" },
    list,
    h("figcaption", {}, "Rajaji National Park, India, after herders and their livestock were moved out. Tigers: bright bars; leopards: hatched. Source: ", ui.cite(["Harihar2011"])),
  );
}

// ---- The sandbox ----

const sand = { prey: 30, share: SHARE };

function square(per100: number): SVGElement {
  const n = Math.floor(per100);
  const S = 300;
  const k = S / 10;
  const svg = s("svg", { class: "density-square", viewBox: `0 0 ${S + 20} ${S + 30}`, role: "img" });
  svg.setAttribute("aria-label", `A 10 km by 10 km square with ${n} tiger${n === 1 ? "" : "s"} drawn in it.`);
  svg.append(s("rect", { class: "tl-hollow", x: 10, y: 10, width: S, height: S }));
  for (const d of dots(n)) svg.append(s("circle", { class: "tl-solid", cx: 10 + d.x * k, cy: 10 + d.y * k, r: 6 }));
  svg.append(s("text", { class: "tl-tick-label", x: 10, y: S + 26 }, "100 km²: 10 km on each side"));
  return svg;
}

function sandbox(): HTMLElement {
  const out = h("div", { attrs: { "aria-live": "polite" } });
  const say = (): string => `${sand.prey} prey per km²`;
  const draw = () => {
    const per100 = tigersPer100(sand.prey, sand.share);
    const area = km2PerTiger(per100);
    const leo = leopardsAt(sand.prey);
    out.replaceChildren(
      h(
        "div",
        { cls: "density-row" },
        asEl(square(per100)),
        h(
          "div",
          { cls: "density-read" },
          h("p", {}, h("strong", {}, `${fmt(per100)} tigers`), " per 100 km²", per100 % 1 ? ` (drawn as ${Math.floor(per100)})` : ""),
          h("p", {}, h("strong", {}, `${area >= 10 ? fmt(Math.round(area)) : fmt(area)} km²`), " of forest for each tiger, on average"),
          h("p", { cls: "muted small" }, `${(sand.prey * 100).toLocaleString("en-GB")} prey in 100 km² × ${sand.share * 100}% spared a year ÷ ${KILLS_PER_YEAR} kills a tiger.`),
          h("p", { cls: `leopards ${leo}` }, h("strong", {}, "Leopards: "), ...ui.rich(LEOPARD_TEXT[leo])),
        ),
      ),
      sites({ model: { per100 } }),
    );
  };
  const input = h("input", {
    type: "range",
    min: String(PREY_MIN),
    max: String(PREY_MAX),
    step: "1",
    value: String(sand.prey),
    key: "prey",
    attrs: { "aria-label": "Prey per km²", "aria-valuetext": say() },
    // Redraw only the output: a full redraw would replace the slider under the pointer.
    oninput: () => {
      sand.prey = Number(input.value);
      input.setAttribute("aria-valuetext", say());
      shown.textContent = say();
      draw();
    },
  });
  const shown = h("output", { cls: "estimate-value" }, say());
  draw();
  const shares = h(
    "div",
    { cls: "choice-row", attrs: { role: "group", "aria-label": "Share of the prey spared a year (made up)" } },
    h("span", { cls: "muted small" }, "Share spared a year (made up): "),
    ...SHARES.map((v) =>
      pressed(
        h(
          "button",
          {
            type: "button",
            key: `share-${v}`,
            onclick: () => {
              sand.share = v;
              ui.render();
            },
          },
          `${v * 100}%`,
        ),
        sand.share === v,
      ),
    ),
  );
  return h(
    "div",
    { cls: "panel" },
    h(
      "div",
      { cls: "panel estimate" },
      h("p", { cls: "estimate-question" }, "How much prey lives in the forest?"),
      shown,
      input,
      h("div", { cls: "estimate-ends", attrs: { "aria-hidden": "true" } }, h("span", {}, `${PREY_MIN} per km²`), h("span", {}, `${PREY_MAX} per km²`)),
      shares,
    ),
    out,
    h(
      "p",
      { cls: "muted small" },
      `A teaching model. Made up: the share spared, and where scarce prey (under ${SCARCE_BELOW} per km²) turns plentiful (${PLENTY_FROM} and over) for the leopards. India's 11 sites had 5.3 to 63.8 prey per km² `,
      ui.cite(["Karanth2004"]),
      ".",
    ),
  );
}

// ---- The lesson ----

export const lesson10: Lesson = {
  title: TITLE,
  steps: STEPS,
  sources: lessonSources(),
  view(i, u) {
    ui = u;
    switch (STEPS[i]!.view) {
      case "junu":
        return [habitats()];
      case "habitats":
        return [habitats()];
      case "sites":
        return [sites()];
      case "model":
        return [model()];
      case "check":
        return [estimateView(check, checkState, ui)];
      case "measured":
        return [sites({ bright: SITES[1]!.label })];
      case "ranges":
        return [ranges()];
      case "guild":
        return [rajaji()];
      case "sandbox":
        return [sandbox()];
    }
  },
  hold(i) {
    return STEPS[i]!.view === "check" && !checkState.locked ? "Lock in your estimate to go on." : null;
  },
};
