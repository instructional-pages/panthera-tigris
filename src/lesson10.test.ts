import { test } from "node:test";
import assert from "node:assert/strict";
import { judgeEstimate } from "./estimate.ts";
import {
  along,
  AXIS,
  CHECK,
  CHECK_EXPLAIN,
  CHECK_PREY,
  dots,
  KILLS_PER_YEAR,
  km2PerTiger,
  leopardsAt,
  lessonSources,
  PLENTY_FROM,
  RAJAJI,
  SCARCE_BELOW,
  SHARE,
  SHARES,
  SITES,
  STEPS,
  tigersPer100,
} from "./lesson10.ts";
import { SOURCES } from "./sources.ts";

test("every source the lesson cites is in the site's source list", () => {
  const keys = lessonSources();
  for (const k of ["Goodrich2022", "Karanth2004", "Miller2013", "Carter2019", "Karanth2000", "Steinmetz2013", "Harihar2011", "Liu2026"]) {
    assert.ok(keys.includes(k), `not cited: ${k}`);
  }
  for (const k of keys) assert.ok(SOURCES[k], `unknown source ${k}`);
});

test("the model: tigers grow in step with prey, and with the share spared", () => {
  assert.equal(tigersPer100(20), 4); // 2,000 prey × 10% ÷ 50
  assert.equal(tigersPer100(40), 2 * tigersPer100(20));
  assert.equal(tigersPer100(20, 0.2), 2 * tigersPer100(20, 0.1));
  assert.equal(tigersPer100(20, 0.1, 100), 2);
  assert.equal(tigersPer100(0), 0);
  assert.ok(SHARES.includes(SHARE));
  assert.ok(KILLS_PER_YEAR >= 50 && KILLS_PER_YEAR <= 60, "within the sources' 50–60 kills a year");
});

test("forest per tiger is 100 km² shared out", () => {
  assert.equal(km2PerTiger(4), 25);
  assert.equal(km2PerTiger(0.5), 200);
  assert.equal(km2PerTiger(0), Infinity);
});

test("the check's answer is the model's, the explanation says it, and 3 to 5 count as close", () => {
  assert.equal(CHECK.answer, tigersPer100(CHECK_PREY));
  assert.equal(CHECK.answer, 4);
  assert.ok(CHECK_EXPLAIN.includes(`= ${CHECK.answer} tigers`));
  assert.equal(judgeEstimate(CHECK, 3).kind, "close");
  assert.equal(judgeEstimate(CHECK, 5).kind, "close");
  assert.equal(judgeEstimate(CHECK, 2).kind, "low");
  assert.equal(judgeEstimate(CHECK, 6).kind, "high");
});

test("no step before the check gives its answer away", () => {
  const before = STEPS.slice(0, STEPS.findIndex((s) => s.view === "check")).flatMap((s) => s.text).join(" ");
  assert.ok(!before.includes(`${CHECK_PREY} deer`) && !before.includes("= 4"), "the check's numbers appear before it");
});

test("the sites are the sources' figures, and all fit on the axis", () => {
  const by = (l: string) => SITES.find((s) => s.label.startsWith(l))!;
  assert.deepEqual([by("Kaziranga").lo, by("Kaziranga").hi], [15, 19]);
  assert.deepEqual([by("11 sites").lo, by("11 sites").hi], [3.2, 16.8]);
  assert.deepEqual([by("Rajaji").lo, by("Rajaji").hi], [RAJAJI.tigers.before, RAJAJI.tigers.after]);
  assert.deepEqual([by("Sikhote").lo, by("Sikhote").hi], [0.13, 0.45]);
  for (const s of SITES) {
    assert.ok(s.lo <= s.hi);
    assert.ok(along(s.lo) >= 0 && along(s.hi) <= 1, s.label);
  }
  assert.equal(along(AXIS.min), 0);
  assert.equal(along(AXIS.max), 1);
});

test("leopards: avoid under scarce prey, share with plenty, and the gap between is left unknown", () => {
  assert.equal(leopardsAt(SCARCE_BELOW - 1), "avoid");
  assert.equal(leopardsAt(SCARCE_BELOW), "unknown");
  assert.equal(leopardsAt(PLENTY_FROM - 1), "unknown");
  assert.equal(leopardsAt(PLENTY_FROM), "share");
});

test("dots: one per tiger, inside the 10 km square, the same every time", () => {
  for (const n of [0, 1, 4, 7, 28]) {
    const d = dots(n);
    assert.equal(d.length, n);
    for (const p of d) assert.ok(p.x > 0 && p.x < 10 && p.y > 0 && p.y < 10);
  }
  assert.deepEqual(dots(9), dots(9));
});
