import { test } from "node:test";
import assert from "node:assert/strict";
import {
  branches,
  CHECK_ANSWER,
  CHECK_EXPLAIN,
  CHECK_GROUPS,
  CHECK_ITEMS,
  checkScheme,
  EIGHT,
  groupOf,
  groupsAt,
  judgeSort,
  leaves,
  lessonSources,
  POPULATIONS,
  SCHEMES,
  SIX,
  STEPS,
  THRESHOLD_MAX,
  THRESHOLD_MIN,
  TREE,
  TWO,
} from "./lesson8.ts";
import { SOURCES } from "./sources.ts";

test("every source the lesson cites is in the site's source list", () => {
  const keys = lessonSources();
  assert.deepEqual(new Set(keys), new Set(["Kitchener2017", "Goodrich2022", "Luo2004", "Liu2018", "CATSG"]));
  for (const k of keys) assert.ok(SOURCES[k], `unknown source ${k}`);
});

test("each scheme places every population once, and counts what its source counts", () => {
  for (const s of SCHEMES) checkScheme(s);
  assert.equal(EIGHT.groups.length, 8);
  assert.equal(TWO.groups.length, 2);
  assert.equal(SIX.groups.length, 6);
  // The six are living populations; the extinct ones are outside the genome study's six.
  for (const g of SIX.groups) for (const id of g.members) assert.notEqual(POPULATIONS.find((p) => p.id === id)!.status, "extinct");
});

test("the two-subspecies scheme is the mainland against the islands", () => {
  for (const p of POPULATIONS) assert.equal(groupOf(TWO, p.id), TWO.groups[p.island ? 1 : 0]!.name);
});

test("the check: the six living populations, Sumatran alone in sondaica", () => {
  assert.equal(CHECK_ITEMS.length, 6);
  assert.deepEqual(CHECK_GROUPS, ["P. t. tigris", "P. t. sondaica"]);
  assert.deepEqual(
    CHECK_ITEMS.filter((_, i) => CHECK_ANSWER[i] === 1),
    ["sumatran"],
  );
  assert.ok(CHECK_EXPLAIN.includes("Malayan"));
});

test("judgeSort: a missing pick is wrong", () => {
  assert.deepEqual(judgeSort([0, 1, 0], [0, 0, null]), [true, false, false]);
});

test("the check comes before the two subspecies are shown or told", () => {
  const check = STEPS.findIndex((s) => s.view === "check");
  const two = STEPS.findIndex((s) => s.view === "two");
  assert.ok(check >= 0 && check < two);
  for (const s of STEPS.slice(0, check + 1)) {
    assert.ok(!/mainland|Sunda/.test(s.text.join(" ")), `step "${s.view}" gives the check away`);
    assert.ok(!["two", "six", "all"].includes(s.view));
  }
});

test("the model tree holds the nine populations once each", () => {
  assert.deepEqual(new Set(leaves(TREE)), new Set(POPULATIONS.map((p) => p.id)));
  assert.equal(leaves(TREE).length, POPULATIONS.length);
});

test("groupsAt: every difference counts gives nine; none gives one", () => {
  assert.equal(groupsAt(TREE, THRESHOLD_MIN).length, 9);
  assert.equal(groupsAt(TREE, THRESHOLD_MAX).length, 1);
  for (const at of branches(TREE).map((b) => b.at)) {
    assert.ok(at >= THRESHOLD_MIN && at < THRESHOLD_MAX);
  }
});

test("groupsAt: raising the line only ever merges groups", () => {
  let before = groupsAt(TREE, THRESHOLD_MIN).length;
  for (let t = THRESHOLD_MIN + 1; t <= THRESHOLD_MAX; t++) {
    const n = groupsAt(TREE, t).length;
    assert.ok(n <= before);
    before = n;
  }
});

test("groupsAt: some line gives the 2017 two, and some the 2018 six living", () => {
  const sets = (gs: readonly (readonly string[])[]) => new Set(gs.map((g) => [...g].sort().join(",")));
  const two = sets(TWO.groups.map((g) => g.members));
  let foundTwo = false;
  let foundSix = false;
  for (let t = THRESHOLD_MIN; t <= THRESHOLD_MAX; t++) {
    const gs = groupsAt(TREE, t);
    if ([...sets(gs)].every((g) => two.has(g)) && gs.length === 2) foundTwo = true;
    // The six living groups, each alone among the living (extinct ones may join one).
    const living = gs.map((g) => g.filter((id) => POPULATIONS.find((p) => p.id === id)!.status !== "extinct")).filter((g) => g.length);
    if (living.length === 6 && living.every((g) => g.length === 1)) foundSix = true;
  }
  assert.ok(foundTwo, "no line gives the two subspecies");
  assert.ok(foundSix, "no line gives the six living groups");
});

test("groupsAt: Caspian and Amur are the last pair to come apart", () => {
  const pairAt = (a: string, b: string) => branches(TREE).find((x) => (x.left.includes(a) && x.right.includes(b)) || (x.left.includes(b) && x.right.includes(a)))!.at;
  const caspianAmur = pairAt("caspian", "amur");
  for (const b of branches(TREE)) assert.ok(b.at >= caspianAmur);
  // The islands against the mainland is the biggest split.
  assert.equal(Math.max(...branches(TREE).map((b) => b.at)), pairAt("bengal", "sumatran"));
});
