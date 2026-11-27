import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CATS, CHECKED, grade, lessonSources, PLACES, SANDBOX_ROOT, STEPS, TRAITS, TREE } from "./lesson1.ts";
import { SOURCES } from "./sources.ts";
import { find, judge, leaves } from "./tree.ts";

test("every source the lesson cites is in the site's source list", () => {
  const keys = lessonSources();
  assert.ok(keys.length >= 10);
  for (const k of keys) assert.ok(SOURCES[k], `unknown source ${k}`);
});

test("the site's sources match the dossier's keys and links", () => {
  const dossier = readFileSync(new URL("../docs/research/sources.md", import.meta.url), "utf8");
  for (const [key, s] of Object.entries(SOURCES)) {
    const entry = dossier.split("\n- ").find((e) => e.startsWith(`**[@${key}]**`));
    assert.ok(entry, `${key} missing from sources.md`);
    assert.ok(entry.includes(s.url), `${key}: link ${s.url} not in its dossier entry`);
  }
});

test("every cat and trait refers to a species in the sandbox's branch", () => {
  const species = new Set(leaves(find(TREE, SANDBOX_ROOT)!));
  assert.equal(species.size, 7);
  assert.deepEqual(new Set(CATS.map((c) => c.id)), species);
  for (const t of TRAITS) for (const c of t.cats) assert.ok(species.has(c), `${t.label}: ${c}`);
});

test("the tree's verdicts on the lesson's groupings", () => {
  const root = find(TREE, SANDBOX_ROOT)!;
  const kind = (...ids: string[]) => judge(root, new Set(ids)).kind;
  assert.equal(kind("tiger", "snow-leopard"), "branch");
  assert.equal(kind("tiger", "lion"), "not-a-branch");
  assert.equal(kind("lion", "leopard"), "unresolved");
  assert.equal(kind("nebulosa", "diardi"), "branch");
  const byTrait = Object.fromEntries(TRAITS.map((t) => [t.label, judge(root, new Set(t.cats)).kind]));
  assert.deepEqual(byTrait, {
    "Spots or rosettes": "not-a-branch",
    "Can weigh over 100 kg": "not-a-branch",
    "Lives wild in Asia": "not-a-branch",
    "Panthera in its name": "branch",
  });
});

test("the check: only Panthera's other branch is right, for both cats", () => {
  for (const c of CHECKED) {
    assert.deepEqual(
      PLACES.map((p) => grade(c, p.value).correct),
      [false, true, false],
    );
  }
  assert.match(grade("tiger", "with-lion").text, /lion as the tiger's closest relative \[@SINZ\]/);
  assert.match(grade("snow-leopard", "outside").text, /\*Panthera uncia\*/);
});

test("the check comes before the sandbox, and no step is empty", () => {
  const modes = STEPS.map((s) => s.mode);
  assert.ok(modes.indexOf("check") < modes.indexOf("sandbox"));
  assert.equal(modes.at(-1), "sandbox");
  for (const s of STEPS) assert.ok(s.text.length > 0);
});
