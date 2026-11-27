// The stripe renderer, drawn: a tiger's side view in SVG with its seeded stripe pattern, a
// camera-trap "photo" (part of one flank, cropped), and a matching task where the learner says
// which tiger each photo shows, locks the matches in, then sees which were right. Logic in
// stripes.ts. The silhouette is a self-made drawing.

import { h, pressed } from "./dom.ts";
import { type Coat, type Flank, type Photo, checkMatchTask, judgeMatch, pattern, shapes } from "./stripes.ts";
import type { Ui } from "./shell.ts";

const SVG = "http://www.w3.org/2000/svg";
const W = 240;
const H = 114;
/** Where the stripes go: from the rump to the shoulder, from above the back line to the belly. */
const FLANK: Flank = { left: 58, right: 178, top: 26, depth: 58 };

/** The tiger seen from its left side, facing right: body, head and legs as one outline. */
const BODY =
  "M54 44C78 30 150 30 176 38C186 28 198 22 210 24L214 16L220 23C230 28 237 38 234 48" +
  "C232 56 220 62 206 60C196 64 188 70 184 76L186 110L172 110L166 84C140 88 104 88 80 84" +
  "L78 110L64 110L58 82C50 74 48 58 54 44Z";
const TAIL = "M54 50C36 56 22 70 14 90";
/** The full drawing's box, as viewBox numbers. */
const BOX = [6, 12, W - 6, H - 12] as const;

/**
 * Where the tiger sits in a full (uncropped) drawing, measured from the box's top-left: the
 * tail tip (with its round end), the nose, and the ground under the paws. For drawing to scale.
 */
export const DRAWING = { width: BOX[2], height: BOX[3], tail: 11.5 - BOX[0], nose: 235.5 - BOX[0], ground: 110 - BOX[1] } as const;
/** The pale belly. */
const BELLY = "M80 78C104 88 144 88 164 78L164 92L80 92Z";

function s<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}, ...kids: (Node | string)[]): SVGElementTagNameMap[K] {
  const e = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  e.append(...kids);
  return e;
}

/** What one drawing of a tiger shows. */
export interface TigerOptions {
  /** Unique on the page: names the clip path. */
  readonly key: string;
  readonly seed: number;
  readonly coat?: Coat;
  /** How many stripes; the renderer's default when left out. */
  readonly count?: number;
  /** Spoken name of the drawing. */
  readonly title: string;
  /** Show only this part of the flank (0 to 1, rump to shoulder), as a camera-trap photo would. */
  readonly crop?: readonly [number, number];
}

/** A tiger with its own stripe pattern, as an SVG; cropped to part of the flank for a photo. */
export function tigerView(o: TigerOptions): SVGSVGElement {
  const coat = o.coat ?? "orange";
  const sh = shapes(pattern(o.seed, coat, o.count), FLANK);
  const clip = `tiger-${o.key}`;
  const span = FLANK.right - FLANK.left;
  const box = o.crop ? [FLANK.left + o.crop[0] * span, FLANK.top + 4, (o.crop[1] - o.crop[0]) * span, FLANK.depth] : BOX;
  const svg = s("svg", { viewBox: box.join(" "), class: `tiger coat-${coat}${o.crop ? " photo" : ""}`, role: "img", "aria-label": o.title });
  svg.append(s("defs", {}, s("clipPath", { id: clip }, s("path", { d: BODY }))));
  svg.append(s("path", { d: TAIL, class: "tiger-tail" }), s("path", { d: BODY, class: "tiger-coat" }));
  const marks = s("g", { "clip-path": `url(#${clip})` }, s("path", { d: BELLY, class: "tiger-belly" }));
  for (const d of sh.paths) marks.append(s("path", { d, class: "tiger-stripe" }));
  for (const [cx, cy, rx, ry] of sh.spots) marks.append(s("ellipse", { cx, cy, rx, ry, class: "tiger-stripe" }));
  svg.append(marks, s("path", { d: BODY, class: "tiger-outline" }));
  // The eye, and the white spot on the back of the ear [@SINZ; @ADW].
  if (!o.crop) svg.append(s("circle", { cx: 222, cy: 38, r: 1.6, class: "tiger-eye" }), s("circle", { cx: 215.5, cy: 21.5, r: 1.4, class: "tiger-belly" }));
  return svg;
}

/** A "which tiger is in this photo?" check. */
export interface MatchTask {
  /** Unique on the page. */
  readonly key: string;
  /** The question, in rich text. */
  readonly question: string;
  /** The known tigers: a name and the seed of each one's pattern. */
  readonly tigers: readonly { readonly name: string; readonly seed: number }[];
  /** The photos to match, each showing part of one tiger's flank. */
  readonly photos: readonly Photo[];
  readonly coat?: Coat;
  readonly count?: number;
  /** Shown after the reveal: why, in rich text with citations. */
  readonly explain: string;
}

export interface MatchState {
  picks: (number | null)[];
  locked: boolean;
}

export function freshMatch(t: MatchTask): MatchState {
  checkMatchTask(
    t.tigers.map((g) => g.seed),
    t.photos,
  );
  return { picks: t.photos.map(() => null), locked: false };
}

/** The known tigers, then each photo with a button per tiger; after locking, each photo's verdict. */
export function matchView(t: MatchTask, st: MatchState, ui: Ui): HTMLElement {
  const right = st.locked ? judgeMatch(t.photos, st.picks) : undefined;
  const known = h(
    "ul",
    { cls: "match-known" },
    ...t.tigers.map((g, i) =>
      h("li", {}, tigerView({ key: `${t.key}-t${i}`, seed: g.seed, coat: t.coat, count: t.count, title: `${g.name}, side view` }) as unknown as HTMLElement, h("span", { cls: "match-name" }, g.name)),
    ),
  );
  const photos = h("ol", { cls: "match-photos" });
  t.photos.forEach((ph, p) => {
    const title = `Camera-trap photo ${p + 1}: part of a tiger's flank`;
    const row = h("li", { cls: "match-photo" }, tigerView({ key: `${t.key}-p${p}`, seed: t.tigers[ph.tiger]!.seed, coat: t.coat, count: t.count, title, crop: [ph.from, ph.to] }) as unknown as HTMLElement);
    const pick = st.picks[p];
    if (!right) {
      const group = h("span", { cls: "match-buttons", attrs: { role: "group", "aria-label": `Who is in photo ${p + 1}?` } });
      t.tigers.forEach((g, i) =>
        group.append(
          pressed(
            h(
              "button",
              {
                type: "button",
                key: `${t.key}-p${p}-${i}`,
                onclick: () => {
                  st.picks[p] = i;
                  ui.render();
                },
              },
              g.name,
            ),
            pick === i,
          ),
        ),
      );
      row.append(group);
    } else {
      row.classList.add(right[p] ? "right" : "wrong");
      const said = pick === null || pick === undefined ? "no pick" : `you said ${t.tigers[pick]!.name}`;
      row.append(h("span", { cls: "match-verdict" }, right[p] ? `✓ ${t.tigers[ph.tiger]!.name}` : `✗ it's ${t.tigers[ph.tiger]!.name} (${said})`));
    }
    photos.append(row);
  });

  const box = h("div", { cls: "panel match" }, h("p", { cls: "match-question" }, ...ui.rich(t.question)), known, photos);
  if (!right) {
    box.append(
      h(
        "button",
        {
          type: "button",
          key: `${t.key}-lock`,
          disabled: st.picks.some((x) => x === null),
          onclick: () => {
            st.locked = true;
            ui.render();
            ui.focusNext();
          },
        },
        "Lock in my matches",
      ),
    );
    return box;
  }
  const all = right.every(Boolean);
  box.append(
    h(
      "p",
      { cls: all ? "feedback right" : "feedback wrong", attrs: { "aria-live": "polite" } },
      h("strong", {}, all ? "✓ All matched. " : "✗ Not quite. "),
      ...ui.rich(t.explain),
    ),
  );
  return box;
}
