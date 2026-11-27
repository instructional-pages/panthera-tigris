// The lesson page, the same for every lesson: title, text steps with Back and Next, the live
// view, and the source list. A lesson supplies its content and draws its own view.

import { citer, h, richText } from "./dom.ts";
import { SOURCES } from "./sources.ts";
import { back, isFirst, isLast, label, next, start, type StepState } from "./steps.ts";

/** What the shell gives a lesson's view to draw with. */
export interface Ui {
  /** Text with `**term**`, `*italic*` and `[@Key]` citations, as nodes. */
  rich(text: string): Node[];
  /** Numbered links to the source list for these keys. */
  cite(keys: readonly string[]): HTMLElement;
  /** Redraws the page from the lesson's state; call after every change. */
  render(): void;
  /** Moves keyboard focus to Next (e.g. once a check is answered). */
  focusNext(): void;
}

export interface Lesson {
  readonly title: string;
  /** Each step's paragraphs, in the rich-text format above. */
  readonly steps: readonly { readonly text: readonly string[] }[];
  /** Every source key the lesson cites, in the order they are numbered. */
  readonly sources: readonly string[];
  /** Called when the learner arrives on step `index` (also the first step, at mount). */
  enter?(index: number): void;
  /** The live view for step `index`. */
  view(index: number, ui: Ui): Node[];
  /** Why Next is held on step `index` (shown as a hint), or null when it isn't. */
  hold?(index: number): string | null;
}

const el = (id: string): HTMLElement => {
  const found = document.getElementById(id);
  if (!found) throw new Error(`missing #${id}`);
  return found;
};

/** Draws `lesson` into the page's skeleton (index.html) and wires Back and Next. */
export function mount(lesson: Lesson): void {
  const labelEl = el("step-label");
  const textEl = el("step-text");
  const viewEl = el("view");
  const hintEl = el("nav-hint");
  const backBtn = el("back") as HTMLButtonElement;
  const nextBtn = el("next") as HTMLButtonElement;
  backBtn.dataset.key = "back";
  nextBtn.dataset.key = "next";

  let step: StepState = start(lesson.steps.length);
  const cite = citer(lesson.sources);
  const ui: Ui = {
    rich: (text) => richText(text, cite),
    cite,
    render,
    focusNext: () => nextBtn.focus(),
  };

  function render(): void {
    const focusKey = (document.activeElement as HTMLElement | null)?.dataset?.key;

    labelEl.textContent = label(step);
    textEl.replaceChildren(...lesson.steps[step.index]!.text.map((p) => h("p", {}, ...ui.rich(p))));
    viewEl.replaceChildren(...lesson.view(step.index, ui));

    const held = lesson.hold?.(step.index) ?? null;
    backBtn.disabled = isFirst(step);
    nextBtn.disabled = isLast(step) || held !== null;
    hintEl.textContent = held ?? "";

    // Redrawing replaces the focused element; put focus back on its replacement.
    const again = focusKey ? document.querySelector<HTMLElement>(`[data-key="${CSS.escape(focusKey)}"]`) : null;
    if (again && !(again as HTMLButtonElement).disabled) again.focus();
    else if (focusKey === "next") backBtn.focus();
    else if (focusKey === "back") nextBtn.focus();
  }

  function go(to: StepState): void {
    step = to;
    lesson.enter?.(step.index);
    render();
  }

  backBtn.addEventListener("click", () => go(back(step)));
  nextBtn.addEventListener("click", () => go(next(step)));

  el("lesson-title").textContent = lesson.title;
  el("sources").replaceChildren(
    ...lesson.sources.map((k) => {
      const s = SOURCES[k]!;
      return h("li", { id: `src-${k}` }, `${s.cite} `, h("a", { href: s.url, attrs: { rel: "noreferrer" } }, s.url));
    }),
  );
  go(step);
}
