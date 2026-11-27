// The course's lessons, in order, and which one a page address asks for. Pure, so it is
// tested without a browser; main.ts loads the lesson's code only when it is opened.

export const TITLES: readonly string[] = ["1. What is a tiger?", "2. Two and a half million years of tigers", "3. The body: size, coat, stripes", "4. Voice and senses", "5. Hunting", "6. A territory of her own", "7. A life: mating, cubs, leaving home", "8. How many kinds of tiger?", "9. Where tigers live", "10. Prey, rivals and the forest", "11. Tigers and people", "12. The trade in tiger parts", "13. The tiger in culture", "14. Counting tigers, and saving them", "15. Final quiz"];

/** The address of lesson `n` (1-based); lesson 1 is the course's front page. */
export const href = (n: number): string => (n === 1 ? "./" : `./?lesson=${n}`);

/**
 * The lesson (1-based) a page's query string asks for: "?lesson=2" is 2; anything else is
 * lesson 1. A query, not a hash, because citation links already use the hash.
 */
export function lessonOf(search: string): number {
  const m = /^(\d+)$/.exec(new URLSearchParams(search).get("lesson") ?? "");
  const n = m ? Number(m[1]) : 1;
  return n >= 1 && n <= TITLES.length ? n : 1;
}
