import { test } from "node:test";
import assert from "node:assert/strict";
import { judgeEstimate } from "./estimate.ts";
import { BARS, BY_COUNTRY, BY_PART, BY_YEAR, CHECK, lessonSources, perYear, poacherShare, PRICES, pricePos, STEPS, TEMPLE, yearBars } from "./lesson12.ts";
import { SOURCES } from "./sources.ts";

test("every source the lesson cites is in the site's source list", () => {
  const keys = lessonSources();
  for (const k of ["Goodrich2022", "Wong2019", "ElvesPowell2024", "Armstrong2024"]) assert.ok(keys.includes(k), `not cited: ${k}`);
  for (const k of keys) assert.ok(SOURCES[k], `unknown source ${k}`);
});

test("the poacher's share: 200 of 10,000 at most, 100 of 70,000 at least", () => {
  const { most, least } = poacherShare();
  assert.equal(most, 2);
  assert.ok(Math.abs(least - 0.1428) < 0.001);
  assert.equal(CHECK.answer, 2);
});

test("the check: anything at or under the 2% bound is close; a tenth of the price is too high", () => {
  for (const g of [0.1, 0.5, 1, 2]) assert.equal(judgeEstimate(CHECK, g).kind, "close", String(g));
  assert.equal(judgeEstimate(CHECK, 10).kind, "high");
  assert.equal(judgeEstimate(CHECK, 50).kind, "high");
});

test("no step before the check gives a price away", () => {
  const before = STEPS.slice(0, STEPS.findIndex((s) => s.view === "check")).flatMap((s) => s.text).join(" ");
  for (const giveaway of ["USD", "$", "2%", "100–200", "70,000"]) assert.ok(!before.includes(giveaway), `"${giveaway}" appears before the check`);
});

test("prices: the chain comes first, each within the log scale", () => {
  assert.deepEqual(PRICES.map((p) => p.chain), [true, true, true, true, false, false]);
  for (const p of PRICES) {
    assert.ok(p.lo <= p.hi, p.label);
    assert.ok(pricePos(p.lo) >= 0 && pricePos(p.hi) <= 1, p.label);
  }
  assert.equal(pricePos(1000), 0.5);
});

test("the year data add up to the report's totals", () => {
  assert.equal(BY_YEAR.length, 19);
  const sum = (i: 0 | 1 | 2) => BY_YEAR.reduce((t, y) => t + y[i], 0);
  assert.equal(sum(0), 1086); // incidents in range countries (Table 4)
  assert.equal(sum(1), 56); // outside them
  assert.equal(sum(0) + sum(1), 1142);
  assert.ok(Math.abs(sum(2) - 2359) <= 2, `tigers ${sum(2)}`); // yearly labels are rounded up
});

test("taking out the temple seizure changes only 2016's tigers", () => {
  const all = yearBars("tigers", false);
  const without = yearBars("tigers", true);
  all.forEach((d, i) => assert.equal(without[i]!.main, d.year === TEMPLE.year ? d.main - TEMPLE.tigers : d.main));
  assert.equal(without.find((d) => d.year === 2016)!.main, 101);
  assert.deepEqual(yearBars("seizures", true), yearBars("seizures", false));
});

test("countries: incidents sum to the report's TRC and outside totals; averages per year", () => {
  const total = BY_COUNTRY.reduce((t, c) => t + c.seizures[0] + (c.seizures[1] ?? 0), 0);
  assert.equal(total, 1142); // Table 4's total; Lao PDR's 9 are all in 2000–2014
  assert.equal(perYear(218, 1), 54.5); // Thailand, 2015–2018, as the report's table gives
  assert.ok(Math.abs(perYear(64, 0) - 4.3) < 0.05); // Indonesia, 2000–2014
});

test("parts: skins are the most, and match the dossier's 40%", () => {
  assert.equal(BY_PART[0]!.label, "Skins");
  assert.equal(BY_PART[0]!.value, 1099);
  for (const p of BY_PART.slice(1)) assert.ok(p.value < BY_PART[0]!.value);
});

test("bars stay within their figures", () => {
  for (const [view, list] of Object.entries(BARS)) for (const b of list) for (const r of b.rows) assert.ok(r.value >= 0 && r.value <= b.max, `${view}: ${r.label}`);
});
