import { test } from "node:test";
import assert from "node:assert/strict";
import { judgeEstimate, valueAt } from "./estimate.ts";
import {
  DENSITY,
  HUNT,
  HUNT_START,
  KILLS,
  lessonSources,
  LOST_SINCE_2000,
  MAP_CHOICES,
  MATCH_PHOTOS,
  MATCH_TIGERS,
  RANGE_LEFT,
  STAGES,
  STAGES_START,
  STEPS,
  WORLD_COUNT,
} from "./lesson15.ts";
import { HUNT_START as LESSON5_START } from "./lesson5.ts";
import { STAGES_START as LESSON7_START } from "./lesson7.ts";
import { MATCH_TIGERS as LESSON3_TIGERS } from "./lesson3.ts";
import { checkPickTask } from "./map.ts";
import { REGIONS } from "./map-data.ts";
import { checkStart } from "./order.ts";
import { checkMatchTask } from "./stripes.ts";
import { TITLES } from "./lessons.ts";
import { SOURCES } from "./sources.ts";

test("every source the quiz cites is in the site's source list", () => {
  const keys = lessonSources();
  for (const k of ["CATSG", "Karanth1995", "SINZ", "Miller2013", "Smith1993", "Goodrich2022", "Karanth2004", "Sanderson2023", "NTCA2023"]) assert.ok(keys.includes(k), `not cited: ${k}`);
  for (const k of keys) assert.ok(SOURCES[k], `unknown source ${k}`);
});

test("every task links back to real, earlier lessons, and every step but the first and last is a task", () => {
  for (const s of STEPS.slice(1, -1)) {
    assert.ok(s.from && s.from.length > 0, s.view);
    for (const n of s.from!) assert.ok(n >= 1 && n < TITLES.length, `${s.view}: lesson ${n}`);
  }
  assert.equal(STEPS[0]!.view, "junu");
  assert.equal(STEPS.at(-1)!.view, "end");
});

test("the matching task is valid, uses tigers new to the course, and one tiger appears twice", () => {
  checkMatchTask(MATCH_TIGERS.map((t) => t.seed), MATCH_PHOTOS);
  const old = new Set(LESSON3_TIGERS.map((t) => t.seed));
  for (const t of MATCH_TIGERS) assert.ok(!old.has(t.seed), t.name);
  const shown = MATCH_PHOTOS.map((p) => p.tiger);
  assert.equal(new Set(shown).size, MATCH_TIGERS.length); // every tiger is in some photo
  assert.equal(shown.length, MATCH_TIGERS.length + 1);
});

test("the order tasks start with nothing in place, and not as lessons 5 and 7 did", () => {
  checkStart(HUNT_START, HUNT.length);
  checkStart(STAGES_START, STAGES.length);
  assert.notDeepEqual(HUNT_START, LESSON5_START);
  assert.notDeepEqual(STAGES_START, LESSON7_START);
});

test("the map's answer is Vietnam, Cambodia and Laos, and the task is valid", () => {
  assert.deepEqual([...LOST_SINCE_2000].sort(), ["khm", "lao", "vnm"]);
  checkPickTask(new Set(REGIONS.map((r) => r.id)), MAP_CHOICES, LOST_SINCE_2000);
});

test("the estimates: the sources' figures, each reachable on its slider", () => {
  assert.equal(KILLS.answer, 6.5);
  assert.deepEqual(DENSITY.range, [15, 19]);
  assert.equal(RANGE_LEFT.answer, 8);
  assert.deepEqual(WORLD_COUNT.range, [3726, 5578]);
  for (const spec of [KILLS, DENSITY, RANGE_LEFT, WORLD_COUNT]) {
    if (spec.range) assert.ok(spec.range[0] <= spec.answer && spec.answer <= spec.range[1]);
    const stops = Array.from({ length: spec.steps + 1 }, (_, i) => valueAt(spec, i));
    assert.ok(stops.some((v) => judgeEstimate(spec, v).kind === "close"), "no stop is close");
    assert.notEqual(judgeEstimate(spec, spec.min).kind, "close");
    assert.notEqual(judgeEstimate(spec, spec.max).kind, "close");
  }
  // The old guess of 100,000 tigers is far too high.
  assert.equal(judgeEstimate(WORLD_COUNT, 100_000).kind, "high");
  assert.equal(judgeEstimate(DENSITY, 1).kind, "low");
});
