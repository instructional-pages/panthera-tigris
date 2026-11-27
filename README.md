# Panthera tigris

A multi-lesson, in-depth browser course about the tiger (*Panthera tigris*): everything known
about a tiger. It covers the science (taxonomy, evolution, body, senses, hunting, behaviour, life
cycle, subspecies, range, ecology, conservation) and the culture (history, myth, art, and the
trade in tiger parts). Every lesson ends with interactive, hands-on checks.

Status: outline phase. The cited dossier in `docs/research/` (start at its `index.md`) is approved;
the lesson outline (`docs/LESSONS.md`) waits for approval, and the site is a skeleton until then. See `docs/BRIEF.md`.
Researched and written with Claude (AI), and reviewed by the author.

License: MIT.

## Develop

TypeScript and Vite, plain DOM, no framework. Needs Node 22.18 or later (`node --test` runs the
TypeScript tests directly).

```sh
npm install
npm run dev        # local dev server
npm test           # unit tests for the pure modules in src/
npm run build      # static site in dist/
```

`./.local-ci` runs every check (`local-ci` runs it and posts the status to the PR): the research
dossier's citations (every `[@Key]` resolves to `sources.md`, every source is cited, `index.md`
links every file), then typecheck, unit tests, build, and the bundle budget: the whole built
site must stay under 60 kB gzipped (`scripts/check_bundle.py`).
