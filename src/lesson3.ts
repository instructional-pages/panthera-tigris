// Lesson 3, "The body: size, coat, stripes": its content (steps, the size scene, the
// stripe-matching check and the genetics sandboxes' settings). Pure data and functions;
// lesson3-view.ts draws them. Facts are in docs/research/body.md.

import { citedKeys } from "./cite.ts";
import type { Copies } from "./genes.ts";
import { JUNU } from "./junu.ts";
import type { Photo } from "./stripes.ts";

export const TITLE = "3. The body: size, coat, stripes";

/**
 * What the live view shows at a step: the size scene, Junu's coat, three tigers side by side,
 * a camera-trap photo, the check, a coat variant beside an ordinary coat, or a sandbox.
 */
export type View = "size" | "coat" | "unique" | "camera" | "check" | "white" | "black" | "breed" | "drift";

export interface Step {
  /** Paragraphs; `*x*` is italic, `**x**` a new term, `[@Key]` a citation. */
  readonly text: readonly string[];
  readonly view: View;
}

// ---- The size scene ----

/** A person drawn beside the tigers for scale; a drawing choice, not a fact about tigers. */
export const PERSON_M = 1.7;

export interface Sized {
  readonly name: string;
  readonly detail: string;
  /** Nose to tail tip, in metres. */
  readonly length: number;
  readonly cites: readonly string[];
}

/** The largest and smallest tigers, at their sources' maxima. */
export const SIZES: readonly Sized[] = [
  { name: "Amur male, the largest", detail: "up to 3 m and 300 kg", length: 3, cites: ["SINZ"] },
  { name: "Sumatran, the smallest", detail: "at most 2.4 m and 140 kg", length: 2.4, cites: ["SINZ"] },
];

/** The species' body and tail lengths, in metres [@CATSG]. */
export const BODY_M = [1.5, 2.3] as const;
export const TAIL_M = [0.9, 1.1] as const;

/** Where a side-view drawing's tiger sits in its picture: the picture's size, and the tail tip and nose along it. */
export interface Drawing {
  readonly width: number;
  readonly height: number;
  readonly tail: number;
  readonly nose: number;
}

/** The size, in metres, to draw a picture at so its tiger is `length` metres from tail tip to nose. */
export function scaled(d: Drawing, length: number): { width: number; height: number } {
  if (!(d.nose > d.tail)) throw new Error("the nose must be ahead of the tail tip");
  const k = length / (d.nose - d.tail);
  return { width: d.width * k, height: d.height * k };
}

// ---- Junu and the tigers the lesson draws ----

/** Junu's stripe pattern, from junu.ts. */
export { JUNU };

/** Three tigers for "no two the same": Junu, her brother, and a tiger from elsewhere in the park. */
export const THREE: readonly { readonly name: string; readonly seed: number }[] = [
  { name: "Junu", seed: JUNU },
  { name: "her brother", seed: 41 },
  { name: "a neighbour", seed: 77 },
];

// ---- The check ----

export const CHECK_STEP = 5;

export const MATCH_TIGERS: readonly { readonly name: string; readonly seed: number }[] = [
  { name: "Tiger A", seed: 101 },
  { name: "Tiger B", seed: 202 },
  { name: "Tiger C", seed: 303 },
];

/** Four photos, so one tiger appears twice and the last pick can't be made by elimination. */
export const MATCH_PHOTOS: readonly Photo[] = [
  { tiger: 1, from: 0.05, to: 0.45 },
  { tiger: 2, from: 0.5, to: 0.95 },
  { tiger: 0, from: 0.3, to: 0.75 },
  { tiger: 1, from: 0.55, to: 0.98 },
];

export const CHECK_EXPLAIN =
  "Each photo shows only part of one side, yet the stripes there (how many, how wide, which split or break into spots) belong to one tiger alone [@CATSG]. This is how researchers tell tigers apart in camera-trap photos, and count them [@Karanth1995]. Tiger B was in two photos: a tiger photographed again is exactly what the counting method needs.";

// ---- The steps ----

export const STEPS: readonly Step[] = [
  {
    view: "coat",
    text: [
      "Junu is six months old. Her coat already carries the stripes she will keep all her life: a pattern that is hers alone.",
      "This lesson is about the tiger's body: how big it gets, what its coat is like, why every coat is different, and where white and \"black\" tigers come from.",
    ],
  },
  {
    view: "size",
    text: [
      "The tiger is the largest living cat, but how large depends on where it lives, and a large lion can be bigger than a small tiger [@CATSG]. Across the species, adults weigh 75–325 kg; the body is 150–230 cm long, and the tail another 90–110 cm [@CATSG].",
      "The largest are Amur tigers, from the Russian Far East: males weigh up to 300 kg and reach 3 m. The smallest are Sumatran tigers, at most 140 kg and 2.4 m [@SINZ]. More broadly, tigers on the mainland are larger than those on the Sunda Islands, such as Sumatra [@Kitchener2017].",
    ],
  },
  {
    view: "size",
    text: [
      "The Smithsonian's 3 m and 2.4 m don't say whether the tail is counted. Adding body and tail gives a whole tiger of 2.4–3.4 m [@CATSG], and both figures fall inside that, so the picture draws them nose to tail tip.",
      "Females of every kind of tiger tend to be smaller than males [@SINZ]. Neither source gives females' sizes, so the picture draws only the two maxima. Junu is likely to end up smaller than her brother.",
    ],
  },
  {
    view: "unique",
    text: [
      "Tigers are the only striped cats: a reddish-orange to yellow-ochre coat with black stripes and a white underside [@CATSG]. Each ear has a white spot on its back [@SINZ]. Males grow a ruff of longer fur around the face [@CATSG].",
      "No two tigers have the same stripes. Patterns differ in how many stripes there are, how wide they are, and whether they split or break into spots [@CATSG]; the Smithsonian compares them to a human fingerprint [@SINZ]. Mainland tigers tend to be paler with fewer stripes, Sunda Island tigers darker with more [@Kitchener2017].",
    ],
  },
  {
    view: "camera",
    text: [
      "That is what makes a tiger countable. Researchers fix **camera traps**, cameras that fire when an animal walks past, along forest paths. Each photo shows part of a tiger's side, and its stripes say which tiger it is [@Karanth1995].",
      "Photographing the area again and again, session after session, they see which tigers turn up again. From how often known tigers are caught again, a method called **capture–recapture** estimates how many tigers live there in all, including those never photographed [@Karanth1995]. Lesson 14 returns to it.",
    ],
  },
  {
    view: "check",
    text: [
      "Your turn. Three tigers were photographed in full; then camera traps caught four photos, each showing part of a tiger's left side.",
      "For each photo, say which tiger it is, then lock in your matches.",
    ],
  },
  {
    view: "white",
    text: [
      "Coat colour comes from **melanin**, a pigment with two forms: one red to yellow, one black to brown [@Xu2013]. A **white tiger** has dark stripes on white fur, blue eyes and a pink nose. It is not an albino: it lacks most of the red-yellow form but keeps the black-brown one, in its eyes and stripes [@Xu2013].",
      "A **gene** is a stretch of DNA that does one job, and a tiger has two copies of each, one from each parent. White tigers have a single change in a gene called *SLC45A2*, the same gene that varies coat or skin colour in people, horses and chickens. The change is **recessive**: a tiger is white only with two changed copies. With one, a **carrier**, it looks orange [@Xu2013].",
    ],
  },
  {
    view: "white",
    text: [
      "White tigers were seen now and then in the wild in India, with records back to the 1500s [@Xu2013]; the last documented wild one was shot in 1958 [@CATSG].",
      "White tigers in zoos are often bred from close relatives to keep the trait, and suffer health problems as a result [@Xu2013]. Two related tigers are likely to carry the same rare copies, harmful ones included.",
    ],
  },
  {
    view: "black",
    text: [
      "\"Black\" tigers are not black all over: they are **pseudomelanistic**, with stripes so wide they merge. In Similipal Tiger Reserve, a 2,750 km² park in eastern India, about 37% of tigers look like this; camera traps across the rest of the tiger's range have found them nowhere else in the wild [@Sagar2021].",
      "The cause is a change in a gene called *Taqpep*, the same gene that shapes the stripes of tabby house cats and the blotches of the king cheetah. It is recessive too [@Sagar2021].",
    ],
  },
  {
    view: "black",
    text: [
      "Researchers found the change in 12 Similipal tigers, where 58% of all copies of the gene carry it, and in none of 395 tigers from other places [@Sagar2021]. With random mating, a share of 0.58 puts two copies in 0.58 × 0.58, about one tiger in three: close to the 37% seen.",
      "Why there, and only there? Similipal's tigers are few, cut off from other tigers, and low in genetic variety. The likely reason is **genetic drift**: chance decides which copies parents happen to pass on, and in a small population chance alone can make a rare copy common [@Sagar2021].",
    ],
  },
  {
    view: "breed",
    text: [
      "The first sandbox breeds cubs. Pick a gene, and how many changed copies the mother and father carry. Each parent passes one of its two copies to each cub, at random.",
      "Try two carriers: both look orange. How many of their cubs show the coat? Then breed a white tiger with a carrier.",
    ],
  },
  {
    view: "drift",
    text: [
      "The second sandbox follows one gene through 20 separate populations at once, generation by generation. In each, the changed copy starts rare, at 5% of all copies, and every copy in the next generation is drawn by chance from the parents'.",
      "Run small populations, then large ones. In which does the rare copy sometimes become common, as in Similipal, and in which is it often lost? The model's numbers are not Similipal's.",
    ],
  },
];

// ---- The sandboxes ----

export type Gene = "white" | "black";

export const GENES: readonly { readonly id: Gene; readonly label: string }[] = [
  { id: "white", label: "white (SLC45A2)" },
  { id: "black", label: "\"black\" (Taqpep)" },
];

export const COPIES_LABEL: Readonly<Record<Copies, string>> = { 0: "no changed copies", 1: "one copy (a carrier)", 2: "two copies" };

/** The most cubs the breeding sandbox keeps on screen. */
export const MAX_CUBS = 24;

/** Population sizes (tigers) the drift sandbox offers, and the variant's starting share. */
export const POPULATIONS: readonly number[] = [10, 20, 100, 1000];
export const START_POPULATION = 20;
/** How many isolated populations each run follows side by side. */
export const RUNS = 20;
export const START_SHARE = 0.05;
/** A run stops after this many generations if the copy is neither lost nor in every tiger. */
export const MAX_GENERATIONS = 200;
/** The share in Similipal today, drawn as a reference line [@Sagar2021]. */
export const SIMILIPAL_SHARE = 0.58;

/** Every source the lesson cites, in order of first appearance: the numbering on screen. */
export function lessonSources(): string[] {
  return [...new Set([...citedKeys([...STEPS.flatMap((s) => s.text), CHECK_EXPLAIN]), ...SIZES.flatMap((s) => s.cites), "Sagar2021"])];
}
