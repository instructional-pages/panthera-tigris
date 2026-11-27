import { test } from "node:test";
import assert from "node:assert/strict";
import { TITLE as TITLE1 } from "./lesson1.ts";
import { TITLE as TITLE2 } from "./lesson2.ts";
import { TITLE as TITLE3 } from "./lesson3.ts";
import { TITLE as TITLE4 } from "./lesson4.ts";
import { TITLE as TITLE5 } from "./lesson5.ts";
import { TITLE as TITLE6 } from "./lesson6.ts";
import { href, lessonOf, TITLES } from "./lessons.ts";

test("the course's list carries each lesson's own title, in order", () => {
  assert.deepEqual(TITLES, [TITLE1, TITLE2, TITLE3, TITLE4, TITLE5, TITLE6]);
});

test("lessonOf: the query string picks the lesson; anything unknown is lesson 1", () => {
  assert.equal(lessonOf(""), 1);
  assert.equal(lessonOf("?lesson=1"), 1);
  assert.equal(lessonOf("?lesson=2"), 2);
  assert.equal(lessonOf("?lesson=3"), 3);
  assert.equal(lessonOf("?lesson=4"), 4);
  assert.equal(lessonOf("?lesson=5"), 5);
  assert.equal(lessonOf("?lesson=6"), 6);
  assert.equal(lessonOf("?x=1&lesson=2"), 2);
  assert.equal(lessonOf("?lesson=99"), 1);
  assert.equal(lessonOf("?lesson=0"), 1);
  assert.equal(lessonOf("?lesson=2x"), 1);
  assert.equal(lessonOf("?lesson=-2"), 1);
});

test("href: every lesson's address leads back to it", () => {
  for (let n = 1; n <= TITLES.length; n++) assert.equal(lessonOf(href(n).replace("./", "")), n);
});
