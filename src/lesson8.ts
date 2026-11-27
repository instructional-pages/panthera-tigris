// Lesson 8, "How many kinds of tiger?": its content (steps, the nine populations, the three ways
// of grouping them, the two-subspecies check and the threshold model). Pure data and functions;
// lesson8-view.ts draws them. Facts are in docs/research/taxonomy.md. The threshold model's
// differences are made up, and the lesson says so: the sources read give no such numbers.

import { citedKeys } from "./cite.ts";

export const TITLE = "8. How many kinds of tiger?";

/** What the live view shows at a step. */
export type View = "junu" | "populations" | "eight" | "evidence" | "check" | "two" | "six" | "all" | "sandbox";

export interface Step {
  /** Paragraphs; `*x*` is italic, `**x**` a new term, `[@Key]` a citation. */
  readonly text: readonly string[];
  readonly view: View;
}

// ---- The populations ----

export type Status = "living" | "extinct" | "wild-extinct";

export interface Population {
  readonly id: string;
  readonly name: string;
  readonly where: string;
  readonly status: Status;
  readonly island: boolean;
}

/** Roughly west to east on the mainland, then the islands [@Kitchener2017; @Goodrich2022]. */
export const POPULATIONS: readonly Population[] = [
  { id: "caspian", name: "Caspian", where: "Central Asia to Turkey", status: "extinct", island: false },
  { id: "bengal", name: "Bengal", where: "India, Nepal, Bangladesh, Bhutan", status: "living", island: false },
  { id: "amur", name: "Amur", where: "Russian Far East, NE China", status: "living", island: false },
  { id: "southchina", name: "South China", where: "China", status: "wild-extinct", island: false },
  { id: "indochinese", name: "Indochinese", where: "Indochina", status: "living", island: false },
  { id: "malayan", name: "Malayan", where: "Malay Peninsula", status: "living", island: false },
  { id: "sumatran", name: "Sumatran", where: "Sumatra", status: "living", island: true },
  { id: "javan", name: "Javan", where: "Java", status: "extinct", island: true },
  { id: "bali", name: "Bali", where: "Bali", status: "extinct", island: true },
];

export const STATUS_WORD: Readonly<Record<Status, string>> = {
  living: "living",
  extinct: "extinct",
  "wild-extinct": "extinct in the wild",
};

export const byId = (id: string): Population => {
  const p = POPULATIONS.find((q) => q.id === id);
  if (!p) throw new Error(`no population "${id}"`);
  return p;
};

export const LIVING: readonly string[] = POPULATIONS.filter((p) => p.status !== "extinct").map((p) => p.id);

// ---- Three ways of grouping them ----

/** One named group in a scheme: its name and the populations it holds. */
export interface Group {
  readonly name: string;
  readonly members: readonly string[];
}

export interface Scheme {
  readonly key: "eight" | "two" | "six";
  readonly label: string;
  readonly groups: readonly Group[];
  /** Populations the scheme leaves out, and why. */
  readonly outside: readonly string[];
  readonly outsideWhy: string;
  readonly keys: readonly string[];
}

/** Wozencraft (2005), as listed by Kitchener et al. [@Kitchener2017]. */
export const EIGHT: Scheme = {
  key: "eight",
  label: "Eight subspecies (2005)",
  groups: [
    { name: "P. t. virgata", members: ["caspian"] },
    { name: "P. t. tigris", members: ["bengal"] },
    { name: "P. t. altaica", members: ["amur"] },
    { name: "P. t. amoyensis", members: ["southchina"] },
    { name: "P. t. corbetti", members: ["indochinese"] },
    { name: "P. t. sumatrae", members: ["sumatran"] },
    { name: "P. t. sondaica", members: ["javan"] },
    { name: "P. t. balica", members: ["bali"] },
  ],
  outside: ["malayan"],
  outsideWhy: "not named until 2004",
  keys: ["Kitchener2017", "Luo2004"],
};

/** The 2017 revision by the IUCN Cat Specialist Group's task force [@Kitchener2017]. */
export const TWO: Scheme = {
  key: "two",
  label: "Two subspecies (IUCN, 2017)",
  groups: [
    { name: "P. t. tigris (mainland)", members: ["caspian", "bengal", "amur", "southchina", "indochinese", "malayan"] },
    { name: "P. t. sondaica (Sunda Islands)", members: ["sumatran", "javan", "bali"] },
  ],
  outside: [],
  outsideWhy: "",
  keys: ["Kitchener2017"],
};

/** Whole genomes: six living groups, extinct ones not among them [@Liu2018]. */
export const SIX: Scheme = {
  key: "six",
  label: "Six living subspecies (genomes, 2018)",
  groups: ["bengal", "amur", "southchina", "indochinese", "malayan", "sumatran"].map((id) => ({ name: byId(id).name, members: [id] })),
  outside: ["caspian", "javan", "bali"],
  outsideWhy: "extinct, not among the six",
  keys: ["Liu2018"],
};

export const SCHEMES: readonly Scheme[] = [EIGHT, TWO, SIX];

/** Checks a scheme: every population is in exactly one group or left outside. */
export function checkScheme(s: Scheme): void {
  const seen = [...s.groups.flatMap((g) => g.members), ...s.outside];
  for (const id of seen) byId(id);
  if (new Set(seen).size !== seen.length) throw new Error(`${s.key}: a population is placed twice`);
  if (seen.length !== POPULATIONS.length) throw new Error(`${s.key}: a population is missing`);
}

/** The name of the group holding `id` in a scheme, or null when the scheme leaves it out. */
export function groupOf(s: Scheme, id: string): string | null {
  return s.groups.find((g) => g.members.includes(id))?.name ?? null;
}

// ---- The two-subspecies check ----

/** The two names to choose between, in the order shown. */
export const CHECK_GROUPS: readonly string[] = TWO.groups.map((g) => g.name.split(" (")[0]!);

/** The populations to sort: the living ones, in the order shown. */
export const CHECK_ITEMS: readonly string[] = LIVING;

/** The right pick for each check item: 0 is tigris, 1 is sondaica. */
export const CHECK_ANSWER: readonly number[] = CHECK_ITEMS.map((id) => TWO.groups.findIndex((g) => g.members.includes(id)));

/** Which picks were right, item by item (a missing pick is wrong). */
export function judgeSort(answer: readonly number[], picks: readonly (number | null)[]): boolean[] {
  return answer.map((a, i) => picks[i] === a);
}

export const CHECK_EXPLAIN =
  "Every mainland population went into *P. t. tigris*, the Malayan tiger too, though it lives closest to Sumatra. Only the Sumatran tiger, with the extinct Javan and Bali tigers, became *P. t. sondaica*. The task force found no support from body, genes and ecology for separate subspecies on the mainland, but did for a separate Sunda Islands tiger [@Kitchener2017].";

// ---- The threshold model: made-up differences ----

/**
 * A tree of the nine populations: a leaf is a population's id; a branch joins two parts at a
 * difference. The differences are made up, in made-up units. Only the pattern is taken from the
 * sources: the islands against the mainland is the biggest split, the one the 2017 revision kept
 * [@Kitchener2017]; Caspian and Amur are the closest pair, one base apart in 1,257 of
 * mitochondrial DNA [@Kitchener2017]; the island tigers share mitochondrial types
 * [@Kitchener2017]; the living groups are six [@Liu2018]. The order in which mainland groups branch is made up too.
 */
export type Tree = string | { readonly at: number; readonly parts: readonly [Tree, Tree] };

export const TREE: Tree = {
  at: 20,
  parts: [
    {
      at: 12,
      parts: [
        "bengal",
        {
          at: 10,
          parts: [
            { at: 2, parts: ["caspian", "amur"] },
            { at: 8, parts: ["southchina", { at: 6, parts: ["indochinese", "malayan"] }] },
          ],
        },
      ],
    },
    { at: 4, parts: ["sumatran", { at: 3, parts: ["javan", "bali"] }] },
  ],
};

/** The slider's range: from "every difference counts" to "none does". */
export const THRESHOLD_MIN = 1;
export const THRESHOLD_MAX = 21;

/** The leaves of a tree, left to right. */
export function leaves(t: Tree): string[] {
  return typeof t === "string" ? [t] : [...leaves(t.parts[0]), ...leaves(t.parts[1])];
}

/**
 * The groups when a difference of at least `threshold` counts as a subspecies: a branch at or
 * above the threshold splits, one below it stays one group. Left to right.
 */
export function groupsAt(t: Tree, threshold: number): string[][] {
  if (typeof t === "string") return [[t]];
  if (t.at < threshold) return [leaves(t)];
  return [...groupsAt(t.parts[0], threshold), ...groupsAt(t.parts[1], threshold)];
}

/** Every branch, with its difference and the leaves it joins (for drawing). */
export function branches(t: Tree): { at: number; left: string[]; right: string[] }[] {
  if (typeof t === "string") return [];
  return [{ at: t.at, left: leaves(t.parts[0]), right: leaves(t.parts[1]) }, ...branches(t.parts[0]), ...branches(t.parts[1])];
}

/** The threshold the sandbox starts at: every difference counts. */
export const THRESHOLD_START = THRESHOLD_MIN;

// ---- The steps ----

export const STEPS: readonly Step[] = [
  {
    view: "junu",
    text: [
      "Junu is five. In this story, a park team reads the DNA in a sample she left on a trail, and it places her among the Bengal tigers, like every tiger in Chitwan.",
      "But is \"Bengal tiger\" a kind of tiger, a **subspecies**, or just a place? Scientists have said there are eight kinds, then two, then six. This lesson is about why they disagree, and why each answer can be defended.",
    ],
  },
  {
    view: "populations",
    text: [
      "In lesson 1 you met the **species**, *Panthera tigris*. Inside a species, a **subspecies** is a population that lives apart from the others and is different enough to get a name of its own: a third word, as in *Panthera tigris tigris* [@Kitchener2017].",
      "Here are the tiger populations that have had names, roughly from west to east, then the islands. Three are extinct, and the South China tiger hasn't been seen in the wild since the 1970s [@Goodrich2022]. The question is where to draw the lines between them.",
    ],
  },
  {
    view: "eight",
    text: [
      "The older view, still in many books, has **eight subspecies**: Caspian, Bengal, Amur (or Siberian), South China, Indochinese, Sumatran, Javan and Bali [@Kitchener2017]. Each has its own third word, shown in the boxes.",
      "In 2004, a study of mitochondrial DNA and other genetic markers proposed a ninth, the Malayan tiger of the Malay Peninsula, and suggested at least five and possibly six living subspecies [@Luo2004]. The 2017 revision rejects its name, *jacksoni*, because it was published without a description, which the rules for naming animals require [@Kitchener2017].",
    ],
  },
  {
    view: "evidence",
    text: [
      "In 2017, a task force of the IUCN Cat Specialist Group checked every name against the evidence: the body (skulls, size, coat), genes, and where and how the tigers live [@Kitchener2017].",
      "Some lines did not hold. Skull traits once used to tell subspecies apart turned out to be shared or overlapping. The Caspian and Amur tigers differ by a single letter, one base, in 1,257 bases of mitochondrial DNA (Driscoll et al. 2009, as summarised in [@Kitchener2017]).",
    ],
  },
  {
    view: "check",
    text: [
      "The revision kept just two subspecies. They kept two of the old names: *P. t. tigris*, the old Bengal name, and *P. t. sondaica*, the old Javan name [@Kitchener2017].",
      "Your turn: put each living population into one of the two, then lock it in.",
    ],
  },
  {
    view: "two",
    text: [
      "**Mainland against islands.** Mainland tigers, *P. t. tigris*, are larger and paler with fewer stripes; Sunda Island tigers, *P. t. sondaica*, are smaller and darker with more stripes. The island tigers share mitochondrial types with no pattern by island, and may have been cut off from the mainland by rising seas in prehistory [@Kitchener2017].",
      "Not everyone on the task force agreed: two of its members, Luo and Driscoll, would keep the South China, Bengal and Indochinese tigers apart, recognise the Malayan tiger, and merge Amur with Caspian [@Kitchener2017]. And within the mainland group, northern tigers (Amur and Caspian) are still kept apart for conservation, for their distinct body and way of life [@Kitchener2017].",
    ],
  },
  {
    view: "six",
    text: [
      "In 2018, a study read the **whole genomes** of 32 tigers, far more DNA than any earlier study, and found six clear groups among living tigers: Bengal, Amur, South China, Indochinese, Malayan and Sumatran. Very few genes pass between them [@Liu2018].",
      "So the genomes draw six lines where the 2017 revision drew one. The Cat Specialist Group's page on the tiger says its taxonomy is under review [@CATSG].",
    ],
  },
  {
    view: "all",
    text: [
      "Who is right? Both answers fit their evidence. Every study sees differences between tiger populations; they disagree about **how big a difference counts** as a subspecies, and which kind. The 2017 revision asked for support from body, genes and ecology together; the 2018 study used the genome alone, but far more of it [@Kitchener2017; @Liu2018].",
      "This course uses the six names, because they are the populations you'll meet in conservation work, and it treats the two as the current formal classification. Either way, Junu belongs to the mainland group, and to the Bengal tigers within it.",
    ],
  },
  {
    view: "sandbox",
    text: [
      "The sandbox: a model of the nine populations, with a made-up difference between each pair of branches. Set how big a difference counts as a subspecies, and watch the populations merge into fewer groups or split into more.",
      "The numbers are made up. Only the pattern follows the sources: the islands against the mainland is the biggest split, Caspian and Amur are the closest pair, the island tigers differ little from each other [@Kitchener2017], and the living groups are six [@Liu2018]. Which mainland group branches off first is made up too. Find where the line gives two, where it gives six, and notice that the data alone don't choose for you.",
    ],
  },
];

/** Every source the lesson cites, in order of first appearance: the numbering on screen. */
export function lessonSources(): string[] {
  return [...new Set([...citedKeys([...STEPS.flatMap((s) => s.text), CHECK_EXPLAIN]), ...SCHEMES.flatMap((s) => s.keys)])];
}
