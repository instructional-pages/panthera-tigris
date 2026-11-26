# Panthera tigris

A multi-lesson, in-depth browser course about the tiger (*Panthera tigris*): everything known
about a tiger. It covers the science (taxonomy, evolution, body, senses, hunting, behaviour, life
cycle, subspecies, range, ecology, conservation) and the culture (history, myth, art, and the
trade in tiger parts). Every lesson ends with interactive, hands-on checks.

Status: research phase. The cited dossier is in `docs/research/` (start at its `index.md`); the site is not built yet. See `docs/BRIEF.md`.

License: MIT.

## Develop

`./.local-ci` runs the checks (`local-ci` runs it and posts the status to the PR). For now it
checks the research dossier in `docs/research/`: every `[@Key]` citation resolves to an entry in
`sources.md`, every source is cited, and `index.md` links every file.
