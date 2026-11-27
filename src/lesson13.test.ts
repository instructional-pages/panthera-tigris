import { test } from "node:test";
import assert from "node:assert/strict";
import { CHECK_PLACES, CROP, judgeMatch, lessonSources, PLACES, placesOf, STEPS, STORIES, WANT } from "./lesson13.ts";
import { project } from "./map.ts";
import { FRAME, REGIONS } from "./map-data.ts";
import { SOURCES } from "./sources.ts";

test("every source the lesson cites is in the site's source list", () => {
  const keys = lessonSources();
  for (const k of ["Welch2016", "Nair2021", "Struebig2018", "PMA101270", "CMA1960", "ElvesPowell2024", "Blake", "Kipling", "NTCAProjectTiger"]) assert.ok(keys.includes(k), `not cited: ${k}`);
  for (const k of keys) assert.ok(SOURCES[k], `unknown source ${k}`);
});

test("every place lies in a region of the range map, and its dot inside the lesson's crop", () => {
  const ids = new Set(REGIONS.map((r) => r.id));
  const [cx, cy, cw, ch] = CROP;
  for (const p of PLACES) {
    assert.ok(ids.has(p.region), `${p.id}: no region ${p.region}`);
    if (!p.at) continue;
    const [x, y] = project(FRAME, p.at.lon, p.at.lat);
    assert.ok(x > cx && x < cx + cw && y > cy && y < cy + ch, `${p.id} is off the map`);
  }
  assert.equal(new Set(PLACES.map((p) => p.id)).size, PLACES.length);
});

test("every step that draws a story map has places, and every place is told in some step", () => {
  const views = new Set(STEPS.map((s) => s.view));
  for (const v of ["china", "rulers", "durga", "guardians", "sumatra", "symbols", "tolerance"] as const) {
    assert.ok(views.has(v), v);
    assert.ok(placesOf(v).length > 0, `${v} has no places`);
  }
  for (const p of PLACES) assert.ok(p.views.every((v) => views.has(v)), p.id);
});

test("the check: each story has one answer among the places, with one place left over", () => {
  for (const s of STORIES) assert.ok(CHECK_PLACES.includes(s.answer), s.answer);
  assert.equal(new Set(STORIES.map((s) => s.answer)).size, STORIES.length);
  assert.equal(CHECK_PLACES.length, STORIES.length + 1);
  assert.deepEqual(judgeMatch(STORIES.map((s) => s.answer)), STORIES.map(() => true));
  assert.deepEqual(judgeMatch(STORIES.map(() => null)), STORIES.map(() => false));
  const swapped = STORIES.map((s) => s.answer);
  [swapped[0], swapped[1]] = [swapped[1]!, swapped[0]!];
  assert.deepEqual(judgeMatch(swapped).slice(0, 3), [false, false, true]);
});

test("no step before the check names a story's place or gives a story away", () => {
  const before = STEPS.slice(0, STEPS.findIndex((s) => s.view === "check")).flatMap((s) => s.text).join(" ");
  for (const giveaway of ["China", "Korea", "Mysore", "Sundarbans", "Sumatra", "Thailand", "Bonbibi", "Tipu", "white tiger", "ancestral"]) assert.ok(!before.includes(giveaway), `"${giveaway}" appears before the check`);
  for (const s of STORIES) for (const name of ["China", "Korea", "Mysore", "Sundarbans", "Sumatra", "Thailand"]) assert.ok(!s.text.includes(name), `story names ${name}`);
});

test("the survey's answers are the paper's three shares, leaving 5% unaccounted", () => {
  assert.deepEqual(WANT.map((w) => w.value), [28, 48, 19]);
  assert.equal(100 - WANT.reduce((t, w) => t + w.value, 0), 5);
});
