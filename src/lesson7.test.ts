import { test } from "node:test";
import assert from "node:assert/strict";
import { judgeEstimate, valueAt } from "./estimate.ts";
import {
  alive,
  AREAS,
  chances,
  CHECK,
  CHECK_EXPLAIN,
  cohort,
  COHORT_STAGES,
  counts,
  expected,
  lessonSources,
  MATING_PEAK,
  ORDER_EXPLAIN,
  PATHS,
  SPANS,
  STAGES,
  STAGES_START,
  STEPS,
} from "./lesson7.ts";
import { checkStart } from "./order.ts";
import { SOURCES } from "./sources.ts";

test("every source the lesson cites is in the site's source list", () => {
  const keys = lessonSources();
  assert.deepEqual(new Set(keys), new Set(["SINZ", "CATSG", "Smith1989", "Kerley2003", "Smith1993", "Gour2013", "Liu2024"]));
  for (const k of keys) assert.ok(SOURCES[k], `unknown source ${k}`);
});

test("the order check starts with nothing in place and teaches each stage", () => {
  assert.doesNotThrow(() => checkStart(STAGES_START, STAGES.length));
  assert.match(ORDER_EXPLAIN, /\[@Smith1993\]/);
});

test("the order check comes before the stages are told, and the cubs check before the survival figures", () => {
  const at = (v: string) => STEPS.findIndex((s) => s.view === v);
  assert.ok(at("order") < at("stages"));
  assert.ok(at("estimate") < at("survival"));
  const before = STEPS.slice(0, at("survival")).flatMap((s) => s.text).join(" ");
  assert.doesNotMatch(before, /34%|17%|half/);
  const beforeStages = STEPS.slice(0, at("stages")).flatMap((s) => s.text).join(" ");
  assert.doesNotMatch(beforeStages, /19 to 28|semi-independent/);
});

test("most mating is November to April: six months", () => {
  assert.deepEqual([...MATING_PEAK].sort((a, b) => a - b), [0, 1, 2, 3, 10, 11]);
});

test("the stages time line: each span is ordered and cited", () => {
  for (const s of SPANS) {
    assert.ok(s.from <= s.to, s.label);
    if (s.mean !== undefined) assert.ok(s.mean >= s.from && s.mean <= s.to, s.label);
    assert.ok(s.keys.length > 0);
  }
});

test("the map: Junu's path is short, her brother's long, and neither enters farmland", () => {
  const len = (p: readonly (readonly [number, number])[]) => p.slice(1).reduce((d, q, i) => d + Math.hypot(q[0] - p[i]![0], q[1] - p[i]![1]), 0);
  assert.ok(len(PATHS.brother) > 3 * len(PATHS.junu));
  const farm = AREAS.find((a) => a.kind === "farm")!;
  for (const p of [...PATHS.junu, ...PATHS.brother]) assert.ok(p[1] < farm.y, `point ${p} is in farmland`);
});

test("alive: ten Chitwan cubs leave about 6.6 after a year and 5.5 after two", () => {
  const [n0, n1, n2] = alive(10, [0.34, 0.17]);
  assert.equal(n0, 10);
  assert.ok(Math.abs(n1! - 6.6) < 1e-9);
  assert.ok(Math.abs(n2! - 5.478) < 1e-9);
  assert.match(CHECK_EXPLAIN, /5\.5/);
});

test("the cubs check: 5 or 6 is close, 4 and 7 are not", () => {
  const verdict = (v: number) => judgeEstimate(CHECK, v).kind;
  assert.equal(verdict(5), "close");
  assert.equal(verdict(6), "close");
  assert.equal(verdict(4), "low");
  assert.equal(verdict(7), "high");
  assert.equal(valueAt(CHECK, 3), 3); // whole cubs
});

test("chances: the studies' figures, daughters settling more than sons", () => {
  const near = (a: readonly number[], b: readonly number[]) => a.forEach((x, i) => assert.ok(Math.abs(x - b[i]!) < 1e-9, `${a} vs ${b}`));
  near(chances("chitwan", "daughter"), [0.66, 0.83, 1]);
  near(chances("chitwan", "son"), [0.66, 0.83, 0.5]);
  assert.ok(Math.abs(chances("russia", "son")[0] - 1.3 / 2.4) < 1e-9);
});

test("cohort: half daughters, the same run for the same seed, counts never rising", () => {
  const a = cohort(100, "chitwan", 7);
  assert.deepEqual(a, cohort(100, "chitwan", 7));
  assert.equal(a.filter((c) => c.sex === "daughter").length, 50);
  for (const sex of ["daughter", "son"] as const) {
    const n = counts(a, sex);
    assert.equal(n.length, COHORT_STAGES.length);
    assert.equal(n[0], 50);
    for (let i = 1; i < n.length; i++) assert.ok(n[i]! <= n[i - 1]!);
  }
  // A daughter who reaches two always settles in this model.
  const d = counts(a, "daughter");
  assert.equal(d[3], d[2]);
});

test("cohort: many runs average to the expected numbers", () => {
  const runs = 400;
  const sum = [0, 0, 0, 0];
  for (let k = 0; k < runs; k++) counts(cohort(100, "chitwan", k), "son").forEach((v, i) => (sum[i]! += v));
  const want = expected(50, "chitwan", "son");
  sum.forEach((v, i) => assert.ok(Math.abs(v / runs - want[i]!) < 0.5, `stage ${i}: ${v / runs} vs ${want[i]}`));
});

test("expected: fewer reach a year in the Russian Far East than in Chitwan", () => {
  assert.ok(expected(50, "russia", "daughter")[1]! < expected(50, "chitwan", "daughter")[1]!);
});
