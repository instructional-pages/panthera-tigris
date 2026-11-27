# Lessons

The course outline, written from the approved research dossier (`docs/research/`). **Status:
approved by the owner on 2026-11-27.** Built so far: lessons 1 to 9.

## How every lesson works

- Short text steps beside a live view, advanced with Back and Next.
- It teaches every term it uses (the learner is a curious adult with no biology background), with
  the picture first and the number beside it.
- It ends in a **sandbox**: a live model of what the lesson just taught, driven by the learner.
- Then a **hands-on check**: the learner commits to an answer (drags, orders, sets a slider),
  then sees the answer and why. No score.
- Every fact on screen links to its source in the dossier. Where the dossier records a
  disagreement, the lesson shows it rather than picking silently.

## The running tiger: Junu

One tiger runs through the course and ages with it. **Junu** is a female Bengal tiger born in
Chitwan National Park, in the lowlands of southern Nepal. She is **fictional, and the site says
so**: a composite whose every life event is a typical one reported by the studies in the dossier.
Chitwan is chosen because the dossier's best long-term field studies come from there (scent
marking, dispersal, density, attacks on people) [behaviour, life-cycle, ecology, people]. A female
is chosen because daughters stay near home, so Junu can stay in one place and still live the
whole life cycle; her brother shows the male path.

Each lesson opens with Junu at her age for that lesson, and the "Junu" line below is that beat.

## The lessons

### 1. What is a tiger?

- **Teaches:** how scientists name and group living things (species, genus, family, subspecies);
  *Panthera tigris* in the cat family and the big-cat genus; its closest relative, probably the
  snow leopard, and why one popular source says the lion.
- **Junu:** newborn, one of a litter of three in a den. What is she?
- **Live view:** a family tree of the big cats that the learner opens branch by branch.
- **Sandbox:** sort cats into the tree by the traits shown; see which trait groupings the
  molecular evidence supports and which it doesn't.
- **Check:** place the tiger and the snow leopard on the tree before the answer is shown.
  *Built:* the check comes before the sandbox here, because sorting cats in the sandbox would
  give the answer away (see `DECISIONS.md`).
- **Research:** [taxonomy](research/taxonomy.md).

### 2. Two and a half million years of tigers

- **Teaches:** deep time (Mya, kya, the Pleistocene); the Longdan skull, the oldest member of the
  tiger's line; the trend to larger size; mitochondrial DNA and the common ancestor of living
  tigers about 100,000 years ago, after a bottleneck; Toba as a hypothesis, not a proven cause.
- **Junu:** two months old, starting to travel with her mother.
- **Live view:** a time line from 10.8 Mya to today, with fossils and the bottleneck on it.
- **Sandbox:** a family-line model: pick a population size, run generations, watch maternal lines
  die out until all survivors share one ancestor; a bottleneck makes it happen fast.
- **Check:** set a slider to when the last common ancestor of living tigers lived.
  *Built:* the check comes once mtDNA is taught and before the time line shows the date, so
  the steps after it reveal the bottleneck and Toba; the sandbox ends the lesson (see
  `DECISIONS.md`).
- **Research:** [evolution](research/evolution.md).

### 3. The body: size, coat, stripes

- **Teaches:** size range and how it varies by region and sex; the coat and why no two stripe
  patterns are the same; how researchers tell tigers apart from camera photos; white and "black"
  tigers, recessive genes, and why an isolated population (Similipal) shows one variant.
- **Junu:** six months old; her stripe pattern is already hers alone.
- **Live view:** a drawn tiger beside a person, scaled by region and sex.
- **Sandbox:** a genetics model: choose two parents' genes for white or pseudomelanistic coat and
  breed litters; then shrink and isolate a population and watch a rare gene drift to common.
- **Check:** match stripe patterns (drawn side views) to individual tigers.
  *Built:* the check comes once unique stripes and camera traps are taught, before the coat
  variants; the two sandboxes end the lesson. The size view draws only the sources' maxima
  (Amur male, Sumatran), since neither gives figures for females; sex is told in words (see
  `DECISIONS.md`).
- **Research:** [body](research/body.md).

### 4. Voice and senses

- **Teaches:** sound and pitch (Hz); the roar at about 158 Hz and the fat in the vocal folds;
  the cochlea and why the tiger's long one suits low sounds; scent marks as long-lasting chemical
  messages; pupil shape and hunting style.
- **Junu:** a year old, answering her mother's call in tall grass.
- **Live view:** the roar's pitch range on a sound scale beside human speech; the uncoiled
  cochleas of a house cat, a person and a tiger to scale.
- **Sandbox:** the pupil model from 214 species: set an animal's height and hunting style and
  see which pupil shape the data predicts, then place the tiger.
- **Check:** predict whether a tiger's ear is tuned more like a house cat's or a person's.
- **Gap before building:** the dossier has no source yet on tiger colour vision, night vision,
  whiskers or the tiger's own pupil shape. The brief's "change the light to compare tiger and prey
  vision" sandbox needs Fennell et al. 2019 read first; until then, this lesson uses only what is
  sourced.
  *Built:* the gap is left out, not filled: colour vision, night vision and whiskers are not
  taught, and the sandbox gives the tiger's predicted pupil but not its own (see `DECISIONS.md`).
  Human speech on the pitch scale is drawn at two sources' averages; the check comes before the
  answer's step.
- **Research:** [senses](research/senses.md), [body](research/body.md) (voice).

### 5. Hunting

- **Teaches:** ambush hunting; ungulates; preferred prey (wild boar, sambar) and the 60–250 kg
  rule; how GPS clusters find kills; about one kill a week (every 6.5 days in Amur tigers), and
  how prey size and season change it.
- **Junu:** eighteen months, hunting beside her mother.
- **Live view:** prey animals laid out by body mass, with the preferred band shaded.
- **Sandbox:** a kill-rate model: choose the prey a tiger catches and the season, and see the days
  between kills and the meat eaten per day.
- **Check:** put the steps of a hunt in order (wait or stalk, pounce, pull down, neck bite); set a
  slider to the days between kills.
- **Gap before building:** hunting success rate, teeth, claws and bite force are unsourced; they
  stay out until read.
  *Built:* the gap is left out, not filled. The prey view draws Chitwan's prey at the weights of a
  Chitwan scat study, which also shows "eaten most" against "preferred". The order check comes
  before the hunt's steps are told and the slider before the kill rate; the sandbox shows one of
  the study's own averages at a time (season, or size of the last kill), never the two combined
  (see `DECISIONS.md`).
- **Research:** [hunting](research/hunting.md).

### 6. A territory of her own

- **Teaches:** home range and territory; a solitary life that stays in touch; the five ways
  tigers mark; why marks cluster at edges and path crossings; females sharing a boundary at
  different times.
- **Junu:** two years old, she leaves her mother and settles next door, as most daughters do; her
  mother shifts over and hands her part of the old range.
- **Live view:** a map of neighbouring ranges with marks on it.
- **Sandbox:** walk a tiger through the map; marks build up at edges and crossings, and the
  "odour field" shows where a meeting is likely.
- **Check:** drop scent marks where a tiger would mark most, then compare with the field data.
  *Built:* the map is a drawn grid (Junu between her mother and a neighbouring female, a male's
  range over two of them, three travel routes), labelled a drawing. The check comes before the
  edge pattern is told; the reveal shades her edges and the crossings. The sandbox's marking
  chances are made up to follow the study's pattern, and say so (see `DECISIONS.md`).
- **Research:** [behaviour](research/behaviour.md).

### 7. A life: mating, cubs, leaving home

- **Teaches:** maturity, heat and induced ovulation; about 100 days of pregnancy and litters of
  2–4; growing up in steps (hunting with mother, semi-independent, dispersal at about 1.5–2.5
  years); daughters stay close, sons go far; about half the cubs die before two.
- **Junu:** about four, her first litter; looking back, her brother left far and struggled.
- **Live view:** a life-stage time line with Junu's and her brother's paths on a map.
- **Sandbox:** a cohort model: follow a set of cubs through the stages with the survival figures,
  and compare daughters' and sons' fates.
- **Check:** order the life stages; set a slider to how many of ten cubs reach two years.
  *Built:* the gap is filled from Kerley et al. 2003 (abstract) and the Cat Specialist Group's
  Chitwan figures; Smith & McDougal 1991 could not be reached. The slider asks about two years in
  Chitwan (34% and 17% yearly deaths give about 5.5 of 10). Each check comes before its answer is
  told. The map is a drawing; the sandbox's chances are the studies', and half daughters, half
  sons is a model setting (see `DECISIONS.md`).
- **Research:** [life-cycle](research/life-cycle.md).

### 8. How many kinds of tiger?

- **Teaches:** how scientists draw lines inside a species; the older eight subspecies; the 2017
  IUCN revision (two); whole genomes (six living); why both are defensible; the extinct island
  and Caspian tigers.
- **Junu:** five, part of the mainland group on either view; a scat sample places her in the
  Bengal population.
- **Live view:** the same tigers grouped three ways (eight, two, six).
- **Sandbox:** set the threshold of difference that counts as "a subspecies" and watch the
  populations merge and split.
- **Check:** put each living population in the two-subspecies scheme.
  *Built:* the live view is a row of the nine named populations with each scheme's groups drawn
  under it (the Malayan tiger has no name in the eight). The check comes before the two are
  shown or told. Liu et al. 2018 is still read as an abstract only, so the sandbox's tree is a
  model with made-up differences, ordered to match the sources, and says so (see `DECISIONS.md`).
- **Research:** [taxonomy](research/taxonomy.md), [evolution](research/evolution.md).

### 9. Where tigers live

- **Teaches:** range, extant and extirpated; the indigenous range from Turkey to Bali; the
  century of losses; the three layers of why (habitat gone, unusable, emptied by killing); the
  63 landscapes left, about 8% of the old range; restoration landscapes.
- **Junu:** six, in one of the 63 landscapes; Chitwan's tigers can reach India's next door.
- **Live view:** a range map (redrawn from the CC BY habitat study, credited).
- **Sandbox:** a time slider from 1900 to 2020 that empties the map decade by decade, with a toggle
  for the three layers of loss.
- **Check:** drag the ten countries with breeding tigers onto the map.
  *Built:* the check (pick the ten places on the map, then Lock in) comes right after the old
  range is shown and before any loss is told. Whole countries are shaded, as a sketch; places
  the sources don't date, or disagree about (Java), are hatched. The layers toggle sets the 2020
  shares of the old range beside the map, since the layers are measured only for 2020. Junu's
  line drops "Chitwan's tigers can reach India's next door": no source read says so (see
  `DECISIONS.md`).
- **Research:** [range](research/range.md).

### 10. Prey, rivals and the forest

- **Teaches:** habitat generalists that need large prey; tiger density and how prey sets it;
  home ranges from 20 km² to 400 km²; tigers, leopards and dholes sharing or splitting the forest
  depending on prey.
- **Junu:** seven; a leopard uses her range at night when she is elsewhere.
- **Live view:** tiger density across sites, from Kaziranga to Sikhote-Alin.
- **Sandbox:** a prey slider that sets how many tigers an area holds and how big each range is,
  and whether leopards share the area or move off.
- **Check:** given a prey density, set a slider to the number of tigers in 100 km².
- **Gap before building:** the prey-to-tiger model's equation from Karanth et al. 2004 must be read
  so the sandbox uses the published fit, not a guess.
- **Research:** [ecology](research/ecology.md).

### 11. Tigers and people

- **Teaches:** human–tiger conflict; why it rises as tigers recover; where and when attacks
  happen (forest, buffer zones, by day, people alone); which tigers attack (old, injured,
  dispersing); livestock; retaliation; tolerance; what reduces conflict. Factual, never graphic.
- **Junu:** eight; her range meets the buffer zone, where villagers cut grass.
- **Live view:** a buffer-zone map with forest edge, villages and paths.
- **Sandbox:** a risk model built from the Nepal studies: change group size, distance from the
  forest edge and season, and see how the relative risk moves (directions only where the studies
  give no number).
- **Check:** predict which of two situations carried more risk, then see the study's figures.
- **Research:** [people](research/people.md).

### 12. The trade in tiger parts

- **Teaches:** what drives demand (medicine, status, belief, meat); CITES and Appendix I; weak
  penalties; what seizures show; the argument over tiger farms and the evidence against it;
  South Korea's ban that worked. Factual, never graphic.
- **Junu:** nine; rangers remove a snare set for deer near her range.
- **Live view:** the chain from poacher to buyer with the price at each step.
- **Sandbox:** seizure data from 2000 to 2018 by year, country and part, filtered by the learner.
- **Check:** set a slider to the poacher's share of the final price.
- **Research:** [trade](research/trade.md).

### 13. The tiger in culture

- **Teaches:** king of beasts and the white tiger of the west; tigers as protectors of ordinary
  people; Durga's mount; Waghoba and Bonbibi; Sumatran beliefs; Tipu's Tiger; Blake and Kipling;
  Project Tiger and the tiger as flagship; how belief can support tolerance.
- **Junu:** ten; the villagers beyond the buffer zone have their own ways of living beside her.
- **Live view:** a map of Asia with the stories placed where they come from.
- **Sandbox:** a culture map: pick a place and see how people there see the tiger, what they do,
  and what the studies found about tolerance there.
- **Check:** match each image or story to the place it comes from.
- **Gap before building:** confirm the Blake and Kipling dates and spelling from the editions read;
  self-drawn or openly licensed images only.
- **Research:** [culture](research/culture.md).

### 14. Counting tigers, and saving them

- **Teaches:** the Red List and "Endangered"; capture–recapture by stripes; 3,726–5,578 wild
  tigers; India's and Nepal's rises and South-East Asia's losses; why a higher count is not always
  more tigers; the threats in order; why tigers can't absorb much killing (the 15% line); the
  2010 goal to double numbers; protection, corridors, reintroduction.
- **Junu:** twelve, an old tigress; the national count photographs her stripes; her daughter now
  holds part of her territory.
- **Live view:** India's and Nepal's counts over time beside the global trend.
- **Sandbox:** two models: a camera-trap survey (place cameras, run sessions, estimate the
  population from recaptures); and a population model where the learner sets yearly deaths and
  prey and sees whether it recovers.
- **Check:** estimate a population from a capture–recapture result; predict whether a
  population at a given death rate recovers.
- **Research:** [conservation](research/conservation.md), [body](research/body.md) (stripes).

### 15. Final quiz

Mixed hands-on tasks from every lesson, each answered first, then revealed and explained, with a
link back to the lesson. No score. Planned tasks: drag populations and the old range onto a map;
match stripe patterns to individuals; order the steps of a hunt and the stages of a life; set
estimate sliders (days between kills, tigers per 100 km², the share of the old range left).

## Shared pieces

Built once, used by several lessons: the step navigation (done), a stripe renderer (lessons 3, 14,
15; done), the range map (9, 13, 14, 15; done), the ordering task (5, 7, 15; done) and the estimate slider (2, 5, 7, 10,
12, 14, 15; done). Each can be tried in the dev-only gallery, `dev/pieces.html`.

## Before building

- The gaps named under lessons 3, 4, 5, 7, 10 and 13 are researched (or the content dropped)
  before that lesson is built.
- The dossier's other **Open** items stay off the site until read.
