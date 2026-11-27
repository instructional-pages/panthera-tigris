import { test } from "node:test";
import assert from "node:assert/strict";
import {
  AMBUSH,
  ANIMALS,
  ANSWER,
  CHECK_STEP,
  COCHLEAS,
  EARS,
  grade,
  hzLabel,
  lessonSources,
  logPos,
  PITCHES,
  ROAR_STEP,
  SCALE_HZ,
  STEPS,
  tally,
  TICKS_HZ,
} from "./lesson4.ts";
import { SOURCES } from "./sources.ts";

test("every source the lesson cites is in the site's source list", () => {
  const keys = lessonSources();
  assert.deepEqual(
    new Set(keys),
    new Set(["NCVS", "SydneyVoiceLab", "Klemuk2011", "Bergevin2012", "Smith1989", "Burger2008", "SINZ", "Banks2015"]),
  );
  for (const k of keys) assert.ok(SOURCES[k], `unknown source ${k}`);
});

test("logPos: equal ratios are equal steps, and the ends are 0 and 1", () => {
  assert.equal(logPos(50, 50, 2000), 0);
  assert.equal(logPos(2000, 50, 2000), 1);
  const a = logPos(100, 50, 2000) - logPos(50, 50, 2000);
  const b = logPos(1000, 50, 2000) - logPos(500, 50, 2000);
  assert.ok(Math.abs(a - b) < 1e-12);
  assert.equal(logPos(10, 50, 2000), 0, "clamped below");
  assert.equal(logPos(9000, 50, 2000), 1, "clamped above");
  assert.throws(() => logPos(100, 0, 10));
});

test("hzLabel", () => {
  assert.equal(hzLabel(200), "200 Hz");
  assert.equal(hzLabel(1000), "1 kHz");
  assert.equal(hzLabel(2000), "2 kHz");
});

test("every pitch drawn fits the scale, and the roar is its sources' figures", () => {
  for (const p of PITCHES) {
    assert.ok(p.lo >= SCALE_HZ[0] && p.hi <= SCALE_HZ[1], p.name);
    assert.ok(p.lo <= p.hi, p.name);
    if (p.mid !== undefined) assert.ok(p.mid >= p.lo && p.mid <= p.hi, p.name);
  }
  const roar = PITCHES.find((p) => p.name.includes("roar"))!;
  assert.deepEqual([roar.lo, roar.mid, roar.hi], [83, 158, 246]);
  assert.equal(roar.from, ROAR_STEP);
  assert.ok(TICKS_HZ.includes(1000), "the 1 kHz mark the cochlea step names");
});

test("the cochleas are the source's lengths, shortest first", () => {
  assert.deepEqual(
    COCHLEAS.map((c) => [c.name, c.lo, c.hi]),
    [
      ["House cat", 25, 25],
      ["Person", 35, 35],
      ["Tiger", 36, 39],
    ],
  );
});

test("predict, then reveal: one check, and nothing before it gives the answer away", () => {
  assert.equal(STEPS[CHECK_STEP]!.view, "check");
  assert.equal(STEPS.filter((s) => s.view === "check").length, 1);
  const before = STEPS.slice(0, CHECK_STEP + 1)
    .flatMap((s) => s.text)
    .join(" ");
  assert.ok(!/tuned about as sharply|more sharply/i.test(before));
  // The terms the check uses are taught before it.
  assert.match(before, /\*\*cochlea\*\*/);
  assert.match(before, /\*\*tuning\*\*/);
});

test("grade: a person's ear is right, a house cat's is not, and both explain why", () => {
  assert.equal(ANSWER, "person");
  assert.deepEqual(new Set(EARS.map((e) => e.value)), new Set(["cat", "person"]));
  assert.equal(grade("person").correct, true);
  assert.equal(grade("cat").correct, false);
  for (const e of EARS) assert.match(grade(e.value).text, /\[@Bergevin2012\]/);
});

test("tally: Banks et al.'s counts, worked out from their percentages", () => {
  assert.deepEqual(tally("ambush", "short"), { counts: { vertical: 36, round: 3 }, of: 39, predicted: "vertical", worked: true });
  assert.deepEqual(tally("ambush", "tall"), { counts: { vertical: 8, round: 16 }, of: 24, predicted: "round", worked: true });
  // The two heights add back up to the paper's totals.
  const s = tally("ambush", "short").counts;
  const t = tally("ambush", "tall").counts;
  assert.equal(s.vertical! + t.vertical!, AMBUSH.vertical);
  assert.equal(s.round! + t.round!, AMBUSH.round);
  // And the shares under 42 cm come within rounding of the paper's 82% and 17% (3 of 19 is 16%,
  // so the paper's 17% is likely of the species whose height was known: the view says "about").
  assert.ok(Math.abs(s.vertical! / AMBUSH.vertical - AMBUSH.verticalShort) < 0.01);
  assert.ok(Math.abs(s.round! / AMBUSH.round - AMBUSH.roundShort) < 0.02);
});

test("tally: prey have horizontal pupils whatever their height (the paper gives no split)", () => {
  for (const h of ["short", "tall"] as const)
    assert.deepEqual(tally("prey", h), { counts: { horizontal: 36 }, of: 42, predicted: "horizontal", worked: false });
});

test("placing the animals: the house cat comes out a slit, the tiger round, and the tiger's own pupil is not claimed", () => {
  const cat = ANIMALS.find((a) => a.name === "A house cat")!;
  const tiger = ANIMALS.find((a) => a.name === "A tiger")!;
  assert.equal(tally(cat.style, cat.height).predicted, "vertical");
  assert.equal(tally(tiger.style, tiger.height).predicted, "round");
  assert.match(tiger.note, /not in the sources/);
});
