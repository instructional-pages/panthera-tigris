// Lesson 2, "Two and a half million years of tigers": its content (steps, the time line's
// events, the check and the family-line sandbox's settings). Pure data and functions;
// lesson2-view.ts draws them. Facts are in docs/research/evolution.md and life-cycle.md.

import { citedKeys } from "./cite.ts";
import type { EstimateSpec } from "./estimate.ts";
import type { TimeScale } from "./timeline.ts";

export const TITLE = "2. Two and a half million years of tigers";

/** The time line runs from 20 million to 5,000 years ago, so 10.8 Mya and the last 20,000 years both fit. */
export const SCALE: TimeScale = { oldest: 20_000_000, newest: 5_000 };

/**
 * How an event is drawn, so kinds are told apart by shape and words, not hue: a fossil is a
 * solid square, a DNA date a solid bar with dashed whiskers for its outer bounds, a boundary
 * between ages a thin line, and a hypothesis a dashed line labelled as one.
 */
export type Kind = "boundary" | "fossil" | "dna" | "hypothesis";

export interface TimeEvent {
  readonly id: string;
  /** The label on the line: short, plain text. */
  readonly label: string;
  readonly kind: Kind;
  /** Years ago; a span runs from `from` (older) to `to`. */
  readonly from: number;
  readonly to?: number;
  /** A DNA date's widest bounds, older first, drawn as dashed whiskers. */
  readonly bounds?: readonly [number, number];
  /** The span runs on to the line's right end (towards today). */
  readonly open?: boolean;
  readonly cites: readonly string[];
}

export const EVENTS: readonly TimeEvent[] = [
  { id: "panthera", label: "Big-cat line splits off", kind: "dna", from: 10_800_000, cites: ["Mazak2011"] },
  { id: "first-fossils", label: "Oldest Panthera fossils", kind: "fossil", from: 3_800_000, cites: ["Mazak2011"] },
  { id: "pleistocene", label: "Pleistocene begins", kind: "boundary", from: 2_588_000, cites: ["Mazak2011"] },
  { id: "longdan", label: "Longdan skull", kind: "fossil", from: 2_550_000, to: 2_160_000, cites: ["Mazak2011"] },
  { id: "calabrian", label: "Calabrian: oldest certain tiger jaws", kind: "boundary", from: 1_806_000, cites: ["Mazak2011"] },
  { id: "mrca", label: "Last common ancestor (mtDNA)", kind: "dna", from: 108_000, to: 72_000, bounds: [157_000, 39_000], cites: ["Luo2004"] },
  { id: "genomes", label: "Whole genomes", kind: "dna", from: 110_000, cites: ["Liu2018"] },
  { id: "toba", label: "Toba eruption (a hypothesis)", kind: "hypothesis", from: 73_500, cites: ["Luo2004"] },
  { id: "amur", label: "Amur founder event", kind: "dna", from: 20_000, open: true, cites: ["Luo2004"] },
];

export type Mode = "timeline" | "check" | "sandbox";

export interface Step {
  /** Paragraphs; `*x*` is italic, `**x**` a new term, `[@Key]` a citation. */
  readonly text: readonly string[];
  readonly mode: Mode;
  /** Events on the time line at this step. */
  readonly shown: readonly string[];
}

const DEEP = ["panthera", "first-fossils"];
const FOSSILS = [...DEEP, "pleistocene", "longdan", "calabrian"];
const DNA = [...FOSSILS, "mrca", "genomes"];
const ALL = EVENTS.map((e) => e.id);

/** The step with the check; the time line hides the answer until it is locked in. */
export const CHECK_STEP = 6;

export const STEPS: readonly Step[] = [
  {
    mode: "timeline",
    shown: [],
    text: [
      "Junu is two months old. In Chitwan, cubs begin to travel with their mother at about this age [@Smith1993], so Junu now follows her out of the den.",
      "She is a tiger like every tiger alive today. How long have there been tigers? This lesson runs back more than ten million years, then forward to the ancestor all living tigers share.",
    ],
  },
  {
    mode: "timeline",
    shown: DEEP,
    text: [
      "Deep time is counted in years ago. **Mya** means million years ago, **kya** thousand years ago. The line on the right is drawn so that each tick is ten times older than the next: 10 kya, 100 kya, 1 Mya, 10 Mya. Equal steps along it are equal multiples, not equal amounts.",
      "DNA dates the split of the big cats' line, *Panthera*, from the other cats to about 10.8 Mya, probably in South-east Asia, followed by a fast split into the living species [@Mazak2011]. The oldest *Panthera* fossils, from East Africa about 3.8 Mya, are fragments of two cats, one lion-sized and one leopard-sized, whose identity is still open [@Mazak2011].",
    ],
  },
  {
    mode: "timeline",
    shown: FOSSILS,
    text: [
      "The **Pleistocene** is the age of the ice ages. Its first stage, the Gelasian, starts 2.588 Mya; it was once counted as the Pliocene, so older papers call the same rocks \"Late Pliocene\" [@Mazak2011].",
      "Near its start lived the oldest member of the tiger's line we know: *Panthera zdanskyi*, the \"Longdan tiger\". Its nearly complete skull, from Gansu Province in north-western China, is dated by the rocks' magnetism to 2.55–2.16 Mya. It is the oldest complete pantherine skull ever found, and it sits beside the tiger on the family tree, its closest branch [@Mazak2011].",
    ],
  },
  {
    mode: "timeline",
    shown: FOSSILS,
    text: [
      "The Longdan tiger was jaguar-sized: as big as the smallest female tigers today, though it was a male [@Mazak2011]. Yet its skull was already much like a modern tiger's, and its skull, bite and teeth suggest it already lived much like one [@Mazak2011].",
      "Over two million years the line grew larger, though not in a straight line [@Mazak2011]. The oldest fossils that are certainly tigers are jaw fragments from Lantian, China, from the Pleistocene's next stage, the Calabrian, which starts 1.806 Mya [@Mazak2011].",
    ],
  },
  {
    mode: "timeline",
    shown: FOSSILS,
    text: [
      "By early in the Pleistocene, tigers were widespread in eastern Asia. The ice ages' swings in climate then shrank and spread their range, again and again [@Luo2004].",
      "Fossils show where tigers lived. To learn which of those tigers today's tigers descend from, scientists read the DNA of living ones.",
    ],
  },
  {
    mode: "timeline",
    shown: FOSSILS,
    text: [
      "Besides its main DNA, a tiger carries a small second piece, **mitochondrial DNA** or mtDNA, that passes down the mother's line only: Junu has her mother's, and her mother's mother's [@Luo2004].",
      "Trace every living tiger's mtDNA back, mother to mother, and the lines meet in one female: the **most recent common ancestor**. She is not the first tiger, only the latest one that all living tigers descend from through their mothers [@Luo2004].",
    ],
  },
  {
    mode: "check",
    shown: FOSSILS,
    text: [
      "Your turn, before the answer. The tiger's line goes back more than two million years, to the Longdan tiger [@Mazak2011].",
      "When did the most recent common ancestor of all living tigers live? Set the slider, then lock it in.",
    ],
  },
  {
    mode: "timeline",
    shown: DNA,
    text: [
      "Recent. The mtDNA of living tigers meets 72,000–108,000 years ago (at the widest, 39,000–157,000), young next to some other big cats [@Luo2004]. Whole genomes, all of each tiger's DNA, also lead back to about 110,000 years ago [@Liu2018].",
      "Both studies read it as a **bottleneck**: a time when tigers became few and lost genetic variety [@Luo2004; @Liu2018].",
    ],
  },
  {
    mode: "timeline",
    shown: ALL,
    text: [
      "What caused it? Luo and colleagues noticed that their date roughly matches the super-eruption of Toba, on Sumatra, about 73,500 years ago, and proposed it as a possible cause [@Luo2004].",
      "That is a **hypothesis**: the dates line up, but no one has shown that the eruption did it [@Luo2004]. The line draws it dashed for that reason.",
    ],
  },
  {
    mode: "timeline",
    shown: ALL,
    text: [
      "Afterwards, as their habitats shrank and spread again, groups of tigers were cut off from each other and grew apart: the differences between today's subspecies arose in the last 100,000 years [@Kitchener2017; @Luo2004]. Amur tigers show no mtDNA variety at all, a sign of a second squeeze less than 20,000 years ago [@Luo2004].",
      "So where did tigers begin? The Longdan skull points to north-western China [@Mazak2011]; the DNA points to northern Indochina and southern China [@Luo2004]. They may answer different questions: where the line arose 2.5 Mya, and where today's tigers spread from after the bottleneck.",
    ],
  },
  {
    mode: "sandbox",
    shown: ALL,
    text: [
      "The sandbox: a model of maternal lines, not real tigers. Every generation, each daughter is born to a mother picked at random from the generation before, so some females have several daughters and some none. A female with no daughters ends her line for good.",
      "Run it and watch the lines die out until one is left: from then on, every female shares one ancestor among the founders. Then start over and press Bottleneck: shrink the population for a few generations and see how fast the lines go.",
    ],
  },
];

// ---- The check ----

export const CHECK: EstimateSpec = {
  min: 1_000,
  max: 10_000_000,
  answer: 100_000,
  scale: "log",
  steps: 200,
  // Within about 0.24 of a power of ten: 57,000 to 174,000 years ago counts as close.
  close: 0.06,
};

export const CHECK_EXPLAIN =
  "That is a round figure for both studies: the mtDNA of living tigers meets 72,000–108,000 years ago [@Luo2004], and whole genomes about 110,000 [@Liu2018]. The tiger's line is more than two million years old, yet every living tiger descends, mother to mother, from one female of about 100,000 years ago.";

// ---- The sandbox ----

/** Population sizes the learner can start a run with (females per generation). */
export const SIZES: readonly number[] = [10, 25, 50, 100];
export const START_SIZE = 50;

/** A bottleneck in the model: this many females, for this many generations, then back to full size. */
export const BOTTLENECK = { size: 2, generations: 5 } as const;

/** Every source the lesson cites, in order of first appearance: the numbering on screen. */
export function lessonSources(): string[] {
  return [...new Set([...citedKeys([...STEPS.flatMap((s) => s.text), CHECK_EXPLAIN]), ...EVENTS.flatMap((e) => e.cites)])];
}
