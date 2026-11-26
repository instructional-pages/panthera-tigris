# panthera-tigris

A multi-lesson, in-depth browser course about the tiger (*Panthera tigris*): everything known
about a tiger, in both science and culture, for a curious adult with no biology background.
Claude researches the subject thoroughly before any of the site is built. Every lesson ends in a
live-model sandbox and a hands-on quiz, and a final mixed quiz closes the course.

The spec is `docs/BRIEF.md`. Decisions are in `docs/DECISIONS.md`. The org rules
(`../CLAUDE.md`) apply.

## Not doing

- Everything in the `instructional-pages` org's Not doing list (no accounts, backend,
  saved progress, analytics, ads, gamification; English only; desktop first).

## Constraints

- **Anthropic policy: allowed, with limits** (Usage Policy effective 2026-11-12, checked
  2026-11-15). Educational content is explicitly outside the high-risk categories. Limits:
  (1) no false or misleading science, so every fact (populations, subspecies taxonomy,
  conservation status) is verified against cited sources; (2) no IP infringement, so only
  self-made or openly licensed images, with credits; (3) poaching and attacks are covered
  factually, without graphic or gratuitous content; (4) if an AI tutor/chatbot is ever
  added it must say it's AI (static lessons and scripted quizzes don't trigger this).
- Org rules (`~/organizations/instructional-pages/CLAUDE.md`): predict-then-reveal checks,
  no scores, points or badges, no third-party requests at runtime, MIT, $0.

## Specific to this repo

- Research comes first. `docs/research/` holds one cited file per topic, and the user reviews it
  before `docs/LESSONS.md` is written.
- The repo is private until the user approves making it public (see `docs/DECISIONS.md`).
