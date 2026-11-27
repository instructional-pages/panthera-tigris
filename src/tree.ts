// A family tree of living things, and the question the lesson asks of it: does a group of
// species make up one whole branch? Pure, so it is tested without a browser.

export interface TreeNode {
  readonly id: string;
  /** What the node is called on screen, e.g. "Big cats". */
  readonly label: string;
  /** The scientific name, shown in italics, e.g. "Panthera". */
  readonly latin?: string;
  /** Source keys behind this grouping or species. */
  readonly cites?: readonly string[];
  /** Absent for a species (a leaf). */
  readonly children?: readonly TreeNode[];
}

export const isLeaf = (n: TreeNode): boolean => !n.children || n.children.length === 0;

/** The ids of every species under a node, in tree order. */
export function leaves(n: TreeNode): string[] {
  return isLeaf(n) ? [n.id] : n.children!.flatMap(leaves);
}

/** Finds a node by id, or undefined. */
export function find(n: TreeNode, id: string): TreeNode | undefined {
  if (n.id === id) return n;
  for (const c of n.children ?? []) {
    const hit = find(c, id);
    if (hit) return hit;
  }
  return undefined;
}

/** The smallest node whose species include every id given (the last common ancestor). */
export function smallestBranch(root: TreeNode, ids: ReadonlySet<string>): TreeNode {
  for (const c of root.children ?? []) {
    const under = new Set(leaves(c));
    if ([...ids].every((id) => under.has(id))) return smallestBranch(c, ids);
  }
  return root;
}

export type Verdict =
  /** Fewer than two species: nothing to judge. */
  | { kind: "too-few" }
  /** Exactly the species of one branch. */
  | { kind: "branch"; branch: TreeNode }
  /** Part of a branch whose inner splits the tree leaves open (more than two children). */
  | { kind: "unresolved"; branch: TreeNode }
  /** Not a branch: the smallest branch holding them also holds `missing`. */
  | { kind: "not-a-branch"; branch: TreeNode; missing: string[] };

/**
 * Judges whether the species form one whole branch of the tree: everything descended from
 * their last common ancestor, and nothing else. Unknown ids are ignored.
 */
export function judge(root: TreeNode, chosen: ReadonlySet<string>): Verdict {
  const all = new Set(leaves(root));
  const ids = new Set([...chosen].filter((id) => all.has(id)));
  if (ids.size < 2) return { kind: "too-few" };
  const branch = smallestBranch(root, ids);
  const under = leaves(branch);
  const missing = under.filter((id) => !ids.has(id));
  if (missing.length === 0) return { kind: "branch", branch };
  // A node with three or more children is a split the tree doesn't resolve. A group made of
  // whole children of it might be a branch or might not; the tree can't say.
  const kids = branch.children ?? [];
  if (kids.length > 2) {
    const madeOfWholeChildren = kids.every((k) => {
      const ks = leaves(k);
      const inside = ks.filter((id) => ids.has(id)).length;
      return inside === 0 || inside === ks.length;
    });
    if (madeOfWholeChildren) return { kind: "unresolved", branch };
  }
  return { kind: "not-a-branch", branch, missing };
}
