import { test } from "node:test";
import assert from "node:assert/strict";
import {
  at,
  byZone,
  CHECK_EXPLAIN,
  CHECK_MARKS,
  CHECK_STEP,
  COLS,
  FIELD_LEVELS,
  has,
  isPath,
  judgeMarks,
  lessonSources,
  MARK_CHANCE,
  odourField,
  othersMarks,
  RANGES,
  ROWS,
  STEPS,
  stepTo,
  TIGERS,
  toggleMark,
  VISITS,
  walker,
  wander,
  zone,
  zoneSizes,
} from "./lesson6.ts";
import { SOURCES } from "./sources.ts";

test("every source the lesson cites is in the site's source list", () => {
  const keys = lessonSources();
  assert.deepEqual(new Set(keys), new Set(["Smith1993", "Smith1989", "Liu2024", "SINZ", "Goodrich2022", "Burger2008"]));
  for (const k of keys) assert.ok(SOURCES[k], `unknown source ${k}`);
});

test("the map: a rectangle of known letters, females never sharing a cell, the male over two of them", () => {
  for (const row of RANGES) assert.equal(row.length, COLS);
  assert.equal(ROWS, 11);
  assert.match(RANGES.join(""), /^[.AJB]+$/);
  let maleOver = new Set<string>();
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const females = TIGERS.filter((t) => t !== "male" && has(t, c, r));
      assert.ok(females.length <= 1);
      if (has("male", c, r) && females[0]) maleOver.add(females[0]);
    }
  assert.deepEqual([...maleOver].sort(), ["junu", "mother"]);
  assert.ok(!has("junu", -1, 0) && !has("junu", COLS, 0));
});

test("zones: inside, edge, and an edge where a route crosses it", () => {
  assert.equal(zone("junu", 8, 4), "inside");
  assert.equal(zone("junu", 7, 1), "edge"); // the mother is to the west, open land above
  assert.equal(zone("junu", 5, 5), "crossing"); // the east–west route, at the mother's side
  assert.equal(zone("junu", 11, 5), "crossing"); // and at the neighbour's side
  assert.equal(zone("junu", 9, 1), "crossing"); // the north–south route, at the top
  assert.equal(zone("junu", 9, 5), "inside"); // routes cross each other inside: not an edge
  assert.ok(isPath(9, 5));
  assert.equal(zone("junu", 2, 2), null);
  assert.deepEqual(zoneSizes("junu"), { inside: 27, edge: 18, crossing: 4 });
});

test("a step: moves within the range, stays put at its edge, and counts the time where it ends", () => {
  const w = walker("junu", 1);
  w.pos = [7, 1];
  assert.equal(stepTo(w, 0), false); // north is open land
  assert.deepEqual(w.pos, [7, 1]);
  assert.equal(stepTo(w, 1), true);
  assert.deepEqual(w.pos, [8, 1]);
  assert.equal(w.steps[at(7, 1)], 1);
  assert.equal(w.steps[at(8, 1)], 1);
});

test("the model: equal time everywhere, marks piled at edges and crossings", () => {
  const w = walker("junu", 7);
  wander(w, 200_000);
  const sizes = zoneSizes("junu");
  const cells = sizes.inside + sizes.edge + sizes.crossing;
  const time = byZone("junu", w.steps);
  const marks = byZone("junu", w.marks);
  // Time follows area (a blocked step stays put), within a couple of points.
  assert.ok(Math.abs(time.inside - sizes.inside / cells) < 0.02, `inside time ${time.inside}`);
  assert.ok(Math.abs(time.crossing - sizes.crossing / cells) < 0.01, `crossing time ${time.crossing}`);
  // Marks per step spent are highest at crossings, then edges, then inside.
  const rate = (z: "inside" | "edge" | "crossing") => marks[z] / time[z];
  assert.ok(rate("crossing") > rate("edge") && rate("edge") > rate("inside"));
  assert.ok(marks.edge + marks.crossing > 0.75);
  assert.ok(MARK_CHANCE.crossing > MARK_CHANCE.edge && MARK_CHANCE.edge > MARK_CHANCE.inside);
});

test("byZone: shares that sum to one, or all zero for no counts", () => {
  const counts = new Array<number>(COLS * ROWS).fill(0);
  assert.deepEqual(byZone("junu", counts), { inside: 0, edge: 0, crossing: 0 });
  counts[at(8, 4)] = 3;
  counts[at(5, 5)] = 1;
  counts[at(2, 2)] = 50; // the mother's: not counted for Junu
  assert.deepEqual(byZone("junu", counts), { inside: 0.75, edge: 0, crossing: 0.25 });
});

test("the other tigers' marks are the same every visit, and none in Junu's range but the male's", () => {
  const a = othersMarks();
  assert.deepEqual(a, othersMarks());
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) if (a[at(c, r)]! > 0) assert.ok(!has("junu", c, r) || has("male", c, r), `${c},${r}`);
});

test("the odour field: strongest where the marks are, fading with distance, in levels", () => {
  const marks = new Array<number>(COLS * ROWS).fill(0);
  assert.ok(odourField(marks).every((v) => v === 0));
  marks[at(5, 5)] = 10;
  const f = odourField(marks);
  assert.equal(f[at(5, 5)], FIELD_LEVELS);
  assert.ok(f[at(6, 5)]! < FIELD_LEVELS && f[at(6, 5)]! > 0);
  assert.ok(f[at(7, 5)]! < f[at(6, 5)]!);
  assert.equal(f[at(9, 5)], 0);
});

test("the check: marks only in Junu's range, at most five, toggled off again", () => {
  let p: number[] = [];
  p = toggleMark(p, at(2, 2)); // her mother's
  assert.deepEqual(p, []);
  for (const c of [5, 6, 7, 8, 10]) p = toggleMark(p, at(c, 5));
  assert.equal(p.length, CHECK_MARKS);
  assert.deepEqual(toggleMark(p, at(8, 4)), p);
  p = toggleMark(p, at(6, 5));
  assert.equal(p.length, 4);
  assert.deepEqual(judgeMarks([at(5, 5), at(7, 1), at(8, 4)]), ["crossing", "edge", "inside"]);
});

test("the check comes before the steps that give its answer away", () => {
  assert.equal(STEPS[CHECK_STEP]!.view, "check");
  const before = STEPS.slice(0, CHECK_STEP + 1).flatMap((s) => s.text).join(" ");
  assert.ok(!/edge|boundar|cross|border/i.test(before), "where tigers mark is told before the check");
  assert.match(CHECK_EXPLAIN, /edges/);
  assert.match(STEPS[CHECK_STEP + 1]!.text.join(" "), /edges/);
});

test("the timing drawing: the two females never at the boundary on the same day", () => {
  for (const d of VISITS.mother) assert.ok(!VISITS.junu.includes(d));
});
