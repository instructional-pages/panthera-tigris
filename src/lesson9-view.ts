// Lesson 9's live view: the range map (old range, losses, the check, today), the layers of
// loss, the landscapes left, and the 1900–2020 sandbox, drawn from lesson9.ts.

import { h, pressed } from "./dom.ts";
import {
  BREEDING,
  CHECK_EXPLAIN,
  CHECK_QUESTION,
  CHITWAN,
  countAt,
  FIRST_YEAR,
  INDIGENOUS_KM2,
  LAST_YEAR,
  LAYERS,
  lessonSources,
  lostIn,
  PLACES,
  type State,
  stateAt,
  STEPS,
  TCL_BY_COUNTRY,
  TCL_TOTAL_KM2,
  TITLE,
  unsplitKm2,
  YEAR_STEP,
} from "./lesson9.ts";
import { REGIONS } from "./map-data.ts";
import { freshPick, mapView, type PickTask, pickView, type Shade } from "./map-view.ts";
import type { Lesson, Ui } from "./shell.ts";

let ui: Ui;

const nameOf = new Map(REGIONS.map((r) => [r.id, r.name]));
const name = (id: string): string => nameOf.get(id)!;
const byPlace = new Map(PLACES.map((p) => [p.id, p]));
const SHADE: Readonly<Record<State, Shade>> = { tigers: "solid", gone: "dim", unsure: "hatched" };
const fmt = (n: number): string => n.toLocaleString("en-GB");

const JUNU_MARK = { ...CHITWAN, label: "Chitwan" };
const LEGEND = "Bright: tigers. Grey: tigers gone. Hatched: gone, but the sources read don't say when, or disagree. Dark, plain: outside the old range. Whole countries are shaded, a sketch rather than the range's own outline.";

/** The range map in `year`, or the whole old range shaded bright when `year` is null (or no range, plain). */
function rangeMap(key: string, year: number | null, opts: { plain?: boolean; caption: string }): HTMLElement {
  const shade = (id: string): Shade | undefined => {
    const p = byPlace.get(id);
    if (!p || opts.plain) return undefined;
    return year === null ? "solid" : SHADE[stateAt(p, year)];
  };
  const summary =
    opts.plain
      ? "A map of Asia, with Chitwan in southern Nepal marked."
      : year === null
      ? `The tiger's old range: ${PLACES.map((p) => name(p.id)).join(", ")}.`
      : `In ${year}, tigers in: ${PLACES.filter((p) => stateAt(p, year) === "tigers").map((p) => name(p.id)).join(", ")}.`;
  return h(
    "figure",
    { cls: "tl-figure" },
    mapView({ key, title: summary, shade, marks: [JUNU_MARK] }),
    h("p", { cls: "muted small" }, opts.caption, ...(opts.plain ? [] : [" Sources: ", ui.cite(["Sanderson2023", "Goodrich2022"])])),
  );
}

// ---- The check ----

const TASK: PickTask = {
  key: "breeding",
  question: CHECK_QUESTION,
  choices: PLACES.map((p) => p.id),
  answer: BREEDING,
  explain: CHECK_EXPLAIN,
};
const pick = freshPick(TASK);

// ---- The losses, as a table ----

function lossTable(): HTMLElement {
  const dated = PLACES.filter((p) => p.lostBy !== undefined).sort((a, b) => a.lostBy! - b.lostBy!);
  const undated = PLACES.filter((p) => p.noDate);
  const body = h("tbody");
  for (const p of dated) body.append(h("tr", {}, h("td", {}, p.when!), h("td", {}, name(p.id)), h("td", {}, ui.cite(p.keys))));
  body.append(h("tr", {}, h("td", {}, "not given"), h("td", {}, undated.map((p) => name(p.id)).join(", ")), h("td", {}, ui.cite(["Sanderson2023"]))));
  return h("table", { cls: "range-table" }, h("thead", {}, h("tr", {}, h("th", {}, "Tigers lost"), h("th", {}, "Where"), h("th", {}, "Source"))), body);
}

// ---- Shares, as rows of bars ----

interface Row {
  readonly label: string;
  readonly value: number;
  readonly text: string;
  readonly bright?: boolean;
}

function shareRows(rows: readonly Row[], max: number, label: string): HTMLElement {
  const list = h("ul", { cls: "share-rows", attrs: { "aria-label": label } });
  for (const r of rows) {
    const bar = h("span", { cls: r.bright ? "share-bar bright" : "share-bar", attrs: { "aria-hidden": "true" } });
    bar.style.width = `${(100 * r.value) / max}%`;
    list.append(h("li", {}, h("span", { cls: "share-label" }, r.label), h("span", { cls: "share-track" }, bar), h("span", { cls: "share-value" }, r.text)));
  }
  return list;
}

function layers(): HTMLElement {
  const rows: Row[] = LAYERS.map((l) => ({ label: l.label, value: l.km2, text: `${l.pct}% · ${fmt(l.km2)} km²`, bright: l.key === "tcl" }));
  const rest = unsplitKm2();
  rows.push({ label: "Not split out in the figures read", value: rest, text: `about 1% · ${fmt(rest)} km²` });
  return h(
    "figure",
    { cls: "tl-figure" },
    shareRows(rows, INDIGENOUS_KM2, "What became of the tiger's old range, by 2020"),
    h("figcaption", {}, `What became of the old range (${fmt(INDIGENOUS_KM2)} km²) by 2020. Each bar is its share of the whole. Source: `, ui.cite(["Sanderson2023"])),
  );
}

function tclRows(): HTMLElement {
  const rows: Row[] = TCL_BY_COUNTRY.map((c) => ({ label: name(c.id), value: c.km2, text: `${fmt(c.km2)} km²`, bright: c.id === "npl" }));
  return h(
    "figure",
    { cls: "tl-figure" },
    shareRows(rows, TCL_BY_COUNTRY[0]!.km2, "Area of tiger landscapes by country, 2020"),
    h("figcaption", {}, `Tiger Conservation Landscapes by country on 1 January 2020: ${fmt(TCL_TOTAL_KM2)} km² in all. Nepal, Junu's country, is the bright bar. Source: `, ui.cite(["Sanderson2023"])),
  );
}

// ---- The sandbox ----

const sand = { year: FIRST_YEAR, why: false };

function sayYear(year: number): string {
  const c = countAt(year);
  return `${year}: tigers in ${c.tigers} of ${PLACES.length} places, gone from ${c.gone}${c.unsure ? `, ${c.unsure} uncertain` : ""}`;
}

function sandbox(): HTMLElement {
  const fig = h("div", { attrs: { "aria-live": "polite" } });
  const lost = h("p", { cls: "range-lost" });
  const draw = () => {
    fig.replaceChildren(rangeMap("sandbox", sand.year, { caption: LEGEND }));
    const gone = lostIn(sand.year);
    lost.textContent = `${sayYear(sand.year)}.${gone.length ? ` Lost in the ten years before: ${gone.map((p) => name(p.id)).join(", ")}.` : ""}`;
  };
  const input = h("input", {
    type: "range",
    min: String(FIRST_YEAR),
    max: String(LAST_YEAR),
    step: String(YEAR_STEP),
    value: String(sand.year),
    key: "year",
    attrs: { "aria-label": "Year", "aria-valuetext": sayYear(sand.year) },
    // Redraw only the map: a full redraw would replace the slider under the pointer.
    oninput: () => {
      sand.year = Number(input.value);
      input.setAttribute("aria-valuetext", sayYear(sand.year));
      draw();
    },
  });
  draw();
  const why = pressed(
    h(
      "button",
      {
        type: "button",
        key: "why",
        onclick: () => {
          sand.why = !sand.why;
          ui.render();
        },
      },
      "Why: the three layers",
    ),
    sand.why,
  );
  return h(
    "div",
    { cls: "panel" },
    h(
      "div",
      { cls: "panel estimate" },
      h("p", { cls: "estimate-question" }, "Move through the century."),
      input,
      h("div", { cls: "estimate-ends", attrs: { "aria-hidden": "true" } }, h("span", {}, String(FIRST_YEAR)), h("span", {}, String(LAST_YEAR))),
      why,
    ),
    fig,
    lost,
    ...(sand.why ? [layers()] : []),
  );
}

// ---- The lesson ----

export const lesson9: Lesson = {
  title: TITLE,
  steps: STEPS,
  sources: lessonSources(),
  view(i, u) {
    ui = u;
    switch (STEPS[i]!.view) {
      case "junu":
        return [rangeMap("junu", null, { plain: true, caption: "Chitwan, Junu's home, in southern Nepal." })];
      case "indigenous":
        return [rangeMap("old", null, { caption: "The 30 countries of the tiger's old range, with Indonesia drawn as Sumatra, Java and Bali, and Malaysia as its peninsula." })];
      case "check":
        return [pickView(TASK, pick, ui)];
      case "losses":
        return [rangeMap("losses", LAST_YEAR, { caption: `The map in ${LAST_YEAR}. ${LEGEND}` }), lossTable()];
      case "layers":
        return [layers()];
      case "now":
        return [rangeMap("now", LAST_YEAR, { caption: `The ten countries with breeding tigers in ${LAST_YEAR}. ${LEGEND}` }), tclRows()];
      case "trend":
        return [layers()];
      case "sandbox":
        return [sandbox()];
    }
  },
  hold(i) {
    return STEPS[i]!.view === "check" && !pick.locked ? "Lock in your picks to go on." : null;
  },
};
