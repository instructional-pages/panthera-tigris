import { test } from "node:test";
import assert from "node:assert/strict";
import { citedKeys, parse } from "./cite.ts";

test("splits text and citation groups", () => {
  assert.deepEqual(parse("A [@X] b [@Y; @Z-2]."), [
    { text: "A " },
    { cites: ["X"] },
    { text: " b " },
    { cites: ["Y", "Z-2"] },
    { text: "." },
  ]);
});

test("text without citations is one run; brackets that aren't citations stay text", () => {
  assert.deepEqual(parse("plain [not one]"), [{ text: "plain [not one]" }]);
  assert.deepEqual(parse(""), []);
});

test("citedKeys keeps first-appearance order without repeats", () => {
  assert.deepEqual(citedKeys(["a [@B] [@A]", "[@B; @C]"]), ["B", "A", "C"]);
});
