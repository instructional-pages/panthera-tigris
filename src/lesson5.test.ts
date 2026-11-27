import { test } from "node:test";
import assert from "node:assert/strict";
import { checkStart, inOrder } from "./order.ts";
import { judgeEstimate, stopOf, valueAt } from "./estimate.ts";
import {
  BAND,
  CASES,
  CHECK,
  CHECK_EXPLAIN,
  ESTIMATE_STEP,
  HUNT,
  HUNT_START,
  inBand,
  killDays,
  lessonSources,
  logPos,
  MASS_KG,
  ORDER_STEP,
  PREY,
  SPAN_DAYS,
  STEPS,
} from "./lesson5.ts";
import { SOURCES } from "./sources.ts";

test("every source the lesson cites is in the site's source list", () => {
  const keys = lessonSources();
  assert.deepEqual(new Set(keys), new Set(["SINZ", "Miller2013", "Bhandari2017", "Hayward2012"]));
  for (const k of keys) assert.ok(SOURCES[k], `unknown source ${k}`);
});

test("the hunt check starts with nothing in place, and its answer is the sourced order", () => {
  assert.doesNotThrow(() => checkStart(HUNT_START, HUNT.length));
  assert.ok(!inOrder(HUNT_START));
  assert.deepEqual(HUNT, ["Wait in cover, or stalk closer", "Pounce", "Pull the prey down", "Bite the neck"]);
});

test("checks come before the steps that give their answers away", () => {
  assert.equal(STEPS[ORDER_STEP]!.view, "order");
  assert.equal(STEPS[ESTIMATE_STEP]!.view, "estimate");
  const before = (i: number) => STEPS.slice(0, i).flatMap((s) => s.text).join(" ");
  assert.ok(!/pounce|neck/i.test(before(ORDER_STEP)), "the hunt's steps are told before the order check");
  assert.ok(!/6\.5|once a week/.test(before(ESTIMATE_STEP + 1)), "the kill rate is told before the estimate");
  assert.match(CHECK_EXPLAIN, /6\.5 days/);
});

test("the estimate: the answer is a slider stop, 5 to 8 days is close, and the start isn't", () => {
  assert.equal(valueAt(CHECK, stopOf(CHECK, CHECK.answer)), 6.5);
  assert.equal(judgeEstimate(CHECK, 5).kind, "close");
  assert.equal(judgeEstimate(CHECK, 8).kind, "close");
  assert.equal(judgeEstimate(CHECK, 4).kind, "low");
  assert.equal(judgeEstimate(CHECK, 9).kind, "high");
  assert.equal(judgeEstimate(CHECK, 20).kind, "high");
});

test("the prey: the Chitwan study's weights and shares, lightest first, on the mass scale", () => {
  assert.deepEqual(
    PREY.map((p) => [p.name, p.kg, p.share]),
    [
      ["Barking deer", 20, 4],
      ["Hog deer", 33, 9],
      ["Wild boar", 38, 15],
      ["Chital", 45, 45],
      ["Sambar", 125, 23],
      ["Cow", 180, 1],
      ["Buffalo", 273, 2],
      ["Gaur", 450, 2],
    ],
  );
  for (const p of PREY) assert.ok(p.kg > MASS_KG[0] && p.kg < MASS_KG[1], p.name);
  assert.deepEqual(PREY.filter((p) => p.choice === "more").map((p) => p.name), ["Hog deer", "Wild boar", "Sambar"]);
  assert.deepEqual(PREY.filter((p) => p.choice === "less").map((p) => p.name), ["Chital"]);
});

test("the preferred band is 60–250 kg, edges included", () => {
  assert.deepEqual(BAND, [60, 250]);
  assert.ok(inBand(60) && inBand(250) && inBand(125));
  assert.ok(!inBand(45) && !inBand(273));
  assert.deepEqual(PREY.filter((p) => inBand(p.kg)).map((p) => p.name), ["Sambar", "Cow"]);
});

test("logPos: equal ratios are equal steps, clamped at the ends", () => {
  assert.equal(logPos(10, 10, 1000), 0);
  assert.equal(logPos(100, 10, 1000), 0.5);
  assert.equal(logPos(1000, 10, 1000), 1);
  assert.equal(logPos(1, 10, 1000), 0);
  assert.equal(logPos(5000, 10, 1000), 1);
  assert.throws(() => logPos(5, 0, 10));
});

test("the sandbox's cases are the study's own averages", () => {
  assert.deepEqual(
    CASES.map((c) => [c.key, c.days, c.kgPerDay]),
    [
      ["year", 6.5, 8.9],
      ["summer", 7.4, 7.9],
      ["winter", 5.7, 10.3],
      ["small", 5.75, null],
      ["large", 8.12, null],
    ],
  );
  for (const c of CASES) assert.match(c.note, /\[@Miller2013\]/);
});

test("killDays: evenly spaced kills within the span", () => {
  assert.deepEqual(killDays(10, 30), [10, 20, 30]);
  assert.deepEqual(killDays(6.5, 20), [6.5, 13, 19.5]);
  assert.equal(killDays(6.5, SPAN_DAYS).length, 9);
  assert.equal(killDays(5.7, SPAN_DAYS).length, 10);
  assert.equal(killDays(8.12, SPAN_DAYS).length, 7);
  assert.deepEqual(killDays(100, 60), []);
  assert.throws(() => killDays(0, 60));
});
