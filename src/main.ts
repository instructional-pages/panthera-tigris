import "./style.css";
import { href, lessonOf, TITLES } from "./lessons.ts";
import { type Lesson, mount } from "./shell.ts";

// Each lesson's code is loaded only when it is opened.
const LOAD: readonly (() => Promise<Lesson>)[] = [
  () => import("./lesson1-view.ts").then((m) => m.lesson1),
  () => import("./lesson2-view.ts").then((m) => m.lesson2),
];

const n = lessonOf(location.search);
mount(await LOAD[n - 1]!(), { lesson: n, titles: TITLES, href });
