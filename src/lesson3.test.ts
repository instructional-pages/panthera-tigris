import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BODY_M,
  CHECK_STEP,
  lessonSources,
  MATCH_PHOTOS,
  MATCH_TIGERS,
  POPULATIONS,
  scaled,
  SIMILIPAL_SHARE,
  SIZES,
  START_POPULATION,
  START_SHARE,
  STEPS,
  TAIL_M,
  THREE,
} from "./lesson3.ts";
import { checkMatchTask, pattern } from "./stripes.ts";
import { SOURCES } from "./sources.ts";
import { showing, startDrift } from "./genes.ts";

test("every source the lesson cites is in the site's source list", () => {
  const keys = lessonSources();
  assert.deepEqual(new Set(keys), new Set(["CATSG", "SINZ", "Kitchener2017", "Karanth1995", "Xu2013", "Sagar2021"]));
  for (const k of keys) assert.ok(SOURCES[k], `unknown source ${k}`);
});

test("ADW, the dossier's lowest-trust source, is never cited", () => {
  assert.ok(!lessonSources().includes("ADW"));
});

test("the drawn maxima fit the species' whole length, body plus tail", () => {
  const [lo, hi] = [BODY_M[0] + TAIL_M[0], BODY_M[1] + TAIL_M[1]];
  assert.ok(Math.abs(lo - 2.4) < 1e-9 && Math.abs(hi - 3.4) < 1e-9);
  for (const z of SIZES) assert.ok(z.length >= lo - 1e-9 && z.length <= hi, z.name);
  assert.ok(SIZES[0]!.length > SIZES[1]!.length, "the largest comes first");
});

test("scaled: a drawing is sized so its tiger has the asked length", () => {
  const d = { width: 200, height: 100, tail: 20, nose: 180 };
  assert.deepEqual(scaled(d, 3.2), { width: 4, height: 2 });
  assert.throws(() => scaled({ ...d, nose: 10 }, 3));
});

test("predict, then reveal: one check, before the coat genetics, and Next waits on it", () => {
  assert.equal(STEPS[CHECK_STEP]!.view, "check");
  assert.equal(STEPS.filter((s) => s.view === "check").length, 1);
  // Everything the check uses is taught before it: unique patterns and camera traps.
  const before = STEPS.slice(0, CHECK_STEP).map((s) => s.view);
  assert.ok(before.includes("unique") && before.includes("camera"));
  assert.deepEqual(
    STEPS.slice(-2).map((s) => s.view),
    ["breed", "drift"],
  );
});

test("the matching task is valid, every tiger is in a photo, and one tiger is in two", () => {
  checkMatchTask(
    MATCH_TIGERS.map((t) => t.seed),
    MATCH_PHOTOS,
  );
  const seen = MATCH_PHOTOS.map((p) => p.tiger);
  assert.deepEqual(new Set(seen), new Set([0, 1, 2]));
  assert.ok(seen.length > MATCH_TIGERS.length);
});

test("the lesson's tigers all look different", () => {
  const seeds = [...THREE, ...MATCH_TIGERS].map((t) => t.seed);
  assert.equal(new Set(seeds).size, seeds.length);
  const looks = seeds.map((s) => JSON.stringify(pattern(s).stripes));
  assert.equal(new Set(looks).size, looks.length);
});

test("the drift sandbox offers small and large populations, and Similipal's share is the paper's", () => {
  assert.ok(POPULATIONS.includes(START_POPULATION));
  assert.ok(Math.min(...POPULATIONS) <= 25 && Math.max(...POPULATIONS) >= 1000);
  assert.equal(SIMILIPAL_SHARE, 0.58);
});

test("every step's text cites at least one source, except the opening and the sandboxes'", () => {
  for (const [i, s] of STEPS.entries()) {
    if (i === 0 || s.view === "breed" || s.view === "drift" || s.view === "check") continue;
    assert.ok(s.text.some((t) => t.includes("[@")), `step ${i + 1}`);
  }
});

test("the lesson's arithmetic: a share of 0.58 puts two copies in about one tiger in three, near the 37% seen", () => {
  const p = showing(SIMILIPAL_SHARE);
  assert.ok(Math.abs(p - 1 / 3) < 0.01 && Math.abs(p - 0.37) < 0.05, String(p));
  assert.ok(STEPS.some((s) => s.text.some((t) => t.includes("0.58 × 0.58, about one tiger in three"))));
});

test("every drift population size starts at exactly 5%, in whole copies", () => {
  for (const n of POPULATIONS) assert.equal(startDrift(n, START_SHARE).history[0], START_SHARE, String(n));
});
