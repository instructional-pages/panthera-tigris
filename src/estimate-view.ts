// The estimate slider, drawn: the learner sets a number, locks it in, and only then sees the
// answer on the same scale beside their guess. Logic in estimate.ts.

import { h } from "./dom.ts";
import { type EstimateSpec, judgeEstimate, position, stopOf, valueAt } from "./estimate.ts";
import type { Ui } from "./shell.ts";

export interface Estimate extends EstimateSpec {
  /** Unique on the page; keeps keyboard focus across redraws. */
  readonly key: string;
  /** The question, in rich text. */
  readonly question: string;
  /** A value as the learner reads it, e.g. "100,000 years ago". */
  readonly format: (value: number) => string;
  /** Shown after the reveal: why the answer is what it is, in rich text with citations. */
  readonly explain: string;
  /** Where the slider starts; the middle when not given. */
  readonly start?: number;
  /** Words for a guess below and above the answer, when "Too low" and "Too high" don't fit. */
  readonly words?: { readonly low: string; readonly high: string };
}

export interface EstimateState {
  stop: number;
  locked: boolean;
}

export const freshEstimate = (e: Estimate): EstimateState => ({
  stop: e.start === undefined ? Math.round(e.steps / 2) : stopOf(e, e.start),
  locked: false,
});

const pct = (p: number): string => `${(p * 100).toFixed(2)}%`;

function marker(cls: string, at: number, text: string): HTMLElement {
  return h("div", { cls: `mark ${cls}`, attrs: { style: `left: ${pct(at)}` } }, h("span", {}, text));
}

/** The slider, its Lock in button, and after locking, the answer beside the guess. */
export function estimateView(e: Estimate, s: EstimateState, ui: Ui): HTMLElement {
  const guess = valueAt(e, s.stop);
  const shown = h("output", { cls: "estimate-value" }, e.format(guess));
  const input = h("input", {
    type: "range",
    min: "0",
    max: String(e.steps),
    step: "1",
    value: String(s.stop),
    disabled: s.locked,
    key: `${e.key}-slider`,
    attrs: { "aria-valuetext": e.format(guess), "aria-label": "Your estimate" },
    // Update in place while dragging: a redraw would replace the slider under the pointer.
    oninput: () => {
      s.stop = Number(input.value);
      const v = e.format(valueAt(e, s.stop));
      shown.textContent = v;
      input.setAttribute("aria-valuetext", v);
    },
  });
  const ends = h("div", { cls: "estimate-ends", attrs: { "aria-hidden": "true" } }, h("span", {}, e.format(e.min)), h("span", {}, e.format(e.max)));
  const box = h("div", { cls: "panel estimate" }, h("p", { cls: "estimate-question" }, ...ui.rich(e.question)), shown, input, ends);

  if (!s.locked) {
    box.append(
      h(
        "button",
        {
          type: "button",
          key: `${e.key}-lock`,
          onclick: () => {
            s.locked = true;
            ui.render();
            ui.focusNext();
          },
        },
        "Lock in my estimate",
      ),
    );
    return box;
  }

  const v = judgeEstimate(e, guess);
  const head = v.kind === "close" ? "✓ Close. " : `✗ ${v.kind === "low" ? (e.words?.low ?? "Too low") : (e.words?.high ?? "Too high")}. `;
  box.append(
    h(
      "div",
      { cls: "estimate-track", attrs: { role: "img", "aria-label": `Your estimate, ${e.format(guess)}, beside the answer, ${e.format(e.answer)}` } },
      marker("guess", position(e, guess), "You"),
      marker("answer", position(e, e.answer), "Answer"),
    ),
    h(
      "p",
      { cls: v.kind === "close" ? "feedback right" : "feedback wrong", attrs: { "aria-live": "polite" } },
      h("strong", {}, head),
      `You said ${e.format(guess)}; the answer is ${e.format(e.answer)}. `,
      ...ui.rich(e.explain),
    ),
  );
  return box;
}
