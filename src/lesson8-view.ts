// Lesson 8's live view: Junu, the nine populations, the three ways of grouping them, the
// two-subspecies check and the threshold sandbox, drawn from lesson8.ts.

import { h, pressed } from "./dom.ts";
import { JUNU } from "./junu.ts";
import {
  byId,
  CHECK_ANSWER,
  CHECK_EXPLAIN,
  CHECK_GROUPS,
  CHECK_ITEMS,
  EIGHT,
  groupsAt,
  judgeSort,
  leaves,
  lessonSources,
  POPULATIONS,
  type Scheme,
  SCHEMES,
  SIX,
  STATUS_WORD,
  STEPS,
  THRESHOLD_MAX,
  THRESHOLD_MIN,
  THRESHOLD_START,
  TITLE,
  TREE,
  type Tree,
  TWO,
} from "./lesson8.ts";
import type { Lesson, Ui } from "./shell.ts";
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

const W = 900;
const COL = W / POPULATIONS.length;

function junu(): HTMLElement {
  return h(
    "figure",
    { cls: "coat-figure" },
    asEl(tigerView({ key: "junu", seed: JUNU, title: "Junu, side view" })),
    h("figcaption", {}, "Junu, five. A drawing: her pattern is made up, but it is hers in every lesson."),
  );
}

// ---- The populations, and the schemes that group them ----

/** A population's tile: solid outline if living, dashed if extinct (in the wild or for good). */
function tile(svg: SVGElement, id: string, x: number, y: number, w: number): void {
  const p = byId(id);
  const gone = p.status !== "living";
  svg.append(
    s("rect", { class: gone ? "sub-tile gone" : "sub-tile", x: x + 3, y, width: w - 6, height: 52, rx: 4 }),
    s("text", { class: "tl-label sub-name", x: x + w / 2, y: y + 20, "text-anchor": "middle" }, p.name),
    s("text", { class: "tl-tick-label", x: x + w / 2, y: y + 40, "text-anchor": "middle", ...(p.status === "wild-extinct" ? { textLength: w - 14, lengthAdjust: "spacingAndGlyphs" } : {}) }, STATUS_WORD[p.status]),
  );
}

/** The third word of a subspecies name, for a box too narrow for the whole name. */
const short = (name: string): string => name.replace(/^P\. t\. /, "");

const ROW = 62;

/** The populations in a row, west to east then the islands, with each scheme's groups below. */
function schemesSvg(schemes: readonly Scheme[], note?: "caspian-amur"): SVGElement {
  const top = note ? 46 : 8;
  const tilesH = 52;
  const height = top + tilesH + 14 + schemes.length * ROW + 4;
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} ${height}`, role: "img" });
  const said = schemes.map((sc) => `${sc.label}: ${sc.groups.map((g) => `${g.name} (${g.members.map((m) => byId(m).name).join(", ")})`).join("; ")}${sc.outside.length ? `; ${sc.outside.map((m) => byId(m).name).join(", ")} ${sc.outsideWhy}` : ""}.`);
  svg.setAttribute("aria-label", `Nine tiger populations, west to east, then the islands: ${POPULATIONS.map((p) => `${p.name}, ${STATUS_WORD[p.status]}`).join("; ")}. ${said.join(" ")}`);
  const col = (id: string) => POPULATIONS.findIndex((p) => p.id === id);
  if (note) {
    const a = (col("caspian") + 0.5) * COL;
    const b = (col("amur") + 0.5) * COL;
    svg.append(
      s("path", { class: "sub-link", d: `M${a},${top - 2} C${a},${top - 30} ${b},${top - 30} ${b},${top - 2}` }),
      s("text", { class: "tl-label", x: b + 18, y: top - 22 }, "one base in 1,257 apart (mitochondrial DNA)"),
    );
  }
  POPULATIONS.forEach((p, i) => tile(svg, p.id, i * COL, top, COL));
  schemes.forEach((sc, k) => {
    const y = top + tilesH + 14 + k * ROW;
    svg.append(s("text", { class: "tl-tick-label", x: 4, y: y + 4 }, `${schemes.length > 1 ? `${k + 1}. ` : ""}${sc.label}`));
    for (const g of sc.groups) {
      const cols = g.members.map(col);
      const x0 = Math.min(...cols) * COL;
      const x1 = (Math.max(...cols) + 1) * COL;
      const name = cols.length > 1 ? g.name : short(g.name);
      svg.append(
        s("rect", { class: `sub-group ${sc.key}`, x: x0 + 3, y: y + 12, width: x1 - x0 - 6, height: ROW - 26, rx: 3 }),
        s("text", { class: `tl-label${sc.key === "six" ? "" : " sub-sci"}`, x: (x0 + x1) / 2, y: y + 35, "text-anchor": "middle" }, name),
      );
    }
    for (const id of sc.outside)
      svg.append(s("text", { class: "tl-tick-label", x: (col(id) + 0.5) * COL, y: y + 35, "text-anchor": "middle" }, sc.key === "eight" ? "no name yet" : "—"));
  });
  return svg;
}

function schemesFigure(schemes: readonly Scheme[], caption: string, note?: "caspian-amur"): HTMLElement {
  const keys = [...new Set(["Kitchener2017", "Goodrich2022", ...schemes.flatMap((sc) => sc.keys)])];
  return h(
    "figure",
    { cls: "tl-figure" },
    asEl(schemesSvg(schemes, note)),
    h("figcaption", {}, caption, " Solid tile: living. Dashed tile: extinct, or extinct in the wild. Sources: ", ui.cite(keys)),
  );
}

// ---- The two-subspecies check ----

const sortState: { picks: (number | null)[]; locked: boolean } = { picks: CHECK_ITEMS.map(() => null), locked: false };

function checkView(): HTMLElement {
  const right = sortState.locked ? judgeSort(CHECK_ANSWER, sortState.picks) : undefined;
  const list = h("ol", { cls: "match-photos" });
  CHECK_ITEMS.forEach((id, i) => {
    const p = byId(id);
    const row = h("li", { cls: "match-photo" }, h("span", { cls: "sub-item" }, h("strong", {}, p.name), h("span", { cls: "muted small" }, ` ${p.where}`)));
    const pick = sortState.picks[i];
    if (!right) {
      const group = h("span", { cls: "match-buttons", attrs: { role: "group", "aria-label": `Where does the ${p.name} tiger go?` } });
      CHECK_GROUPS.forEach((g, k) =>
        group.append(
          pressed(
            h(
              "button",
              {
                type: "button",
                key: `sort-${id}-${k}`,
                onclick: () => {
                  sortState.picks[i] = k;
                  ui.render();
                },
              },
              h("em", {}, g),
            ),
            pick === k,
          ),
        ),
      );
      row.append(group);
    } else {
      const answer = CHECK_GROUPS[CHECK_ANSWER[i]!]!;
      row.classList.add(right[i] ? "right" : "wrong");
      row.append(h("span", { cls: "match-verdict" }, right[i] ? `✓ ${answer}` : `✗ it's ${answer} (you said ${pick === null || pick === undefined ? "nothing" : CHECK_GROUPS[pick]})`));
    }
    list.append(row);
  });
  const box = h("div", { cls: "panel match" }, h("p", { cls: "match-question" }, "Put each living population into one of the two subspecies of 2017."), list);
  if (!right) {
    box.append(
      h(
        "button",
        {
          type: "button",
          key: "sort-lock",
          disabled: sortState.picks.some((x) => x === null),
          onclick: () => {
            sortState.locked = true;
            ui.render();
            ui.focusNext();
          },
        },
        "Lock in my answer",
      ),
    );
    return box;
  }
  const all = right.every(Boolean);
  box.append(h("p", { cls: all ? "feedback right" : "feedback wrong", attrs: { "aria-live": "polite" } }, h("strong", {}, all ? "✓ All placed right. " : "✗ Not quite. "), ...ui.rich(CHECK_EXPLAIN)));
  return box;
}

// ---- The threshold sandbox ----

const sand = { threshold: THRESHOLD_START };
const ORDER = leaves(TREE);
const TOP = 20;
const BASE = 250;
const LEAF_W = W / ORDER.length;
const yOf = (d: number) => BASE - (d / THRESHOLD_MAX) * (BASE - TOP);
const xOf = (id: string) => (ORDER.indexOf(id) + 0.5) * LEAF_W;

/** Where a part of the tree hangs: its x (the middle of its two parts) and y. */
function anchor(t: Tree): [number, number] {
  if (typeof t === "string") return [xOf(t), BASE];
  const a = anchor(t.parts[0])[0];
  const b = anchor(t.parts[1])[0];
  return [(a + b) / 2, yOf(t.at)];
}

function drawTree(svg: SVGElement, t: Tree, threshold: number): void {
  if (typeof t === "string") return;
  const [x, y] = anchor(t);
  const split = t.at >= threshold;
  for (const part of t.parts) {
    const [cx, cy] = anchor(part);
    svg.append(s("path", { class: split ? "sub-branch" : "sub-branch merged", d: `M${cx},${cy} V${y} H${x}` }));
    drawTree(svg, part, threshold);
  }
}

/** What the current count matches, if anything. */
function matches(groups: readonly (readonly string[])[]): string {
  const key = (g: readonly string[]) => [...g].sort().join(",");
  const two = new Set(TWO.groups.map((g) => key(g.members)));
  if (groups.length === 2 && groups.every((g) => two.has(key(g)))) return "The 2017 revision's two: mainland and islands.";
  const living = groups.map((g) => g.filter((id) => byId(id).status !== "extinct")).filter((g) => g.length);
  if (groups.length === SIX.groups.length && living.length === SIX.groups.length && living.every((g) => g.length === 1)) return "Each living population is its own group: the genomes' six.";
  if (groups.length === POPULATIONS.length) return "Every population its own subspecies: more even than the old eight.";
  if (groups.length === 1) return "No difference is big enough: one tiger, no subspecies.";
  return "";
}

function sandboxSvg(): SVGElement {
  const groups = groupsAt(TREE, sand.threshold);
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} ${BASE + 120}`, role: "img" });
  svg.setAttribute("aria-label", `A model tree of nine populations. At this line there are ${groups.length} subspecies: ${groups.map((g) => g.map((id) => byId(id).name).join(" + ")).join("; ")}.`);
  drawTree(svg, TREE, sand.threshold);
  const lineY = yOf(sand.threshold - 0.5);
  svg.append(
    s("line", { class: "sub-cut", x1: 0, y1: lineY, x2: W, y2: lineY }),
    s("text", { class: "tl-tick-label", x: 4, y: TOP - 6 }, "↑ bigger difference (made-up units)"),
  );
  for (const id of ORDER) {
    const p = byId(id);
    svg.append(s("text", { class: p.status === "extinct" ? "tl-label sub-gone" : "tl-label", x: xOf(id), y: BASE + 18, "text-anchor": "middle" }, p.status === "extinct" ? `${p.name}†` : p.name));
  }
  for (const g of groups) {
    const x0 = (ORDER.indexOf(g[0]!) + 0) * LEAF_W;
    const x1 = (ORDER.indexOf(g[g.length - 1]!) + 1) * LEAF_W;
    svg.append(s("rect", { class: "sub-group sandbox", x: x0 + 3, y: BASE + 28, width: x1 - x0 - 6, height: 26, rx: 3 }));
  }
  svg.append(s("text", { class: "sub-count", x: W / 2, y: BASE + 90, "text-anchor": "middle" }, `${groups.length} subspecies`));
  return svg;
}

function sandbox(): HTMLElement {
  const fig = h("div", { attrs: { "aria-live": "polite" } });
  const note = h("p", { cls: "muted" });
  const draw = () => {
    fig.replaceChildren(asEl(sandboxSvg()));
    note.textContent = matches(groupsAt(TREE, sand.threshold)) || " ";
  };
  const count = () => `${groupsAt(TREE, sand.threshold).length} subspecies`;
  const input = h("input", {
    type: "range",
    min: String(THRESHOLD_MIN),
    max: String(THRESHOLD_MAX),
    step: "1",
    value: String(sand.threshold),
    key: "threshold",
    attrs: { "aria-label": "How big a difference counts as a subspecies", "aria-valuetext": count() },
    // Redraw only the picture: a full redraw would replace the slider under the pointer.
    oninput: () => {
      sand.threshold = Number(input.value);
      input.setAttribute("aria-valuetext", count());
      draw();
    },
  });
  draw();
  return h(
    "div",
    { cls: "panel" },
    h(
      "div",
      { cls: "panel estimate" },
      h("p", { cls: "estimate-question" }, "How big a difference counts as a subspecies?"),
      input,
      h("div", { cls: "estimate-ends", attrs: { "aria-hidden": "true" } }, h("span", {}, "any difference"), h("span", {}, "only the biggest")),
    ),
    h(
      "figure",
      { cls: "tl-figure" },
      fig,
      note,
      h(
        "figcaption",
        {},
        "A model, not measured data: the heights of the branches are made up. Only the pattern follows the sources. Dashed line: where you set it; bright branches above it split, faint ones below it merge. † extinct. Sources: ",
        ui.cite(["Kitchener2017", "Liu2018"]),
      ),
    ),
  );
}

// ---- The lesson ----

export const lesson8: Lesson = {
  title: TITLE,
  steps: STEPS,
  sources: lessonSources(),
  view(i, u) {
    ui = u;
    switch (STEPS[i]!.view) {
      case "junu":
        return [junu()];
      case "populations":
        return [schemesFigure([], "The tiger populations that have had names, roughly west to east, then the islands.")];
      case "eight":
        return [schemesFigure([EIGHT], "Each box is a subspecies, named by the third word of P. t. … The Malayan tiger got no name of its own until 2004.")];
      case "evidence":
        return [schemesFigure([EIGHT], "The closest pair: the Caspian and Amur tigers.", "caspian-amur")];
      case "check":
        return [schemesFigure([], "Where each population lived."), checkView()];
      case "two":
        return [schemesFigure([TWO], "The two boxes are the two subspecies of 2017.")];
      case "six":
        return [schemesFigure([SIX], "Each box is one of the genome study's six living groups. The extinct tigers are not among them.")];
      case "all":
        return [schemesFigure(SCHEMES, "The same tigers, grouped three ways.")];
      case "sandbox":
        return [sandbox()];
    }
  },
  hold(i) {
    return STEPS[i]!.view === "check" && !sortState.locked ? "Lock in your answer to go on." : null;
  },
};
