// Lesson 14's live view: Junu photographed by a camera trap, the Red List's categories, two
// sessions of photos, the capture–recapture check, India's and Nepal's counts beside the world
// estimate, the split, the threats, the recovery check, the population model's curves, the
// protection shares, and the two sandboxes (a camera-trap survey and a population model), drawn
// from lesson14.ts.

import { h, pressed } from "./dom.ts";
import { type Estimate, estimateView, freshEstimate } from "./estimate-view.ts";
import { JUNU } from "./junu.ts";
import {
  AREA,
  BIRTHS,
  CAMERA_COUNTS,
  cameras,
  CATEGORIES,
  CHECK,
  CHECK_EXPLAIN,
  CHECK_QUESTION,
  type Count,
  growth,
  INDIA,
  type Layout,
  lessonSources,
  levelsAt,
  NEPAL,
  population,
  type Prey,
  PREYS,
  PROTECTION,
  RECOVER_ANSWER,
  RECOVER_CHOICES,
  RECOVER_EXPLAIN,
  RECOVER_QUESTION,
  recovers,
  reserve,
  ROOM,
  session,
  START,
  STEPS,
  surveyResult,
  TIGER_CATEGORY,
  TITLE,
  WORLD,
  YEARS,
} from "./lesson14.ts";
import type { Lesson, Ui } from "./shell.ts";
import { tigerView } from "./stripes-view.ts";

const SVG = "http://www.w3.org/2000/svg";

function s(tag: string, attrs: Record<string, string | number> = {}, ...kids: (Node | string)[]): SVGElement {
  const e = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  e.append(...kids);
  return e;
}

const asEl = (n: Element): HTMLElement => n as unknown as HTMLElement;
const num = (x: number): string => Math.round(x).toLocaleString("en-GB");

let ui: Ui;

const figure = (body: Node[], ...caption: (Node | string)[]): HTMLElement => h("figure", { cls: "tl-figure" }, ...body, h("figcaption", {}, ...caption));
const photo = (seed: number, key: string, title: string): HTMLElement => asEl(tigerView({ key, seed, title, crop: [0.3, 0.75] }));

// ---- Junu, and two sessions of photos ----

function junu(): HTMLElement {
  return h(
    "div",
    { cls: "coat-pair" },
    figure([asEl(tigerView({ key: "l14-junu", seed: JUNU, title: "Junu, side view" }))], "Junu, twelve. A drawing: her pattern is the same in every lesson."),
    figure([h("div", { cls: "photo-row" }, photo(JUNU, "l14-junu-photo", "A camera-trap photo of part of Junu's flank"))], "The count's camera photographs part of her side; its stripes match hers."),
  );
}

/** Two sessions: tigers A, B and Junu, then Junu again and C. Seeds are drawing choices. */
function sessions(): HTMLElement {
  const row = (label: string, tigers: [number, string][]) =>
    h("div", {}, h("p", { cls: "chart-title" }, label), h("ul", { cls: "photo-row" }, ...tigers.map(([seed, name], i) => h("li", {}, photo(seed, `l14-s-${label.length}-${i}`, `Photo: ${name}`), h("span", { cls: "match-name" }, name)))));
  return figure(
    [row("Session 1: three tigers photographed", [[11, "new: A"], [JUNU, "new: Junu"], [12, "new: B"]]), row("Session 2: two tigers photographed", [[JUNU, "again: Junu"], [13, "new: C"]])],
    "Drawn tigers. Junu's stripes match across the sessions, so she was \"recaptured\": one of the second session's two tigers had been seen before. Source: ",
    ui.cite(["Karanth1995"]),
  );
}

// ---- The Red List ----

function redList(): HTMLElement {
  return figure(
    [h("ol", { cls: "dates" }, ...CATEGORIES.map((c, i) => h("li", { cls: c === TIGER_CATEGORY ? "bright" : "" }, h("strong", {}, c === TIGER_CATEGORY ? "◆ the tiger" : String(i + 1)), h("span", {}, c))))],
    "The Red List's categories, least to most threatened. Source: ",
    ui.cite(["Goodrich2022"]),
  );
}

// ---- The counts, and their growth ----

const CW = 480;
const CH = 200;
const CL = 46;
const X0 = 2004;
const X1 = 2032;

function countsChart(mode: "counts" | "growth"): HTMLElement {
  const max = mode === "counts" ? 6000 : 4;
  const right = mode === "counts" ? CW - 110 : CW - 70;
  const x = (yr: number) => CL + ((yr - X0) / (X1 - X0 - (mode === "counts" ? 0 : 4))) * (right - CL);
  const y = (v: number) => 10 + (1 - v / max) * (CH - 10);
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${CW} ${CH + 24}`, role: "img" });
  const val = (cs: readonly Count[]) => (mode === "counts" ? cs.map((c) => c.n) : growth(cs));
  const describe = (name: string, cs: readonly Count[]) => `${name}: ${cs.map((c, i) => `${c.year}, ${mode === "counts" ? num(c.n) : `${val(cs)[i]!.toFixed(1)}×`}`).join("; ")}`;
  svg.setAttribute("aria-label", `${mode === "counts" ? "Tiger counts" : "Each count as a multiple of the first"}. ${describe("India", INDIA)}. ${describe("Nepal", NEPAL)}.${mode === "counts" ? ` World, Red List 2022: ${num(WORLD.lo)} to ${num(WORLD.hi)}.` : ""}`);
  const ticks = mode === "counts" ? [0, 2000, 4000, 6000] : [0, 1, 2, 3, 4];
  for (const t of ticks)
    svg.append(
      s("line", { class: t ? "ref-line" : "tl-axis", x1: CL, y1: y(t), x2: right, y2: y(t) }),
      s("text", { class: "tl-tick-label", x: CL - 6, y: y(t) + 4, "text-anchor": "end" }, mode === "counts" ? num(t) : `${t}×`),
    );
  for (const yr of [2006, 2010, 2014, 2018, 2022, 2026]) svg.append(s("text", { class: "tl-tick-label", x: x(yr), y: CH + 18, "text-anchor": "middle" }, String(yr)));
  if (mode === "growth") svg.append(s("line", { class: "goal-line", x1: CL, y1: y(2), x2: right, y2: y(2) }), s("text", { class: "tl-label", x: CL + 6, y: y(2) - 6 }, "the 2010 goal: double"));
  const line = (cs: readonly Count[], cls: string, label: string) => {
    const vs = val(cs);
    if (mode === "counts")
      for (const c of cs) if (c.lo !== undefined) svg.append(s("line", { class: "count-range", x1: x(c.year), y1: y(c.lo), x2: x(c.year), y2: y(c.hi!) }));
    svg.append(s("polyline", { class: `count-line ${cls}`, points: cs.map((c, i) => `${x(c.year)},${y(vs[i]!)}`).join(" ") }));
    for (const [i, c] of cs.entries()) svg.append(cls === "india" ? s("circle", { class: "tl-solid", cx: x(c.year), cy: y(vs[i]!), r: 3.5 }) : s("rect", { class: "tl-hollow", x: x(c.year) - 3, y: y(vs[i]!) - 3, width: 6, height: 6 }));
    const last = cs[cs.length - 1]!;
    svg.append(s("text", { class: "tl-label", x: x(last.year) + 8, y: y(vs[vs.length - 1]!) + (cls === "india" || mode === "growth" ? 4 : -6) }, label));
  };
  line(INDIA, "india", "India ●");
  line(NEPAL, "nepal", "Nepal ■");
  if (mode === "counts") {
    const wx = CW - 60;
    svg.append(
      s("line", { class: "tl-boundary", x1: CW - 96, y1: 10, x2: CW - 96, y2: CH }),
      s("rect", { class: "world-band", x: wx - 12, y: y(WORLD.hi), width: 24, height: y(WORLD.lo) - y(WORLD.hi) }),
      s("text", { class: "tl-tick-label", x: wx, y: CH + 18, "text-anchor": "middle" }, "World"),
      s("text", { class: "tl-label", x: wx, y: y(WORLD.hi) - 8, "text-anchor": "middle" }, `${num(WORLD.lo)}–${num(WORLD.hi)}`),
    );
  }
  const caption =
    mode === "counts"
      ? "India's estimates (dots, solid line; the bars are each estimate's range) and Nepal's counts (squares, dashed line), on one scale. Dashed box, right: the world's wild tigers, the Red List's estimate published in 2022, which lists the trend as decreasing. Nepal's years are IUCN's; some reports date the first two 2010 and 2014. Sources: "
      : "Each country's counts as a multiple of its first: India's from 2006 (dots), Nepal's from 2009 (squares, dashed). Sources: ";
  return figure([asEl(svg)], caption, ui.cite(mode === "counts" ? ["NTCA2023", "IUCN2026Nepal", "Goodrich2022"] : ["NTCA2023", "IUCN2026Nepal"]));
}

// ---- The split, the threats, protection ----

function split(): HTMLElement {
  const side = (cls: string, title: string, items: string[]) => h("div", { cls: `compare-side ${cls}` }, h("strong", {}, title), h("ul", {}, ...items.map((t) => h("li", {}, t))));
  return figure(
    [
      h(
        "div",
        { cls: "compare" },
        side("solid", "Counts rising", ["India: about 1,411 (2006) to 3,682 (2022)", "Nepal: about 120 (around 2010) to 429 (2026)"]),
        side("dashed", "Tigers lost or falling", ["Vietnam, Cambodia, Laos: gone", "Malaysia: steep decline, it appears", "Thailand's largest population: 35–58 tigers, 2006–2012; patrols brought a small improvement"]),
      ),
    ],
    "One world trend, two regions. Sources: ",
    ui.cite(["NTCA2023", "IUCN2026Nepal", "Goodrich2022", "Duangchantrasiri2016"]),
  );
}

function threats(): HTMLElement {
  const rows: [string, string][] = [
    ["Hunting", "of tigers and their prey; the only high-impact threat"],
    ["Habitat loss", "farms, plantations, roads; small, inbred populations"],
    ["Conflict", "tigers killed for killing livestock or people; never recorded systematically"],
    ["Disease", "little studied"],
  ];
  return figure([h("ol", { cls: "dates" }, ...rows.map(([t, d], i) => h("li", { cls: i === 0 ? "bright" : "" }, h("strong", {}, `${i + 1}. ${t}`), h("span", {}, d))))], "The threats, in the order of weight the Red List gives them. Source: ", ui.cite(["Goodrich2022"]));
}

function protection(): HTMLElement {
  const list = h("ul", { cls: "share-rows", attrs: { "aria-label": "How much of tigers' land and populations is protected" } });
  for (const r of PROTECTION) {
    const bar = h("span", { cls: r.bound ? "share-bar bound" : "share-bar", attrs: { "aria-hidden": "true" } });
    bar.style.width = `${r.value}%`;
    list.append(h("li", {}, h("span", { cls: "share-label" }, r.label), h("span", { cls: "share-track" }, bar), h("span", { cls: "share-value" }, r.note)));
  }
  return figure([list], "\"Over 60%\" is drawn at 60%, its bound, with an open end. Source: ", ui.cite(["Goodrich2022"]));
}

// ---- The checks ----

const check: Estimate = { ...CHECK, key: "l14-est", question: CHECK_QUESTION, format: (v) => `${num(v)} tigers`, explain: CHECK_EXPLAIN, start: 80 };
const checkState = freshEstimate(check);
const recover: { pick: number | null; locked: boolean } = { pick: null, locked: false };

function recoverView(): HTMLElement {
  const box = h("div", { cls: "panel match" }, h("p", { cls: "match-question" }, ...ui.rich(RECOVER_QUESTION)));
  const group = h("div", { cls: "choice-row", attrs: { role: "group", "aria-label": "Your prediction" } });
  RECOVER_CHOICES.forEach((c, i) =>
    group.append(
      pressed(
        h(
          "button",
          {
            type: "button",
            key: `l14-rec-${i}`,
            disabled: recover.locked,
            onclick: () => {
              recover.pick = i;
              ui.render();
            },
          },
          c,
        ),
        recover.pick === i,
      ),
    ),
  );
  box.append(group);
  if (!recover.locked) {
    box.append(
      h(
        "button",
        {
          type: "button",
          key: "l14-rec-lock",
          disabled: recover.pick === null,
          onclick: () => {
            recover.locked = true;
            ui.render();
            ui.focusNext();
          },
        },
        "Lock in my answer",
      ),
    );
    return box;
  }
  const right = recover.pick === RECOVER_ANSWER;
  box.append(h("p", { cls: right ? "feedback right" : "feedback wrong", attrs: { "aria-live": "polite" } }, h("strong", {}, right ? "✓ Right. " : "✗ Not so. "), ...ui.rich(RECOVER_EXPLAIN)));
  return box;
}

// ---- The population model's chart ----

const MW = 480;
const MH = 180;
const ML = 40;
const LINE_STYLES = ["model-a", "model-b", "model-c"];

function modelChart(lines: readonly { deaths: number; prey: Prey; label: string }[], key: string): SVGElement {
  const max = 130;
  const x = (yr: number) => ML + (yr / YEARS) * (MW - ML - 90);
  const y = (n: number) => 8 + (1 - Math.min(n, max) / max) * (MH - 8);
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${MW} ${MH + 22}`, role: "img", "data-key": key });
  const runs = lines.map((l) => population(l.deaths, l.prey));
  svg.setAttribute("aria-label", `Model tigers over ${YEARS} years: ${lines.map((l, i) => `${l.label}, ${num(runs[i]![YEARS]!)} after ${YEARS} years`).join("; ")}.`);
  for (const t of [0, 40, 80, 120])
    svg.append(s("line", { class: t ? "ref-line" : "tl-axis", x1: ML, y1: y(t), x2: x(YEARS), y2: y(t) }), s("text", { class: "tl-tick-label", x: ML - 6, y: y(t) + 4, "text-anchor": "end" }, String(t)));
  svg.append(
    s("line", { class: "tl-axis", x1: ML, y1: 8, x2: ML, y2: MH }),
    s("text", { class: "tl-tick-label", x: ML, y: MH + 18 }, "years →"),
    s("text", { class: "tl-tick-label", x: x(YEARS), y: MH + 18, "text-anchor": "end" }, String(YEARS)),
  );
  lines.forEach((l, i) => {
    const run = runs[i]!;
    svg.append(s("polyline", { class: `model-line ${LINE_STYLES[i]!}`, points: run.map((n, yr) => `${x(yr)},${y(n)}`).join(" ") }));
    svg.append(s("text", { class: "tl-label", x: x(YEARS) + 6, y: y(run[YEARS]!) + 4 + (lines.length > 1 ? [-6, 0, 6][i]! : 0) }, l.label));
  });
  return svg;
}

function fifteen(): HTMLElement {
  const lines = [0.1, 0.15, 0.2].map((d, i) => ({ deaths: d, prey: "plentiful" as Prey, label: `${Math.round(d * 100)}%${["", " - -", " ···"][i]}` }));
  return figure([asEl(modelChart(lines, "l14-fifteen"))], `This course's model, not the study's: ${START} tigers with plentiful prey, at three yearly death rates: 10% (solid), 15% (dashed) and 20% (dotted). Its birth rate is made up, set so the line falls at 15%, the study's figure. Source of the 15%: `, ui.cite(["Chapron2008"]));
}

// ---- Sandbox 1: the camera-trap survey ----

const survey: { seed: number; count: number; layout: Layout; ran: 0 | 1 | 2; truth: boolean } = { seed: 1, count: 9, layout: "spread", ran: 0, truth: false };
const setSurvey = (change: () => void) => () => {
  change();
  survey.ran = 0;
  survey.truth = false;
  ui.render();
};
const SQ = 24;

function surveyMap(tigers: readonly (readonly [number, number])[], cams: readonly (readonly [number, number])[], first: readonly number[], second: readonly number[]): SVGElement {
  const svg = s("svg", { class: "lines survey-map", viewBox: `-2 -2 ${AREA.w * SQ + 4} ${AREA.h * SQ + 4}`, role: "img" });
  const seen = new Set([...first, ...second]);
  svg.setAttribute("aria-label", `The model reserve with ${cams.length} cameras ${survey.layout === "spread" ? "spread out" : "bunched in the middle"}; ${seen.size} tigers photographed so far${survey.truth ? `, of ${tigers.length}` : ""}.`);
  svg.append(s("rect", { class: "survey-ground", x: 0, y: 0, width: AREA.w * SQ, height: AREA.h * SQ }));
  for (const [cx, cy] of cams) svg.append(s("rect", { class: "survey-camera", x: cx * SQ - 4, y: cy * SQ - 4, width: 8, height: 8 }));
  tigers.forEach(([tx, ty], i) => {
    const both = first.includes(i) && second.includes(i);
    if (seen.has(i)) svg.append(s("circle", { class: both ? "tl-solid" : "tl-hollow", cx: tx * SQ, cy: ty * SQ, r: 4 }));
    else if (survey.truth) svg.append(s("text", { class: "survey-missed", x: tx * SQ, y: ty * SQ + 4, "text-anchor": "middle" }, "×"));
  });
  return svg;
}

function surveyPanel(): HTMLElement {
  const tigers = reserve(survey.seed);
  const cams = cameras(survey.count, survey.layout);
  const first = survey.ran >= 1 ? session(survey.seed, tigers, cams, 1) : [];
  const second = survey.ran >= 2 ? session(survey.seed, tigers, cams, 2) : [];
  const r = surveyResult(first, second);
  const choose = <T,>(label: string, values: readonly T[], current: T, name: (v: T) => string, set: (v: T) => void, key: string) =>
    h(
      "div",
      { cls: "choice-row", attrs: { role: "group", "aria-label": label } },
      h("span", { cls: "muted small choice-label" }, `${label}: `),
      ...values.map((v) => pressed(h("button", { type: "button", key: `${key}-${String(v)}`, onclick: setSurvey(() => set(v)) }, name(v)), v === current)),
    );
  let status: string;
  if (survey.ran === 0) status = "Cameras in place. Run the first session.";
  else if (survey.ran === 1) status = `Session 1: ${r.n1} tigers photographed. Run the second.`;
  else
    status =
      r.estimate === null
        ? `Session 1: ${r.n1} tigers; session 2: ${r.n2}, none of them seen before. With no tiger photographed twice, there is no estimate: try more cameras.`
        : `Session 1: ${r.n1} tigers; session 2: ${r.n2}, of which ${r.m} seen before. Estimate: ${r.n1} × ${r.n2} ÷ ${r.m} ≈ ${num(r.estimate)} tigers.`;
  if (survey.truth) status += ` The reserve really holds ${tigers.length}.`;
  const photos = (ids: readonly number[], label: string, again?: readonly number[]) =>
    ids.length
      ? h(
          "div",
          {},
          h("p", { cls: "chart-title" }, label),
          h("ul", { cls: "photo-row small-photos" }, ...ids.map((i) => h("li", {}, photo(survey.seed * 100 + i, `l14-p-${label.length}-${i}`, `Photo of tiger ${i + 1}`), h("span", { cls: "match-name" }, again?.includes(i) ? "seen before" : "new")))),
        )
      : h("span");
  return h(
    "div",
    { cls: "panel" },
    choose("Cameras", CAMERA_COUNTS, survey.count, String, (v) => (survey.count = v), "l14-cams"),
    choose("Placed", ["spread", "bunched"] as Layout[], survey.layout, (v) => (v === "spread" ? "spread out" : "bunched in the middle"), (v) => (survey.layout = v), "l14-lay"),
    h(
      "div",
      { cls: "choice-row" },
      h(
        "button",
        {
          type: "button",
          key: "l14-run",
          disabled: survey.ran === 2,
          onclick: () => {
            survey.ran = survey.ran === 0 ? 1 : 2;
            ui.render();
          },
        },
        survey.ran === 0 ? "Run session 1" : "Run session 2",
      ),
      h(
        "button",
        {
          type: "button",
          key: "l14-truth",
          disabled: survey.truth,
          onclick: () => {
            survey.truth = true;
            ui.render();
          },
        },
        "Show the true number",
      ),
      h("button", { type: "button", key: "l14-new", onclick: setSurvey(() => survey.seed++) }, "New reserve"),
    ),
    h("p", { cls: "verdict", attrs: { "aria-live": "polite" } }, status),
    asEl(surveyMap(tigers, cams, first, second)),
    h("p", { cls: "muted small" }, "Squares: cameras. Hollow circles: tigers photographed once; filled: photographed in both sessions; × (after Show): never photographed. A model reserve: the number of tigers and how often a camera photographs one are made up."),
    photos(first, "Session 1's photos"),
    photos(second, "Session 2's photos, matched by stripes", first),
  );
}

// ---- Sandbox 2: the population model ----

const model: { deaths: number; prey: Prey } = { deaths: 10, prey: "plentiful" };

function modelVerdict(): string {
  const d = model.deaths / 100;
  const run = population(d, model.prey);
  if (recovers(d, model.prey)) return `Recovers: it grows and levels off at about ${num(levelsAt(d, model.prey))} tigers, the most this prey can feed (${ROOM[model.prey]}) less what the deaths take.`;
  const gone = run.findIndex((n) => n === 0);
  return `Doesn't recover: deaths match or outpace the ${Math.round(BIRTHS[model.prey] * 100)}% this prey lets the model add each year${gone > 0 ? `; gone after ${gone} years` : `; ${num(run[YEARS]!)} left after ${YEARS} years`}.`;
}

function modelPanel(): HTMLElement {
  const label = () => `${model.deaths}% die each year`;
  const chart = () => modelChart([{ deaths: model.deaths / 100, prey: model.prey, label: `${num(population(model.deaths / 100, model.prey)[YEARS]!)} tigers` }], "l14-model");
  const verdict = h("p", { cls: "verdict", attrs: { "aria-live": "polite" } }, modelVerdict());
  const shown = h("output", { cls: "estimate-value" }, label());
  let svg = chart();
  const slider = h("input", {
    type: "range",
    min: "0",
    max: "30",
    step: "1",
    value: String(model.deaths),
    key: "l14-deaths",
    cls: "model-slider",
    attrs: { "aria-label": "Share of tigers that die each year", "aria-valuetext": label() },
    // Redraw the chart in place while dragging: a full redraw would replace the slider under the pointer.
    oninput: () => {
      model.deaths = Number(slider.value);
      shown.textContent = label();
      slider.setAttribute("aria-valuetext", label());
      verdict.textContent = modelVerdict();
      const next = chart();
      svg.replaceWith(next);
      svg = next;
    },
  });
  return h(
    "div",
    { cls: "panel" },
    h(
      "div",
      { cls: "choice-row", attrs: { role: "group", "aria-label": "Prey" } },
      h("span", { cls: "muted small choice-label" }, "Prey: "),
      ...PREYS.map((p) =>
        pressed(
          h(
            "button",
            {
              type: "button",
              key: `l14-prey-${p}`,
              onclick: () => {
                model.prey = p;
                ui.render();
              },
            },
            p,
          ),
          p === model.prey,
        ),
      ),
    ),
    h("label", { cls: "muted small" }, "Deaths each year, from every cause: ", shown),
    slider,
    verdict,
    asEl(svg),
    h(
      "p",
      { cls: "muted small" },
      `A model, starting from ${START} tigers. Its settings are made up: each year it adds new tigers at ${Math.round(BIRTHS.scarce * 100)}%, ${Math.round(BIRTHS.some * 100)}% or ${Math.round(BIRTHS.plentiful * 100)}% of the population (scarce, some or plentiful prey), fewer as it nears what the prey can feed (${ROOM.scarce}, ${ROOM.some} or ${ROOM.plentiful} tigers); under 2 tigers, it is gone. Only the pattern is the study's: with plentiful prey, no recovery once deaths reach about 15%. Source: `,
      ui.cite(["Chapron2008"]),
    ),
  );
}

// ---- The lesson ----

export const lesson14: Lesson = {
  title: TITLE,
  steps: STEPS,
  sources: lessonSources(),
  view(i, u) {
    ui = u;
    switch (STEPS[i]!.view) {
      case "junu":
        return [junu()];
      case "redlist":
        return [redList()];
      case "camera":
        return [sessions()];
      case "estimate":
        return [estimateView(check, checkState, ui)];
      case "counts":
        return [countsChart("counts")];
      case "split":
        return [split()];
      case "threats":
        return [threats()];
      case "recover":
        return [recoverView()];
      case "fifteen":
        return [fifteen()];
      case "doubling":
        return [countsChart("growth")];
      case "protection":
        return [protection()];
      case "survey":
        return [surveyPanel()];
      case "model":
        return [modelPanel()];
    }
  },
  hold(i) {
    const v = STEPS[i]!.view;
    if (v === "estimate" && !checkState.locked) return "Lock in your estimate to go on.";
    if (v === "recover" && !recover.locked) return "Lock in your answer to go on.";
    return null;
  },
};
