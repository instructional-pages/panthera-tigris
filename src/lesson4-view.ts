// Lesson 4's live view: the pitch scale, the cochleas, the tuning check, Junu, the pupils and
// the pupil model, drawn from lesson4.ts.

import { h, pressed } from "./dom.ts";
import {
  ANIMALS,
  COCHLEAS,
  type Ear,
  EARS,
  grade,
  type Height,
  HEIGHTS,
  hzLabel,
  lessonSources,
  logPos,
  PITCHES,
  type Pupil,
  PUPIL_NAME,
  SCALE_HZ,
  SHOULDER_CM,
  STEPS,
  type Style,
  STYLES,
  tally,
  TICKS_HZ,
  TITLE,
} from "./lesson4.ts";
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

// ---- The pitch scale ----

function pitchScale(step: number): HTMLElement {
  const L = 20;
  const R = W - 20;
  const x = (hz: number) => L + logPos(hz, SCALE_HZ[0], SCALE_HZ[1]) * (R - L);
  const shown = PITCHES.filter((p) => p.from <= step);
  const ROW = 52;
  const top = 28;
  const axis = top + PITCHES.length * ROW;
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} ${axis + 40}`, role: "img" });
  svg.setAttribute("aria-label", `Pitch, on a scale from ${hzLabel(SCALE_HZ[0])} to ${hzLabel(SCALE_HZ[1])}: ${shown.map((p) => `${p.name}, ${p.detail}`).join("; ")}.`);
  for (const t of TICKS_HZ)
    svg.append(
      s("line", { class: "tl-guide", x1: x(t), y1: top - 10, x2: x(t), y2: axis }),
      s("line", { class: "tl-tick", x1: x(t), y1: axis, x2: x(t), y2: axis + 6 }),
      s("text", { class: "tl-tick-label", x: x(t), y: axis + 20, "text-anchor": "middle" }, hzLabel(t)),
    );
  svg.append(
    s("line", { class: "tl-axis", x1: L, y1: axis, x2: R, y2: axis }),
    s("text", { class: "tl-tick-label", x: L, y: axis + 36 }, "lower pitch"),
    s("text", { class: "tl-tick-label", x: R, y: axis + 36, "text-anchor": "end" }, "higher pitch →"),
  );
  shown.forEach((p, i) => {
    const y = top + i * ROW + 22;
    const roar = p.mid !== undefined;
    const x1 = x(p.lo);
    const x2 = Math.max(x(p.hi), x1 + 4);
    svg.append(
      s("rect", { class: roar ? "pitch-band roar" : "pitch-band", x: x1, y: y - 6, width: x2 - x1, height: 12 }),
      s("text", { class: "tl-label", x: Math.min(x1, R - 260), y: y - 12 }, `${p.name}: ${p.detail}`),
    );
    if (roar) svg.append(s("circle", { class: "tl-solid", cx: x(p.mid!), cy: y, r: 5 }));
  });
  return h(
    "figure",
    { cls: "tl-figure" },
    asEl(svg),
    h(
      "figcaption",
      {},
      "A logarithmic scale: each tick is about double the one before. Voices are drawn as narrow solid bars at their averages; the roar as an outlined band, its whole range, with a dot at its average. Sources: ",
      ui.cite([...new Set(shown.flatMap((p) => p.cites))]),
    ),
  );
}

// ---- The cochleas, uncoiled ----

function cochleas(): HTMLElement {
  const L = 110;
  const PX = 14; // pixels per mm
  const ROW = 46;
  const top = 34;
  const svg = s("svg", { class: "lines", viewBox: `0 0 ${W} ${top + COCHLEAS.length * ROW + 30}`, role: "img" });
  svg.setAttribute("aria-label", `Basilar membranes uncoiled, to scale: ${COCHLEAS.map((c) => `${c.name.toLowerCase()} ${c.lo === c.hi ? c.lo : `${c.lo}–${c.hi}`} mm`).join(", ")}. High pitches at the left end, low pitches at the right.`);
  svg.append(
    s("text", { class: "tl-tick-label", x: L, y: 14 }, "← high pitches"),
    s("text", { class: "tl-tick-label", x: L + 39 * PX, y: 14, "text-anchor": "end" }, "low pitches →"),
  );
  COCHLEAS.forEach((c, i) => {
    const y = top + i * ROW + 12;
    svg.append(
      s("text", { class: "tl-label", x: L - 12, y: y + 4, "text-anchor": "end" }, c.name),
      s("line", { class: "cochlea", x1: L, y1: y, x2: L + c.lo * PX, y2: y }),
      s("text", { class: "tl-tick-label", x: L + c.hi * PX + 10, y: y + 4 }, c.lo === c.hi ? `${c.lo} mm` : `${c.lo}–${c.hi} mm`),
    );
    if (c.hi > c.lo) svg.append(s("line", { class: "cochlea range", x1: L + c.lo * PX, y1: y, x2: L + c.hi * PX, y2: y }));
  });
  const yb = top + COCHLEAS.length * ROW + 6;
  svg.append(
    s("line", { class: "tl-axis", x1: L, y1: yb, x2: L + 10 * PX, y2: yb }),
    s("line", { class: "tl-axis", x1: L, y1: yb - 5, x2: L, y2: yb + 5 }),
    s("line", { class: "tl-axis", x1: L + 10 * PX, y1: yb - 5, x2: L + 10 * PX, y2: yb + 5 }),
    s("text", { class: "tl-tick-label", x: L + 10 * PX + 8, y: yb + 4 }, "10 mm"),
  );
  return h(
    "figure",
    { cls: "tl-figure" },
    asEl(svg),
    h("figcaption", {}, "Each basilar membrane drawn straight, to scale. The tiger's runs 36–39 mm: solid to 36, dashed to 39. Source: ", ui.cite(["Bergevin2012"])),
  );
}

// ---- The check ----

let guess: Ear | null = null;
let revealed = false;

function checkPanel(): HTMLElement {
  const fs = h("fieldset", {}, h("legend", {}, "A tiger's cochlea is tuned…"));
  for (const e of EARS)
    fs.append(
      h(
        "label",
        {},
        h("input", {
          type: "radio",
          name: "ear",
          value: e.value,
          checked: guess === e.value,
          disabled: revealed,
          key: `ear-${e.value}`,
          onchange: () => {
            guess = e.value;
            ui.render();
          },
        }),
        " ",
        e.label,
      ),
    );
  if (revealed && guess) {
    const f = grade(guess);
    fs.append(h("p", { cls: f.correct ? "feedback right" : "feedback wrong" }, h("strong", {}, f.correct ? "✓ Right. " : "✗ Not quite. "), ...ui.rich(f.text)));
  }
  const box = h("div", { cls: "panel" }, fs);
  if (!revealed)
    box.append(
      h(
        "button",
        {
          type: "button",
          key: "reveal",
          disabled: guess === null,
          onclick: () => {
            revealed = true;
            ui.render();
            ui.focusNext();
          },
        },
        "Show the answer",
      ),
    );
  return box;
}

// ---- Eyes ----

/** An eye with its pupil, drawn at (cx, cy); the shapes follow the paper's examples. */
function eye(pupil: Pupil, cx: number, cy: number, r = 34): SVGElement {
  const g = s("g", {}, s("circle", { class: "iris", cx, cy, r }));
  if (pupil === "round") g.append(s("circle", { class: "pupil", cx, cy, r: r * 0.42 }));
  if (pupil === "vertical") g.append(s("ellipse", { class: "pupil", cx, cy, rx: r * 0.12, ry: r * 0.85 }));
  if (pupil === "horizontal") g.append(s("rect", { class: "pupil", x: cx - r * 0.7, y: cy - r * 0.2, width: r * 1.4, height: r * 0.4, rx: r * 0.12 }));
  return g;
}

const SHAPES: readonly { pupil: Pupil; animal: string }[] = [
  { pupil: "vertical", animal: "house cat" },
  { pupil: "round", animal: "person" },
  { pupil: "horizontal", animal: "sheep" },
];

function pupils(): HTMLElement {
  const svg = s("svg", { class: "lines eyes", viewBox: `0 0 ${W} 130`, role: "img" });
  svg.setAttribute("aria-label", SHAPES.map((p) => `${PUPIL_NAME[p.pupil]}, as in a ${p.animal}`).join("; "));
  SHAPES.forEach((p, i) => {
    const cx = W / 6 + (i * W) / 3;
    svg.append(
      eye(p.pupil, cx, 46),
      s("text", { class: "tl-label", x: cx, y: 102, "text-anchor": "middle" }, PUPIL_NAME[p.pupil]),
      s("text", { class: "tl-tick-label", x: cx, y: 120, "text-anchor": "middle" }, `as in a ${p.animal}`),
    );
  });
  return h("figure", { cls: "tl-figure" }, asEl(svg), h("figcaption", {}, "Drawings of the three shapes, after the paper's examples. Source: ", ui.cite(["Banks2015"])));
}

// ---- The pupil model ----

let style: Style = "ambush";
let height: Height = "short";
let placed: string | null = null;

function choose(set: () => void): void {
  set();
  placed = null;
  ui.render();
}

function modelPanel(): HTMLElement {
  const t = tally(style, height);
  const animal = ANIMALS.find((a) => a.name === placed) ?? null;
  const svg = s("svg", { class: "lines eyes", viewBox: `0 0 ${W} 100`, role: "img" });
  svg.setAttribute("aria-label", `The data predicts ${PUPIL_NAME[t.predicted]}.`);
  svg.append(eye(t.predicted, W / 2, 50, 40));
  const counts = (Object.entries(t.counts) as [Pupil, number][]).map(([p, n]) => `${t.worked ? "about " : ""}${n} with ${PUPIL_NAME[p]}`).join(" and ");
  const why =
    style === "prey"
      ? `Of the paper's ${t.of} grazing prey animals, ${counts}. The paper doesn't split them by height.`
      : `Of the paper's ambush hunters with forward-facing eyes ${HEIGHTS.find((x) => x.value === height)!.label}: ${counts}. Worked out from the paper's percentages, so rounded.`;
  return h(
    "div",
    { cls: "panel" },
    h(
      "div",
      { cls: "traits", attrs: { role: "group", "aria-label": "Hunting style" } },
      h("span", { cls: "muted" }, "The animal is "),
      ...STYLES.map((x) => pressed(h("button", { type: "button", key: `style-${x.value}`, onclick: () => choose(() => (style = x.value)) }, x.label), x.value === style)),
    ),
    h(
      "div",
      { cls: "traits", attrs: { role: "group", "aria-label": "Height at the shoulder" } },
      h("span", { cls: "muted" }, "and stands "),
      ...HEIGHTS.map((x) => pressed(h("button", { type: "button", key: `height-${x.value}`, onclick: () => choose(() => (height = x.value)) }, x.label), x.value === height)),
    ),
    h(
      "div",
      { cls: "traits", attrs: { role: "group", "aria-label": "Place an animal" } },
      h("span", { cls: "muted" }, "Or place: "),
      ...ANIMALS.map((a) =>
        pressed(
          h(
            "button",
            {
              type: "button",
              key: `animal-${a.name}`,
              onclick: () => {
                style = a.style;
                height = a.height;
                placed = a.name;
                ui.render();
              },
            },
            a.name.replace(/^A /, "a "),
          ),
          a.name === placed,
        ),
      ),
    ),
    asEl(svg),
    h(
      "div",
      { cls: "verdict", attrs: { "aria-live": "polite" } },
      h("p", {}, h("strong", {}, `The data predicts ${PUPIL_NAME[t.predicted]}. `), why, " ", ui.cite(["Banks2015"])),
      ...(animal ? [h("p", {}, ...ui.rich(animal.note))] : []),
    ),
    h("p", { cls: "muted small" }, `A model of the paper's data: two hunting styles, and height split at ${SHOULDER_CM} cm as the paper splits it. Active hunters that chase their prey are left out: the paper gives no counts for them in its text.`),
  );
}

// ---- The lesson ----

export const lesson4: Lesson = {
  title: TITLE,
  steps: STEPS,
  sources: lessonSources(),
  view(i, u) {
    ui = u;
    switch (STEPS[i]!.view) {
      case "pitch":
        return [pitchScale(i)];
      case "cochlea":
        return [cochleas()];
      case "check":
        return [checkPanel(), cochleas()];
      case "scent":
        return [h("figure", { cls: "coat-figure" }, asEl(tigerView({ key: "junu", seed: JUNU, title: "Junu, side view" })), h("figcaption", {}, "Junu at a year old. A drawing: her pattern is made up, but it is hers in every lesson."))];
      case "pupils":
        return [pupils()];
      case "pupil-model":
        return [modelPanel()];
    }
  },
  hold: (i) => (STEPS[i]!.view === "check" && !revealed ? "Show the answer to go on." : null),
};
