// A photo with its caption and credit under it (what it shows, who made it, the licence, and
// the file page where the licence was read). The image is bundled: `url` is the lesson's own
// import of the file, so it downloads only with that lesson.

import { h } from "./dom.ts";
import { LICENCES, type Photo } from "./photos.ts";

/** "Supradai, CC BY 4.0 (linked), resized; source (linked)." */
export function creditNodes(p: Photo): (Node | string)[] {
  return [
    `${p.author}, `,
    h("a", { href: LICENCES[p.licence], attrs: { rel: "noreferrer" } }, p.licence),
    `, ${p.changes}; `,
    h("a", { href: p.source, attrs: { rel: "noreferrer" } }, "source"),
    ".",
  ];
}

export function photoFigure(p: Photo, url: string, width: number, height: number): HTMLElement {
  return h(
    "figure",
    { cls: height > width ? "photo-figure portrait" : "photo-figure" },
    h("img", { src: url, alt: p.alt, width, height, attrs: { decoding: "async" } }),
    h("figcaption", {}, p.caption, " ", h("span", { cls: "photo-credit" }, "Picture: ", ...creditNodes(p))),
  );
}
