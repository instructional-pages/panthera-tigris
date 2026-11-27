// Lesson 1, "What is a tiger?": its content (steps, the tree, the cats' traits) and the
// grading of its check. Pure data and functions; main.ts draws them.
// Every fact carries its source key; the facts are in docs/research/taxonomy.md.

import { citedKeys } from "./cite.ts";
import type { TreeNode } from "./tree.ts";

export const TITLE = "1. What is a tiger?";

/** The group of cats this lesson doesn't open. */
export const OTHER_CATS = "other-cats";
/** The genus whose inner forks stay hidden until the check is answered. */
export const PANTHERA = "panthera";

export const TREE: TreeNode = {
  id: "felidae",
  label: "Cat family",
  latin: "Felidae",
  cites: ["Kitchener2017"],
  children: [
    {
      id: "pantherinae",
      label: "Pantherine cats, 7 living species",
      cites: ["Mazak2011"],
      children: [
        {
          id: "neofelis",
          label: "Clouded leopards",
          latin: "Neofelis",
          cites: ["Kitchener2017"],
          children: [
            { id: "nebulosa", label: "Mainland clouded leopard", latin: "Neofelis nebulosa", cites: ["CATSGCloudedLeopard"] },
            { id: "diardi", label: "Sunda clouded leopard", latin: "Neofelis diardi", cites: ["CATSGSundaCloudedLeopard"] },
          ],
        },
        {
          id: PANTHERA,
          label: "Big cats",
          latin: "Panthera",
          cites: ["Kitchener2017"],
          children: [
            {
              id: "lion-leopard-jaguar",
              label: "Lion, leopard and jaguar",
              cites: ["Davis2010", "Mazak2011"],
              // How these three split isn't in the dossier yet, so the tree leaves it open.
              children: [
                { id: "lion", label: "Lion", latin: "Panthera leo", cites: ["CATSGLion"] },
                { id: "leopard", label: "Leopard", latin: "Panthera pardus", cites: ["CATSGLeopard"] },
                { id: "jaguar", label: "Jaguar", latin: "Panthera onca", cites: ["CATSGJaguar"] },
              ],
            },
            {
              id: "tiger-snow-leopard",
              label: "Tiger and snow leopard",
              cites: ["Davis2010", "Mazak2011"],
              children: [
                { id: "tiger", label: "Tiger", latin: "Panthera tigris", cites: ["Kitchener2017"] },
                { id: "snow-leopard", label: "Snow leopard", latin: "Panthera uncia", cites: ["CATSGSnowLeopard"] },
              ],
            },
          ],
        },
      ],
    },
    { id: OTHER_CATS, label: "All other cats: not part of this lesson" },
  ],
};

/** The branch the sandbox judges groups against. */
export const SANDBOX_ROOT = "pantherinae";

export interface Cat {
  readonly id: string;
  readonly weight: string;
  readonly coat: string;
  readonly where: string;
  readonly cite: string;
}

export const CATS: readonly Cat[] = [
  { id: "tiger", weight: "75–325 kg", coat: "orange with black stripes", where: "Asia", cite: "CATSG" },
  { id: "lion", weight: "110–272 kg", coat: "plain tawny", where: "Africa; India's Gir Forest", cite: "CATSGLion" },
  { id: "leopard", weight: "17–90 kg", coat: "black spots", where: "Africa and Asia", cite: "CATSGLeopard" },
  { id: "jaguar", weight: "36–148 kg", coat: "rosettes round small spots", where: "the Americas", cite: "CATSGJaguar" },
  { id: "snow-leopard", weight: "30–50 kg", coat: "grey, spots and rosettes", where: "Central Asian mountains", cite: "CATSGSnowLeopard" },
  { id: "nebulosa", weight: "16–23 kg", coat: "cloud-like blotches", where: "mainland South-east Asia", cite: "CATSGCloudedLeopard" },
  { id: "diardi", weight: "11–25 kg", coat: "grey, cloud-like blotches", where: "Sumatra and Borneo", cite: "CATSGSundaCloudedLeopard" },
];

export interface Trait {
  readonly label: string;
  readonly cats: readonly string[];
}

/** Groupings by a shared trait, for the sandbox. Each follows from the CATS rows above. */
export const TRAITS: readonly Trait[] = [
  { label: "Spots or rosettes", cats: ["leopard", "jaguar", "snow-leopard"] },
  { label: "Can weigh over 100 kg", cats: ["tiger", "lion", "jaguar"] },
  { label: "Lives wild in Asia", cats: ["tiger", "lion", "leopard", "snow-leopard", "nebulosa", "diardi"] },
  { label: "Panthera in its name", cats: ["tiger", "lion", "leopard", "jaguar", "snow-leopard"] },
];

export type Mode = "tree" | "check" | "sandbox";

export interface Step {
  /** Paragraphs; `*x*` is italic, `**x**` a new term, `[@Key]` a citation. */
  readonly text: readonly string[];
  readonly mode: Mode;
  /** Tree nodes open when the step is shown (the learner can open more). */
  readonly open: readonly string[];
}

export const STEPS: readonly Step[] = [
  {
    mode: "tree",
    open: [],
    text: [
      "Meet Junu. She has just been born in a den in Chitwan National Park, in the lowlands of southern Nepal, one of a litter of three; tigers usually have two to four cubs [@SINZ].",
      "Junu is fictional: a composite tiger whose life, lesson by lesson, is made of typical events from the field studies. The first question is what she is.",
    ],
  },
  {
    mode: "tree",
    open: [],
    text: [
      "To a scientist, Junu is *Panthera tigris*. Every described species has a two-part name. The first word is the **genus**, a group of close relatives; the second picks out the **species** within it.",
      "The name is written in italics, often with who first described the species and when: *Panthera tigris* (Linnaeus, 1758) [@Kitchener2017].",
    ],
  },
  {
    mode: "tree",
    open: ["felidae"],
    text: [
      "Groups sit inside bigger groups. A genus belongs to a **family**; the tiger's is the cat family, *Felidae* [@Kitchener2017].",
      "Inside the family, the tiger belongs to the **pantherine cats**, seven living species [@Mazak2011]. Press that group on the right to open it.",
    ],
  },
  {
    mode: "tree",
    open: ["felidae", "pantherinae", "neofelis", PANTHERA],
    text: [
      "Five of the seven make up the genus *Panthera*, the big cats, which include the largest living cats: tiger, lion, leopard, jaguar and snow leopard [@Kitchener2017].",
      "The other two are the clouded leopards, genus *Neofelis* [@Kitchener2017]. Every big cat's scientific name starts with *Panthera*, so the name alone tells you the genus.",
    ],
  },
  {
    mode: "tree",
    open: ["felidae", "pantherinae", "neofelis", PANTHERA],
    text: [
      "A family tree pictures who shares an ancestor with whom. Each fork is a split: one ancestral population became two lines. Species on the same branch share an ancestor that no species off that branch shares.",
      "So a species' **closest relative** is the one it shares the most recent ancestor with. Scientists find the forks by comparing DNA, the inherited code in every cell; for the big cats, several separate parts of it were compared [@Davis2010; @Mazak2011].",
    ],
  },
  {
    mode: "tree",
    open: ["felidae", "pantherinae", PANTHERA],
    text: [
      "One rank sits below the species. A **subspecies** is a population, separated by geography, distinct enough to get a third name, such as *Panthera tigris tigris* [@Kitchener2017].",
      "Junu belongs to the Bengal tigers of the Indian subcontinent, Nepal included [@Kitchener2017]. How many tiger subspecies there are is a live dispute; lesson 8 takes it apart.",
    ],
  },
  {
    mode: "check",
    open: ["felidae", "pantherinae", "neofelis", PANTHERA, "lion-leopard-jaguar", "tiger-snow-leopard"],
    text: [
      "Your turn, before the answer. The first fork inside *Panthera* splits its five cats into two branches, and lion, leopard and jaguar sit together on one of them [@Davis2010; @Mazak2011].",
      "Where do the tiger and the snow leopard go? Choose for each, then show the answer.",
    ],
  },
  {
    mode: "sandbox",
    open: ["felidae", "pantherinae", "neofelis", PANTHERA, "lion-leopard-jaguar", "tiger-snow-leopard"],
    text: [
      "The sandbox. Pick a trait, or press cats to build your own group, and see whether the tree makes it one whole branch.",
      "Looking alike, weighing the same or living in the same part of the world is not the same as sharing an ancestor. The traits come from the Cat Specialist Group's species pages.",
    ],
  },
];

// The check: where do the tiger and the snow leopard sit?

export type Place = "with-lion" | "other-branch" | "outside";

export const PLACES: readonly { value: Place; label: string }[] = [
  { value: "with-lion", label: "On the branch with lion, leopard and jaguar" },
  { value: "other-branch", label: "On Panthera's other branch" },
  { value: "outside", label: "Outside Panthera, next to the clouded leopards" },
];

export const CHECKED = ["tiger", "snow-leopard"] as const;
export type Checked = (typeof CHECKED)[number];

export interface Feedback {
  readonly correct: boolean;
  readonly text: string;
}

const NAME: Record<Checked, { label: string; latin: string; other: string }> = {
  tiger: { label: "The tiger", latin: "Panthera tigris", other: "snow leopard" },
  "snow-leopard": { label: "The snow leopard", latin: "Panthera uncia", other: "tiger" },
};

/** What the learner is told about where they put one cat. */
export function grade(cat: Checked, place: Place): Feedback {
  const n = NAME[cat];
  if (place === "other-branch")
    return {
      correct: true,
      text: `${n.label} sits on Panthera's other branch, beside the ${n.other}: DNA from several parts of the genome puts the two together [@Davis2010; @Mazak2011].`,
    };
  if (place === "outside")
    return {
      correct: false,
      text: `${n.label} is in Panthera, and its name, *${n.latin}*, says so [@Kitchener2017].`,
    };
  return {
    correct: false,
    text:
      cat === "tiger"
        ? "One well-known source agrees with you: the Smithsonian's National Zoo names the lion as the tiger's closest relative [@SINZ]. The DNA studies put the snow leopard there instead [@Davis2010; @Mazak2011]."
        : "The DNA studies put the snow leopard on Panthera's other branch, beside the tiger, not with the lion, leopard and jaguar [@Davis2010; @Mazak2011].",
  };
}

/** Said once, after both answers: why scientists still write "probably". */
export const CHECK_CODA =
  "Why “probably”: different parts of the genome give conflicting trees [@Davis2010]; the snow leopard is the answer the combined evidence supports [@Davis2010; @Mazak2011]. So the tiger's closest living relative is probably the snow leopard, and one well-known zoo still says the lion.";

const treeCites = (n: TreeNode): string[] => [...(n.cites ?? []), ...(n.children ?? []).flatMap(treeCites)];

/** Every source the lesson cites, in order of first appearance: the numbering on screen. */
export function lessonSources(): string[] {
  const texts = [
    ...STEPS.flatMap((s) => s.text),
    ...CHECKED.flatMap((c) => PLACES.map((p) => grade(c, p.value).text)),
    CHECK_CODA,
  ];
  return [...new Set([...citedKeys(texts), ...treeCites(TREE), ...CATS.map((c) => c.cite)])];
}
