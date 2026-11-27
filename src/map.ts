// The range map's logic (lessons 9, 13, 14, 15): where a place falls on the map, and how a
// "pick the places on the map" task is judged. The outlines themselves are generated into
// map-data.ts by scripts/make_map.py. Pure, so it is tested without a browser.

/** The map's frame in degrees, its size in map units, and the projection's constants. */
export interface MapFrame {
  readonly west: number;
  readonly east: number;
  readonly south: number;
  readonly north: number;
  readonly width: number;
  readonly height: number;
  /** Longitudes are shrunk by this (the cosine of the latitude kept true). */
  readonly kx: number;
  /** Map units per degree of latitude. */
  readonly scale: number;
}

/** One place on the map: a country, or a part of one the course tells apart (Java, Bali). */
export interface MapRegion {
  readonly id: string;
  readonly name: string;
  /** Drawn with the finer outline; a drawing choice, not a fact about tigers. */
  readonly detail: boolean;
  /** Bounding box in map units: [left, top, right, bottom]. */
  readonly box: readonly number[];
  /** Where its name goes, in map units. */
  readonly at: readonly number[];
  /** SVG path data in map units. */
  readonly d: string;
}

/** Degrees to map units: x grows east, y grows south, (0, 0) is the frame's north-west corner. */
export function project(f: MapFrame, lon: number, lat: number): [number, number] {
  return [(lon - f.west) * f.kx * f.scale, (f.north - lat) * f.scale];
}

/** What a region turned out to be once a pick task is locked in. */
export type Verdict = "found" | "missed" | "wrong" | "none";

/**
 * Checks a pick task against the map: every choice and answer is a region, no id twice, and
 * every answer is among the choices, with at least one choice that isn't an answer (or picking
 * everything would always be right).
 */
export function checkPickTask(ids: ReadonlySet<string>, choices: readonly string[], answer: readonly string[]): void {
  for (const id of [...choices, ...answer]) if (!ids.has(id)) throw new Error(`no region "${id}" on the map`);
  if (new Set(choices).size !== choices.length) throw new Error("a choice is listed twice");
  if (new Set(answer).size !== answer.length) throw new Error("an answer is listed twice");
  const missing = answer.find((id) => !choices.includes(id));
  if (missing) throw new Error(`answer "${missing}" is not a choice`);
  if (answer.length === 0 || answer.length === choices.length) throw new Error("a pick task needs both right and wrong choices");
}

/** The picks with `id` added, or removed when it was already picked. */
export function toggle(picked: ReadonlySet<string>, id: string): Set<string> {
  const out = new Set(picked);
  if (!out.delete(id)) out.add(id);
  return out;
}

/** Each choice's verdict: picked and right (found), right but not picked (missed), picked but wrong. */
export function judge(choices: readonly string[], answer: readonly string[], picked: ReadonlySet<string>): Map<string, Verdict> {
  const right = new Set(answer);
  return new Map(
    choices.map((id): [string, Verdict] => {
      if (right.has(id)) return [id, picked.has(id) ? "found" : "missed"];
      return [id, picked.has(id) ? "wrong" : "none"];
    }),
  );
}

/** True when exactly the right regions are picked. */
export function allRight(verdicts: ReadonlyMap<string, Verdict>): boolean {
  return [...verdicts.values()].every((v) => v === "found" || v === "none");
}
