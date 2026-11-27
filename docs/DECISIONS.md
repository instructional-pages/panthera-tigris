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
