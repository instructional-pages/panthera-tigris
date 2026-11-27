import { test } from "node:test";
import assert from "node:assert/strict";
import { find, judge, leaves, smallestBranch, type TreeNode } from "./tree.ts";

// ((a, b), (c, d, e)): the second branch has an unresolved three-way split.
const T: TreeNode = {
  id: "root",
  label: "root",
  children: [
    { id: "ab", label: "ab", children: [{ id: "a", label: "a" }, { id: "b", label: "b" }] },
    {
      id: "cde",
      label: "cde",
      children: [{ id: "c", label: "c" }, { id: "d", label: "d" }, { id: "e", label: "e" }],
    },
  ],
};
const ids = (...xs: string[]) => new Set(xs);

test("leaves lists the species in tree order", () => {
  assert.deepEqual(leaves(T), ["a", "b", "c", "d", "e"]);
  assert.deepEqual(leaves(find(T, "a")!), ["a"]);
  assert.equal(find(T, "zz"), undefined);
});

test("smallestBranch finds the last common ancestor", () => {
  assert.equal(smallestBranch(T, ids("a", "b")).id, "ab");
  assert.equal(smallestBranch(T, ids("a", "c")).id, "root");
  assert.equal(smallestBranch(T, ids("d")).id, "d");
});

test("fewer than two known species is too few", () => {
  assert.deepEqual(judge(T, ids()), { kind: "too-few" });
  assert.deepEqual(judge(T, ids("a")), { kind: "too-few" });
  assert.deepEqual(judge(T, ids("a", "nope")), { kind: "too-few" });
});

test("a whole branch is a branch", () => {
  const v = judge(T, ids("a", "b"));
  assert.equal(v.kind, "branch");
  assert.equal(v.kind === "branch" && v.branch.id, "ab");
  assert.equal(judge(T, ids("a", "b", "c", "d", "e")).kind, "branch");
  assert.equal(judge(T, ids("c", "d", "e")).kind, "branch");
});

test("a group that cuts across branches is not a branch, and names what is missing", () => {
  const v = judge(T, ids("a", "c"));
  assert.equal(v.kind, "not-a-branch");
  assert.equal(v.kind === "not-a-branch" && v.branch.id, "root");
  assert.deepEqual(v.kind === "not-a-branch" && v.missing, ["b", "d", "e"]);
  // Part of a resolved branch plus a whole one is still not a branch.
  assert.equal(judge(T, ids("a", "c", "d", "e")).kind, "not-a-branch");
});

test("part of an unresolved split is unresolved, not a verdict", () => {
  const v = judge(T, ids("c", "d"));
  assert.equal(v.kind, "unresolved");
  assert.equal(v.kind === "unresolved" && v.branch.id, "cde");
});
