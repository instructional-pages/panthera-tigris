import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { test } from "node:test";
import { LICENCES, PHOTOS } from "./photos.ts";

const all = Object.values(PHOTOS);

test("every bundled image is a credited photo, and every photo's file is bundled", () => {
  const files = readdirSync(new URL("./photos/", import.meta.url)).sort();
  assert.deepEqual(files, all.map((p) => p.file).sort());
});

test("each photo says what it shows, who made it and where its licence was read", () => {
  for (const p of all) {
    assert.ok(p.alt.length > 20 && p.caption.length > 20, p.file);
    assert.ok(p.author.length > 0, p.file);
    assert.match(p.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, p.file);
    assert.ok(LICENCES[p.licence].startsWith("https://creativecommons.org/"), p.file);
  }
});
