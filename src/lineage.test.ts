import { test } from "node:test";
import assert from "node:assert/strict";
import { breed, found, lineSizes, linesLeft, type Population, random } from "./lineage.ts";

const run = (p: Population, sizes: readonly number[]): Population => sizes.reduce(breed, p);
const untilOneLine = (p: Population, sizeAt: (g: number) => number): Population => {
  while (p.oneLineAt === null) p = breed(p, sizeAt(p.generation));
  return p;
};

test("random: the same seed gives the same numbers, all in [0, 1)", () => {
  let s = 7;
  const a: number[] = [];
  for (let i = 0; i < 1000; i++) {
    const [r, next] = random(s);
    assert.ok(r >= 0 && r < 1);
    a.push(r);
    s = next;
  }
  assert.deepEqual(random(7), random(7));
  assert.ok(new Set(a).size > 990);
});

test("found: every founder is her own line", () => {
  const p = found(5, 1);
  assert.deepEqual(p.line, [0, 1, 2, 3, 4]);
  assert.equal(linesLeft(p), 5);
  assert.deepEqual(lineSizes(p), [1, 1, 1, 1, 1]);
  assert.deepEqual(p.history, [5]);
  assert.equal(p.oneLineAt, null);
  assert.equal(found(0, 1).founders, 1);
});

test("breed: same seed, same run", () => {
  assert.deepEqual(run(found(20, 3), [20, 20, 20]), run(found(20, 3), [20, 20, 20]));
});

test("breed: lines never come back, and the line sizes always add up to the population", () => {
  let p = found(30, 11);
  for (let g = 0; g < 200; g++) {
    const before = new Set(p.line);
    p = breed(p, g % 7 === 3 ? 4 : 30);
    for (const l of p.line) assert.ok(before.has(l), "a daughter's line must be her mother's");
    assert.equal(lineSizes(p).reduce((a, b) => a + b, 0), p.line.length);
    assert.ok(p.history.at(-1)! <= p.history.at(-2)!);
  }
  assert.equal(p.history.length, 201);
});

test("breed: a generation of one leaves one line, and the moment is recorded once", () => {
  const p = run(found(10, 5), [10, 1]);
  assert.equal(linesLeft(p), 1);
  assert.equal(p.oneLineAt, 2);
  const later = run(p, [10, 10]);
  assert.equal(later.oneLineAt, 2);
  assert.equal(later.line.length, 10);
});

test("given time, every run ends with one line", () => {
  for (let seed = 1; seed <= 20; seed++) assert.equal(linesLeft(untilOneLine(found(25, seed), () => 25)), 1);
});

test("a bottleneck brings the one-line moment much sooner, on average", () => {
  const mean = (sizeAt: (g: number) => number) => {
    let sum = 0;
    for (let seed = 1; seed <= 100; seed++) sum += untilOneLine(found(50, seed), sizeAt).oneLineAt!;
    return sum / 100;
  };
  const steady = mean(() => 50);
  const squeezed = mean((g) => (g >= 1 && g <= 5 ? 2 : 50));
  // Theory: about 2 × 50 generations for a steady 50 (about 2N for N mothers).
  assert.ok(steady > 60 && steady < 140, `steady ${steady}`);
  assert.ok(squeezed < steady / 3, `squeezed ${squeezed}, steady ${steady}`);
});
