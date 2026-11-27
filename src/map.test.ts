import { test } from "node:test";
import assert from "node:assert/strict";
import { allRight, checkPickTask, judge, project, toggle } from "./map.ts";
import { FRAME, REGIONS } from "./map-data.ts";

const region = (id: string) => {
  const r = REGIONS.find((x) => x.id === id);
  assert.ok(r, `region ${id}`);
  return r;
};
const inBox = ([x, y]: number[], box: readonly number[]) => x! >= box[0]! && x! <= box[2]! && y! >= box[1]! && y! <= box[3]!;

test("project puts the frame's corners on the map's corners", () => {
  assert.deepEqual(project(FRAME, FRAME.west, FRAME.north), [0, 0]);
  const [x, y] = project(FRAME, FRAME.east, FRAME.south);
  assert.equal(Math.round(x), FRAME.width);
  assert.equal(Math.round(y), FRAME.height);
});

test("the generated outlines agree with project: known cities fall inside their country", () => {
  // Delhi, Kathmandu, Jakarta (Java), Denpasar (Bali), Medan (Sumatra), Vladivostok, Singapore.
  const cities: [string, number, number][] = [
    ["ind", 77.2, 28.6],
    ["npl", 85.3, 27.7],
    ["java", 106.8, -6.2],
    ["bali", 115.2, -8.65],
    ["sumatra", 98.7, 3.6],
    ["rus", 131.9, 43.1],
    ["sgp", 103.85, 1.3],
  ];
  for (const [id, lon, lat] of cities) assert.ok(inBox(project(FRAME, lon, lat), region(id).box), id);
});

test("every region has a unique id, a path inside the map and its label inside its box", () => {
  assert.equal(new Set(REGIONS.map((r) => r.id)).size, REGIONS.length);
  for (const r of REGIONS) {
    assert.match(r.d, /^(M[-\d ]+l[-\d ]+z)+$/, r.id);
    const [l, t, rt, b] = r.box as number[];
    assert.ok(l! >= 0 && t! >= 0 && rt! <= FRAME.width && b! <= FRAME.height, `${r.id} box ${r.box}`);
    assert.ok(inBox(r.at as number[], r.box), `${r.id} label ${r.at}`);
  }
});

test("Indonesia and Malaysia are split into the parts the course tells apart", () => {
  for (const id of ["sumatra", "java", "bali", "indonesia", "malaya", "borneo-malaysia"]) region(id);
  assert.equal(REGIONS.some((r) => r.id === "idn" || r.id === "mys"), false);
});

const ids = new Set(REGIONS.map((r) => r.id));

test("checkPickTask accepts a task with right and wrong choices on the map", () => {
  assert.doesNotThrow(() => checkPickTask(ids, ["ind", "npl", "lao"], ["ind", "npl"]));
});

test("checkPickTask refuses unknown ids, repeats, answers that aren't choices and one-sided tasks", () => {
  assert.throws(() => checkPickTask(ids, ["ind", "atlantis"], ["ind"]), /no region "atlantis"/);
  assert.throws(() => checkPickTask(ids, ["ind", "ind", "lao"], ["ind"]), /choice is listed twice/);
  assert.throws(() => checkPickTask(ids, ["ind", "lao"], ["ind", "ind"]), /answer is listed twice/);
  assert.throws(() => checkPickTask(ids, ["ind", "lao"], ["npl"]), /"npl" is not a choice/);
  assert.throws(() => checkPickTask(ids, ["ind", "lao"], ["ind", "lao"]), /both right and wrong/);
  assert.throws(() => checkPickTask(ids, ["ind", "lao"], []), /both right and wrong/);
});

test("toggle adds and removes a pick without changing its input", () => {
  const a = new Set(["ind"]);
  assert.deepEqual([...toggle(a, "npl")], ["ind", "npl"]);
  assert.deepEqual([...toggle(a, "ind")], []);
  assert.deepEqual([...a], ["ind"]);
});

test("judge names each choice found, missed, wrong or none", () => {
  const v = judge(["ind", "npl", "lao", "khm"], ["ind", "npl"], new Set(["ind", "lao"]));
  assert.deepEqual([...v], [
    ["ind", "found"],
    ["npl", "missed"],
    ["lao", "wrong"],
    ["khm", "none"],
  ]);
  assert.equal(allRight(v), false);
  assert.equal(allRight(judge(["ind", "npl", "lao"], ["ind", "npl"], new Set(["ind", "npl"]))), true);
});
