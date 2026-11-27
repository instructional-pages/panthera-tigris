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
  /** Largest value on the left, to match a figure beside it (a time line with the oldest on the left). */
  readonly reverse?: boolean;
  /** A span as the learner reads it, e.g. "15–19 tigers"; "<lo> to <hi>" in `format` when not given. */
  readonly formatRange?: (lo: number, hi: number) => string;
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

/** The answer as a hatched band from `a` to `b` (either way round), when the sources give a span. */
function span(a: number, b: number): HTMLElement {
  const [lo, hi] = a < b ? [a, b] : [b, a];
  return h("div", { cls: "mark answer-span", attrs: { style: `left: ${pct(lo)}; width: ${pct(hi - lo)}` } }, h("span", {}, "Answer"));
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
  // A reversed slider is a range input drawn right to left: its value, keys and stops are unchanged.
  if (e.reverse) input.style.direction = "rtl";
  const along = (p: number): number => (e.reverse ? 1 - p : p);
  const endLabels = [h("span", {}, e.format(e.min)), h("span", {}, e.format(e.max))];
  const ends = h("div", { cls: "estimate-ends", attrs: { "aria-hidden": "true" } }, ...(e.reverse ? endLabels.reverse() : endLabels));
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
  const said = e.range ? (e.formatRange?.(e.range[0], e.range[1]) ?? `${e.format(e.range[0])} to ${e.format(e.range[1])}`) : e.format(e.answer);
  const answerMark = e.range ? span(along(position(e, e.range[0])), along(position(e, e.range[1]))) : marker("answer", along(position(e, e.answer)), "Answer");
  const head = v.kind === "close" ? "✓ Close. " : `✗ ${v.kind === "low" ? (e.words?.low ?? "Too low") : (e.words?.high ?? "Too high")}. `;
  box.append(
    h(
      "div",
      { cls: "estimate-track", attrs: { role: "img", "aria-label": `Your estimate, ${e.format(guess)}, beside the answer, ${said}` } },
      marker("guess", along(position(e, guess)), "You"),
      answerMark,
    ),
    h(
      "p",
      { cls: v.kind === "close" ? "feedback right" : "feedback wrong", attrs: { "aria-live": "polite" } },
      h("strong", {}, head),
      `You said ${e.format(guess)}; the answer is ${e.bound === "atMost" ? "at most " : ""}${said}. `,
      ...ui.rich(e.explain),
    ),
  );
  return box;
}
