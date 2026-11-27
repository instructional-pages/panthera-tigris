import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BIRTHS,
  CAMERA_COUNTS,
  cameras,
  CHECK,
  estimatePopulation,
  growth,
  INDIA,
  lessonSources,
  levelsAt,
  NEPAL,
  photoChance,
  population,
  PREYS,
  RECOVER_ANSWER,
  RECOVER_CHOICES,
  recovers,
  reserve,
  session,
  STEPS,
  surveyResult,
  TIGERS_MAX,
  TIGERS_MIN,
  WORLD,
  AREA,
} from "./lesson14.ts";
import { judgeEstimate } from "./estimate.ts";
import { SOURCES } from "./sources.ts";

test("every source the lesson cites is in the site's source list", () => {
  const keys = lessonSources();
  for (const k of ["Goodrich2022", "Karanth1995", "NTCA2023", "IUCN2026Nepal", "Duangchantrasiri2016", "Chapron2008", "Sanderson2023"]) assert.ok(keys.includes(k), `not cited: ${k}`);
  for (const k of keys) assert.ok(SOURCES[k], `unknown source ${k}`);
});

test("the counts are the sources' figures, each inside its range", () => {
  assert.deepEqual(INDIA.map((c) => c.n), [1411, 1706, 2226, 2967, 3682]);
  assert.deepEqual(NEPAL.map((c) => c.n), [121, 198, 235, 355, 429]);
  for (const c of INDIA) assert.ok(c.lo! <= c.n && c.n <= c.hi!, String(c.year));
  assert.deepEqual(WORLD, { lo: 3726, hi: 5578 });
  // India more than doubled from 2006, Nepal more than tripled.
  assert.equal(growth(INDIA).at(-1)!.toFixed(2), "2.61");
  assert.equal(growth(NEPAL).at(-1)!.toFixed(2), "3.55");
});

test("capture–recapture: n1 × n2 / m, and no estimate without a recapture", () => {
  assert.equal(estimatePopulation(20, 15, 6), 50);
  assert.equal(estimatePopulation(10, 10, 10), 10);
  assert.equal(estimatePopulation(5, 4, 0), null);
  assert.deepEqual(surveyResult([1, 2, 3, 4], [3, 4, 5]), { n1: 4, n2: 3, m: 2, estimate: 6 });
});

test("the estimate check: 50 tigers; 45 to 55 counts as close", () => {
  assert.equal(CHECK.answer, 50);
  for (const g of [45, 50, 55]) assert.equal(judgeEstimate(CHECK, g).kind, "close", String(g));
  assert.equal(judgeEstimate(CHECK, 40).kind, "low");
  assert.equal(judgeEstimate(CHECK, 75).kind, "high"); // n1 + n2 + ... a learner adding up
});

test("cameras: a square grid inside the reserve; bunched ones sit closer together", () => {
  for (const n of CAMERA_COUNTS)
    for (const layout of ["spread", "bunched"] as const) {
      const cams = cameras(n, layout);
      assert.equal(cams.length, n);
      for (const [x, y] of cams) assert.ok(x > 0 && x < AREA.w && y > 0 && y < AREA.h, `${n} ${layout}`);
    }
  const span = (layout: "spread" | "bunched") => Math.max(...cameras(16, layout).map(([x]) => x)) - Math.min(...cameras(16, layout).map(([x]) => x));
  assert.ok(span("bunched") < span("spread"));
  // A tiger beside a camera is likelier to be photographed than one far from all of them.
  assert.ok(photoChance([6, 4], cameras(4, "bunched")) > 0.5);
  assert.ok(photoChance([0, 0], cameras(4, "bunched")) < 0.01);
});

test("a survey is the same every time for a seed, with 20 to 40 tigers", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const t = reserve(seed);
    assert.ok(t.length >= TIGERS_MIN && t.length <= TIGERS_MAX);
    assert.deepEqual(t, reserve(seed));
  }
  const t = reserve(3);
  const cams = cameras(9, "spread");
  assert.deepEqual(session(3, t, cams, 1), session(3, t, cams, 1));
  assert.notDeepEqual(session(3, t, cams, 1), session(3, t, cams, 2));
});

test("bunched cameras underestimate: spread ones come closer to the true number on average", () => {
  const err = (layout: "spread" | "bunched") => {
    let total = 0;
    for (let seed = 1; seed <= 30; seed++) {
      const t = reserve(seed);
      const cams = cameras(16, layout);
      const r = surveyResult(session(seed, t, cams, 1), session(seed, t, cams, 2));
      total += Math.abs((r.estimate ?? 0) - t.length) / t.length;
    }
    return total / 30;
  };
  assert.ok(err("spread") < 0.25, `spread off by ${err("spread")}`);
  assert.ok(err("bunched") > 2 * err("spread"));
});

test("the population model: recovers only while births outpace deaths; 15% with plentiful prey", () => {
  assert.equal(BIRTHS.plentiful, 0.15);
  assert.ok(recovers(0.14, "plentiful"));
  assert.ok(!recovers(0.15, "plentiful"));
  assert.ok(!recovers(0.2, "plentiful"));
  for (const p of PREYS) assert.ok(BIRTHS[p] <= 0.15, p); // no prey level beats the study's line
  // Recovering runs head for their level; failing ones shrink below the start.
  const up = population(0.05, "plentiful");
  assert.ok(Math.abs(up.at(-1)! - levelsAt(0.05, "plentiful")) < 5);
  assert.equal(levelsAt(0.05, "plentiful"), 80);
  const down = population(0.2, "plentiful");
  assert.ok(down.at(-1)! < 2);
  assert.ok(down.every((n, i) => i === 0 || n <= down[i - 1]!));
  // Below two tigers, the model population is gone.
  assert.equal(population(0.3, "scarce").at(-1), 0);
});

test("the recovery check's answer is that it keeps shrinking, as the model shows", () => {
  assert.match(RECOVER_CHOICES[RECOVER_ANSWER], /shrinking/);
  assert.ok(!recovers(0.2, "plentiful"));
});

test("no step before a check gives its answer away", () => {
  const before = (view: string) => STEPS.slice(0, STEPS.findIndex((s) => s.view === view)).flatMap((s) => s.text).join(" ");
  assert.ok(!/\b50\b|n1|÷/.test(before("estimate")));
  assert.ok(!before("recover").includes("15%"));
  assert.ok(!before("recover").includes("Chapron"));
});
