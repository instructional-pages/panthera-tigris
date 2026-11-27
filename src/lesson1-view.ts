// Lesson 1's live view: the family tree, the check and the sandbox, drawn from lesson1.ts.

import { h, pressed } from "./dom.ts";
import {
  CATS,
  CHECK_CODA,
  CHECKED,
  type Checked,
  grade,
  lessonSources,
  OTHER_CATS,
  PANTHERA,
  type Place,
  PLACES,
  SANDBOX_ROOT,
  STEPS,
  TITLE,
  TRAITS,
  TREE,
} from "./lesson1.ts";
import type { Lesson, Ui } from "./shell.ts";
import { find, isLeaf, judge, leaves, type TreeNode, type Verdict } from "./tree.ts";
import { photoFigure } from "./photo-view.ts";
import { PHOTOS } from "./photos.ts";
import chitwanUrl from "./photos/chitwan-tiger.avif";

// ---- State: the view is redrawn from this on every change. ----

const open = new Set<string>();
const prediction: Partial<Record<Checked, Place>> = {};
let revealed = false;
let chosen = new Set<string>();
let trait: string | null = null;

const nameOf = (id: string): string => find(TREE, id)?.label ?? id;

const list = (names: string[]): string =>
  names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;

let index = 0;
let ui: Ui;
const mode = () => STEPS[index]!.mode;

// ---- The tree ----

const PLACEHOLDER: TreeNode = { id: "placeholder", label: "Tiger and snow leopard: where do they go?" };

/** The children shown for a node: Panthera's forks stay hidden until the check is answered. */
function shownChildren(n: TreeNode): readonly TreeNode[] {
  if (n.id !== PANTHERA || revealed) return n.children ?? [];
  if (mode() === "check") return [find(n, "lion-leopard-jaguar")!, PLACEHOLDER];
  return leaves(n).map((id) => find(n, id)!);
}

function nodeEl(n: TreeNode, verdict: Verdict | null): HTMLLIElement {
  const li = h("li");
  if (n === PLACEHOLDER || n.id === OTHER_CATS) {
    li.append(h("span", { cls: "muted" }, n.label));
    return li;
  }
  const latin = n.latin ? [" ", h("em", { cls: "latin" }, n.latin)] : [];
  const cites = n.cites ? [ui.cite(n.cites)] : [];
  if (isLeaf(n)) {
    const selected = mode() === "sandbox" && chosen.has(n.id);
    const junu = n.id === "tiger" ? [h("span", { cls: "muted" }, " (Junu's species)")] : [];
    li.append(h("span", { cls: selected ? "leaf selected" : "leaf" }, selected ? "● " : "", n.label, ...latin, ...junu, ...cites));
    return li;
  }
  const isOpen = open.has(n.id);
  const marked = verdict && verdict.kind !== "too-few" && verdict.branch.id === n.id;
  const btn = h(
    "button",
    { type: "button", cls: marked ? "branch marked" : "branch", key: `node-${n.id}`, onclick: () => toggle(n.id) },
    h("span", { cls: "chev", attrs: { "aria-hidden": "true" } }, isOpen ? "▾ " : "▸ "),
    n.label,
    ...latin,
  );
  btn.setAttribute("aria-expanded", String(isOpen));
  li.append(btn, ...cites);
  if (marked)
    li.append(h("span", { cls: "tag" }, verdict!.kind === "branch" ? " ← the group is this branch" : " ← smallest branch holding them"));
  if (isOpen) li.append(h("ul", {}, ...shownChildren(n).map((c) => nodeEl(c, verdict))));
  return li;
}

function toggle(id: string): void {
  if (open.has(id)) open.delete(id);
  else open.add(id);
  ui.render();
}

// ---- The check: predict, then reveal ----

function checkPanel(): HTMLElement {
  const box = h("div", { cls: "panel" });
  for (const cat of CHECKED) {
    const fs = h("fieldset", {}, h("legend", {}, `Where does the ${nameOf(cat).toLowerCase()} go?`));
    for (const p of PLACES) {
      const input = h("input", {
        type: "radio",
        name: `place-${cat}`,
        value: p.value,
        checked: prediction[cat] === p.value,
        disabled: revealed,
        key: `radio-${cat}-${p.value}`,
        onchange: () => {
          prediction[cat] = p.value;
          ui.render();
        },
      });
      fs.append(h("label", {}, input, " ", p.label));
    }
    const placed = prediction[cat];
    if (revealed && placed) {
      const f = grade(cat, placed);
      fs.append(
        h("p", { cls: f.correct ? "feedback right" : "feedback wrong" }, h("strong", {}, f.correct ? "✓ Right. " : "✗ Not quite. "), ...ui.rich(f.text)),
      );
    }
    box.append(fs);
  }
  if (revealed) box.append(h("p", { cls: "coda" }, ...ui.rich(CHECK_CODA)));
  else
    box.append(
      h(
        "button",
        {
          type: "button",
          key: "reveal",
          disabled: !CHECKED.every((c) => prediction[c]),
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

// ---- The sandbox ----

function verdictText(v: Verdict): (Node | string)[] {
  switch (v.kind) {
    case "too-few":
      return ["Choose two or more cats, or a trait."];
    case "branch":
      return [
        h("strong", {}, "One whole branch. "),
        `They are everything on the branch “${v.branch.label}”: they share an ancestor that no other cat here shares.`,
      ];
    case "unresolved":
      return [
        h("strong", {}, "The tree can't say. "),
        `They sit on the branch “${v.branch.label}”, but the sources here don't settle how that branch splits.`,
      ];
    case "not-a-branch":
      return [
        h("strong", {}, "Not a branch. "),
        `The smallest branch holding them, “${v.branch.label}”, also holds the ${list(v.missing.map((id) => nameOf(id).toLowerCase()))}. ` +
          `Sharing ${trait ? "this trait" : "what you chose them for"} doesn't make them each other's closest relatives.`,
      ];
  }
}

function sandboxPanel(v: Verdict): HTMLElement {
  const pick = (label: string | null, cats: Iterable<string>) => {
    trait = label;
    chosen = new Set(cats);
    ui.render();
  };
  const traits = h(
    "div",
    { cls: "traits", attrs: { role: "group", "aria-label": "Group the cats by a trait" } },
    ...TRAITS.map((t) => pressed(h("button", { type: "button", key: `trait-${t.label}`, onclick: () => pick(t.label, t.cats) }, t.label), trait === t.label)),
    h("button", { type: "button", key: "clear", onclick: () => pick(null, []) }, "Clear"),
  );

  const rows = CATS.map((c) => {
    const on = chosen.has(c.id);
    const toggleCat = () => pick(null, on ? [...chosen].filter((id) => id !== c.id) : [...chosen, c.id]);
    const b = pressed(h("button", { type: "button", cls: "cat", key: `cat-${c.id}`, onclick: toggleCat }, on ? "● " : "○ ", nameOf(c.id)), on);
    return h("tr", { cls: on ? "on" : "" }, h("td", {}, b), h("td", {}, c.weight), h("td", {}, c.coat), h("td", {}, c.where, ui.cite([c.cite])));
  });
  const table = h(
    "table",
    { cls: "cats" },
    h("thead", {}, h("tr", {}, h("th", {}, "Cat (press to add)"), h("th", {}, "Weight"), h("th", {}, "Coat"), h("th", {}, "Lives in"))),
    h("tbody", {}, ...rows),
  );
  return h("div", { cls: "panel" }, traits, table, h("p", { cls: "verdict", attrs: { "aria-live": "polite" } }, ...verdictText(v)));
}

// ---- The lesson ----

export const lesson1: Lesson = {
  title: TITLE,
  steps: STEPS,
  sources: lessonSources(),
  photos: [PHOTOS.chitwan],
  enter(i) {
    index = i;
    for (const id of STEPS[i]!.open) open.add(id);
  },
  view(i, u) {
    index = i;
    ui = u;
    const verdict = mode() === "sandbox" ? judge(find(TREE, SANDBOX_ROOT)!, chosen) : null;
    const tree = h("ul", { cls: "tree", attrs: { "aria-label": "Family tree of the cats" } }, nodeEl(TREE, verdict));
    const panel = mode() === "check" ? [checkPanel()] : verdict ? [sandboxPanel(verdict)] : [];
    const photo = i === 0 ? [photoFigure(PHOTOS.chitwan, chitwanUrl, 720, 505)] : [];
    return [...photo, ...panel, tree];
  },
  hold: (i) => (STEPS[i]!.mode === "check" && !revealed ? "Answer the check to go on." : null),
};
