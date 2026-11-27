import { test } from "node:test";
import assert from "node:assert/strict";
import { back, isFirst, isLast, label, next, start } from "./steps.ts";

test("starts on the first step", () => {
  assert.deepEqual(start(3), { index: 0, count: 3 });
  assert.equal(label(start(3)), "Step 1 of 3");
});

test("a count below 1 or not an integer becomes 1", () => {
  assert.equal(start(0).count, 1);
  assert.equal(start(-2).count, 1);
  assert.equal(start(2.5).count, 1);
  assert.equal(start(Number.NaN).count, 1);
});

test("next advances and stops at the last step", () => {
  const s = next(next(next(start(3))));
  assert.equal(s.index, 2);
  assert.equal(isLast(s), true);
  assert.equal(label(s), "Step 3 of 3");
});

test("back returns and stops at the first step", () => {
  const s = back(back(next(start(3))));
  assert.equal(s.index, 0);
  assert.equal(isFirst(s), true);
});

test("a one-step lesson is both first and last", () => {
  const s = start(1);
  assert.equal(isFirst(s) && isLast(s), true);
  assert.equal(next(s), s);
  assert.equal(back(s), s);
});
