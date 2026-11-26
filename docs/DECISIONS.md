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
- **Choice:** Private for now. Making it public waits for the user's go-ahead and an audit of everything that would become visible. *Decided by Claude, pending review.*
- **Why:** The permission check refused to create a public repo without the user's approval. Making a repo public can't be undone, so the user should make that call.

## 2026-11-26: Credit for AI-assisted content
- **Question:** How is Claude's part in the research and writing shown?
- **Choice:** The site and README will say the course was researched and written with Claude (AI), and the user reviews it. *Decided by Claude, pending review.*
- **Why:** On re-checking the Usage Policy (effective 2026-11-12), it asks that AI-assisted work presented for others to rely on is properly attributed.
