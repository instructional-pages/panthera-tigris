# Panthera tigris

A multi-lesson, in-depth browser course about the tiger (*Panthera tigris*): everything known
about a tiger. It covers the science (taxonomy, evolution, body, senses, hunting, behaviour, life
cycle, subspecies, range, ecology, conservation) and the culture (history, myth, art, and the
trade in tiger parts). Every lesson ends with interactive, hands-on checks.

Status: building lessons. The cited dossier in `docs/research/` (start at its `index.md`) and the
lesson outline (`docs/LESSONS.md`) are approved. Lessons 1 to 8 (*What is a tiger?*, *Two and a half million
years of tigers*, *The body: size, coat, stripes*, *Voice and senses*, *Hunting*, *A territory of her own*, *A life: mating, cubs, leaving home*, *How many kinds of tiger?*) are built; the rest follow in outline order. Lesson 1 is the front page; lesson
*n* is at `?lesson=n`. See `docs/BRIEF.md`.
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

The page shell (`src/shell.ts`: title, steps with Back and Next, sources) is the same for every
lesson; each lesson supplies its content and draws its live view (`src/lesson1-view.ts`). The
pieces several lessons share are tried out in a dev-only gallery at `/dev/pieces.html` under
`npm run dev`; it is not part of the build.

The range map's country outlines (`src/map-data.ts`) are generated from Natural Earth's 1:50m
admin-0 countries (public domain) by `scripts/make_map.py`; download
`ne_50m_admin_0_countries.geojson` from github.com/nvkelso/natural-earth-vector and run
`python3 scripts/make_map.py <that file> > src/map-data.ts`. The output is committed.

`./.local-ci` runs every check (`local-ci` runs it and posts the status to the PR): the research
dossier's citations (every `[@Key]` resolves to `sources.md`, every source is cited, `index.md`
links every file), then typecheck, unit tests, build, and the bundle budget: the whole built
site must stay under 120 kB gzipped (`scripts/check_bundle.py`).
