"""Check the built site's size against the bundle budget.

Sums the gzipped size (level 9) of every file in the build folder and fails when the
total is over the budget. Images and other assets count too: it is the whole download.

Usage: python3 scripts/check_bundle.py [dir] [budget_kb]   (default: dist 60)
"""

import gzip
import sys
from pathlib import Path


def gzipped_sizes(root: Path) -> dict[str, int]:
    """Gzipped byte size of each file under root, keyed by its path relative to root."""
    return {
        p.relative_to(root).as_posix(): len(gzip.compress(p.read_bytes(), 9, mtime=0))
        for p in sorted(root.rglob("*"))
        if p.is_file()
    }


def main(argv: list[str]) -> int:
    root = Path(argv[1] if len(argv) > 1 else "dist")
    budget_kb = float(argv[2]) if len(argv) > 2 else 60.0
    if not root.is_dir():
        print(f"bundle: {root}/ not found; build first", file=sys.stderr)
        return 1
    sizes = gzipped_sizes(root)
    total = sum(sizes.values())
    for name, size in sizes.items():
        print(f"  {size / 1000:7.2f} kB  {name}")
    verdict = "ok" if total <= budget_kb * 1000 else "OVER BUDGET"
    print(f"bundle: {total / 1000:.2f} kB gzipped of {budget_kb:g} kB budget: {verdict}")
    return 0 if verdict == "ok" else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
