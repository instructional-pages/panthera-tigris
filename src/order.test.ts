import { test } from "node:test";
import assert from "node:assert/strict";
import { checkStart, inOrder, isPermutation, move, rightPlaces } from "./order.ts";

test("isPermutation: each item exactly once", () => {
  assert.equal(isPermutation([2, 0, 1], 3), true);
  assert.equal(isPermutation([0, 0, 1], 3), false);
  assert.equal(isPermutation([0, 1], 3), false);
  assert.equal(isPermutation([0, 1, 3], 3), false);
  assert.equal(isPermutation([0, 1.5, 2], 3), false);
});

test("checkStart accepts an order with nothing in its right place", () => {
  assert.doesNotThrow(() => checkStart([1, 3, 0, 2], 4));
  assert.doesNotThrow(() => checkStart([1, 0], 2));
});

test("checkStart refuses a start that gives part of the answer away", () => {
  assert.throws(() => checkStart([0, 2, 1], 3), /item 0 in its right place/);
  assert.throws(() => checkStart([2, 1, 0], 3), /item 1 in its right place/);
  assert.throws(() => checkStart([1, 1, 0], 3), /not an order/);
  assert.throws(() => checkStart([0], 1), /at least two/);
});

test("move swaps an item with its neighbour", () => {
  assert.deepEqual(move([1, 3, 0, 2], 2, -1), [1, 0, 3, 2]);
  assert.deepEqual(move([1, 3, 0, 2], 0, 1), [3, 1, 0, 2]);
});

test("move leaves the order alone at the ends, and does not change its input", () => {
  const start = [1, 3, 0, 2];
  assert.deepEqual(move(start, 0, -1), [1, 3, 0, 2]);
  assert.deepEqual(move(start, 3, 1), [1, 3, 0, 2]);
  assert.deepEqual(move(start, 1, 1), [1, 0, 3, 2]);
  assert.deepEqual(start, [1, 3, 0, 2]);
});

test("rightPlaces and inOrder judge each place", () => {
  assert.deepEqual(rightPlaces([1, 0, 2, 3]), [false, false, true, true]);
  assert.equal(inOrder([1, 0, 2, 3]), false);
  assert.equal(inOrder([0, 1, 2, 3]), true);
});
