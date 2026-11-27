// DOM helpers shared by the shell and every lesson's view.

import { parse } from "./cite.ts";
import { SOURCES } from "./sources.ts";

type Props<K extends keyof HTMLElementTagNameMap> = Partial<Omit<HTMLElementTagNameMap[K], "children">> & {
  key?: string;
  cls?: string;
  attrs?: Record<string, string>;
};

/** Makes an element; `key` marks it so keyboard focus survives a redraw. */
export function h<K extends keyof HTMLElementTagNameMap>(
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

/** Marks a toggle button as pressed or not, for screen readers. */
export function pressed<T extends HTMLElement>(b: T, on: boolean): T {
  b.setAttribute("aria-pressed", String(on));
  return b;
}

/** Numbered citation links, numbered by each key's place in `order` (the lesson's source list). */
export function citer(order: readonly string[]): (keys: readonly string[]) => HTMLElement {
  return (keys) => {
    const sup = h("sup", { cls: "cite" });
    const sorted = [...keys].sort((a, b) => order.indexOf(a) - order.indexOf(b));
    sorted.forEach((k, i) => {
      if (i) sup.append(",");
      sup.append(h("a", { href: `#src-${k}`, title: SOURCES[k]?.cite ?? k }, String(order.indexOf(k) + 1)));
    });
    return sup;
  };
}

/** Text with `**term**`, `*italic*` and `[@Key]` citations, as nodes. */
export function richText(text: string, cite: (keys: readonly string[]) => HTMLElement): Node[] {
  const out: Node[] = [];
  for (const seg of parse(text)) {
    if ("cites" in seg) {
      out.push(cite(seg.cites));
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
