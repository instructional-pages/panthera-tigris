import { test } from "node:test";
import assert from "node:assert/strict";
import { at, rows, short, ticks, type TimeScale } from "./timeline.ts";

// 10 million to 10,000 years ago: three powers of ten, each a third of the line.
const s: TimeScale = { oldest: 10_000_000, newest: 10_000 };

test("at: oldest on the left, each power of ten an equal step", () => {
  assert.equal(at(s, 10_000_000), 0);
  assert.ok(Math.abs(at(s, 1_000_000) - 1 / 3) < 1e-12);
  assert.ok(Math.abs(at(s, 100_000) - 2 / 3) < 1e-12);
  assert.equal(at(s, 10_000), 1);
  assert.equal(at(s, 50_000_000), 0);
  assert.equal(at(s, 1_000), 1);
});

test("ticks: the powers of ten inside the scale, oldest first", () => {
  assert.deepEqual(ticks(s), [10_000_000, 1_000_000, 100_000, 10_000]);
  assert.deepEqual(ticks({ oldest: 20_000_000, newest: 5_000 }), [10_000_000, 1_000_000, 100_000, 10_000]);
});

test("short: Mya and kya, to three figures", () => {
  assert.equal(short(10_800_000), "10.8 Mya");
  assert.equal(short(2_588_000), "2.59 Mya");
  assert.equal(short(1_000_000), "1 Mya");
  assert.equal(short(73_500), "73.5 kya");
  assert.equal(short(110_000), "110 kya");
  assert.equal(short(500), "500 years ago");
});

test("rows: labels that would overlap go to the next free row", () => {
  assert.deepEqual(rows([], 4), []);
  assert.deepEqual(
    rows(
      [
        { start: 0, width: 50 },
        { start: 30, width: 50 }, // overlaps the first
        { start: 60, width: 20 }, // clears the first by 10
        { start: 52, width: 5 }, // clears neither by 4 (the first ends at 50)
      ],
      4,
    ),
    [0, 1, 0, 2],
  );
});
