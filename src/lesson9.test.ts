import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BREEDING,
  countAt,
  INDIGENOUS_KM2,
  LAST_YEAR,
  LAYERS,
  lessonSources,
  lostIn,
  PLACES,
  stateAt,
  STEPS,
  TCL_BY_COUNTRY,
  TCL_TOTAL_KM2,
  YEARS,
} from "./lesson9.ts";
import { checkPickTask } from "./map.ts";
import { REGIONS } from "./map-data.ts";
import { SOURCES } from "./sources.ts";

const ids = new Set(REGIONS.map((r) => r.id));
const at = (id: string) => PLACES.find((p) => p.id === id)!;

test("every source the lesson cites is in the site's source list", () => {
  const keys = lessonSources();
  assert.deepEqual(new Set(keys), new Set(["Goodrich2022", "Sanderson2023"]));
  for (const k of keys) assert.ok(SOURCES[k], `unknown source ${k}`);
});

test("the old range is the source's 30 countries, drawn as 33 places, each on the map once", () => {
  assert.equal(PLACES.length, 33); // Indonesia as three islands, Hong Kong apart from China
  assert.equal(new Set(PLACES.map((p) => p.id)).size, PLACES.length);
  for (const p of PLACES) assert.ok(ids.has(p.id), `no region ${p.id}`);
  assert.ok(!PLACES.some((p) => p.id === "indonesia" || p.id === "borneo-malaysia"), "tigers never lived there");
});

test("the check: the ten places with breeding tigers, among wrong choices, is a valid pick task", () => {
  assert.deepEqual(new Set(BREEDING), new Set(["bgd", "btn", "chn", "ind", "sumatra", "malaya", "mmr", "npl", "rus", "tha"]));
  checkPickTask(ids, PLACES.map((p) => p.id), BREEDING);
});

test("a place is lost from the decade after the source's decade, and never comes back", () => {
  assert.equal(stateAt(at("sgp"), 1930), "tigers"); // lost in the 1930s
  assert.equal(stateAt(at("sgp"), 1940), "gone");
  assert.equal(stateAt(at("vnm"), 2000), "tigers"); // about 2004
  assert.equal(stateAt(at("vnm"), 2010), "gone");
  assert.equal(stateAt(at("lao"), 2010), "tigers"); // about 2014
  assert.equal(stateAt(at("lao"), 2020), "gone");
  for (const p of PLACES) {
    const states = YEARS.map((y) => stateAt(p, y));
    const firstGone = states.indexOf("gone");
    if (firstGone >= 0) assert.ok(states.slice(firstGone).every((s) => s === "gone"), p.id);
  }
});

test("Java is unsure between the sources' two dates; undated places are unsure throughout", () => {
  assert.equal(stateAt(at("java"), 1960), "tigers");
  assert.equal(stateAt(at("java"), 1970), "unsure");
  assert.equal(stateAt(at("java"), 1980), "unsure");
  assert.equal(stateAt(at("java"), 1990), "gone");
  for (const y of YEARS) assert.equal(stateAt(at("tur"), y), "unsure");
});

test("in 2020 the only places with tigers are the ten breeding ones", () => {
  const living = PLACES.filter((p) => stateAt(p, LAST_YEAR) === "tigers").map((p) => p.id);
  assert.deepEqual(new Set(living), new Set(BREEDING));
  const c = countAt(LAST_YEAR);
  assert.equal(c.tigers + c.gone + c.unsure, PLACES.length);
});

test("lostIn names each dated loss exactly once over the century", () => {
  const named = YEARS.flatMap((y) => lostIn(y).map((p) => p.id));
  const dated = PLACES.filter((p) => p.lostBy !== undefined).map((p) => p.id);
  assert.deepEqual(named.sort(), dated.sort());
  assert.deepEqual(lostIn(1900), []);
});

test("the layers are the source's figures, and fit inside the old range", () => {
  const total = LAYERS.reduce((t, l) => t + l.km2, 0);
  assert.ok(total <= INDIGENOUS_KM2);
  assert.ok(INDIGENOUS_KM2 - total < 0.02 * INDIGENOUS_KM2, "the unsplit rest is small");
  for (const l of LAYERS) assert.ok(Math.abs((100 * l.km2) / INDIGENOUS_KM2 - l.pct) < 1, `${l.key}: ${l.pct}% vs its km²`);
  assert.equal(LAYERS.find((l) => l.key === "tcl")!.km2, TCL_TOTAL_KM2);
});

test("landscape area by country: the ten breeding places, largest first, adding up to the total", () => {
  assert.deepEqual(new Set(TCL_BY_COUNTRY.map((c) => c.id)), new Set(BREEDING));
  for (let i = 1; i < TCL_BY_COUNTRY.length; i++) assert.ok(TCL_BY_COUNTRY[i - 1]!.km2 >= TCL_BY_COUNTRY[i]!.km2);
  const sum = TCL_BY_COUNTRY.reduce((t, c) => t + c.km2, 0);
  assert.ok(Math.abs(sum - TCL_TOTAL_KM2) <= 2, "the source's table rounds by 2 km²");
});

test("no step before the check names the countries that still have tigers", () => {
  const check = STEPS.findIndex((s) => s.view === "check");
  const before = STEPS.slice(0, check + 1).flatMap((s) => s.text).join(" ");
  for (const word of ["Bangladesh", "Bhutan", "Myanmar", "Thailand", "Sumatra", "Malaysia"]) assert.ok(!before.includes(word), word);
});
