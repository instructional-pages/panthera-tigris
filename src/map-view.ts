// The range map, drawn: country outlines as SVG, with regions shaded by a lesson (the range in a
// given decade), places marked by longitude and latitude, and a pick task where the learner picks
// regions, locks the picks in, then sees which were right. Logic in map.ts; outlines in map-data.ts.

import { h } from "./dom.ts";
import { allRight, checkPickTask, judge, project, toggle, type Verdict } from "./map.ts";
import { FRAME, REGIONS } from "./map-data.ts";
import type { Ui } from "./shell.ts";

/** How a lesson shades a region: told apart by brightness and hatching, not by hue. */
export type Shade = "solid" | "hatched" | "dim";

/** A point placed by longitude and latitude, with a short label. */
export interface Mark {
  readonly lon: number;
  readonly lat: number;
  readonly label: string;
}

/** What one drawing of the map shows. */
export interface MapOptions {
  /** Unique on the page: keeps keyboard focus across redraws and names the hatch pattern. */
  readonly key: string;
  /** Spoken name of the whole map. */
  readonly title: string;
  /** Shade for a region, or undefined to leave it plain. */
  readonly shade?: (id: string) => Shade | undefined;
  readonly marks?: readonly Mark[];
  /** Regions the learner may pick, the current picks, and what to do on a pick. */
  readonly pick?: { readonly choices: readonly string[]; readonly picked: ReadonlySet<string>; onToggle(id: string): void };
  /** Once a pick task is locked in: each choice's verdict, drawn and labelled. */
  readonly verdicts?: ReadonlyMap<string, Verdict>;
  /** The part of the map to show, in map units [x, y, width, height]; the whole frame by default. */
  readonly crop?: readonly [number, number, number, number];
}

const SVG = "http://www.w3.org/2000/svg";
const byId = new Map(REGIONS.map((r) => [r.id, r]));
const ids = new Set(byId.keys());
/** Regions smaller than this (map units) get a ring around them, so they can be seen and picked. */
const SMALL = 12;

function s<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}, ...kids: (Node | string)[]): SVGElementTagNameMap[K] {
  const e = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  e.append(...kids);
  return e;
}

const VERDICT_WORD: Record<Verdict, string> = { found: "✓", missed: "missed:", wrong: "✗", none: "" };

/** The map as an SVG figure, with a credit for the outlines. */
export function mapView(o: MapOptions): HTMLElement {
  const hatch = `hatch-${o.key}`;
  const [cx, cy, cw, chh] = o.crop ?? [0, 0, FRAME.width, FRAME.height];
  const svg = s("svg", { viewBox: `${cx} ${cy} ${cw} ${chh}`, class: "map", role: "group", "aria-label": o.title });
  svg.append(
    s(
      "defs",
      {},
      s(
        "pattern",
        { id: hatch, width: 6, height: 6, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" },
        s("line", { x1: 0, y1: 0, x2: 0, y2: 6, class: "map-hatch" }),
      ),
    ),
  );
  // A crop zooms in; text and markers keep their size on screen (strokes don't scale, in CSS).
  const u = cw / FRAME.width;
  svg.style.setProperty("--u", String(u));

  const choices = new Set(o.pick?.choices ?? []);
  const base = s("g", { class: "map-base", "aria-hidden": "true" });
  for (const r of REGIONS) {
    if (choices.has(r.id)) continue;
    const shade = o.shade?.(r.id);
    const path = s("path", { d: r.d, class: `map-region${r.detail ? " detail" : ""}${shade ? ` ${shade}` : ""}` });
    if (shade === "hatched") path.style.fill = `url(#${hatch})`;
    base.append(path);
  }
  svg.append(base);

  const labels = s("g", { class: "map-labels", "aria-hidden": "true" });
  for (const id of o.pick?.choices ?? []) {
    const r = byId.get(id)!;
    const picked = o.pick!.picked.has(id);
    const verdict = o.verdicts?.get(id);
    const shade = verdict ? undefined : o.shade?.(id);
    const cls = ["map-region", "detail", "map-choice", verdict ?? (picked ? "picked" : ""), shade ?? ""].filter(Boolean).join(" ");
    const g = s("g", { class: cls });
    const path = s("path", { d: r.d });
    if (verdict === "wrong" || shade === "hatched") path.style.fill = `url(#${hatch})`;
    g.append(path);
    const [l, t, rt, b] = r.box;
    const small = rt! - l! < SMALL && b! - t! < SMALL;
    if (small) g.append(s("circle", { cx: r.at[0]!, cy: r.at[1]!, r: 8 * u, class: "map-ring" }));
    g.append(s("title", {}, r.name));
    if (!o.verdicts) {
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "checkbox");
      g.setAttribute("aria-checked", String(picked));
      g.setAttribute("aria-label", r.name);
      g.dataset.key = `${o.key}-${id}`;
      g.addEventListener("click", () => o.pick!.onToggle(id));
      g.addEventListener("keydown", (e) => {
        if (e.key !== " " && e.key !== "Enter") return;
        e.preventDefault();
        o.pick!.onToggle(id);
      });
    }
    svg.append(g);
    if (verdict && verdict !== "none") labels.append(label(small ? [r.at[0]!, r.at[1]! - 12 * u] : r.at, `${VERDICT_WORD[verdict]} ${r.name}`, verdict));
  }

  for (const m of o.marks ?? []) {
    const [x, y] = project(FRAME, m.lon, m.lat);
    labels.append(s("circle", { cx: x, cy: y, r: 4 * u, class: "map-mark" }), label([x, y - 9 * u], m.label, "mark"));
  }
  svg.append(labels);

  return h("figure", { cls: "map-figure" }, svg as unknown as HTMLElement, h("figcaption", {}, "Country outlines: Natural Earth (public domain)."));
}

function label(at: readonly number[], text: string, cls: string): SVGTextElement {
  return s("text", { x: at[0]!, y: at[1]!, class: `map-label ${cls}`, "text-anchor": "middle" }, text);
}

/** A "pick the places on the map" check: pick, lock in, then see each choice's verdict. */
export interface PickTask {
  /** Unique on the page. */
  readonly key: string;
  /** The question, in rich text. */
  readonly question: string;
  /** Region ids the learner may pick: the answer and some that aren't. */
  readonly choices: readonly string[];
  /** The right picks. */
  readonly answer: readonly string[];
  /** Shown after the reveal: why, in rich text with citations. */
  readonly explain: string;
  /** The part of the map to show; the whole frame by default. */
  readonly crop?: readonly [number, number, number, number];
}

export interface PickState {
  picked: Set<string>;
  locked: boolean;
}

export function freshPick(t: PickTask): PickState {
  checkPickTask(ids, t.choices, t.answer);
  return { picked: new Set(), locked: false };
}

const names = (list: readonly string[]): string => list.map((id) => byId.get(id)!.name).join(", ");

/** The question, the map, the picks so far and Lock in; after locking, the verdicts. */
export function pickView(t: PickTask, st: PickState, ui: Ui): HTMLElement {
  const verdicts = st.locked ? judge(t.choices, t.answer, st.picked) : undefined;
  const map = mapView({
    key: t.key,
    title: plainQuestion(t, ui),
    crop: t.crop,
    pick: {
      choices: t.choices,
      picked: st.picked,
      onToggle: (id) => {
        st.picked = toggle(st.picked, id);
        ui.render();
      },
    },
    verdicts,
  });
  const chosen = t.choices.filter((id) => st.picked.has(id));
  const box = h(
    "div",
    { cls: "panel pick" },
    h("p", { cls: "pick-question" }, ...ui.rich(t.question)),
    map,
    h("p", { cls: "pick-list", attrs: { "aria-live": "polite" } }, chosen.length ? `Picked: ${names(chosen)}.` : "Nothing picked yet."),
  );
  if (!verdicts) {
    box.append(
      h(
        "button",
        {
          type: "button",
          key: `${t.key}-lock`,
          disabled: chosen.length === 0,
          onclick: () => {
            st.locked = true;
            ui.render();
            ui.focusNext();
          },
        },
        "Lock in my picks",
      ),
    );
    return box;
  }

  const of = (v: Verdict) => t.choices.filter((id) => verdicts.get(id) === v);
  const right = allRight(verdicts);
  const missed = of("missed");
  const wrong = of("wrong");
  box.append(
    h(
      "p",
      { cls: right ? "feedback right" : "feedback wrong", attrs: { "aria-live": "polite" } },
      h("strong", {}, right ? "✓ All right. " : "✗ Not quite. "),
      missed.length ? `Missed: ${names(missed)}. ` : "",
      wrong.length ? `Not right: ${names(wrong)}. ` : "",
      right ? "" : `The answer: ${names(t.answer)}. `,
      ...ui.rich(t.explain),
    ),
  );
  return box;
}

const plainQuestion = (t: PickTask, ui: Ui): string => ui.rich(t.question).map((n) => n.textContent).join("");
