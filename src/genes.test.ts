import { test } from "node:test";
import assert from "node:assert/strict";
import { breedCub, type Copies, cubOdds, type Drift, nextGeneration, settled, share, showing, shows, startDrift } from "./genes.ts";
import { random } from "./stripes.ts";

test("a recessive coat shows only with two copies", () => {
  assert.deepEqual([0, 1, 2].map((c) => shows(c as Copies)), [false, false, true]);
});

test("cubOdds: the textbook crosses", () => {
  assert.deepEqual(cubOdds(1, 1), [0.25, 0.5, 0.25]);
  assert.deepEqual(cubOdds(2, 2), [0, 0, 1]);
  assert.deepEqual(cubOdds(0, 2), [0, 1, 0]);
  assert.deepEqual(cubOdds(1, 2), [0, 0.5, 0.5]);
  assert.deepEqual(cubOdds(0, 0), [1, 0, 0]);
  for (const m of [0, 1, 2] as Copies[]) for (const f of [0, 1, 2] as Copies[]) {
    const sum = cubOdds(m, f).reduce((a, b) => a + b);
    assert.ok(Math.abs(sum - 1) < 1e-12);
  }
});

test("breedCub: two carriers give about one cub in four with two copies", () => {
  const r = random(7);
  const n = 20_000;
  const counts = [0, 0, 0];
  for (let i = 0; i < n; i++) counts[breedCub(1, 1, r)]!++;
  assert.ok(Math.abs(counts[2]! / n - 0.25) < 0.015, String(counts));
  assert.ok(Math.abs(counts[1]! / n - 0.5) < 0.015, String(counts));
});

test("breedCub: parents who can only pass one kind of copy always do", () => {
  const r = random(1);
  for (let i = 0; i < 50; i++) {
    assert.equal(breedCub(0, 0, r), 0);
    assert.equal(breedCub(2, 2, r), 2);
    assert.equal(breedCub(0, 2, r), 1);
  }
});

test("startDrift rounds the share to whole copies and refuses nonsense", () => {
  assert.deepEqual(startDrift(20, 0.05).history, [0.05]);
  assert.deepEqual(startDrift(3, 0.1).history, [1 / 6]);
  assert.throws(() => startDrift(0, 0.1));
  assert.throws(() => startDrift(2.5, 0.1));
  assert.throws(() => startDrift(10, 1.5));
});

test("a lost or fixed variant stays put", () => {
  const r = random(3);
  let d: Drift = startDrift(10, 0);
  for (let i = 0; i < 20; i++) d = nextGeneration(d, r);
  assert.equal(share(d), 0);
  assert.ok(settled(d));
  d = startDrift(10, 1);
  d = nextGeneration(d, r);
  assert.equal(share(d), 1);
});

/** How far the share moved, on average, over 20 generations, from 0.05. */
function spread(size: number, runs: number): number {
  const r = random(11);
  let total = 0;
  for (let k = 0; k < runs; k++) {
    let d = startDrift(size, 0.05);
    for (let g = 0; g < 20; g++) d = nextGeneration(d, r);
    total += Math.abs(share(d) - 0.05);
  }
  return total / runs;
}

test("drift: a small population's share wanders far more than a large one's", () => {
  const small = spread(20, 200);
  const large = spread(1000, 50);
  assert.ok(small > 4 * large, `small ${small}, large ${large}`);
});

test("drift: a rare variant in a small population sometimes becomes common, by chance alone", () => {
  const r = random(5);
  let common = 0;
  for (let k = 0; k < 300; k++) {
    let d = startDrift(20, 0.05);
    while (!settled(d) && d.history.length < 500) d = nextGeneration(d, r);
    if (d.history.some((p) => p >= 0.5)) common++;
  }
  // Fixation's chance is its starting share, 5%; reaching one half is a little likelier.
  assert.ok(common >= 5 && common <= 40, String(common));
});

test("showing: random mating puts two copies in p × p of tigers", () => {
  assert.equal(showing(0.5), 0.25);
  assert.ok(Math.abs(showing(0.58) - 0.3364) < 1e-9);
});
