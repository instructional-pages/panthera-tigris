// Citations on the site: text carries `[@Key]` or `[@Key; @Other]`, the same markers the
// research dossier uses, and each becomes a numbered link to the lesson's source list.

export type Segment = { text: string } | { cites: string[] };

const MARK = /\[(@[A-Za-z][\w-]*(?:;\s*@[A-Za-z][\w-]*)*)\]/g;

/** Splits text into plain runs and citation groups, in order. */
export function parse(text: string): Segment[] {
  const out: Segment[] = [];
  let at = 0;
  for (const m of text.matchAll(MARK)) {
    if (m.index > at) out.push({ text: text.slice(at, m.index) });
    out.push({ cites: m[1]!.split(";").map((k) => k.trim().slice(1)) });
    at = m.index + m[0].length;
  }
  if (at < text.length) out.push({ text: text.slice(at) });
  return out;
}

/** Every key cited in the texts, in order of first appearance, without repeats. */
export function citedKeys(texts: readonly string[]): string[] {
  const seen: string[] = [];
  for (const t of texts)
    for (const s of parse(t))
      if ("cites" in s) for (const k of s.cites) if (!seen.includes(k)) seen.push(k);
  return seen;
}
