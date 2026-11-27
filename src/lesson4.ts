// Lesson 4, "Voice and senses": its content (steps, the pitch scale, the cochleas, the tuning
// check and the pupil model). Pure data and functions; lesson4-view.ts draws them. Facts are in
// docs/research/senses.md and body.md (voice).

import { citedKeys } from "./cite.ts";

export const TITLE = "4. Voice and senses";

/** What the live view shows at a step. */
export type View = "pitch" | "cochlea" | "check" | "scent" | "pupils" | "pupil-model";

export interface Step {
  /** Paragraphs; `*x*` is italic, `**x**` a new term, `[@Key]` a citation. */
  readonly text: readonly string[];
  readonly view: View;
}

// ---- The pitch scale ----

/** A pitch or band of pitches on the scale, in Hz. `mid` is an average, drawn as a dot. */
export interface Pitch {
  readonly name: string;
  readonly lo: number;
  readonly hi: number;
  readonly mid?: number;
  readonly detail: string;
  readonly cites: readonly string[];
  /** Shown from this step on, so the roar joins the scale when it is taught. */
  readonly from: number;
}

export const ROAR_STEP = 1;

export const PITCHES: readonly Pitch[] = [
  { name: "Adult men speaking", lo: 115, hi: 125, detail: "about 115–125 Hz on average", cites: ["NCVS", "SydneyVoiceLab"], from: 0 },
  { name: "Adult women speaking", lo: 199, hi: 200, detail: "about 200 Hz on average", cites: ["NCVS", "SydneyVoiceLab"], from: 0 },
  { name: "A tiger's roar", lo: 83, hi: 246, mid: 158, detail: "83–246 Hz, average 158 Hz", cites: ["Klemuk2011"], from: ROAR_STEP },
];

/** The scale's ends, in Hz: wide enough for every pitch drawn and the 1 kHz mark. */
export const SCALE_HZ = [50, 2000] as const;
export const TICKS_HZ: readonly number[] = [50, 100, 200, 500, 1000, 2000];

/** Where `hz` sits along a logarithmic scale from `lo` to `hi`, as 0 to 1 (clamped). */
export function logPos(hz: number, lo: number, hi: number): number {
  if (!(lo > 0 && hi > lo)) throw new Error("the scale needs 0 < lo < hi");
  const t = Math.log(hz / lo) / Math.log(hi / lo);
  return Math.min(1, Math.max(0, t));
}

/** "1 kHz" for 1000, "200 Hz" for 200. */
export const hzLabel = (hz: number): string => (hz >= 1000 ? `${hz / 1000} kHz` : `${hz} Hz`);

// ---- The cochleas ----

/** A basilar membrane's length in mm: `hi` above `lo` when the source gives a range. */
export interface Cochlea {
  readonly name: string;
  readonly lo: number;
  readonly hi: number;
}

/** Uncoiled, to scale [@Bergevin2012]. */
export const COCHLEAS: readonly Cochlea[] = [
  { name: "House cat", lo: 25, hi: 25 },
  { name: "Person", lo: 35, hi: 35 },
  { name: "Tiger", lo: 36, hi: 39 },
];

// ---- The check ----

export const CHECK_STEP = 3;

export type Ear = "cat" | "person";

export const EARS: readonly { readonly value: Ear; readonly label: string }[] = [
  { value: "cat", label: "More like a house cat's: it is a cat, after all" },
  { value: "person", label: "More like a person's" },
];

export const ANSWER: Ear = "person";

export const CHECK_EXPLAIN =
  "A tiger's cochlea is tuned about as sharply as a person's, and much more sharply than a house cat's. Researchers found this by recording the faint sounds the ear itself gives off (**otoacoustic emissions**) in nine ears of five zoo tigers [@Bergevin2012]. The authors suggest sharp tuning may help a tiger pick out the details of complex sounds, especially where it is noisy or sounds echo [@Bergevin2012].";

/** What the learner is told about their prediction. */
export function grade(ear: Ear): { readonly correct: boolean; readonly text: string } {
  return ear === ANSWER
    ? { correct: true, text: CHECK_EXPLAIN }
    : {
        correct: false,
        text: `Being a cat doesn't settle it. ${CHECK_EXPLAIN}`,
      };
}

// ---- The pupil model ----

export type Pupil = "vertical" | "round" | "horizontal";
export type Style = "ambush" | "prey";
export type Height = "short" | "tall";

/** The 42 cm line at the shoulder that splits the ambush predators [@Banks2015]. */
export const SHOULDER_CM = 42;

export const STYLES: readonly { readonly value: Style; readonly label: string }[] = [
  { value: "ambush", label: "an ambush hunter, eyes facing forward" },
  { value: "prey", label: "a grazing prey animal" },
];

export const HEIGHTS: readonly { readonly value: Height; readonly label: string }[] = [
  { value: "short", label: `under ${SHOULDER_CM} cm at the shoulder` },
  { value: "tall", label: `${SHOULDER_CM} cm or taller` },
];

/** Banks et al.'s counts: 65 frontal-eyed ambush predators, 44 vertical and 19 circular; 82% and 17% of them under 42 cm. */
export const AMBUSH = { total: 65, vertical: 44, round: 19, verticalShort: 0.82, roundShort: 0.17 } as const;
/** Of 42 herbivorous prey animals, 36 have horizontal pupils. The paper gives no split by height. */
export const PREY = { total: 42, horizontal: 36 } as const;

export interface Tally {
  /** Species in the paper's data for this niche and height, by pupil shape. */
  readonly counts: Readonly<Partial<Record<Pupil, number>>>;
  /** How many species the counts are out of. */
  readonly of: number;
  /** The most common pupil among them: what the data predicts. */
  readonly predicted: Pupil;
  /** Whether the counts are worked out from the paper's percentages (so rounded). */
  readonly worked: boolean;
}

/** What the data says about animals of this hunting style and height. */
export function tally(style: Style, height: Height): Tally {
  if (style === "prey") return { counts: { horizontal: PREY.horizontal }, of: PREY.total, predicted: "horizontal", worked: false };
  const vShort = Math.round(AMBUSH.vertical * AMBUSH.verticalShort);
  const rShort = Math.round(AMBUSH.round * AMBUSH.roundShort);
  const counts = height === "short" ? { vertical: vShort, round: rShort } : { vertical: AMBUSH.vertical - vShort, round: AMBUSH.round - rShort };
  return { counts, of: counts.vertical + counts.round, predicted: counts.vertical > counts.round ? "vertical" : "round", worked: true };
}

export const PUPIL_NAME: Readonly<Record<Pupil, string>> = {
  vertical: "a vertical slit",
  round: "a round pupil",
  horizontal: "a horizontal slit",
};

/** Animals to place in the model with one press: what the sources say about each. */
export interface Animal {
  readonly name: string;
  readonly style: Style;
  readonly height: Height;
  readonly note: string;
}

export const ANIMALS: readonly Animal[] = [
  {
    name: "A tiger",
    style: "ambush",
    height: "tall",
    note: "A tiger hunts by ambush [@SINZ] and stands far taller than 42 cm. The data predicts a round pupil. Whether the tiger's own pupil is round is not in the sources this course has read yet, so the course doesn't say.",
  },
  {
    name: "A house cat",
    style: "ambush",
    height: "short",
    note: "The house cat is the paper's own example of a vertical slit [@Banks2015], as the data predicts for a short ambush hunter.",
  },
];

// ---- The steps ----

export const STEPS: readonly Step[] = [
  {
    view: "pitch",
    text: [
      "Junu is a year old. Somewhere in the tall grass her mother calls, and Junu answers. This lesson is about how tigers call, and how they hear, smell and see.",
      "Sound is a vibration in the air. How fast it vibrates is its **pitch**, measured in **hertz** (**Hz**): vibrations per second; 1 **kHz** is 1,000 Hz. On this scale each tick is about double the pitch of the one before. People speak lower than many expect: men at about 115–125 Hz on average, women at about 200 Hz [@NCVS; @SydneyVoiceLab].",
    ],
  },
  {
    view: "pitch",
    text: [
      "A tiger's **roar** is a long-distance call, a way of announcing itself far away. Its pitch averages 158 Hz and runs from 83 to 246 Hz [@Klemuk2011]: the same band as human voices. What makes a roar a roar is not its pitch alone.",
      "Unlike most mammals, tigers and lions have a layer of fat in their **vocal folds**, the folds in the throat that vibrate to make a voice. The fat was thought to lower the pitch by adding weight. Klemuk and colleagues found instead that it gives the folds a large, square shape that starts sounding easily, widening how loud or soft the voice can be, and may protect them [@Klemuk2011].",
    ],
  },
  {
    view: "cochlea",
    text: [
      "Inside the ear, sound reaches the **cochlea**, a coiled tube that turns it into nerve signals. Along it runs the **basilar membrane**; each point along it responds best to one pitch, high pitches at one end and low at the other [@Bergevin2012]. Here three are drawn uncoiled, to scale.",
      "A tiger's is 36–39 mm long, against about 25 mm in a house cat and 35 mm in a person [@Bergevin2012]. Tigers' hearing is built for low sounds: their calls carry much of their energy below 1 kHz, and the highest pitch a tiger hears seems to be lower than a house cat's [@Bergevin2012].",
    ],
  },
  {
    view: "check",
    text: [
      "How finely a point on the cochlea picks out one pitch is its **tuning**. Sharper tuning means telling close pitches apart [@Bergevin2012].",
      "Your turn: is a tiger's cochlea tuned more like a house cat's, or more like a person's? Choose, then show the answer.",
    ],
  },
  {
    view: "scent",
    text: [
      "Tigers also leave messages that last after they've gone. They spray urine on trees and bushes, and scrape the ground and mark the scrape with urine, faeces and secretions of the anal glands [@Smith1989]. Lesson 6 shows what those marks say about territory.",
      "The fluid a male Bengal tiger sprays is urine mixed with a little fat. The fat holds the smelly compounds and lets them go slowly, so a mark keeps signalling long after the tiger has walked on [@Burger2008]. Chemists found 98 such compounds in it [@Burger2008]. Which of them gives the mark its smell is still argued over, so the course names none as \"the\" tiger smell [@Burger2008].",
    ],
  },
  {
    view: "pupils",
    text: [
      "Tigers hunt mostly at night [@SINZ]. Light enters the eye through the **pupil**, which can be round, a **vertical slit** or a **horizontal slit** [@Banks2015].",
      "Banks and colleagues sorted 214 land animals by pupil shape and way of life. Animals with vertical slits are very likely to be **ambush predators**, hunters that wait or stalk and then strike, and active by day and night. Animals with horizontal pupils are very likely to be prey [@Banks2015].",
    ],
  },
  {
    view: "pupils",
    text: [
      "Why? A vertical slit keeps upright things sharp while blurring horizontal ones that are nearer or farther than where the eye is focused. That blur helps an ambush hunter judge how far away its prey is along the ground [@Banks2015].",
      "The trick works best close to the ground. Among the frontal-eyed ambush predators, 82% of those with vertical pupils stand under 42 cm at the shoulder, but only 17% of those with round pupils [@Banks2015].",
    ],
  },
  {
    view: "pupil-model",
    text: [
      "The sandbox: choose a hunting style and a height, and see which pupil the data predicts. Then place a house cat, and a tiger.",
      "A prediction from the data is not a measurement. The data says what is likely for animals like this; each species' own eye is checked by looking at it.",
    ],
  },
];

/** Every source the lesson cites, in order of first appearance: the numbering on screen. */
export function lessonSources(): string[] {
  return [
    ...new Set([
      ...citedKeys([...STEPS.flatMap((s) => s.text), CHECK_EXPLAIN, ...ANIMALS.map((a) => a.note)]),
      ...PITCHES.flatMap((p) => p.cites),
      "Bergevin2012",
      "Banks2015",
    ]),
  ];
}
