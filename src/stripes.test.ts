import { test } from "node:test";
import assert from "node:assert/strict";
import { checkMatchTask, judgeMatch, pattern, random, shapes, STRIPES } from "./stripes.ts";

const flank = { left: 60, right: 180, top: 30, depth: 50 };

test("random: the same seed gives the same numbers, in [0, 1)", () => {
  const a = random(7);
  const b = random(7);
  const xs = Array.from({ length: 1000 }, () => a());
  assert.deepEqual(xs.slice(0, 5), Array.from({ length: 5 }, () => b()));
  assert.ok(xs.every((x) => x >= 0 && x < 1));
  assert.notEqual(random(8)(), random(7)());
});

test("pattern: same seed, same tiger; another seed, another tiger", () => {
  assert.deepEqual(pattern(42), pattern(42));
  assert.notDeepEqual(pattern(42).stripes, pattern(43).stripes);
  assert.equal(pattern(42).stripes.length, STRIPES);
  assert.equal(pattern(42, "orange", 20).stripes.length, 20);
});

test("pattern: stripes run in order along the flank and stay on it", () => {
  for (let seed = 1; seed <= 200; seed++) {
    const st = pattern(seed).stripes;
    st.forEach((s, i) => {
      assert.ok(s.x > 0 && s.x < 1, `seed ${seed}: x ${s.x}`);
      assert.ok(s.length >= 0.4 && s.length <= 1);
      assert.ok(s.fork === null || (s.fork >= 0.3 && s.fork <= 0.7));
      assert.ok([0, 1, 2].includes(s.spots));
      if (i) assert.ok(s.x > st[i - 1]!.x, `seed ${seed}: stripe ${i} is behind the one before it`);
    });
  }
});

test("pattern: across many tigers, some stripes split and some break into spots", () => {
  const all = Array.from({ length: 50 }, (_, i) => pattern(i + 1).stripes).flat();
  const forks = all.filter((s) => s.fork !== null).length / all.length;
  const spotted = all.filter((s) => s.spots > 0).length / all.length;
  assert.ok(forks > 0.2 && forks < 0.4, `forks ${forks}`);
  assert.ok(spotted > 0.25 && spotted < 0.45, `spotted ${spotted}`);
});

test("pattern: a pseudomelanistic coat keeps the layout with stripes wide enough to merge", () => {
  const plain = pattern(5);
  const dark = pattern(5, "pseudomelanistic");
  assert.equal(dark.coat, "pseudomelanistic");
  dark.stripes.forEach((s, i) => {
    assert.equal(s.x, plain.stripes[i]!.x);
    assert.ok(s.width > plain.stripes[i]!.width * 3);
  });
  // Plain stripes leave gaps between them; most dark neighbours touch.
  const touching = (p: typeof plain) => p.stripes.slice(1).filter((s, i) => s.x - p.stripes[i]!.x < (s.width + p.stripes[i]!.width) / 2).length;
  assert.ok(touching(dark) > touching(plain));
  assert.ok(touching(dark) >= (STRIPES - 1) / 2);
});

test("pattern refuses a count that isn't a whole number of stripes", () => {
  assert.throws(() => pattern(1, "orange", 0), /whole number/);
  assert.throws(() => pattern(1, "orange", 2.5), /whole number/);
});

test("shapes: one outline per stripe and fork, one ellipse per spot that fits", () => {
  const p = pattern(42);
  const sh = shapes(p, flank);
  const forks = p.stripes.filter((s) => s.fork !== null).length;
  assert.equal(sh.paths.length, p.stripes.length + forks);
  assert.ok(sh.spots.length <= p.stripes.reduce((a, s) => a + s.spots, 0));
  for (const d of sh.paths) assert.match(d, /^M[\d.-]+ [\d.-]+Q.*Z$/);
});

test("shapes: a lone straight stripe tapers from the back to its tip", () => {
  const sh = shapes({ seed: 0, coat: "orange", stripes: [{ x: 0.5, width: 0.1, length: 1, lean: 0, fork: null, spots: 0 }] }, flank);
  // 12 units wide at x = 120 on the back line, pointed at (120, 80).
  assert.deepEqual(sh.paths, ["M114 30Q116 55 120 80Q124 55 126 30Z"]);
  assert.deepEqual(sh.spots, []);
});

test("shapes: every point stays on the flank, give or take a stripe's width", () => {
  for (let seed = 1; seed <= 100; seed++) {
    const sh = shapes(pattern(seed), flank);
    const nums = sh.paths.flatMap((d) => d.match(/-?[\d.]+/g)!.map(Number));
    for (let i = 0; i < nums.length; i += 2) {
      assert.ok(nums[i]! > flank.left - 30 && nums[i]! < flank.right + 30, `seed ${seed}: x ${nums[i]}`);
      assert.ok(nums[i + 1]! >= flank.top && nums[i + 1]! <= flank.top + flank.depth, `seed ${seed}: y ${nums[i + 1]}`);
    }
    for (const [, cy] of sh.spots) assert.ok(cy <= flank.top + flank.depth);
  }
});

test("checkMatchTask accepts distinct tigers and photos of real parts of their flanks", () => {
  assert.doesNotThrow(() => checkMatchTask([1, 2, 3], [{ tiger: 2, from: 0.1, to: 0.6 }]));
});

test("checkMatchTask refuses tasks that can't be answered fairly", () => {
  assert.throws(() => checkMatchTask([1], [{ tiger: 0, from: 0, to: 1 }]), /at least two tigers/);
  assert.throws(() => checkMatchTask([1, 1], [{ tiger: 0, from: 0, to: 1 }]), /share a seed/);
  assert.throws(() => checkMatchTask([1, 2], []), /needs a photo/);
  assert.throws(() => checkMatchTask([1, 2], [{ tiger: 2, from: 0, to: 1 }]), /no such tiger/);
  assert.throws(() => checkMatchTask([1, 2], [{ tiger: 0, from: 0.5, to: 0.6 }]), /a fifth/);
  assert.throws(() => checkMatchTask([1, 2], [{ tiger: 0, from: -0.1, to: 0.6 }]), /a fifth/);
});

test("judgeMatch: right only when the pick is the tiger in the photo", () => {
  const photos = [
    { tiger: 1, from: 0, to: 0.5 },
    { tiger: 0, from: 0.3, to: 0.9 },
    { tiger: 2, from: 0.2, to: 0.7 },
  ];
  assert.deepEqual(judgeMatch(photos, [1, 2, null]), [true, false, false]);
});
