// Lesson 13's live view: the map of Asia with the stories placed where they come from, the
// match-the-story check, the two books, the Kerinci Seblat survey, and the culture-map sandbox,
// drawn from lesson13.ts.

import { h, pressed } from "./dom.ts";
import {
  CHECK_EXPLAIN,
  CHECK_PLACES,
  CHECK_QUESTION,
  CHITWAN,
  CROP,
  judgeMatch,
  lessonSources,
  PLACES,
  type Place,
  placeById,
  placesOf,
  QUOTES,
  STEPS,
  STORIES,
  TITLE,
  type View,
  WANT,
} from "./lesson13.ts";
import { type Mark, mapView } from "./map-view.ts";
import { photoFigure } from "./photo-view.ts";
import { PHOTOS } from "./photos.ts";
import blakeUrl from "./photos/blake-tyger.avif";
import type { Lesson, Ui } from "./shell.ts";

let ui: Ui;

const JUNU_MARK: Mark = { ...CHITWAN, label: "Junu, Chitwan" };
const markOf = (p: Place): Mark[] => (p.at ? [{ ...p.at, label: p.name.split(",")[0]! }] : []);

/** The map with `places` shaded bright and the smaller ones marked. */
function storyMap(key: string, places: readonly Place[], caption: string | readonly (string | Node)[], extra: readonly Mark[] = []): HTMLElement {
  const regions = new Set(places.map((p) => p.region));
  const names = places.map((p) => p.name).join("; ");
  return h(
    "figure",
    { cls: "tl-figure" },
    mapView({
      key,
      title: places.length ? `A map of Asia. Bright: where this step's stories come from: ${names}.` : "A map of Asia, with Chitwan in southern Nepal marked.",
      shade: (id) => (regions.has(id) ? "solid" : undefined),
      marks: [...extra, ...places.flatMap(markOf)],
      crop: CROP,
    }),
    h("p", { cls: "muted small" }, ...(typeof caption === "string" ? [caption] : caption)),
  );
}

function stepMap(view: View): HTMLElement {
  const places = placesOf(view);
  return storyMap(`l13-${view}`, places, `Bright: ${places.map((p) => p.name).join("; ")}. A dot marks a story from one part of a country; its place is approximate.`);
}

// ---- The check: match each story to its place ----

const matchState: { picks: (string | null)[]; locked: boolean } = { picks: STORIES.map(() => null), locked: false };
const SHORT: Readonly<Record<string, string>> = { china: "China", korea: "Korea", mysore: "Mysore", sundarbans: "Sundarbans", sumatra: "Sumatra", thailand: "Thailand" };

function checkView(): HTMLElement {
  const right = matchState.locked ? judgeMatch(matchState.picks) : undefined;
  const list = h("ol", { cls: "match-photos" });
  STORIES.forEach((story, i) => {
    const row = h("li", { cls: "match-photo" }, h("span", { cls: "sub-item" }, story.text));
    const pick = matchState.picks[i];
    if (!right) {
      const group = h("span", { cls: "match-buttons", attrs: { role: "group", "aria-label": `Where is story ${i + 1} from?` } });
      for (const id of CHECK_PLACES)
        group.append(
          pressed(
            h(
              "button",
              {
                type: "button",
                key: `match-${i}-${id}`,
                onclick: () => {
                  matchState.picks[i] = id;
                  ui.render();
                },
              },
              SHORT[id]!,
            ),
            pick === id,
          ),
        );
      row.append(group);
    } else {
      const answer = placeById(story.answer).name;
      row.classList.add(right[i] ? "right" : "wrong");
      row.append(h("span", { cls: "match-verdict" }, right[i] ? `✓ ${answer}` : `✗ it's ${answer} (you said ${pick ? SHORT[pick] : "nothing"})`));
    }
    list.append(row);
  });
  const box = h("div", { cls: "panel match" }, h("p", { cls: "match-question" }, CHECK_QUESTION), list);
  if (!right) {
    box.append(
      h(
        "button",
        {
          type: "button",
          key: "match-lock",
          disabled: matchState.picks.some((x) => x === null),
          onclick: () => {
            matchState.locked = true;
            ui.render();
            ui.focusNext();
          },
        },
        "Lock in my answer",
      ),
    );
    return box;
  }
  const all = right.every(Boolean);
  box.append(h("p", { cls: all ? "feedback right" : "feedback wrong", attrs: { "aria-live": "polite" } }, h("strong", {}, all ? "✓ All placed right. " : "✗ Not quite. "), ...ui.rich(CHECK_EXPLAIN)));
  return box;
}

// ---- The books ----

function books(): HTMLElement {
  return h(
    "figure",
    { cls: "tl-figure" },
    ...QUOTES.map((q) =>
      h(
        "div",
        { cls: "formula-box quote-box" },
        h("strong", {}, q.work),
        h("blockquote", { cls: "quote" }, ...q.lines.flatMap((l, i) => (i ? [h("br"), l] : [l]))),
        h("span", { cls: "muted small" }, q.note, " ", ui.cite([q.key])),
      ),
    ),
    h("figcaption", {}, "Quoted from the editions read."),
  );
}

// ---- The survey: how many tigers villagers wanted ----

function wantBars(): HTMLElement {
  const list = h("ul", { cls: "share-rows", attrs: { "aria-label": "How many tigers 2,386 villagers around Kerinci Seblat wanted" } });
  for (const r of WANT) {
    const bar = h("span", { cls: r.bright ? "share-bar bright" : "share-bar", attrs: { "aria-hidden": "true" } });
    bar.style.width = `${r.value}%`;
    list.append(h("li", {}, h("span", { cls: "share-label" }, r.label), h("span", { cls: "share-track" }, bar), h("span", { cls: "share-value" }, r.note)));
  }
  return h(
    "figure",
    { cls: "tl-figure" },
    list,
    h("figcaption", {}, "How many tigers 2,386 villagers around Kerinci Seblat, Sumatra, wanted. The rest (5%) gave none of these answers. Source: ", ui.cite(["Struebig2018"])),
  );
}

// ---- The sandbox: the culture map ----

const sand = { place: "sumatra" };

function sandbox(): HTMLElement {
  const p = placeById(sand.place);
  const buttons = h(
    "div",
    { cls: "choice-row", attrs: { role: "group", "aria-label": "Pick a place" } },
    h("span", { cls: "muted small choice-label" }, "Place: "),
    ...PLACES.map((x) =>
      pressed(
        h(
          "button",
          {
            type: "button",
            key: `place-${x.id}`,
            onclick: () => {
              sand.place = x.id;
              ui.render();
            },
          },
          x.name,
        ),
        x.id === sand.place,
      ),
    ),
  );
  const row = (title: string, text: string) => h("div", { cls: "formula-box" }, h("strong", {}, title), h("span", { cls: "small" }, ...ui.rich(text)));
  return h(
    "div",
    { cls: "panel" },
    buttons,
    h(
      "div",
      { attrs: { "aria-live": "polite" } },
      h("div", { cls: "culture-rows" }, row("How people see the tiger", p.sees), row("What they do", p.does), row("What the studies found about tolerance", p.tolerance)),
      storyMap("l13-sand", [p], `Bright: ${p.name}.${p.at ? " The dot's place is approximate." : ""}`),
    ),
  );
}

// ---- The lesson ----

export const lesson13: Lesson = {
  title: TITLE,
  steps: STEPS,
  sources: lessonSources(),
  photos: [PHOTOS.blake],
  view(i, u) {
    ui = u;
    const view = STEPS[i]!.view;
    switch (view) {
      case "junu":
        return [storyMap("l13-junu", [], "Chitwan, in southern Nepal, where Junu lives. The stories in this lesson come from all over this map.", [JUNU_MARK])];
      case "check":
        return [checkView()];
      case "books":
        return [books(), photoFigure(PHOTOS.blake, blakeUrl, 560, 624)];
      case "project":
        return [storyMap("l13-project", [placeById("india")], ["Bright: India, where Project Tiger began in 1973. Source: ", ui.cite(["NTCAProjectTiger"])])];
      case "tolerance":
        return [wantBars()];
      case "sandbox":
        return [sandbox()];
      default:
        return [stepMap(view)];
    }
  },
  hold(i) {
    return STEPS[i]!.view === "check" && !matchState.locked ? "Lock in your answer to go on." : null;
  },
};
