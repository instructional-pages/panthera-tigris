"""Check the built site's size against the bundle budget.

Sums the gzipped size (level 9) of every file in the build folder and fails when the
total is over the budget: it is the whole download. Given an image budget too, photos
(already compressed, and each downloaded only with the lesson that shows it) are summed
apart against that budget, so they can't hide code growth or the other way round.

Usage: python3 scripts/check_bundle.py [dir] [budget_kb] [image_budget_kb]   (default: dist 60)
"""

import gzip
import sys
from pathlib import Path

IMAGES = {".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"}


def gzipped_sizes(root: Path) -> dict[str, int]:
    """Gzipped byte size of each file under root, keyed by its path relative to root."""
    return {
        p.relative_to(root).as_posix(): len(gzip.compress(p.read_bytes(), 9, mtime=0))
        for p in sorted(root.rglob("*"))
        if p.is_file()
    }


def is_image(name: str) -> bool:
    return Path(name).suffix.lower() in IMAGES


def verdict(label: str, total: int, budget_kb: float) -> bool:
    ok = total <= budget_kb * 1000
    print(f"{label}: {total / 1000:.2f} kB gzipped of {budget_kb:g} kB budget: {'ok' if ok else 'OVER BUDGET'}")
    return ok


def main(argv: list[str]) -> int:
    root = Path(argv[1] if len(argv) > 1 else "dist")
    budget_kb = float(argv[2]) if len(argv) > 2 else 60.0
    image_budget_kb = float(argv[3]) if len(argv) > 3 else None
    if not root.is_dir():
        print(f"bundle: {root}/ not found; build first", file=sys.stderr)
        return 1
    sizes = gzipped_sizes(root)
    for name, size in sizes.items():
        print(f"  {size / 1000:7.2f} kB  {name}")
    if image_budget_kb is None:
        return 0 if verdict("bundle", sum(sizes.values()), budget_kb) else 1
    code = sum(s for n, s in sizes.items() if not is_image(n))
    images = sum(s for n, s in sizes.items() if is_image(n))
    ok = verdict("bundle", code, budget_kb)
    ok = verdict("images", images, image_budget_kb) and ok
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
