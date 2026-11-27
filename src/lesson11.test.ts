import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BARS,
  CHECK,
  COMPANY_EFFECT,
  judgePairs,
  lessonSources,
  PLACE_EFFECT,
  PLACES,
  POSTURE_EFFECT,
  rank,
  RANK_MAX,
  STEPS,
} from "./lesson11.ts";
import { SOURCES } from "./sources.ts";

test("every source the lesson cites is in the site's source list", () => {
  const keys = lessonSources();
  for (const k of ["Dhakal2026", "Shrestha2026", "Gurung2008", "Goodrich2010", "Inskip2009", "Goodrich2022", "Struebig2018", "Thinley2018"]) {
    assert.ok(keys.includes(k), `not cited: ${k}`);
  }
  for (const k of keys) assert.ok(SOURCES[k], `unknown source ${k}`);
});

test("the check: buffer zones and bending carried more risk, and only matching picks are right", () => {
  assert.equal(CHECK.length, 2);
  assert.match(CHECK[0]!.options[CHECK[0]!.answer], /buffer zones/);
  assert.match(CHECK[1]!.options[CHECK[1]!.answer], /bending/);
  assert.deepEqual(judgePairs([1, 0]), [true, true]);
  assert.deepEqual(judgePairs([0, 1]), [false, false]);
  assert.deepEqual(judgePairs([null, 0]), [false, true]);
  for (const p of CHECK) assert.match(p.reveal, /\[@Dhakal2026\]/);
});

test("no step before the check gives its answers away", () => {
  const before = STEPS.slice(0, STEPS.findIndex((s) => s.view === "check")).flatMap((s) => s.text).join(" ");
  for (const giveaway of ["69%", "6.5%", "75%", "41%", "bending", "posture"]) assert.ok(!before.includes(giveaway), `"${giveaway}" appears before the check`);
});

test("the bars: shares within 100%, and each bar within its figure", () => {
  for (const [view, b] of Object.entries(BARS)) {
    for (const r of b.rows) assert.ok(r.value >= 0 && r.value <= b.max, `${view}: ${r.label}`);
    assert.ok(b.rows.some((r) => r.value === b.max) || b.max === 100, `${view}: max is a bar or 100%`);
    assert.ok(b.keys.length > 0, view);
  }
  const share = (view: keyof typeof BARS, ...labels: string[]) => labels.reduce((t, l) => t + BARS[view]!.rows.find((r) => r.label.includes(l))!.value, 0);
  assert.ok(share("where", "buffer zones", "Outside", "national parks") <= 100);
  assert.ok(share("tolerance", "fewer or no", "same number", "more tigers") <= 100);
  assert.equal(BARS.counts!.rows[1]!.value, 141);
});

test("each sandbox choice points the way the studies do, citing them", () => {
  assert.ok(PLACE_EFFECT.forest.up && PLACE_EFFECT.edge.up && !PLACE_EFFECT.far.up);
  assert.ok(COMPANY_EFFECT.alone.up && !COMPANY_EFFECT.group.up);
  assert.ok(POSTURE_EFFECT.bending.up && !POSTURE_EFFECT.upright.up);
  for (const e of [PLACE_EFFECT, COMPANY_EFFECT, POSTURE_EFFECT].flatMap((x) => Object.values(x))) assert.match(e.text, /\[@\w+/);
});

test("the ladder orders the choices: forest > near > far, alone > group, bending > standing", () => {
  const v = (place: (typeof PLACES)[number], company: "alone" | "group", posture: "bending" | "upright") => rank({ place, company, posture });
  assert.equal(v("far", "group", "upright"), 0);
  assert.equal(v("forest", "alone", "bending"), RANK_MAX);
  assert.ok(v("forest", "group", "upright") > v("edge", "group", "upright"));
  assert.ok(v("edge", "group", "upright") > v("far", "group", "upright"));
  assert.ok(v("edge", "alone", "upright") > v("edge", "group", "upright"));
  assert.ok(v("edge", "group", "bending") > v("edge", "group", "upright"));
});
