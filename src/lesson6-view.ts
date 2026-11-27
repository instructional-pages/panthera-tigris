// Lesson 6's live view: Junu, the map of neighbouring ranges, the five ways of marking, the
// place-your-marks check, two females taking turns at a boundary, the odour field and the
// walking sandbox, drawn from lesson6.ts.

import { h, pressed } from "./dom.ts";
import {
  at,
  byZone,
  type Cell,
  CHECK_EXPLAIN,
  CHECK_MARKS,
  COLS,
  type Dir,
  FIELD_LEVELS,
  has,
  isPath,
  JUDGE_TEXT,
  judgeMarks,
  lessonSources,
  MALE_BOX,
  MARK_WAYS,
  odourField,
  othersMarks,
  PATHS,
  RANGES,
  ROWS,
  STEPS,
  stepTo,
  TIMING_DAYS,
  TITLE,
  toggleMark,
  VISITS,
  type Walker,
  walker,
  wander,
  type Zone,
  zone,
  zoneSizes,
} from "./lesson6.ts";
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
const CELL = 36;
const OX = (W - COLS * CELL) / 2;
const OY = 10;
const H = OY * 2 + ROWS * CELL;
const cx = (c: number): number => OX + (c + 0.5) * CELL;
const cy = (r: number): number => OY + (r + 0.5) * CELL;
const cellOf = (i: number): Cell => [i % COLS, Math.floor(i / COLS)];

function junu(): HTMLElement {
  return h(
    "figure",
    { cls: "coat-figure" },
    asEl(tigerView({ key: "junu", seed: JUNU, title: "Junu, side view" })),
    h("figcaption", {}, "Junu at two years old. A drawing: her pattern is made up, but it is hers in every lesson."),
  );
}

// ---- The map ----

interface MapOpts {
  readonly paths?: boolean;
  /** Odour field levels per cell, drawn as brightness over Junu's range, where she meets it. */
  readonly field?: readonly number[];
  /** Junu's marks (solid dots) and the other tigers' (hollow dots), per cell. */
  readonly junuMarks?: readonly number[];
  readonly otherMarks?: readonly number[];
  /** Where Junu stands. */
  readonly junuAt?: Cell;
  /** Shade Junu's edges and crossings (the check's reveal). */
  readonly zones?: boolean;
}

const LABELS: readonly (readonly [string, number, number])[] = [
  ["Junu's mother", 3.5, 0],
  ["Junu", 8.5, 0],
  ["a neighbouring female", 14.5, 0],
  ["a male's range: dashed", 6.5, 10],
];

/** A dot whose area grows with the number of marks. */
const dotR = (n: number): number => Math.min(10, 1.8 * Math.sqrt(n));

function mapSvg(o: MapOpts, label: string): SVGElement {
  const svg = s("svg", { class: "lines terr-map", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": label });
  if (o.zones)
    svg.append(
      s(
        "defs",
        {},
        s("pattern", { id: "terr-hatch", width: 6, height: 6, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, s("rect", { width: 6, height: 6, fill: "#3a3a3a" }), s("line", { x1: 0, y1: 0, x2: 0, y2: 6, stroke: "#e6e6e6", "stroke-width": 2 })),
      ),
    );
  const owner = (c: number, r: number): string => (c >= 0 && c < COLS && r >= 0 && r < ROWS ? RANGES[r]![c]! : ".");
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const own = owner(c, r);
      const z = o.zones ? zone("junu", c, r) : null;
      const cls = own === "." ? "" : z === "crossing" ? "terr-cell crossing" : z === "edge" ? "terr-cell edge" : own === "J" ? "terr-cell junu" : "terr-cell";
      if (cls) svg.append(s("rect", { class: cls, x: OX + c * CELL, y: OY + r * CELL, width: CELL, height: CELL }));
      const lvl = has("junu", c, r) ? (o.field?.[at(c, r)] ?? 0) : 0;
      if (lvl) svg.append(s("rect", { class: "odour", x: OX + c * CELL, y: OY + r * CELL, width: CELL, height: CELL, "fill-opacity": (0.12 * lvl).toFixed(2) }));
    }
  // Boundaries between ranges, and between a range and open land.
  for (let r = 0; r <= ROWS; r++)
    for (let c = 0; c <= COLS; c++) {
      if (owner(c, r) !== owner(c - 1, r))
        svg.append(s("line", { class: "terr-line", x1: OX + c * CELL, y1: OY + r * CELL, x2: OX + c * CELL, y2: OY + (r + 1) * CELL }));
      if (owner(c, r) !== owner(c, r - 1))
        svg.append(s("line", { class: "terr-line", x1: OX + c * CELL, y1: OY + r * CELL, x2: OX + (c + 1) * CELL, y2: OY + r * CELL }));
    }
  if (o.paths)
    for (const p of PATHS)
      svg.append(s("polyline", { class: "route", points: p.map(([c, r]) => `${cx(c)},${cy(r)}`).join(" ") }));
  svg.append(
    s("rect", {
      class: "male-range",
      x: OX + MALE_BOX.c0 * CELL + 4,
      y: OY + MALE_BOX.r0 * CELL + 4,
      width: (MALE_BOX.c1 - MALE_BOX.c0 + 1) * CELL - 8,
      height: (MALE_BOX.r1 - MALE_BOX.r0 + 1) * CELL - 8,
    }),
  );
  for (let i = 0; i < COLS * ROWS; i++) {
    const [c, r] = cellOf(i);
    const mine = o.junuMarks?.[i] ?? 0;
    const theirs = o.otherMarks?.[i] ?? 0;
    if (theirs) svg.append(s("circle", { class: "tl-hollow", cx: cx(c) + (mine ? 7 : 0), cy: cy(r) + (mine ? 7 : 0), r: dotR(theirs) }));
    if (mine) svg.append(s("circle", { class: "tl-solid", cx: cx(c) - (theirs ? 6 : 0), cy: cy(r) - (theirs ? 6 : 0), r: dotR(mine) }));
  }
  if (o.junuAt)
    svg.append(
      s("circle", { class: "tiger-at", cx: cx(o.junuAt[0]), cy: cy(o.junuAt[1]), r: 13 }),
      s("text", { class: "tiger-at-label", x: cx(o.junuAt[0]), y: cy(o.junuAt[1]) + 4, "text-anchor": "middle" }, "J"),
    );
  for (const [t, c, r] of LABELS) svg.append(s("text", { class: "tl-label", x: cx(c), y: cy(r) + 4, "text-anchor": "middle" }, t));
  return svg;
}

const MAP_SAYS =
  "A map drawn as a grid: Junu's range in the middle, her mother's to the west, a neighbouring female's to the east, the females' ranges touching but not overlapping; a male's range, dashed, lies over parts of Junu's and her mother's.";

function ranges(): HTMLElement {
  return h(
    "figure",
    { cls: "tl-figure" },
    asEl(mapSvg({}, MAP_SAYS)),
    h("figcaption", {}, "A drawing, not real data or to scale. Females' ranges seldom overlap; a male's overlaps one to three females'. Source: ", ui.cite(["Goodrich2022"])),
  );
}

function marks(): HTMLElement[] {
  return [
    h(
      "figure",
      { cls: "tl-figure" },
      h("p", { cls: "chart-title" }, "Five ways tigers mark"),
      h("ol", { cls: "runs" }, ...MARK_WAYS.map((w) => h("li", {}, w))),
      h("figcaption", {}, "Spraying and scraping were the most common. Source: ", ui.cite(["Smith1989"])),
    ),
    h(
      "figure",
      { cls: "tl-figure" },
      asEl(mapSvg({ paths: true }, `${MAP_SAYS} Dotted lines: three main travel routes, one running east to west across all three females' ranges and two running north to south.`)),
      h("figcaption", {}, "Dotted lines: the main travel routes. A drawing, not real data."),
    ),
  ];
}

// ---- The check ----

const check = { placed: [] as number[], cursor: at(8, 4), locked: false };

const ZONE_SAID: Readonly<Record<Zone, string>> = { inside: "inside", edge: "at an edge", crossing: "at an edge where a route crosses it" };

function cellWords(i: number): string {
  const [c, r] = cellOf(i);
  return `column ${c + 1}, row ${r + 1}${has("junu", c, r) ? ", in Junu's range" : ", not Junu's range"}${isPath(c, r) ? ", on a route" : ""}`;
}

function checkView(): HTMLElement {
  const svg = mapSvg({ paths: true, zones: check.locked }, "");
  const done = check.locked ? judgeMarks(check.placed) : [];
  check.placed.forEach((i, k) => {
    const [c, r] = cellOf(i);
    svg.append(
      s("circle", { class: done[k] === "inside" ? "check-mark wrong" : "check-mark", cx: cx(c), cy: cy(r), r: 11 }),
      s("text", { class: "check-mark-label", x: cx(c), y: cy(r) + 4, "text-anchor": "middle" }, String(k + 1)),
    );
  });
  const live = h("p", { cls: "muted small", attrs: { "aria-live": "polite" } });
  if (!check.locked) {
    const [c, r] = cellOf(check.cursor);
    svg.append(s("rect", { class: "map-cursor", x: OX + c * CELL + 2, y: OY + r * CELL + 2, width: CELL - 4, height: CELL - 4 }));
    svg.setAttribute("role", "application");
    svg.setAttribute("tabindex", "0");
    svg.setAttribute("data-key", "check-map");
    svg.setAttribute(
      "aria-label",
      `${MAP_SAYS} Dotted lines are main travel routes. Move with the arrow keys; Space or Enter leaves or removes a mark. At: ${cellWords(check.cursor)}. Marks placed: ${check.placed.length} of ${CHECK_MARKS}.`,
    );
    const toggle = (i: number) => {
      check.placed = toggleMark(check.placed, i);
      ui.render();
    };
    svg.addEventListener("keydown", (e) => {
      const ev = e as KeyboardEvent;
      const [x, y] = cellOf(check.cursor);
      const move: Record<string, Cell> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
      const d = move[ev.key];
      if (d) {
        check.cursor = at(Math.min(COLS - 1, Math.max(0, x + d[0])), Math.min(ROWS - 1, Math.max(0, y + d[1])));
        ui.render();
      } else if (ev.key === " " || ev.key === "Enter") toggle(check.cursor);
      else return;
      ev.preventDefault();
    });
    for (let i = 0; i < COLS * ROWS; i++) {
      const [c, r] = cellOf(i);
      if (!has("junu", c, r)) continue;
      const hit = s("rect", { class: "map-hit", x: OX + c * CELL, y: OY + r * CELL, width: CELL, height: CELL });
      hit.addEventListener("click", () => {
        check.cursor = i;
        toggle(i);
      });
      svg.append(hit);
    }
    live.append(`Marks placed: ${check.placed.length} of ${CHECK_MARKS}. Click a square of Junu's range, or focus the map and use the arrow keys and Space. Click a mark again to take it back.`);
  } else {
    svg.setAttribute(
      "aria-label",
      `${MAP_SAYS} Junu's edges are shaded lighter, and the edges where a route crosses are hatched. Your marks: ${done.map((z, k) => `${k + 1}, ${ZONE_SAID[z]}`).join("; ")}.`,
    );
  }
  const lock = h(
    "button",
    {
      type: "button",
      key: "check-lock",
      disabled: check.placed.length < CHECK_MARKS,
      onclick: () => {
        check.locked = true;
        ui.render();
        ui.focusNext();
      },
    },
    "Lock in",
  );
  return h(
    "div",
    { cls: "panel" },
    h("p", {}, "Leave Junu's five marks where you think she would mark most."),
    h("figure", { cls: "tl-figure" }, asEl(svg), check.locked ? h("figcaption", {}, "Hatched: an edge where a route crosses it. Lighter: the rest of her edge. A drawing, not real data.") : h("figcaption", {}, "Dotted lines: the main travel routes. A drawing, not real data.")),
    check.locked
      ? h(
          "div",
          { cls: "verdict", attrs: { "aria-live": "polite" } },
          h("ol", { cls: "runs" }, ...done.map((z) => h("li", { cls: z === "inside" ? "muted" : "" }, JUDGE_TEXT[z]))),
          h("p", {}, ...ui.rich(CHECK_EXPLAIN)),
        )
      : h("div", {}, live, h("div", { cls: "traits" }, lock)),
  );
}

// ---- Two females at a shared boundary ----

function timing(): HTMLElement {
  const L = 150;
  const R = W - 20;
  const x = (d: number) => L + (d / TIMING_DAYS) * (R - L);
  const rows = [
    { name: "Junu's mother", days: VISITS.mother, cls: "kill" },
    { name: "Junu", days: VISITS.junu, cls: "kill ref" },
  ];
  const axis = 24 + rows.length * 40;
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} ${axis + 30}`, role: "img" });
  svg.setAttribute("aria-label", `A drawing of ${TIMING_DAYS} days: ${rows.map((r) => `${r.name} at the shared edge on days ${r.days.join(", ")}`).join("; ")}. Never on the same day.`);
  rows.forEach((row, k) => {
    const y = 34 + k * 40;
    svg.append(
      s("text", { class: "tl-label", x: L - 12, y: y + 4, "text-anchor": "end" }, row.name),
      s("line", { class: "tl-guide", x1: L, y1: y, x2: R, y2: y }),
      ...row.days.map((d) => s("line", { class: row.cls, x1: x(d), y1: y - 9, x2: x(d), y2: y + 9 })),
    );
  });
  for (let d = 0; d <= TIMING_DAYS; d += 5)
    svg.append(
      s("line", { class: "tl-tick", x1: x(d), y1: axis, x2: x(d), y2: axis + 6 }),
      s("text", { class: "tl-tick-label", x: x(d), y: axis + 20, "text-anchor": "middle" }, d === 0 ? "day 0" : String(d)),
    );
  svg.append(s("line", { class: "tl-axis", x1: L, y1: axis, x2: R, y2: axis }));
  return h(
    "figure",
    { cls: "tl-figure" },
    asEl(svg),
    h("figcaption", {}, "Each mark is a visit to the edge the two share: the mother's solid, Junu's dashed. A drawing of the pattern, not real data. Source: ", ui.cite(["Liu2024"])),
  );
}

// ---- The odour field ----

let others: number[] | null = null;
const othersNow = (): number[] => (others ??= othersMarks());

function odour(): HTMLElement {
  return h(
    "figure",
    { cls: "tl-figure" },
    asEl(
      mapSvg(
        { paths: true, field: odourField(othersNow()), otherMarks: othersNow(), junuAt: [8, 4] },
        `${MAP_SAYS} Hollow dots: the other tigers' marks, bunched at the edges of their ranges. A brighter shade: a stronger smell of other tigers, strongest along the edges Junu shares with her mother and her neighbour.`,
      ),
    ),
    h(
      "figcaption",
      {},
      `Hollow dots: the other three tigers' marks; a bigger dot, more marks. Brighter squares in Junu's range: a stronger smell of other tigers, in ${FIELD_LEVELS} steps. A model, not real data. Source of the idea: `,
      ui.cite(["Smith1989"]),
    ),
  );
}

// ---- The sandbox ----

const SEED = 6;
let junuWalk: Walker = walker("junu", SEED);
let showField = false;
let walkNote = "";

const pct = (p: number): string => `${Math.round(p * 100)}%`;

function sandbox(): HTMLElement {
  const w = junuWalk;
  const field = showField ? odourField(othersNow()) : undefined;
  const steps = w.steps.reduce((a, b) => a + b, 0);
  const nMarks = w.marks.reduce((a, b) => a + b, 0);
  const sizes = zoneSizes("junu");
  const cells = sizes.inside + sizes.edge + sizes.crossing;
  const time = byZone("junu", w.steps);
  const left = byZone("junu", w.marks);
  const [x, y] = w.pos;
  const go = (d: Dir) => {
    walkNote = stepTo(w, d) ? "" : "That's outside her range: she stays put.";
    ui.render();
  };
  const move = (label: string, d: Dir, key: string) =>
    h(
      "button",
      {
        type: "button",
        key,
        onclick: () => go(d),
      },
      label,
    );
  const svg = mapSvg(
    { paths: true, field, junuMarks: w.marks, junuAt: w.pos },
    `${MAP_SAYS} Junu is at column ${x + 1}, row ${y + 1}, ${ZONE_SAID[zone("junu", x, y)!]} of her range. She has left ${nMarks} marks in ${steps} steps.${showField ? " The odour field is on: brighter squares smell more strongly of other tigers." : ""}`,
  );
  svg.setAttribute("tabindex", "0");
  svg.setAttribute("data-key", "walk-map");
  svg.addEventListener("keydown", (e) => {
    const d = ({ ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 } as Record<string, Dir>)[(e as KeyboardEvent).key];
    if (d === undefined) return;
    e.preventDefault();
    go(d);
  });
  const row = (name: string, z: Zone) =>
    h("tr", {}, h("th", { attrs: { scope: "row" } }, name), h("td", {}, pct(sizes[z] / cells)), h("td", {}, steps ? pct(time[z]) : "–"), h("td", {}, nMarks ? pct(left[z]) : "–"));
  return h(
    "div",
    { cls: "panel" },
    h(
      "div",
      { cls: "traits", attrs: { role: "group", "aria-label": "Walk Junu" } },
      move("↑ North", 0, "walk-n"),
      move("← West", 3, "walk-w"),
      move("↓ South", 2, "walk-s"),
      move("→ East", 1, "walk-e"),
      ...[10, 100, 1000].map((n) =>
        h(
          "button",
          {
            type: "button",
            key: `walk-${n}`,
            onclick: () => {
              wander(w, n);
              walkNote = "";
              ui.render();
            },
          },
          `Wander ${n.toLocaleString("en")} steps`,
        ),
      ),
    ),
    h(
      "div",
      { cls: "traits" },
      pressed(
        h(
          "button",
          {
            type: "button",
            key: "walk-field",
            onclick: () => {
              showField = !showField;
              ui.render();
            },
          },
          "Odour field",
        ),
        showField,
      ),
      h(
        "button",
        {
          type: "button",
          key: "walk-reset",
          onclick: () => {
            junuWalk = walker("junu", SEED);
            walkNote = "";
            ui.render();
          },
        },
        "Start over",
      ),
    ),
    h(
      "figure",
      { cls: "tl-figure" },
      asEl(svg),
      h(
        "figcaption",
        {},
        "J: Junu (arrow keys move her when the map is focused). Solid dots: her marks; a bigger dot, more marks. ",
        showField ? "Brighter squares in her range: a stronger smell of the other tigers' marks. " : "",
        "A model: the pattern is the study's, the chances are made up. Source: ",
        ui.cite(["Smith1989"]),
      ),
    ),
    h("p", { cls: "muted small", attrs: { "aria-live": "polite" } }, walkNote),
    h(
      "table",
      { cls: "cats" },
      h("caption", { cls: "muted small" }, `Junu so far: ${steps.toLocaleString("en")} steps, ${nMarks.toLocaleString("en")} marks.`),
      h("thead", {}, h("tr", {}, h("th", { attrs: { scope: "col" } }, "Where in her range"), h("th", { attrs: { scope: "col" } }, "Share of the ground"), h("th", { attrs: { scope: "col" } }, "Her steps"), h("th", { attrs: { scope: "col" } }, "Her marks"))),
      h("tbody", {}, row("Inside", "inside"), row("At an edge", "edge"), row("Where a route crosses an edge", "crossing")),
    ),
  );
}

// ---- The lesson ----

export const lesson6: Lesson = {
  title: TITLE,
  steps: STEPS,
  sources: lessonSources(),
  view(i, u) {
    ui = u;
    switch (STEPS[i]!.view) {
      case "junu":
        return [junu()];
      case "ranges":
        return [ranges()];
      case "marks":
        return marks();
      case "check":
      case "reveal":
        return [checkView()];
      case "timing":
        return [timing()];
      case "odour":
        return [odour()];
      case "sandbox":
        return [sandbox()];
    }
  },
  hold(i) {
    return STEPS[i]!.view === "check" && !check.locked ? "Lock in your marks to go on." : null;
  },
};
