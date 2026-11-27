import "./style.css";
import { back, isFirst, isLast, label, next, start, type StepState } from "./steps.ts";

// Placeholder steps until the lessons in docs/LESSONS.md are approved and built.
const STEPS = [
  "This course is being built. Its research comes first: every fact on these pages will trace to a cited source.",
  "Each lesson will be a few short steps like these, next to a live picture, advanced with Next.",
  "Each lesson ends with a sandbox and a hands-on check: you answer first, then see the answer explained.",
];

const el = (id: string): HTMLElement => {
  const found = document.getElementById(id);
  if (!found) throw new Error(`missing #${id}`);
  return found;
};

const labelEl = el("step-label");
const textEl = el("step-text");
const backBtn = el("back") as HTMLButtonElement;
const nextBtn = el("next") as HTMLButtonElement;

let state: StepState = start(STEPS.length);

function render(): void {
  labelEl.textContent = label(state);
  textEl.textContent = STEPS[state.index] ?? "";
  const focused = document.activeElement;
  backBtn.disabled = isFirst(state);
  nextBtn.disabled = isLast(state);
  // A disabled button drops keyboard focus; hand it to the other one.
  if (focused === nextBtn && nextBtn.disabled) backBtn.focus();
  if (focused === backBtn && backBtn.disabled) nextBtn.focus();
}

backBtn.addEventListener("click", () => {
  state = back(state);
  render();
});
nextBtn.addEventListener("click", () => {
  state = next(state);
  render();
});

render();
