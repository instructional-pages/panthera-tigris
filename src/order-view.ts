// The ordering task, drawn: the learner moves items up and down with buttons (so it works from
// the keyboard), locks the order in, and only then sees each item's right place. Logic in order.ts.

import { h } from "./dom.ts";
import { checkStart, inOrder, move, rightPlaces } from "./order.ts";
import type { Ui } from "./shell.ts";

export interface OrderTask {
  /** Unique on the page; keeps keyboard focus across redraws. */
  readonly key: string;
  /** The question, in rich text. */
  readonly question: string;
  /** The items in their right order, in rich text. */
  readonly items: readonly string[];
  /** The order they are shown in first, as indices into `items`; nothing in its right place. */
  readonly start: readonly number[];
  /** Shown after the reveal: why this is the order, in rich text with citations. */
  readonly explain: string;
}

export interface OrderState {
  order: number[];
  locked: boolean;
}

export function freshOrder(t: OrderTask): OrderState {
  checkStart(t.start, t.items.length);
  return { order: [...t.start], locked: false };
}

const plain = (ui: Ui, text: string): string => ui.rich(text).map((n) => n.textContent).join("");

/** The list with Up and Down buttons and a Lock in button; after locking, each item's verdict. */
export function orderView(t: OrderTask, s: OrderState, ui: Ui): HTMLElement {
  const right = rightPlaces(s.order);
  const list = h("ol", { cls: "order-list" });
  s.order.forEach((item, place) => {
    const row = h("li", { cls: "order-item" }, h("span", { cls: "order-text" }, ...ui.rich(t.items[item]!)));
    const name = plain(ui, t.items[item]!);
    if (!s.locked) {
      const button = (by: -1 | 1, word: string, glyph: string): HTMLButtonElement =>
        h(
          "button",
          {
            type: "button",
            cls: "order-move",
            key: `${t.key}-${word}-${item}`,
            disabled: place + by < 0 || place + by >= s.order.length,
            attrs: { "aria-label": `Move “${name}” ${word}` },
            onclick: () => {
              s.order = move(s.order, place, by);
              ui.render();
            },
          },
          glyph,
        );
      row.append(h("span", { cls: "order-buttons" }, button(-1, "up", "↑"), button(1, "down", "↓")));
    } else {
      row.classList.add(right[place] ? "right" : "wrong");
      row.append(h("span", { cls: "order-verdict" }, right[place] ? "✓ right place" : `✗ belongs ${ordinal(item + 1)}`));
    }
    list.append(row);
  });

  const box = h("div", { cls: "panel order" }, h("p", { cls: "order-question" }, ...ui.rich(t.question)), list);
  if (!s.locked) {
    box.append(
      h(
        "button",
        {
          type: "button",
          key: `${t.key}-lock`,
          onclick: () => {
            s.locked = true;
            ui.render();
            ui.focusNext();
          },
        },
        "Lock in my order",
      ),
    );
    return box;
  }

  const all = inOrder(s.order);
  box.append(
    h(
      "p",
      { cls: all ? "feedback right" : "feedback wrong", attrs: { "aria-live": "polite" } },
      h("strong", {}, all ? "✓ All in order. " : "✗ Not quite. "),
      all ? "" : `The order is: ${t.items.map((it) => plain(ui, it)).join(", then ")}. `,
      ...ui.rich(t.explain),
    ),
  );
  return box;
}

/** 1 → "first", up to "tenth"; plain numbers beyond. */
export function ordinal(n: number): string {
  const words = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
  return words[n - 1] ?? `${n}th`;
}
