// Lesson 13, "The tiger in culture": its content (steps, the places the stories come from, the
// match-the-story check, and the culture map the sandbox opens). Pure data and functions;
// lesson13-view.ts draws them. Facts are in docs/research/culture.md. A belief is told as the
// people's own account, as the source reports it, never as a claim that it is true.

import { citedKeys } from "./cite.ts";

export const TITLE = "13. The tiger in culture";

/** What the live view shows at a step. */
export type View = "junu" | "check" | "china" | "rulers" | "durga" | "guardians" | "sumatra" | "symbols" | "books" | "project" | "tolerance" | "sandbox";

export interface Step {
  /** Paragraphs; `*x*` is italic, `**x**` a new term, `[@Key]` a citation. */
  readonly text: readonly string[];
  readonly view: View;
}

// ---- The places the stories come from ----

/** A place on the culture map: a whole region of the range map, with a mark where the story is from a smaller place. */
export interface Place {
  readonly id: string;
  readonly name: string;
  /** The range map's region it lies in. */
  readonly region: string;
  /** Where it is, roughly, when it is smaller than its region (a drawing aid, not a fact about tigers). */
  readonly at?: { readonly lon: number; readonly lat: number };
  /** The steps that tell its stories. */
  readonly views: readonly View[];
  /** How people there see the tiger. */
  readonly sees: string;
  /** What they do. */
  readonly does: string;
  /** What the studies read for this course found about tolerance there. */
  readonly tolerance: string;
}

const NO_STUDY = "No study of tolerance there was read for this course.";

export const PLACES: readonly Place[] = [
  {
    id: "china",
    name: "China",
    region: "chn",
    views: ["china", "rulers"],
    sees: "The king of wild beasts, for the mark on its forehead like the character 王, \"king\". The white tiger is one of the four animals that guard the directions: the west, and the element metal, which stands for power. Since lions took over as guardians of palaces and temples, the tiger has been the protector of ordinary people [@Welch2016].",
    does: "The white tiger was painted on the sides of coffins to guard the dead. On the fifth day of the fifth month, thought the most dangerous of the year, court insignia showed the tiger fending off the \"Five Poisonous Creatures\". Qing emperors had themselves painted hunting tigers [@Welch2016].",
    tolerance: NO_STUDY,
  },
  {
    id: "korea",
    name: "Korea",
    region: "kor",
    views: ["rulers"],
    sees: "A royal treasure: in the Joseon dynasty (1392–1897), tiger and leopard skins were tribute to the court and gifts between states [@ElvesPowell2024].",
    does: "Under Japanese rule, tigers were targeted by carnivore-control programmes and trophy hunters, and were gone from the southern half of the peninsula by 1924 [@ElvesPowell2024].",
    tolerance: NO_STUDY,
  },
  {
    id: "india",
    name: "India: Durga and the temples",
    region: "ind",
    views: ["durga"],
    sees: "The goddess Durga, who slays the buffalo demon, rides a great cat, often a tiger; texts call it sometimes a lion, sometimes a tiger, and lions and tigers both stood for divine energy [@PMA101270; @CMA1960].",
    does: "Friezes of elephants, lions and tigers decorate many of India's oldest temples, among them the caves of Ajanta, Ellora and Elephanta [@Welch2016].",
    tolerance: NO_STUDY,
  },
  {
    id: "warli",
    name: "The Warli, Maharashtra",
    region: "ind",
    at: { lon: 73.2, lat: 19.6 },
    views: ["guardians"],
    sees: "Tigers and leopards alike are forms of Waghoba, a big-cat god. If people keep the rituals, Waghoba protects them from the harm of living beside big cats; an attack means the people broke their side of the bargain, not that the animal is to blame [@Nair2021].",
    does: "They worship Waghoba at about 150 shrines in one study area, and hold a yearly festival, Waghbaras [@Nair2021].",
    tolerance: "The study proposes the Warli's relationship with Waghoba as one reason people and big cats share the land there [@Nair2021].",
  },
  {
    id: "sundarbans",
    name: "The Sundarbans",
    region: "bgd",
    at: { lon: 89.2, lat: 21.9 },
    views: ["guardians"],
    sees: "Bonbibi, \"woman of the forest\", is a protector sent to save people from tigers [@Nair2021].",
    does: "Muslims and Hindus alike worship her [@Nair2021].",
    tolerance: NO_STUDY,
  },
  {
    id: "dibang",
    name: "Dibang Valley, north-east India",
    region: "ind",
    at: { lon: 95.7, lat: 28.7 },
    views: ["guardians"],
    sees: "Tigers and people are brothers [@Nair2021].",
    does: "Taboos about the harm of killing a tiger shape how people live with them [@Nair2021].",
    tolerance: "The belief and its taboos shape how people there live with tigers [@Nair2021].",
  },
  {
    id: "mysore",
    name: "Mysore, southern India",
    region: "ind",
    at: { lon: 76.6, lat: 12.3 },
    views: ["symbols"],
    sees: "A ruler's emblem: Tipu Sultan, ruler of Mysore from 1782 to 1799, put tigers on his weapons, uniforms and throne [@Welch2016].",
    does: "His life-size mechanical tiger attacking a European soldier, said to express his hatred of British rule, is in the Victoria and Albert Museum, London [@Welch2016].",
    tolerance: NO_STUDY,
  },
  {
    id: "sumatra",
    name: "Kerinci Seblat, Sumatra",
    region: "sumatra",
    at: { lon: 101.5, lat: -2.0 },
    views: ["sumatra", "tolerance"],
    sees: "The Kerinci and Minangkabau peoples have lost kin to tigers for centuries, yet hold that ancestral souls live in tigers, which guard customary law; some believe people can become **were-tigers**. A death caused by a tiger can be seen as punishment for a broken moral code [@Struebig2018; @Nair2021].",
    does: "Islam, which forbids eating animals that hunt with claws, has also been linked to tolerance there [@Struebig2018].",
    tolerance: "Of 2,386 villagers surveyed, 28% wanted fewer tigers or none, 48% the same number and 19% more. Those who saw tigers as important to their spiritual well-being were more likely to want more, across ethnic groups, not only in some [@Struebig2018].",
  },
  {
    id: "thailand",
    name: "Thailand",
    region: "tha",
    views: ["symbols"],
    sees: "A spiritual protector: statues of tigers guard Buddhist temples [@Welch2016].",
    does: "Tiger tattoos are worn as talismans. Some \"tiger temples\" bred tigers and sold their parts [@Welch2016; @Wong2019].",
    tolerance: NO_STUDY,
  },
  {
    id: "singapore",
    name: "Singapore",
    region: "sgp",
    views: ["symbols"],
    sees: "A danger, then a brand. In the 19th century tigers were common enough that the government paid a bounty for each one killed [@Welch2016].",
    does: "The last wild tiger on the island was reportedly shot in October 1930. Tiger Balm, and Tiger Beer from 1932, made the animal a trademark [@Welch2016].",
    tolerance: NO_STUDY,
  },
];

export const placeById = (id: string): Place => {
  const p = PLACES.find((x) => x.id === id);
  if (!p) throw new Error(`no place "${id}"`);
  return p;
};

/** The places a step tells, in the list's order. */
export const placesOf = (view: View): Place[] => PLACES.filter((p) => p.views.includes(view));

/** Chitwan, Junu's home, as lesson 9 places it. */
export const CHITWAN = { lon: 84.4, lat: 27.5 } as const;

/** The part of the range map the lesson shows, in map units: about 60–135° E and 8° S–50° N. */
export const CROP = [280, 74, 600, 536] as const;

// ---- The check: match each story to its place ----

/** The places the learner chooses from: one more than the stories, so the last can't be found by elimination. */
export const CHECK_PLACES: readonly string[] = ["china", "korea", "mysore", "sundarbans", "sumatra", "thailand"];

export interface Story {
  readonly text: string;
  /** The place it comes from: an id in CHECK_PLACES. */
  readonly answer: string;
}

/** Told in the learner's words, with no place name in them; the step that tells each comes after the check. */
export const STORIES: readonly Story[] = [
  { text: "A white tiger guards the west, painted on the sides of coffins to protect the dead.", answer: "china" },
  { text: "A ruler's life-size mechanical tiger mauls a European soldier.", answer: "mysore" },
  { text: "\"Woman of the forest\", worshipped by Muslims and Hindus alike, protects people from tigers.", answer: "sundarbans" },
  { text: "Ancestral souls live in tigers, which guard the customary law.", answer: "sumatra" },
  { text: "Tiger skins were tribute to a royal court, until the tigers were hunted out by 1924.", answer: "korea" },
];

/** Which picks were right, story by story (a missing pick is wrong). */
export function judgeMatch(picks: readonly (string | null)[]): boolean[] {
  return STORIES.map((s, i) => picks[i] === s.answer);
}

export const CHECK_QUESTION = "Where does each story come from? Pick a place for each, then lock it in. One place is left over.";

export const CHECK_EXPLAIN =
  "The white tiger is one of China's four directional animals [@Welch2016]. Tipu Sultan, ruler of Mysore, had the mechanical tiger made [@Welch2016]. Bonbibi protects people in the Sundarbans [@Nair2021]. The Kerinci and Minangkabau of Sumatra hold that ancestors live in tigers [@Struebig2018]. Korea's Joseon court took skins as tribute [@ElvesPowell2024]. Thailand has its own tigers in culture, as the next steps show [@Welch2016].";

// ---- Tolerance around Kerinci Seblat, as bars ----

export interface Bar {
  readonly label: string;
  readonly value: number;
  readonly note: string;
  readonly bright?: boolean;
}

/** What 2,386 villagers wanted, in percent; the rest didn't fall in these three answers. */
export const WANT: readonly Bar[] = [
  { label: "Fewer tigers, or none", value: 28, note: "28%" },
  { label: "The same number", value: 48, note: "48%", bright: true },
  { label: "More tigers", value: 19, note: "19%" },
];

// ---- The books ----

export interface Quote {
  readonly work: string;
  readonly lines: readonly string[];
  readonly note: string;
  readonly key: string;
}

/** Quoted from the editions read (Project Gutenberg); no publication dates, as none was confirmed from a source. */
export const QUOTES: readonly Quote[] = [
  {
    work: "William Blake, \"The Tyger\"",
    lines: ["Tiger, tiger, burning bright", "In the forests of the night,", "What immortal hand or eye", "Could frame thy fearful symmetry?"],
    note: "Blake's own printed page titles it \"The Tyger\"; the 1901 edition read prints \"Tiger\" in the poem.",
    key: "Blake",
  },
  {
    work: "Rudyard Kipling, The Jungle Book",
    lines: ["\"He has been lame in one foot from his birth. That is why he has only killed cattle.\""],
    note: "Mother Wolf, on Shere Khan, the tiger who lived near the Waingunga River.",
    key: "Kipling",
  },
];

// ---- The steps ----

export const STEPS: readonly Step[] = [
  {
    view: "junu",
    text: [
      "Junu is ten. Beyond the buffer zone, in the villages, people have their own ways of living beside her, and their own stories about tigers.",
      "This lesson travels across Asia, and beyond, to see what people have made of the tiger: gods and guardians, symbols of kings, characters in books, and the emblem of a nation's cause. Where a belief is described, it is the people's own account as the source reports it, not a claim that it is true.",
    ],
  },
  {
    view: "check",
    text: ["Before the stories are told: guess where each comes from, then lock it in."],
  },
  {
    view: "china",
    text: [
      "In China, the tiger is the **king of wild beasts**: the markings on its forehead look like the character 王, \"king\" [@Welch2016].",
      "The white tiger is one of the **four directional animals**, creatures that guard the four directions. It is the west, and stands for the element metal, which equates with power. It was painted on the sides of coffins to protect the dead and keep them oriented in the afterlife [@Welch2016].",
      "When lions arrived from Central Asia, around the first century AD with Buddhism, they took over as guardians of palaces and temples; tigers became **protectors of ordinary people**. On the fifth day of the fifth month, thought the most dangerous day of the year, court insignia showed the tiger fending off the \"Five Poisonous Creatures\" [@Welch2016].",
    ],
  },
  {
    view: "rulers",
    text: [
      "Rulers took the tiger's power for themselves. The Qing emperors Yongzheng and Qianlong had themselves painted hunting tigers [@Welch2016]. Buddhist art in China and Japan often shows a calm tiger beside a monk, a picture of a wild force subdued [@Welch2016].",
      "In Korea, under the Joseon dynasty (1392–1897), tiger and leopard skins were tribute to the royal court and gifts between states. Under Japanese rule, carnivore-control programmes and trophy hunters targeted tigers, and by 1924 they were gone from the southern half of the peninsula [@ElvesPowell2024].",
    ],
  },
  {
    view: "durga",
    text: [
      "In Hinduism, a god's **vahana** is the animal it rides. The goddess **Durga**, who slays the buffalo demon, rides a great cat [@PMA101270; @CMA1960].",
      "Is it a lion or a tiger? Ancient texts call it sometimes one, sometimes the other, sometimes an imaginary creature, and paintings can mix the two. Lions and tigers both stood for **shakti**, divine creative energy, so artists could give Durga either; painters in the western Himalayan foothills showed a tiger [@PMA101270; @CMA1960]. Museums describe the same goddess both ways, so this course says: a great cat, often a tiger.",
      "Friezes of elephants, lions and tigers decorate many of India's oldest temples, among them the caves of Ajanta, Ellora and Elephanta [@Welch2016].",
    ],
  },
  {
    view: "guardians",
    text: [
      "Where people live beside tigers, gods can be guardians. The **Warli**, an Indigenous people of Maharashtra, worship **Waghoba**, a big-cat god, at about 150 shrines in one study area. Tigers and leopards alike are forms of Waghoba. If people keep the rituals, above all the yearly festival of Waghbaras, Waghoba protects them; an attack means the people broke their side of the bargain, not that the animal is to blame [@Nair2021].",
      "In the **Sundarbans**, the mangrove forest of India and Bangladesh, **Bonbibi**, \"woman of the forest\", is worshipped by Muslims and Hindus alike, a protector sent to save people from tigers [@Nair2021].",
      "In the Dibang Valley of north-east India, people hold that tigers and people are brothers, and taboos about the harm of killing a tiger shape how they live together [@Nair2021].",
    ],
  },
  {
    view: "sumatra",
    text: [
      "On Sumatra, the Kerinci and Minangkabau peoples have lost kin to tigers for centuries. Yet they hold that ancestral souls live in tigers, which guard the customary law, and some believe people can become **were-tigers**, people who turn into tigers [@Struebig2018].",
      "A death caused by a tiger can be seen as punishment for a broken moral code, not only the tiger's doing [@Nair2021]. Islam, which forbids eating animals that hunt with claws, has also been linked to tolerance there [@Struebig2018].",
    ],
  },
  {
    view: "symbols",
    text: [
      "The tiger as emblem. **Tipu Sultan**, ruler of Mysore from 1782 to 1799, put tigers on his weapons, uniforms and throne. His life-size mechanical toy of a tiger attacking a European soldier, said to express his hatred of British rule, is now in the Victoria and Albert Museum, London [@Welch2016].",
      "In Thailand, tiger tattoos are worn as talismans, and statues of tigers guard Buddhist temples [@Welch2016]. Across the range, claws and canines are worn as charms against harm, tigers included; lesson 12 showed what that demand costs [@Goodrich2022].",
      "In 19th-century Singapore, tigers were common enough that the government paid a bounty for each one killed; the last wild tiger on the island was reportedly shot in October 1930. Tiger Balm, and Tiger Beer from 1932, made the animal a brand [@Welch2016].",
    ],
  },
  {
    view: "books",
    text: [
      "In English, two tigers stand out. William Blake's poem \"The Tyger\" asks what maker could \"frame thy fearful symmetry\", and \"Did He who made the lamb make thee?\" [@Blake].",
      "In Rudyard Kipling's *The Jungle Book*, the tiger **Shere Khan** has been lame in one foot from birth, \"that is why he has only killed cattle\". The wolves resent him: he has moved to their part of the jungle and will make their villagers angry too, and the villagers will \"scour the jungle for him\" and set the grass alight [@Kipling].",
      "The lame tiger echoes what lesson 11 showed from field studies: many tigers that attack people are old, injured or deformed.",
    ],
  },
  {
    view: "project",
    text: [
      "In April 1973, India launched **Project Tiger**, to keep a viable tiger population \"for scientific, economic, aesthetic, cultural and ecological values\" and to preserve areas of biological importance as national heritage. It still funds India's tiger reserves [@NTCAProjectTiger].",
      "Conservation calls tigers **flagship species** and cultural icons: animals people care about, used to win support for protecting whole forests and everything in them [@Struebig2018].",
    ],
  },
  {
    view: "tolerance",
    text: [
      "Can belief help tigers? Around Kerinci Seblat in Sumatra, a survey asked 2,386 villagers how many tigers they wanted. People who saw tigers as important to their spiritual well-being were more likely to want more [@Struebig2018].",
      "Anthropologists had tied tolerance of tigers to the beliefs of particular peoples. The survey found that spiritual beliefs mattered across ethnic groups, not only in some: what predicted tolerance was attitudes, emotions, social norms and beliefs, not ethnicity [@Struebig2018]. That is one landscape; the Warli's Waghoba is proposed as one reason people and big cats share land in Maharashtra [@Nair2021].",
    ],
  },
  {
    view: "sandbox",
    text: [
      "The sandbox: a culture map. Pick a place to see how people there see the tiger, what they do, and what the studies read for this course found about tolerance there.",
      "Notice how few places have a study of tolerance at all. Stories are easy to collect; measuring whether they change how people treat tigers is much harder.",
    ],
  },
];

/** Every source the lesson cites, in order of first appearance: the numbering on screen. */
export function lessonSources(): string[] {
  return [
    ...new Set([
      ...citedKeys([...STEPS.flatMap((s) => s.text), CHECK_EXPLAIN, ...PLACES.flatMap((p) => [p.sees, p.does, p.tolerance])]),
      ...QUOTES.map((q) => q.key),
    ]),
  ];
}
