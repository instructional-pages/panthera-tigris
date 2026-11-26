"""Check the research dossier's citations (docs/research/).

Rules:
- sources.md lists every source as a bullet starting `- **[@Key]**`, with an https link.
- Topic files cite with `[@Key]` or `[@Key; @Other]`. Every cited key is in sources.md.
- Every source in sources.md is cited by at least one topic file.
- index.md links every other .md file in the folder.

Usage: python3 scripts/check_research.py [dir]   (default: docs/research)
"""

import re
import sys
from pathlib import Path

ENTRY = re.compile(r"^- \*\*\[@([A-Za-z][\w-]*)\]\*\*(.*)$")
CITE = re.compile(r"\[(@[^\]]+)\]")
KEY = re.compile(r"^@([A-Za-z][\w-]*)$")


def entries(sources: str) -> list[tuple[str, str]]:
    """(key, text) for each source bullet; indented lines continue the bullet above."""
    found = []
    inside = False
    for line in sources.splitlines():
        m = ENTRY.match(line)
        if m:
            found.append((m.group(1), m.group(2)))
            inside = True
        elif inside and line.startswith((" ", "\t")) and line.strip():
            key, text = found[-1]
            found[-1] = (key, text + " " + line.strip())
        else:
            inside = False
    return found


def check(files: dict[str, str]) -> list[str]:
    """Return the problems found in {filename: text}; an empty list means it passes."""
    if not files:
        return []
    errors = []
    sources = files.get("sources.md")
    index = files.get("index.md")
    if sources is None:
        errors.append("sources.md is missing")
        sources = ""
    if index is None:
        errors.append("index.md is missing")
        index = ""

    defined = {}
    for key, rest in entries(sources):
        if key in defined:
            errors.append(f"sources.md: @{key} is listed twice")
        defined[key] = rest
        if "https://" not in rest:
            errors.append(f"sources.md: @{key} has no https link")

    cited = set()
    for name, text in sorted(files.items()):
        if name == "sources.md":
            continue
        for lineno, line in enumerate(text.splitlines(), 1):
            for m in CITE.finditer(line):
                for part in m.group(1).split(";"):
                    k = KEY.match(part.strip())
                    if not k:
                        errors.append(f"{name}:{lineno}: malformed citation [{m.group(1)}]")
                        continue
                    cited.add(k.group(1))
                    if k.group(1) not in defined:
                        errors.append(f"{name}:{lineno}: @{k.group(1)} is not in sources.md")

    for key in sorted(set(defined) - cited):
        errors.append(f"sources.md: @{key} is never cited")

    for name in sorted(files):
        if name != "index.md" and f"({name})" not in index:
            errors.append(f"index.md does not link {name}")
    return errors


def main() -> int:
    folder = Path(sys.argv[1] if len(sys.argv) > 1 else "docs/research")
    files = {p.name: p.read_text(encoding="utf-8") for p in sorted(folder.glob("*.md"))}
    errors = check(files)
    for e in errors:
        print(e, file=sys.stderr)
    print(f"research: {len(files)} files, {len(errors)} problems")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
