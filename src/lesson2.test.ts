import { test } from "node:test";
import assert from "node:assert/strict";
import { judgeEstimate, valueAt } from "./estimate.ts";
import { BOTTLENECK, CHECK, CHECK_STEP, EVENTS, lessonSources, SCALE, SIZES, START_SIZE, STEPS } from "./lesson2.ts";
import { SOURCES } from "./sources.ts";

const ids = new Set(EVENTS.map((e) => e.id));
const ANSWERS = ["mrca", "genomes", "toba", "amur"];

test("every source the lesson cites is in the site's source list", () => {
  const keys = lessonSources();
  assert.deepEqual(new Set(keys), new Set(["Smith1993", "Mazak2011", "Luo2004", "Liu2018", "Kitchener2017"]));
  for (const k of keys) assert.ok(SOURCES[k], `unknown source ${k}`);
});

test("every step shows known events, and events only ever appear, never vanish", () => {
  let before = new Set<string>();
  for (const [i, s] of STEPS.entries()) {
    for (const id of s.shown) assert.ok(ids.has(id), `step ${i + 1}: unknown event ${id}`);
    for (const id of before) assert.ok(s.shown.includes(id), `step ${i + 1} hides ${id}`);
    before = new Set(s.shown);
  }
  assert.deepEqual(before, ids);
});

test("predict, then reveal: nothing on the line gives the check's answer away before it", () => {
  assert.equal(STEPS[CHECK_STEP]!.mode, "check");
  assert.equal(STEPS.filter((s) => s.mode === "check").length, 1);
  for (const s of STEPS.slice(0, CHECK_STEP + 1)) for (const id of ANSWERS) assert.ok(!s.shown.includes(id), id);
  assert.ok(STEPS[CHECK_STEP + 1]!.shown.includes("mrca"));
  assert.equal(STEPS.at(-1)!.mode, "sandbox");
});

test("every event is dated within the time line, older end first", () => {
  for (const e of EVENTS) {
    for (const y of [e.from, e.to ?? e.from, ...(e.bounds ?? [])]) assert.ok(y <= SCALE.oldest && y >= SCALE.newest, `${e.id}: ${y}`);
    if (e.to) assert.ok(e.from > e.to, e.id);
    if (e.bounds) assert.ok(e.bounds[0] >= e.from && e.bounds[1] <= (e.to ?? e.from), `${e.id}: bounds hold the range`);
    assert.ok(e.cites.length > 0, e.id);
  }
});

test("the check: both studies' dates count as close; a fossil age or the last ice age doesn't", () => {
  const mrca = EVENTS.find((e) => e.id === "mrca")!;
  for (const y of [mrca.from, mrca.to!, 110_000]) assert.equal(judgeEstimate(CHECK, y).kind, "close", String(y));
  assert.deepEqual(judgeEstimate(CHECK, 2_000_000), { kind: "high", by: 20 });
  assert.equal(judgeEstimate(CHECK, 20_000).kind, "low");
  // The slider's middle is the answer itself, which is why the view starts it elsewhere.
  assert.equal(valueAt(CHECK, CHECK.steps / 2), CHECK.answer);
});

test("the sandbox's settings", () => {
  assert.ok(SIZES.includes(START_SIZE));
  assert.ok(BOTTLENECK.size < Math.min(...SIZES));
  assert.ok(BOTTLENECK.generations >= 1);
});
