import { test } from "node:test";
import assert from "node:assert/strict";
import { type EstimateSpec, judgeEstimate, position, stopOf, twoFigures, valueAt } from "./estimate.ts";

// Years ago, 1,000 to 10 million, on a log scale: each quarter of the slider is ten times older.
const years: EstimateSpec = { min: 1_000, max: 10_000_000, answer: 100_000, scale: "log", steps: 200, close: 0.05 };
// Cubs out of ten, on a linear scale.
const cubs: EstimateSpec = { min: 0, max: 10, answer: 4, scale: "linear", steps: 10, close: 0.05 };

test("position: equal ratios are equal distances on a log scale", () => {
  assert.equal(position(years, 1_000), 0);
  assert.equal(position(years, 100_000), 0.5);
  assert.equal(position(years, 10_000_000), 1);
  assert.equal(position(cubs, 4), 0.4);
});

test("position: values outside the range are pinned to the ends", () => {
  assert.equal(position(years, 10), 0);
  assert.equal(position(cubs, 12), 1);
});

test("twoFigures rounds to two significant figures", () => {
  assert.equal(twoFigures(11_987), 12_000);
  assert.equal(twoFigures(0.01234), 0.012);
  assert.equal(twoFigures(7), 7);
  assert.equal(twoFigures(0), 0);
});

test("valueAt: the ends are exact, log stops read as plain numbers", () => {
  assert.equal(valueAt(years, 0), 1_000);
  assert.equal(valueAt(years, 200), 10_000_000);
  assert.equal(valueAt(years, 100), 100_000);
  assert.equal(valueAt(years, 50), 10_000);
  assert.equal(valueAt(years, 53), 11_000); // 1000 × 10^(4·53/200) ≈ 11,481
  assert.equal(valueAt(cubs, 3), 3);
  assert.equal(valueAt({ ...cubs, max: 1, steps: 10 }, 3), 0.3);
});

test("valueAt clamps and rounds stops off the slider", () => {
  assert.equal(valueAt(cubs, -2), 0);
  assert.equal(valueAt(cubs, 99), 10);
  assert.equal(valueAt(cubs, 2.6), 3);
});

test("stopOf finds the stop that shows a value", () => {
  for (const v of [1_000, 10_000, 100_000, 1_000_000, 10_000_000]) assert.equal(valueAt(years, stopOf(years, v)), v);
  assert.equal(stopOf(cubs, 4), 4);
});

test("judgeEstimate: close is measured along the slider", () => {
  // 5% of the log slider is a factor of 10^0.2 ≈ 1.58 either side of the answer.
  assert.deepEqual(judgeEstimate(years, 150_000), { kind: "close" });
  assert.deepEqual(judgeEstimate(years, 70_000), { kind: "close" });
  assert.deepEqual(judgeEstimate(years, 1_000_000), { kind: "high", by: 10 });
  assert.deepEqual(judgeEstimate(years, 20_000), { kind: "low", by: 5 });
});

test("judgeEstimate on a linear scale reports the difference", () => {
  assert.deepEqual(judgeEstimate(cubs, 4), { kind: "close" });
  assert.deepEqual(judgeEstimate(cubs, 7), { kind: "high", by: 3 });
  assert.deepEqual(judgeEstimate(cubs, 1), { kind: "low", by: 3 });
});

test("judgeEstimate with an upper bound: anything at or under it is close", () => {
  const share: EstimateSpec = { min: 0.1, max: 100, answer: 2, scale: "log", steps: 30, close: 0.1, bound: "atMost" };
  assert.equal(judgeEstimate(share, 0.1).kind, "close");
  assert.equal(judgeEstimate(share, 2).kind, "close");
  assert.equal(judgeEstimate(share, 3.2).kind, "close"); // within the closeness above the bound
  assert.equal(judgeEstimate(share, 10).kind, "high");
});

test("judgeEstimate with a span: inside is close; outside is judged from the nearer end", () => {
  const spec: EstimateSpec = { min: 0.1, max: 30, answer: 17, range: [15, 19], scale: "log", steps: 30, close: 0.02 };
  assert.deepEqual(judgeEstimate(spec, 15), { kind: "close" });
  assert.deepEqual(judgeEstimate(spec, 19), { kind: "close" });
  assert.deepEqual(judgeEstimate(spec, 16), { kind: "close" });
  // Just past an end, within `close` of it along the slider.
  assert.deepEqual(judgeEstimate(spec, 19.5), { kind: "close" });
  assert.deepEqual(judgeEstimate(spec, 5), { kind: "low", by: 3 }); // 15 ÷ 5, from the nearer end
  const high = judgeEstimate(spec, 30);
  assert.ok(high.kind === "high" && Math.abs(high.by - 30 / 19) < 1e-9);
});
