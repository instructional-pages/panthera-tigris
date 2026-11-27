// Lesson 12's live view: the chain of prices from poacher to buyer, the four reasons for demand,
// the poacher's-share check, the law and penalties, the seizure figures, farms, South Korea, and
// the seizure-data sandbox, drawn from lesson12.ts.

import { h, pressed } from "./dom.ts";
import { type Estimate, estimateView, freshEstimate } from "./estimate-view.ts";
import {
  BARS,
  type Bar,
  type Bars,
  BY_COUNTRY,
  BY_PART,
  CHECK,
  CHECK_EXPLAIN,
  CHECK_QUESTION,
  lessonSources,
  type Measure,
  perYear,
  PERIODS,
  PRICE_MAX,
  PRICE_MIN,
  PRICES,
  pricePos,
  STEPS,
  TEMPLE,
  TITLE,
  yearBars,
} from "./lesson12.ts";
import type { Lesson, Ui } from "./shell.ts";

const SVG = "http://www.w3.org/2000/svg";

function s(tag: string, attrs: Record<string, string | number> = {}, ...kids: (Node | string)[]): SVGElement {
  const e = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  e.append(...kids);
  return e;
}

const asEl = (n: SVGElement): HTMLElement => n as unknown as HTMLElement;
const num = (x: number): string => x.toLocaleString("en-GB", { maximumFractionDigits: 1 });

let ui: Ui;

// ---- The chain of prices ----

/** The price rows on a log scale; `hide` keeps the prices back (before the check is answered). */
function prices(hide: boolean): HTMLElement {
  const list = h("ul", { cls: "share-rows price-rows", attrs: { "aria-label": "Prices in US dollars, from the poacher to the buyer, then two products" } });
  PRICES.forEach((p, i) => {
    if (i > 0 && !p.chain && PRICES[i - 1]!.chain) list.append(h("li", { cls: "price-gap" }, h("span", { cls: "muted small" }, "What buyers pay for products:")));
    const track = h("span", { cls: "share-track price-track" });
    if (!hide) {
      const bar = h("span", { cls: i === 0 ? "price-bar bright" : "price-bar", attrs: { "aria-hidden": "true" } });
      bar.style.left = `${100 * pricePos(p.lo)}%`;
      bar.style.width = `max(4px, ${100 * (pricePos(p.hi) - pricePos(p.lo))}%)`;
      track.append(bar);
    }
    list.append(h("li", {}, h("span", { cls: "share-label" }, `${p.chain ? `${i + 1}. ` : ""}${p.label}`), track, h("span", { cls: "share-value" }, hide ? "?" : p.note)));
  });
  const ticks = h("div", { cls: "price-ticks", attrs: { "aria-hidden": "true" } });
  for (let v = PRICE_MIN; v <= PRICE_MAX; v *= 10) {
    const t = h("span", {}, `$${num(v)}`);
    t.style.left = `${100 * pricePos(v)}%`;
    ticks.append(t);
  }
  return h(
    "figure",
    { cls: "tl-figure" },
    list,
    hide ? h("span") : ticks,
    h("figcaption", {}, hide ? "From the forest to the buyer. The prices come after the check. " : "Prices in US dollars, on a stretched scale: each mark is ten times the one before. Different studies, places and years. Source: ", ui.cite(["Goodrich2022"])),
  );
}

// ---- Why people buy ----

function demand(): HTMLElement {
  const card = (title: string, text: string) => h("div", { cls: "formula-box" }, h("strong", {}, title), h("span", { cls: "muted small" }, text));
  return h(
    "figure",
    { cls: "tl-figure" },
    h(
      "div",
      { cls: "demand-grid" },
      card("Medicine", "bone wine, bone glue"),
      card("Status", "gifts, skins on display"),
      card("Belief", "claws and teeth as charms"),
      card("Meat", "eaten by the wealthy"),
    ),
    h("figcaption", {}, "Why tigers are bought. Source: ", ui.cite(["Goodrich2022"])),
  );
}

// ---- Dates: the law, and South Korea ----

function dates(korea: boolean): HTMLElement {
  const rows: [string, string, boolean][] = [
    ["1975", "All tigers on CITES Appendix I, except the Amur tiger", !korea],
    ["1987", "The Amur tiger added", !korea],
    ["Early 1990s", "South Korea: one of the largest importers of tiger bone", korea],
    ["1993", "South Korea joins CITES", korea],
    ["1994", "South Korea bans commercial trade in big cats", korea],
    ["2024", "Experts judge Korea's trade much shrunk; small sales go on", korea],
  ];
  return h(
    "figure",
    { cls: "tl-figure" },
    h("ol", { cls: "dates" }, ...rows.map(([y, t, bright]) => h("li", { cls: bright ? "bright" : "" }, h("strong", {}, y), h("span", {}, t)))),
    h("figcaption", {}, "Bright: the dates this step is about. Sources: ", ui.cite(korea ? ["ElvesPowell2024"] : ["Goodrich2022"])),
  );
}

// ---- Bars ----

function barList(rows: readonly Bar[], max: number, label: string): HTMLElement {
  const list = h("ul", { cls: "share-rows", attrs: { "aria-label": label } });
  for (const r of rows) {
    const bar = h("span", { cls: r.bright ? "share-bar bright" : "share-bar", attrs: { "aria-hidden": "true" } });
    bar.style.width = `${(100 * r.value) / max}%`;
    list.append(h("li", {}, h("span", { cls: "share-label" }, r.label), h("span", { cls: "share-track" }, bar), h("span", { cls: "share-value" }, r.note)));
  }
  return list;
}

const bars = (b: Bars): HTMLElement => h("figure", { cls: "tl-figure" }, barList(b.rows, b.max, b.caption), h("figcaption", {}, `${b.caption} Source: `, ui.cite(b.keys)));

// ---- Farms: the argument and the evidence ----

function farms(): HTMLElement {
  const side = (cls: string, title: string, items: string[]) => h("div", { cls: `compare-side ${cls}` }, h("strong", {}, title), h("ul", {}, ...items.map((t) => h("li", {}, t))));
  return h(
    "figure",
    { cls: "tl-figure" },
    h(
      "div",
      { cls: "compare" },
      side("dashed", "The argument for farms", ["Farmed parts meet the demand", "So fewer wild tigers are poached"]),
      side("solid", "The evidence against", ["Buyers prefer wild tigers", "Farm tigers leak into the illegal trade", "Seizures go on where wild tigers live", "Laos: most of Vietnam's routes, almost no wild tigers"]),
    ),
    h("figcaption", {}, "Dashed: an argument no source read supports with evidence; solid: what the sources found. Sources: ", ui.cite(["Wong2019", "Goodrich2022"])),
  );
}

// ---- Seizures by year: a bar chart ----

const CW = 720;
const CH = 260;
const BASE = 220;
const TOP = 24;

function yearChart(measure: Measure, withoutTemple: boolean): HTMLElement {
  const data = yearBars(measure, withoutTemple);
  const max = measure === "seizures" ? 120 : 300;
  const y = (v: number): number => BASE - ((BASE - TOP) * v) / max;
  const step = (CW - 40) / data.length;
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${CW} ${CH}`, role: "img" });
  svg.setAttribute(
    "aria-label",
    `${measure === "seizures" ? "Seizure incidents" : "Tigers seized"} each year, 2000 to 2018: ${data.map((d) => `${d.year}, ${d.main + d.extra}`).join("; ")}.`,
  );
  svg.append(s("defs", {}, s("pattern", { id: "l12-out", width: 5, height: 5, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, s("line", { class: "hatch-park", x1: 0, y1: 0, x2: 0, y2: 5 }))));
  for (let v = 0; v <= max; v += max / 4) {
    svg.append(s("line", { class: "tl-guide", x1: 30, x2: CW, y1: y(v), y2: y(v) }), s("text", { class: "tl-tick-label", x: 26, y: y(v) + 4, "text-anchor": "end" }, String(v)));
  }
  data.forEach((d, i) => {
    const x = 36 + i * step;
    const w = step - 6;
    svg.append(s("rect", { class: "year-bar", x, y: y(d.main), width: w, height: BASE - y(d.main) }));
    if (d.extra) svg.append(s("rect", { class: "year-bar-out", x, y: y(d.main + d.extra), width: w, height: y(d.main) - y(d.main + d.extra), fill: "url(#l12-out)" }));
    svg.append(s("text", { class: "tl-tick-label", x: x + w / 2, y: y(d.main + d.extra) - 4, "text-anchor": "middle" }, String(d.main + d.extra)));
    if (i % 2 === 0) svg.append(s("text", { class: "tl-label", x: x + w / 2, y: BASE + 18, "text-anchor": "middle" }, String(d.year)));
  });
  const note =
    measure === "seizures"
      ? "Seizure incidents each year. Solid: in tiger range countries; hatched, on top: outside them."
      : `Tigers seized each year, counted as the fewest whole tigers the parts could come from.${withoutTemple ? ` 2016 without the ${TEMPLE.tigers} temple tigers.` : ""}`;
  return h("figure", { cls: "tl-figure" }, asEl(svg), h("figcaption", {}, `${note} Read from the report's chart. Source: `, ui.cite(["Wong2019"])));
}

// ---- Seizures by country: two periods, as yearly averages ----

function countryChart(measure: Measure): HTMLElement {
  const per = (c: (typeof BY_COUNTRY)[number], p: 0 | 1): number | null => {
    const v = c[measure][p];
    return v === null ? null : perYear(v, p);
  };
  const max = Math.max(...BY_COUNTRY.flatMap((c) => [per(c, 0) ?? 0, per(c, 1) ?? 0]));
  const list = h("ul", { cls: "share-rows country-rows", attrs: { "aria-label": `${measure === "seizures" ? "Seizures" : "Tigers seized"} a year, by country, in 2000–2014 and 2015–2018` } });
  for (const c of BY_COUNTRY) {
    const track = h("span", { cls: "share-track country-track" });
    const values: string[] = [];
    ([0, 1] as const).forEach((p) => {
      const v = per(c, p);
      const bar = h("span", { cls: p === 0 ? "share-bar" : "share-bar recent", attrs: { "aria-hidden": "true" } });
      if (v === null) bar.style.visibility = "hidden";
      else bar.style.width = `${(100 * v) / max}%`;
      track.append(bar);
      values.push(v === null ? "too little data" : num(v));
    });
    list.append(h("li", {}, h("span", { cls: "share-label" }, c.name), track, h("span", { cls: "share-value" }, `${values[0]} → ${values[1]}`)));
  }
  return h(
    "figure",
    { cls: "tl-figure" },
    list,
    h(
      "figcaption",
      {},
      `${measure === "seizures" ? "Seizures" : "Tigers seized"} a year, on average. Upper bar, grey: ${PERIODS[0].label}; lower bar, bright and outlined: ${PERIODS[1].label}. Source: `,
      ui.cite(["Wong2019"]),
    ),
  );
}

function partChart(): HTMLElement {
  return h(
    "figure",
    { cls: "tl-figure" },
    barList(BY_PART, BY_PART[0]!.value, "Tigers seized by kind of item, 2000–2018"),
    h("figcaption", {}, "Tigers seized by the kind of item, 2000–2018. Don't add these up: one tiger's skin and bones are counted under both. Bones and claws read from the report's chart. Source: ", ui.cite(["Wong2019"])),
  );
}

// ---- The check ----

const check: Estimate = {
  ...CHECK,
  key: "share",
  question: CHECK_QUESTION,
  format: (v) => `${v}%`,
  explain: CHECK_EXPLAIN,
  start: 25,
};
const checkState = freshEstimate(check);

// ---- The sandbox ----

type By = "year" | "country" | "part";
const sand: { by: By; measure: Measure; withoutTemple: boolean } = { by: "year", measure: "tigers", withoutTemple: false };

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

function sandbox(): HTMLElement {
  const box = h("div", { cls: "panel" }, choices("Look at", "by", ["year", "country", "part"] as const, { year: "By year", country: "By country", part: "By part" }, sand.by, (x) => (sand.by = x)));
  if (sand.by !== "part") box.append(choices("Count", "measure", ["seizures", "tigers"] as const, { seizures: "Seizure incidents", tigers: "Tigers" }, sand.measure, (x) => (sand.measure = x)));
  if (sand.by === "year" && sand.measure === "tigers") {
    const input = h("input", {
      type: "checkbox",
      key: "temple",
      checked: sand.withoutTemple,
      onchange: () => {
        sand.withoutTemple = input.checked;
        ui.render();
      },
    });
    box.append(h("label", { cls: "choice-row small" }, input, ` Take out the temple seizure (${TEMPLE.tigers} captive tigers, Thailand, ${TEMPLE.year})`));
  }
  box.append(h("div", { attrs: { "aria-live": "polite" } }, sand.by === "year" ? yearChart(sand.measure, sand.withoutTemple) : sand.by === "country" ? countryChart(sand.measure) : partChart()));
  return box;
}

// ---- The lesson ----

export const lesson12: Lesson = {
  title: TITLE,
  steps: STEPS,
  sources: lessonSources(),
  view(i, u) {
    ui = u;
    const view = STEPS[i]!.view;
    switch (view) {
      case "junu":
        return [prices(true)];
      case "demand":
        return [demand()];
      case "check":
        return [estimateView(check, checkState, ui)];
      case "money":
        return [prices(false)];
      case "law":
        return [dates(false)];
      case "korea":
        return [dates(true)];
      case "seizures":
        return [yearChart("tigers", false)];
      case "farms":
        return [farms()];
      case "sandbox":
        return [sandbox()];
      default:
        return BARS[view]!.map(bars);
    }
  },
  hold(i) {
    return STEPS[i]!.view === "check" && !checkState.locked ? "Lock in your estimate to go on." : null;
  },
};
