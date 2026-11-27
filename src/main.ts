import "./style.css";
import { href, lessonOf, TITLES } from "./lessons.ts";
import { type Lesson, mount } from "./shell.ts";

// Each lesson's code is loaded only when it is opened.
const LOAD: readonly (() => Promise<Lesson>)[] = [
  () => import("./lesson1-view.ts").then((m) => m.lesson1),
  () => import("./lesson2-view.ts").then((m) => m.lesson2),
  () => import("./lesson3-view.ts").then((m) => m.lesson3),
  () => import("./lesson4-view.ts").then((m) => m.lesson4),
  () => import("./lesson5-view.ts").then((m) => m.lesson5),
  () => import("./lesson6-view.ts").then((m) => m.lesson6),
  () => import("./lesson7-view.ts").then((m) => m.lesson7),
  () => import("./lesson8-view.ts").then((m) => m.lesson8),
  () => import("./lesson9-view.ts").then((m) => m.lesson9),
  () => import("./lesson10-view.ts").then((m) => m.lesson10),
  () => import("./lesson11-view.ts").then((m) => m.lesson11),
  () => import("./lesson12-view.ts").then((m) => m.lesson12),
  () => import("./lesson13-view.ts").then((m) => m.lesson13),
  () => import("./lesson14-view.ts").then((m) => m.lesson14),
  () => import("./lesson15-view.ts").then((m) => m.lesson15),
];

const n = lessonOf(location.search);
mount(await LOAD[n - 1]!(), { lesson: n, titles: TITLES, href });
