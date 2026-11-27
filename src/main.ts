import "./style.css";
import { parse } from "./cite.ts";
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
import { SOURCES } from "./sources.ts";
import { back, isFirst, isLast, label, next, start, type StepState } from "./steps.ts";
import { find, isLeaf, judge, leaves, type TreeNode, type Verdict } from "./tree.ts";

// ---- State: the page is redrawn from this on every change. ----

let step: StepState = start(STEPS.length);
const open = new Set<string>(STEPS[0]!.open);
const prediction: Partial<Record<Checked, Place>> = {};
let revealed = false;
let chosen = new Set<string>();
let trait: string | null = null;

// ---- DOM helpers ----

const el = (id: string): HTMLElement => {
  const found = document.getElementById(id);
  if (!found) throw new Error(`missing #${id}`);
  return found;
};

type Props<K extends keyof HTMLElementTagNameMap> = Partial<Omit<HTMLElementTagNameMap[K], "children">> & {
  key?: string;
  cls?: string;
  attrs?: Record<string, string>;
};

/** Makes an element; `key` marks it so keyboard focus survives a redraw. */
function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Props<K> = {},
  ...kids: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const { key, cls, attrs, ...rest } = props;
  const e = Object.assign(document.createElement(tag), rest);
  if (key) e.dataset.key = key;
  if (cls) e.className = cls;
  for (const [k, v] of Object.entries(attrs ?? {})) e.setAttribute(k, v);
  e.append(...kids);
  return e;
}

const ORDER = lessonSources();

function citeLink(keys: readonly string[]): HTMLElement {
  const sup = h("sup", { cls: "cite" });
  const sorted = [...keys].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  sorted.forEach((k, i) => {
    if (i) sup.append(",");
    sup.append(h("a", { href: `#src-${k}`, title: SOURCES[k]?.cite ?? k }, String(ORDER.indexOf(k) + 1)));
  });
  return sup;
}

/** Text with `**term**`, `*italic*` and `[@Key]` citations, as nodes. */
function rich(text: string): Node[] {
  const out: Node[] = [];
  for (const seg of parse(text)) {
    if ("cites" in seg) {
      out.push(citeLink(seg.cites));
      continue;
    }
    for (const part of seg.text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)) {
      if (part.startsWith("**")) out.push(h("strong", { cls: "term" }, part.slice(2, -2)));
      else if (part.startsWith("*") && part.length > 1) out.push(h("em", {}, part.slice(1, -1)));
      else if (part) out.push(document.createTextNode(part));
    }
  }
  return out;
}

const nameOf = (id: string): string => find(TREE, id)?.label ?? id;

const list = (names: string[]): string =>
  names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;

const mode = () => STEPS[step.index]!.mode;

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
  const cites = n.cites ? [citeLink(n.cites)] : [];
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
  render();
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
          render();
        },
      });
      fs.append(h("label", {}, input, " ", p.label));
    }
    const placed = prediction[cat];
    if (revealed && placed) {
      const f = grade(cat, placed);
      fs.append(
        h("p", { cls: f.correct ? "feedback right" : "feedback wrong" }, h("strong", {}, f.correct ? "✓ Right. " : "✗ Not quite. "), ...rich(f.text)),
      );
    }
    box.append(fs);
  }
  if (revealed) box.append(h("p", { cls: "coda" }, ...rich(CHECK_CODA)));
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
            render();
            nextBtn.focus();
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

function pressed<T extends HTMLElement>(b: T, on: boolean): T {
  b.setAttribute("aria-pressed", String(on));
  return b;
}

function sandboxPanel(v: Verdict): HTMLElement {
  const pick = (label: string | null, cats: Iterable<string>) => {
    trait = label;
    chosen = new Set(cats);
    render();
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
    return h("tr", { cls: on ? "on" : "" }, h("td", {}, b), h("td", {}, c.weight), h("td", {}, c.coat), h("td", {}, c.where, citeLink([c.cite])));
  });
  const table = h(
    "table",
    { cls: "cats" },
    h("thead", {}, h("tr", {}, h("th", {}, "Cat (press to add)"), h("th", {}, "Weight"), h("th", {}, "Coat"), h("th", {}, "Lives in"))),
    h("tbody", {}, ...rows),
  );
  return h("div", { cls: "panel" }, traits, table, h("p", { cls: "verdict", attrs: { "aria-live": "polite" } }, ...verdictText(v)));
}

// ---- Page ----

const labelEl = el("step-label");
const textEl = el("step-text");
const viewEl = el("view");
const hintEl = el("nav-hint");
const backBtn = el("back") as HTMLButtonElement;
const nextBtn = el("next") as HTMLButtonElement;
backBtn.dataset.key = "back";
nextBtn.dataset.key = "next";

function render(): void {
  const focusKey = (document.activeElement as HTMLElement | null)?.dataset?.key;
  const s = STEPS[step.index]!;

  labelEl.textContent = label(step);
  textEl.replaceChildren(...s.text.map((p) => h("p", {}, ...rich(p))));

  const verdict = s.mode === "sandbox" ? judge(find(TREE, SANDBOX_ROOT)!, chosen) : null;
  const tree = h("ul", { cls: "tree", attrs: { "aria-label": "Family tree of the cats" } }, nodeEl(TREE, verdict));
  const panel = s.mode === "check" ? [checkPanel()] : verdict ? [sandboxPanel(verdict)] : [];
  viewEl.replaceChildren(...panel, tree);

  const gated = s.mode === "check" && !revealed;
  backBtn.disabled = isFirst(step);
  nextBtn.disabled = isLast(step) || gated;
  hintEl.textContent = gated ? "Answer the check to go on." : "";

  // Redrawing replaces the focused element; put focus back on its replacement.
  const again = focusKey ? document.querySelector<HTMLElement>(`[data-key="${CSS.escape(focusKey)}"]`) : null;
  if (again && !(again as HTMLButtonElement).disabled) again.focus();
  else if (focusKey === "next") backBtn.focus();
  else if (focusKey === "back") nextBtn.focus();
}

function go(to: StepState): void {
  step = to;
  for (const id of STEPS[step.index]!.open) open.add(id);
  render();
}

backBtn.addEventListener("click", () => go(back(step)));
nextBtn.addEventListener("click", () => go(next(step)));

el("lesson-title").textContent = TITLE;
el("sources").replaceChildren(
  ...ORDER.map((k) => {
    const s = SOURCES[k]!;
    return h("li", { id: `src-${k}` }, `${s.cite} `, h("a", { href: s.url, attrs: { rel: "noreferrer" } }, s.url));
  }),
);
render();
