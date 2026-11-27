# Decisions

Dated question, choice and why, newest last. Entries from 2026-11-15 come from the backlog brief.

## 2026-11-15: Name
- **Question:** What is the repo called?
- **Choice:** `panthera-tigris`, the tiger's scientific name.
- **Why:** The user asked for it.

## 2026-11-15: Format
- **Question:** One page or a course?
- **Choice:** A multi-lesson course that goes deep: everything known about the tiger.
- **Why:** The goal is depth, not a summary.

## 2026-11-15: Learner
- **Question:** Who is the course for?
- **Choice:** A curious adult with no biology background. Every term is taught.
- **Why:** The org rules require one stated learner. This learner gives the widest reach without losing depth.

## 2026-11-15: Breadth
- **Question:** Science only, or culture too?
- **Choice:** Both. All the biology and ecology, plus tigers in history, myth and art, and the trade in tiger parts.
- **Why:** "Everything known about a tiger" covers both.

## 2026-11-15: Research first
- **Question:** What comes before the build?
- **Choice:** Claude writes a cited research dossier in `docs/research/`, one file per topic. Every claim cites a source (IUCN, peer-reviewed papers) and disagreements between sources are recorded. The user reviews the dossier before the lesson outline.
- **Why:** Every fact on the site must trace back to a source (success criterion, policy limit 1).

## 2026-11-15: Lesson order
- **Question:** Order the lessons by topic, or by a story?
- **Choice:** By topic, from the body outward. One named tiger is the running example in every lesson and ages as the course goes on.
- **Why:** The topic order builds knowledge step by step, and the running tiger ties the lessons together.

## 2026-11-15: Sandboxes
- **Question:** What does each lesson's closing sandbox contain?
- **Choice:** A live model in every lesson, for example light and vision, territory or prey and population.
- **Why:** The org rule is a guided path then a sandbox, and a live model teaches cause and effect.

## 2026-11-15: Quizzes
- **Question:** Where do quizzes go, what are they like, and are they scored?
- **Choice:** A short check at the end of each lesson, plus a final mixed quiz. All are hands-on tasks (drag ranges onto a map, match stripes to tigers, order a hunt, estimate with a slider). The learner answers first, then the answer is revealed and explained. No score.
- **Why:** The user wanted quizzes that are "not just questions and answers", and the org forbids scores.

## 2026-11-15: Visuals
- **Question:** Photos or drawings?
- **Choice:** Self-made SVG and Canvas diagrams do the teaching, plus a few openly licensed photos, bundled and credited.
- **Why:** Open-licensed tiger images are limited, diagrams teach better, and this avoids IP risk.

## 2026-11-15: Length
- **Question:** How long is the course?
- **Choice:** No cap. The dossier decides how many lessons there are. The lesson list goes in `docs/LESSONS.md` and the user approves it before any lesson is built.
- **Why:** Depth comes first, and the org rules require an approved outline.

## 2026-11-15: Stack, look, hosting
- **Question:** Which stack, look and hosting?
- **Choice:** The instructional-pages defaults (TypeScript, Vite, plain DOM, Canvas/SVG; the dark look; GitHub Pages deployed from this machine).
- **Why:** The courses are siblings and should feel the same.

## 2026-11-26: Repo visibility at creation
- **Question:** Should the repo be public from the first commit (org rule) or private?
- **Choice:** Private for now. Making it public waits for the user's go-ahead and an audit of everything that would become visible. *Decided by Claude; approved by the owner on 2026-11-27.*
- **Why:** The permission check refused to create a public repo without the user's approval. Making a repo public can't be undone, so the user should make that call.

## 2026-11-26: Credit for AI-assisted content
- **Question:** How is Claude's part in the research and writing shown?
- **Choice:** The site and README will say the course was researched and written with Claude (AI), and the user reviews it. *Decided by Claude; approved by the owner on 2026-11-27.*
- **Why:** On re-checking the Usage Policy (effective 2026-11-12), it asks that AI-assisted work presented for others to rely on is properly attributed.

## 2026-11-26: How the dossier cites and weighs sources
- **Question:** How are claims tied to sources, and which sources count?
- **Choice:** Every claim cites `[@Key]` entries in `docs/research/sources.md`, checked by `.local-ci`. Sources are ranked: peer-reviewed full text, then IUCN work, then abstracts, then institutional pages; press and encyclopedias are only for finding sources. Each entry records how it was read. Disagreements are recorded with each position and the course's proposed choice. *Decided by Claude; approved by the owner on 2026-11-27.*
- **Why:** The success criterion is that every fact traces to a source; a machine check keeps citations from breaking, and the read-level tells a reviewer how much weight a claim can carry.

## 2026-11-26: Which subspecies taxonomy the course teaches
- **Question:** IUCN's 2017 revision recognises two subspecies; a 2018 whole-genome study finds six living ones. Which does the course use?
- **Choice:** Teach the disagreement. Name the six living populations (the units conservation is organised around) and present the two-subspecies view as IUCN's current formal classification, now under review, with the evidence for each. *Decided by Claude; approved by the owner on 2026-11-27.*
- **Why:** Neither view is settled, and how scientists draw the line is itself worth understanding.

## 2026-11-27: Bundle budget
- **Question:** What gzipped size budget does `.local-ci` enforce?
- **Choice:** 60 kB gzipped for the whole built site (HTML, JS, CSS and any bundled asset), measured by `scripts/check_bundle.py`. The skeleton is about 2 kB. Bundled photos will likely need the budget raised in its own decision when they arrive. *Decided by Claude; approved by the owner on 2026-11-27.*
- **Why:** A whole-download budget catches heavy assets, not just code; 60 kB leaves room for many lessons of plain DOM, Canvas and SVG while staying small.

## 2026-11-27: A Content-Security-Policy on the page
- **Question:** How is "no third-party requests at runtime" kept true?
- **Choice:** `index.html` sets a CSP meta tag with `default-src 'self'`, so the browser itself refuses any request to another origin. *Decided by Claude; approved by the owner on 2026-11-27.*
- **Why:** A rule the browser enforces can't drift the way a review habit can.

## 2026-11-27: Research dossier approved
- **Question:** Is the research dossier ready for the lesson outline to be written from it?
- **Choice:** Yes. The owner approved the dossier on 2026-11-27. Its **Open** items stay off the site until read.
- **Why:** The repo's rule is that the user reviews the research before `docs/LESSONS.md` is written.

## 2026-11-27: The running tiger
- **Question:** Who is the one named tiger that ages through the lessons?
- **Choice:** Junu, a fictional female Bengal tiger in Chitwan National Park, Nepal, whose every life event is a typical one reported by the dossier's studies. The site says she is fictional. *Decided by Claude; approved by the owner on 2026-11-27.*
- **Why:** Chitwan has the dossier's best long-term field studies (marking, dispersal, density, conflict). A female stays near home, so one place can carry her whole life; a real, named tiger would tie the course to claims about one animal that the sources don't support.

## 2026-11-27: Lesson outline approved
- **Question:** Is `docs/LESSONS.md` the outline the lessons are built from?
- **Choice:** Yes. The owner approved the outline, Junu included, and every decision above, on 2026-11-27.
- **Why:** The repo's rule is that the user approves the outline before lessons are built.

## 2026-11-27: Public repo and GitHub Pages
- **Question:** May the repo become public and the site be published on GitHub Pages?
- **Choice:** Yes, once the course is built and an audit of everything that becomes visible (commits with author and committer emails, tags, PR refs, PR and issue text) finds no secrets, personal paths or email other than the noreply one. Any finding stops it for the owner to decide. Approved by the owner on 2026-11-27.
- **Why:** Making a repo public can't be undone for anyone who has already seen it.

## 2026-11-27: Lesson 1 puts its check before its sandbox
- **Question:** The outline ends each lesson with a sandbox, then the check. In lesson 1 the sandbox (grouping cats and seeing which groups are branches) would show where the tiger and snow leopard sit, which is the check's answer. Which comes first?
- **Choice:** The check comes first in lesson 1, and Next stays disabled until it is answered; the sandbox ends the lesson. Before the check, the tree shows *Panthera*'s five species without their inner forks. *Decided by Claude, pending review.*
- **Why:** Predict, then reveal: a prediction made after the answer has been shown checks nothing.

## 2026-11-27: How facts are cited on the site
- **Question:** "Every fact on screen links to its source in the dossier": how, while the repo is private?
- **Choice:** Each fact carries the dossier's `[@Key]` marker in the source text and is drawn as a numbered superscript linking to a source list at the foot of the lesson (author, year, title, link to the original). `src/sources.ts` holds the entries the site uses; a unit test checks each key and link against `docs/research/sources.md`. *Decided by Claude, pending review.*
- **Why:** Links into a private repo would be dead for readers; the original sources stay valid, and the shared key keeps site and dossier tied together. Links are navigation, not runtime requests.

## 2026-11-27: Lesson 1's sandbox traits and tree
- **Question:** Which traits does the sandbox sort cats by, and how is the tree drawn where the dossier is silent?
- **Choice:** Four traits, all from the Cat Specialist Group's species pages (added to the dossier): spots or rosettes, can weigh over 100 kg, lives wild in Asia, and *Panthera* in the name. Roaring is left out because the pages describe it for only two of the seven cats. Lion, leopard and jaguar share one branch without inner forks, and the sandbox says "the tree can't say" for groups that split it. The tree is drawn as nested lists with branch lines, not a canvas. *Decided by Claude, pending review.*
- **Why:** Only sourced traits go on the site, and the tree mustn't claim forks the dossier hasn't read (the Davis et al. abstract was unreachable). Nested lists are keyboard- and screen-reader-friendly for free and cost no drawing code.

## 2026-11-27: How the estimate slider judges a guess
- **Question:** Several checks ask for a number on a slider (years ago, cubs out of ten, a price share). When is a guess "close", and how is a span over orders of magnitude shown?
- **Choice:** Each slider is linear or logarithmic (equal steps are equal ratios, for spans like 1,000 to 10 million years). A guess is close when it sits within a set fraction of the slider's length from the answer, so on a log scale "close" means within a ratio. Log stops are rounded to two significant figures so they read as plain numbers. After locking in, the answer and the guess are drawn on the same scale, told apart by a solid or dashed line and a label, not by hue. *Decided by Claude, pending review.*
- **Why:** Closeness measured along the slider matches what the learner sees and works the same on both scales; a fixed amount would be meaningless across orders of magnitude.

## 2026-11-27: Shared pieces are tried out in a dev-only gallery
- **Question:** How is a shared piece verified in a browser before any lesson uses it?
- **Choice:** `dev/pieces.html` mounts the pieces with the real lesson shell and demo values, served by `npm run dev` and left out of the build. *Decided by Claude, pending review.*
- **Why:** It checks the piece live without publishing demo values (which aren't facts) on the site.

## 2026-11-27: How the ordering task is answered and judged
- **Question:** Lessons 5, 7 and 15 ask the learner to put steps in order. How do they move items, where do the items start, and what does the reveal show?
- **Choice:** Each item has Up and Down buttons (no dragging), so the task works from the keyboard and needs no pointer code; focus follows the moved item. Items start in an order the lesson sets, checked so that no item is already in its right place. After locking in, each item says "✓ right place" or "✗ belongs third", told apart by the glyph, the words, brightness and a solid or dashed line, and the right order is spelled out with the explanation. No count of right places, which would read as a score. *Decided by Claude, pending review.*
- **Why:** Buttons are accessible for free; a fixed start keeps every visit the same and testable, and a start with nothing in place gives no part of the answer away.

## 2026-11-27: How the range map is drawn and answered
- **Question:** Lessons 9, 13, 14 and 15 put things on a map of Asia (the range by decade, stories by place, "drag the ten countries with breeding tigers onto the map"). Where do the outlines come from, how is the map drawn, and how does the learner place things on it?
- **Choice:** Country outlines from Natural Earth's 1:50m countries (public domain), clipped to Turkey–Russian Far East and Siberia's edge–Bali, simplified and rounded to whole units by `scripts/make_map.py` into committed SVG path data (about 10 kB gzipped, loaded only by lessons that use the map). Sumatra, Java and Bali are split from the rest of Indonesia, and the Malay Peninsula from Malaysian Borneo, since the course tells their stories apart. Drawn as plain SVG in an equirectangular projection (longitudes shrunk by cos 30°). The base layer makes no claim about tigers: the range itself is lesson data with citations. "Drag onto the map" becomes picking regions on the map (click, or Tab and Space), then Lock in; tiny places (Singapore, Hong Kong) get a ring so they can be seen and picked. After locking, each choice is found (solid bright), missed (dashed outline) or wrong (hatched), each with a ✓, "missed:" or ✗ label, and the text names what was missed and what was wrong. No count, which would read as a score. Lessons shade regions solid, hatched or dim and place marks by longitude and latitude; a crop zooms in. *Decided by Claude, pending review.*
- **Why:** Public-domain outlines need no permission and cost nothing; generating them once keeps the site static with no runtime requests. Picking is keyboard-accessible with no drag code, and the reveal is told apart by brightness, hatching, dashes and words, not hue.

## 2026-11-27: How stripe patterns are drawn and matched
- **Question:** Lessons 3, 14 and 15 show tigers' stripe patterns and ask the learner to match photos to individuals. Where do the patterns come from, and how is matching answered?
- **Choice:** Patterns are self-made and procedural: a seed fixes a tiger's pattern (same seed, same tiger), so no photo or drawing is traced. Each pattern varies only in what the dossier says makes a pattern unique: the number and width of stripes and whether they split or break into spots [@CATSG; @SINZ]. Twelve stripes by default, a drawing choice since the dossier gives no count; a lesson sets fewer or more (mainland tigers have fewer, Sunda Island tigers more [@Kitchener2017]). A pseudomelanistic coat keeps the same layout with stripes about three times as wide, so they merge [@Sagar2021]; a white coat has sepia stripes on white [@Xu2013]. The drawing is a simple side view (left flank, facing right) with the white spot behind the ear [@SINZ; @ADW]; a camera-trap "photo" is a crop of part of the flank. Matching is a button per tiger for each photo, then Lock in; each photo then says "✓ Tiger B" or "✗ it's Tiger A (you said Tiger B)", told apart by the glyph, the words, brightness and a solid or dashed line. The coat's colours are the animal's own, not a code. *Decided by Claude, pending review.*
- **Why:** A seeded drawing is ours to publish, costs a few hundred bytes instead of images, and gives every visit the same tigers. Buttons work from the keyboard with no drag code, and a crop is how a camera trap really sees a tiger: part of one side.

## 2026-11-27: How lessons get their own address
- **Question:** With a second lesson, how does a learner reach each one, and how is each lesson's code loaded?
- **Choice:** One page. Lesson 1 is the front page and lesson *n* is `?lesson=n` (a query string, because citation links already use the `#` part of the address); anything unknown opens lesson 1. A list of all lessons sits at the top of every page, and a lesson's last step links to the next. Each lesson's code is a separate chunk loaded only when that lesson is opened. *Decided by Claude, pending review.*
- **Why:** Real links work with Back, bookmarks and a static host, with no routing code; per-lesson chunks keep each visit's download small as the course grows to fifteen lessons.

## 2026-11-27: Lesson 2 puts its check before the answer's steps
- **Question:** The outline ends lesson 2 with the sandbox, then the check (when did the last common ancestor live?). But the lesson teaches that date, and the sandbox would come after it. Where does the check go?
- **Choice:** The check comes right after mtDNA and the common ancestor are taught, and before the time line shows the date; Next is held until the estimate is locked in. The steps after it reveal the date, the bottleneck and Toba, with the learner's estimate drawn on the time line; the sandbox ends the lesson. *Decided by Claude, pending review.*
- **Why:** Predict, then reveal: asking for a date the learner has just read checks nothing. The same reasoning as lesson 1's check.

## 2026-11-27: Lesson 2's time line and family-line model
- **Question:** How is a span from 10.8 million to 20,000 years ago drawn, and what does the sandbox model?
- **Choice:** The time line is logarithmic, oldest on the left, with ticks at 10 Mya, 1 Mya, 100 kya and 10 kya and a "today →" at the right end (a log scale never reaches zero). Kinds of evidence are told apart by shape and words, not hue: a fossil is a solid square, a DNA date a dot or bar with dashed whiskers for its widest bounds, the start of a stage a thin line, a hypothesis a dashed line with "(a hypothesis)" in its label. Each event keeps one place for the whole lesson, so events appear without the others moving. The check's slider runs the same way, oldest on the left (the shared estimate slider gained a `reverse` option), and starts at 1 million years, since the slider's middle is the answer itself. The sandbox is a textbook neutral model of mothers and daughters (each daughter's mother picked at random, seeded so a visit is repeatable): the learner picks 10, 25, 50 or 100 females per generation and runs generations; a bottleneck is 2 females for 5 generations. It shows each founder's line as a bar and the lines left over time, and lists finished runs side by side. It says it is a model whose numbers are not tigers'. *Decided by Claude, pending review.*
- **Why:** Only a log scale fits both ends on one line; the lesson teaches how to read it. A run with a steady 50 takes about 100 generations on average to reach one line; with the bottleneck pressed at generation 10, about 17 (300 seeded runs each), so the contrast shows in two runs without claiming tiger numbers the dossier lacks.

## 2026-11-27: Lesson 3's size view, check and sandboxes
- **Question:** The outline scales the size view "by region and sex", but the dossier has no figures for females or for Bengal tigers (the Smithsonian and Cat Specialist Group pages were re-read today: neither gives them). Where does the check go, and what do the two genetics sandboxes model?
- **Choice:** The size view draws only what the sources give: the largest (Amur male, up to 3 m and 300 kg) and smallest (Sumatran, at most 2.4 m and 140 kg) [@SINZ], to scale beside a person 1.7 m tall (a drawing choice), with a 1 m bar. The Smithsonian doesn't say whether its lengths include the tail; both fall within the Cat Specialist Group's body plus tail, 2.4–3.4 m [@CATSG], so they are drawn nose to tail tip, and the lesson says so. That females are smaller is said in words, with no drawn size. The check (match four camera-trap crops to three tigers, one tiger photographed twice so the last pick can't be made by elimination) comes once unique stripes and camera traps are taught, before the coat variants; the two sandboxes end the lesson. Breeding: pick the white (*SLC45A2*) or "black" (*Taqpep*) gene and each parent's copies (0, 1 or 2); each parent passes one copy at random; the panel shows the cubs, how many show the coat and each cub's chances. Drift: a textbook Wright–Fisher model of 20 isolated populations at once (10, 20, 100 or 1,000 tigers each), the changed copy starting at 5%, run for up to 200 generations, with Similipal's share today (0.58) drawn as a dotted line. Both say they are models. The lesson works out, with random mating, 0.58 × 0.58 ≈ one tiger in three, beside the 37% observed [@Sagar2021]; that arithmetic is the lesson's, not the paper's. *Decided by Claude, pending review.*
- **Why:** Drawing a female at a guessed size would be a number without a source. One drift run shows a rare copy reaching half of all copies only about one time in ten, so a learner could run a few and never see it; twenty side by side show the fan of outcomes at once: small populations lose the copy or swing it high, large ones barely move.

## 2026-11-27: Lesson 4's research gap, pitch scale, check and pupil model
- **Question:** Lesson 4's outline names a gap (colour vision, night vision, whiskers, the tiger's own pupil) to fill or drop before building. And what do the pitch scale and the pupil sandbox draw, when the dossier gave no figure for human speech and only percentages for the pupil data?
- **Choice:** The gap is dropped for now: the lesson teaches only what is sourced, and says nothing about colour vision, night vision or whiskers. Banks et al. 2015 was re-read in full (an eScholarship copy) for its counts: of 65 frontal-eyed ambush predators, 44 vertical and 19 circular, 82% and 17% under 42 cm; 36 of 42 grazing prey horizontal. The sandbox picks a hunting style (ambush hunter with forward-facing eyes, or grazing prey) and a height on either side of the paper's 42 cm line, and shows the most common pupil with counts worked out from the percentages (about 36 and 3 under 42 cm, 8 and 16 above), marked "about" since 3 of 19 is 16%, not 17%. Active chasers are left out: the paper's counts for them are only in its supplementary table, not reached. Placing a tiger shows the data's prediction (round) and says the tiger's own pupil is not in the sources read: the only statement found is a press quote from one of the paper's authors, and press is never cited (sources.md). Human speech on the pitch scale comes from two institutional pages that agree, the National Center for Voice and Speech (men about 125 Hz, women about 200 Hz) and the Sydney Voice Lab's norms (115 and 199 Hz, from Leung et al. 2022), so it is drawn as bands at about 115–125 Hz and 200 Hz; children are left out, as only one page gives them. The pitch scale is logarithmic, 50 Hz to 2 kHz; voices are solid bars, the roar an outlined band with a dot at its average. The cochleas are straight bars to scale, the tiger's solid to 36 mm and dashed to 39. The check (a tiger's cochlea is tuned more like a house cat's or a person's) comes after cochlea and tuning are taught, and the answer is only in its reveal. *Decided by Claude, pending review.*
- **Why:** "Never draw a number no source gives", and the trust rules (an institutional page never alone for a number; press never cited) decide what can be shown; the pupil model teaches how a prediction from data differs from a measurement, which is honest about the tiger's own pupil too.

## 2026-11-27: Lesson 5's research gap, prey view, checks and kill-rate sandbox
- **Question:** Lesson 5's outline names a gap (hunting success, teeth, claws, bite force) to fill or drop. The prey view needs body masses the dossier lacked, and the sandbox ("choose the prey and the season") needs numbers for each combination.
- **Choice:** The gap is dropped for now: none of it is taught. Prey masses come from a peer-reviewed, open-access Chitwan scat study read in full (Bhandari et al. 2017, added to the dossier): eight prey at its estimated weights on a log scale (10–1,000 kg), wild prey solid and livestock hollow, with each prey's share of items. The 60–250 kg band [@Hayward2012] is shaded from the step that teaches preference; the next step marks what the Chitwan study found taken more (▲) or less (▼) than expected, so "eaten most" (chital) and "preferred" are told apart, and the lesson says plainly that wild boar and hog deer sit below the band at that study's weights (recorded as a disagreement in `hunting.md`). The hunt-order check (wait or stalk, pounce, pull down, bite the neck [@SINZ]) comes before those steps are told; the days-between-kills slider (1–30 days, half-day stops, 5–8 counts as close) comes after GPS clusters and before the rate is given. Miller et al. 2013 was re-read in full for the sandbox's numbers: all year 6.5 days and 8.9 kg/day, summer 7.4 and 7.9, winter 5.7 and 10.3, after a kill under 40 kg 5.75 days, after a larger one 8.12. The sandbox shows one of those five averages at a time as kills on a 60-day strip, evenly spaced and labelled as averages, beside the year's average dashed; the study gives each factor separately, so no season-by-size figure is made up, and no meat per day is shown for the size cases. The GPS view is a drawing labelled "not real data". *Decided by Claude, pending review.*
- **Why:** "Never draw a number no source gives." Chitwan is Junu's park, so its prey are hers; showing a study that disagrees with the range-wide band teaches what a preference is better than hiding it.

## 2026-11-27: Lesson 6's map, check, marking model and odour field
- **Question:** Lesson 6 needs a map of neighbouring ranges with marks on it, a check where the learner drops marks, and a sandbox where marks build up and an "odour field" shows where a meeting is likely. The sources give the pattern (more marking at edges than inside, most where main travel routes cross a boundary, by marking more often there rather than spending more time [@Smith1989]) but no amounts, no map and no field.
- **Choice:** The map is a drawn grid of 18 by 11 squares, labelled "a drawing, not real data or to scale": Junu's range between her mother's and a neighbouring female's, touching but not overlapping, and one male's range (dashed) over parts of two females' [@Goodrich2022], with three straight travel routes (dotted). A square is *inside*, at an *edge* (a side touches another range or open land), or a *crossing* (an edge on a route). The check (leave five marks in Junu's range by click, or arrow keys and Space on the focused map, then Lock in) comes before the pattern is told; the reveal shades her edges lighter and hatches the crossings, and labels each mark "✓ at an edge where a route crosses it", "✓ at an edge" or "✗ inside", with no count. The sandbox is a seeded model: each step goes in a random direction and a step out of her range stays put, so every square gets the same time in the long run; a step leaves a mark with a chance of 3% inside, 25% at an edge and 70% at a crossing. These chances are made up to follow the study's pattern, and the lesson says so; the table beside it shows the share of ground, of steps and of marks in each zone, so "same time, more marks" can be seen. The odour field is each mark's smell spread over nearby squares (a Gaussian one square wide) in four brightness levels against the strongest, from the other three tigers' marks (500 seeded steps each, the same every visit), drawn only over Junu's range, where she would meet it. The two-females-at-different-times view [@Liu2024] is a 30-day drawing of the pattern, the mother solid and Junu dashed, labelled as not real data. *Decided by Claude, pending review.*
- **Why:** "Never draw a number no source gives": every made-up quantity is a model setting, named as one, and only the pattern it produces is taught. Equal time with unequal marks is exactly the study's point, and a walk that gives every square the same time shows it in the table. Dots whose area grows with the number of marks, and a field shown only where Junu walks, keep the picture readable; brightness, hatching, dashes and labels tell things apart, not hue.

## 2026-11-27: Lesson 7's research gap, checks, map and cohort model
- **Question:** Lesson 7's outline names a gap (litter size, birth interval and cub survival from the Smithsonian page only; read Kerley 2003 and Smith & McDougal 1991 first). What can be shown, where do the two checks go, and what does the cohort sandbox model?
- **Choice:** Kerley et al. 2003 was read as an abstract on the publisher's page (tier 3: its headline figures): litters 2.4 cubs at first count and 1.3 by 12 months, 41–47% of cubs dying, at least 57% of deaths caused by people, 21.4 months between litters, first breeding at about 4. Smith & McDougal 1991 could not be reached (the publisher and JSTOR refuse automated reading), so its paper is not cited; its Chitwan figures (34% of cubs dying in the first year, 17% in the second; first breeding at 3.4 years for females, 4.8 for males) come from the Cat Specialist Group's page (tier 2), re-read today, which also gives gestation (about 103 days), births 20–24 months apart and independence at 18–28 months. Infanticide, which that page calls the leading cause of cub deaths, stays off the site until a study is read. The order check (five stages of a young female's life, from travelling with her mother to her first litter) comes before the stages are told; the slider (of 10 Chitwan cubs, how many are alive at two years; whole cubs, 5 or 6 counts as close) comes before the survival figures; the answer, about 5.5, is the lesson's own multiplying of the two yearly rates, and says so. The stages time line draws each source's span as a bar, with Chitwan's averages as dots and Junu's life as dashed ticks. The leaving-home map is a drawing labelled as one: Junu's short solid path next door, her brother's long dashed path through degraded forest to a temporary range, and hatched farmland neither crosses [@Smith1993]. The cohort sandbox runs 10 or 100 cubs (seeded, "Run again" for the next seed) through three stages with the studies' chances: Chitwan's first and second years [@CATSG], or the Russian Far East's first year from its litters shrinking from 2.4 to 1.3 [@Kerley2003]; then settling, all 4 daughters and 4 of 8 sons in Chitwan [@Smith1993], said to be tiny samples. Half daughters, half sons is a model setting, named as one, since no source read gives a sex ratio at birth. Daughters are circles and sons squares, alive solid and lost outlined; a table shows the run beside the long-run average. *Decided by Claude, pending review.*
- **Why:** "Never draw a number no source gives": every chance in the model is a study's, and the one assumption is named. The outline asked about two years, and Chitwan's two yearly rates answer that for Junu's own park; Russia's first year beside it shows how much people change the picture.

## 2026-11-27: The bundle budget is raised to 120 kB
- **Question:** With lesson 8, the whole built site is about 63 kB gzipped, over the 60 kB budget. Cut content, or raise the budget?
- **Choice:** Raise the whole-site budget to 120 kB gzipped (`.local-ci`, `scripts/check_bundle.py dist 120`). The whole-download measure stays, so heavy assets are still caught. *Decided by Claude, pending review.*
- **Why:** Each lesson is its own chunk, loaded only when opened, so one visit downloads the page, the shared code and one lesson: about 19 kB for lesson 8. The whole site grows by about 6–7 kB a lesson; fifteen lessons, the shared pieces and the range map (about 10 kB, from lesson 9) come to roughly 110 kB, so 120 kB covers the course as planned without raising it lesson by lesson, while any heavy asset still fails it.

## 2026-11-27: Lesson 8's views, check and threshold model
- **Question:** How are the same tigers shown "grouped three ways", where does the check go, and what does the threshold sandbox measure, when the sources read give no numeric difference between subspecies (Liu et al. 2018 is still read only as an abstract; its full text is blocked to automated reading and not in PubMed Central)?
- **Choice:** No map (it would add about 10 kB for a schematic point): the live view is one row of the nine named populations, west to east then the islands, living tiles solid and extinct ones dashed, with each scheme's groups drawn as boxes beneath it; the eight [@Kitchener2017], the two [@Kitchener2017] and the six living [@Liu2018], with the Malayan tiger shown as "no name yet" in the eight and the extinct tigers outside the six. The check (sort the six living populations into *P. t. tigris* or *P. t. sondaica*, a button pair per population, then Lock in) comes after the evidence is taught and before the two are shown or told; no step before it says "mainland" or "Sunda". The sandbox is a model tree of the nine populations whose branch heights are made up, in made-up units, and the lesson says so: only the pattern follows the sources (islands against mainland the biggest split, Caspian and Amur the closest pair, the island tigers differing little [@Kitchener2017]; six living groups [@Liu2018]). The order in which mainland groups branch is made up too. A slider sets how big a difference counts; the count runs from nine to one and passes through the 2017 two and the genomes' six, each named when reached. Junu's DNA sample is part of her story, not a fact. *Decided by Claude, pending review.*
- **Why:** "Never draw a number no source gives": the lesson's point is that where the line goes decides the count, which a made-up tree shows honestly as long as it is named as one. A row of tiles keeps every scheme lined up against the same populations, so the learner sees the lines move while the tigers stay put.

## 2026-11-27: Lesson 9's map, dates, check and sandbox
- **Question:** The range map needs to say, place by place and decade by decade, where tigers lived from 1900 to 2020, but the dossier named the 30 countries of the old range only as a count and dated only some losses. How is the range drawn, where does the check go, and what does the "three layers" toggle show?
- **Choice:** Sanderson et al. 2023 (CC BY) was re-read in full: its Table 2 lists the 30 countries, its text dates Bali (into the 1940s), Java (into the 1980s), Korea (the 1950s) and Azerbaijan (into the 1970s), and its Table 3 gives landscape area by country; all added to `range.md`. The map shades whole countries (a sketch, and the caption says so), with Indonesia drawn as Sumatra, Java and Bali, Malaysia as its peninsula and Hong Kong apart from China, as the sources tell them: 33 places. A place is bright while it has tigers, grey from the first decade after the source's decade of loss ("the 1930s" shows at 1940; "about 2004" at 2010), and hatched where the sources read give no date (Turkey, Iran, Iraq, Syria, Georgia, Armenia, Afghanistan, Pakistan) or disagree (Java, 1960s or 1980s, hatched from 1970 to 1980). China stays bright: it still has tigers in the north-east, and the text tells its southern losses. The check (pick the ten places with breeding tigers, then Lock in) comes once the old range is shown and before any loss is told. The sandbox is a slider of decades from 1900 to 2020, with the places lost in the decade before listed under the map (labels on the map collided in Central Asia), and a "Why: the three layers" toggle that shows the 2020 shares of the old range as bars (60%, 23%, 6%, plus the 2% not surveyed, the 8.2% left and about 1% the figures don't split out), since the layers are only measured for 2020. Junu's line keeps her in Nepal's single landscape [@Sanderson2023] and drops "Chitwan's tigers can reach India's next door", which no source read says. *Decided by Claude, pending review.*
- **Why:** "Never draw a number no source gives": a decade the sources don't give is shown as unknown, not guessed, and a country-level map claims only what the country lists do. The check before the losses keeps predict-then-reveal honest.

## 2026-11-27: Lesson 10's research gap, prey model, check and leopards
- **Question:** Lesson 10's outline asks for Karanth et al. 2004's prey-to-tiger equation before the sandbox is built, so it uses the published fit and not a guess. The paper's full text could not be read: PNAS and Europe PMC answer 403, PubMed Central shows a bot check, and Europe PMC's API has only the abstract (which gives the ranges but not the fit). Fetching it from an unofficial copy, or past the bot check, was not attempted. What do the sandbox and check use?
- **Choice:** The published fit is dropped, and the lesson says so ("its full text couldn't be read for this course"). The sandbox and check use a teaching model built from the one sourced rate: tigers per 100 km² = prey per km² × 100 × the share the prey can spare a year ÷ 50 kills a tiger a year (the low end of 50–60 [@Goodrich2022; @Miller2013]). The share is a made-up setting, named as one on every screen that uses it, with 5%, 10% (default) and 20% to choose in the sandbox, so the learner sees how much one assumption moves the answer. The check (20 deer per km², 1 in 10, 50 kills: 4 tigers; 3 to 5 is close) gives every number and tests the reasoning; it comes after the model is explained in words and before it is run. The live view draws only the dossier's measured densities: Kaziranga and Corbett 15–19, India's 11 sites 3.2–16.8 (spans, as the sites' paired figures weren't read), Rajaji 3.31 to 5.81, Sikhote-Alin 0.13–0.45, on a log scale from 0.1 to 30, with the sandbox's model value as a dashed square beneath. Leopards follow the dossier's approved reading (share with plentiful prey [@Karanth2000]; avoid or are displaced with scarce [@Steinmetz2013; @Harihar2011]); where scarce turns plentiful is made up (below 10 prey per km², 30 and over) with the stretch between shown as "not known", and said to be made up. Home ranges are two squares to scale. Junu's leopard uses her range "when she is somewhere else" [@Liu2026], without "at night": the Thai study the lesson cites found leopards active by day where prey was scarce. *Decided by Claude, pending review.* A later task asks the owner for the paper's text so the fit can replace or sit beside the model.
- **Why:** "Never draw a number no source gives": the reasoning (prey sets tigers through what the prey can spare) is the lesson's point and survives without the fitted numbers, as long as the one assumption is named and changeable.
