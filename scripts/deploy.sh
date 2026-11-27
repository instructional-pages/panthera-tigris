#!/usr/bin/env bash
# Publish the course to GitHub Pages from this machine (no Actions).
# Runs every check, then pushes the built dist/ as the only commit of the gh-pages branch
# (replaced on each deploy, so old builds don't pile up in the repo), and turns Pages on
# the first time. Run from an up-to-date main with a clean tree.
set -euo pipefail
cd "$(dirname "$0")/.."
repo=instructional-pages/panthera-tigris
email=105952144+ntfifwyb@users.noreply.github.com

[ -z "$(git status --porcelain)" ] || { echo "deploy: working tree not clean" >&2; exit 1; }
[ "$(git rev-parse --abbrev-ref HEAD)" = main ] || { echo "deploy: not on main" >&2; exit 1; }
[ "$(git config user.email)" = "$email" ] || { echo "deploy: git user.email is not $email" >&2; exit 1; }

./.local-ci

sha=$(git rev-parse --short HEAD)
out=$(mktemp -d)
trap 'rm -rf "$out"' EXIT
cp -r dist/. "$out/"
touch "$out/.nojekyll"
git -C "$out" init -q -b gh-pages
git -C "$out" add -A
git -C "$out" -c user.name="$(git config user.name)" -c user.email="$email" \
  commit -q -m "deploy $sha"
git -C "$out" push -q -f "$(git remote get-url origin)" gh-pages

# GitHub may enable Pages on its own when gh-pages first appears, so a failed POST is fine
# as long as Pages exists afterwards.
if ! gh api "repos/$repo/pages" >/dev/null 2>&1; then
  gh api -X POST "repos/$repo/pages" -f 'source[branch]=gh-pages' -f 'source[path]=/' >/dev/null 2>&1 ||
    gh api "repos/$repo/pages" >/dev/null
fi
echo "deployed $sha: https://instructional-pages.github.io/panthera-tigris/ (live in a minute or two)"
