"""Make the range map's outlines (src/map-data.ts) from Natural Earth's countries.

Reads Natural Earth's 1:50m admin-0 countries (public domain; ne_50m_admin_0_countries.geojson
from github.com/nvkelso/natural-earth-vector), keeps the part of each country inside the map's
frame (Turkey to the Russian Far East, Siberia's southern edge to Bali), projects it, simplifies
it, rounds it to whole map units and writes SVG path strings. Sumatra, Java and Bali are split
from the rest of Indonesia, and the Malay Peninsula from Malaysian Borneo, because the course
tells their stories apart. Run by hand when the map changes; the output is committed.

Usage: python3 scripts/make_map.py ne_50m_admin_0_countries.geojson > src/map-data.ts
"""

import json
import math
import sys

# The frame, in degrees, and the map's width in map units (its height follows).
WEST, EAST, SOUTH, NORTH = 25.0, 150.0, -11.0, 58.0
WIDTH = 1000
# Equirectangular, with longitudes shrunk by cos(30°) so the middle of the map keeps its shape.
KX = math.cos(math.radians(30))
SCALE = WIDTH / ((EAST - WEST) * KX)
HEIGHT = round((NORTH - SOUTH) * SCALE)

# How far a simplified outline may stray (map units), and the smallest island drawn (units²).
TOLERANCE = 0.8
TOLERANCE_BACKGROUND = 2.0
MIN_AREA = 6.0

# Parts split off a country: a point inside each part's main island names the part.
PARTS = {
    "IDN": [("sumatra", "Sumatra", (101.0, 0.0)), ("java", "Java", (110.0, -7.3)), ("bali", "Bali", (115.1, -8.4))],
    "MYS": [("malaya", "Peninsular Malaysia", (102.0, 4.0))],
}
# What is left of a split country, as (id, name).
REST = {"IDN": ("indonesia", "Indonesia (other islands)"), "MYS": ("borneo-malaysia", "Malaysian Borneo")}
# Short ids and plain names for countries the course names; others use their code and NE name.
NAMES = {
    "BGD": "Bangladesh", "BTN": "Bhutan", "CHN": "China", "IND": "India", "MMR": "Myanmar",
    "NPL": "Nepal", "RUS": "Russia", "THA": "Thailand", "KHM": "Cambodia", "LAO": "Laos",
    "VNM": "Vietnam", "SGP": "Singapore", "HKG": "Hong Kong", "PRK": "North Korea",
    "KOR": "South Korea", "IRN": "Iran", "TUR": "Turkey", "KAZ": "Kazakhstan",
}
# Tiny places the course names: always drawn, however small.
KEEP_SMALL = {"SGP", "HKG", "bali"}
# Countries drawn with the finer outline: those in or near the area the course is about (Turkey
# to Russia's Pacific coast, south to Bali). Only a drawing choice, not a claim about the range:
# where tigers lived and live is lesson data, cited there. The rest are background.
DETAIL = {
    "TUR", "GEO", "ARM", "AZE", "IRN", "IRQ", "SYR", "TKM", "UZB", "KAZ", "KGZ", "TJK", "AFG",
    "PAK", "IND", "NPL", "BTN", "BGD", "MMR", "THA", "LAO", "KHM", "VNM", "MYS", "SGP", "IDN",
    "CHN", "HKG", "MNG", "RUS", "PRK", "KOR",
}


def project(lon: float, lat: float) -> tuple[float, float]:
    """Degrees to map units: x grows east, y grows south, (0, 0) is the frame's north-west corner."""
    return ((lon - WEST) * KX * SCALE, (NORTH - lat) * SCALE)


def clip(ring: list[tuple[float, float]], west=WEST, east=EAST, south=SOUTH, north=NORTH) -> list[tuple[float, float]]:
    """The part of a closed ring inside the box (Sutherland–Hodgman); [] when none of it is."""
    edges = [
        (lambda p: p[0] >= west, lambda a, b: _at_x(a, b, west)),
        (lambda p: p[0] <= east, lambda a, b: _at_x(a, b, east)),
        (lambda p: p[1] >= south, lambda a, b: _at_y(a, b, south)),
        (lambda p: p[1] <= north, lambda a, b: _at_y(a, b, north)),
    ]
    out = list(ring)
    for inside, cross in edges:
        if not out:
            break
        src, out = out, []
        for i, cur in enumerate(src):
            prev = src[i - 1]
            if inside(cur):
                if not inside(prev):
                    out.append(cross(prev, cur))
                out.append(cur)
            elif inside(prev):
                out.append(cross(prev, cur))
    return out


def _at_x(a, b, x):
    t = (x - a[0]) / (b[0] - a[0])
    return (x, a[1] + t * (b[1] - a[1]))


def _at_y(a, b, y):
    t = (y - a[1]) / (b[1] - a[1])
    return (a[0] + t * (b[0] - a[0]), y)


def simplify(points: list[tuple[float, float]], tolerance: float) -> list[tuple[float, float]]:
    """Douglas–Peucker on an open line: drops points closer than `tolerance` to the kept line."""
    if len(points) < 3:
        return list(points)
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        lo, hi = stack.pop()
        far, far_d = -1, tolerance
        for i in range(lo + 1, hi):
            d = _distance(points[i], points[lo], points[hi])
            if d > far_d:
                far, far_d = i, d
        if far >= 0:
            keep[far] = True
            stack += [(lo, far), (far, hi)]
    return [p for p, k in zip(points, keep) if k]


def _distance(p, a, b):
    dx, dy = b[0] - a[0], b[1] - a[1]
    if dx == dy == 0:
        return math.hypot(p[0] - a[0], p[1] - a[1])
    t = max(0.0, min(1.0, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)))
    return math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy)


def area(ring) -> float:
    """Unsigned area of a closed ring (shoelace)."""
    return abs(sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(ring, ring[1:] + ring[:1]))) / 2


def contains(ring, p) -> bool:
    """True when point p is inside the closed ring (even–odd rule)."""
    inside = False
    for a, b in zip(ring, ring[1:] + ring[:1]):
        if (a[1] > p[1]) != (b[1] > p[1]) and p[0] < a[0] + (p[1] - a[1]) * (b[0] - a[0]) / (b[1] - a[1]):
            inside = not inside
    return inside


def ring_path(ring: list[tuple[float, float]], tolerance: float) -> list[tuple[int, int]]:
    """A projected, simplified ring rounded to whole units, without repeats; [] if it vanishes."""
    xy = [project(*p) for p in ring]
    # Simplify as an open line from a point to itself, so the ring's start is kept.
    pts = simplify(xy + [xy[0]], tolerance)[:-1]
    out: list[tuple[int, int]] = []
    for x, y in pts:
        q = (round(x), round(y))
        if not out or q != out[-1]:
            out.append(q)
    if len(out) > 1 and out[0] == out[-1]:
        out.pop()
    return out if len(out) >= 3 else []


def encode(rings: list[list[tuple[int, int]]]) -> str:
    """SVG path data: an absolute move to each ring's start, then relative lines, closed."""
    parts = []
    for ring in rings:
        nums = [ring[0][0], ring[0][1]]
        cmds = f"M{_nums(nums)}l"
        deltas = []
        for a, b in zip(ring, ring[1:]):
            deltas += [b[0] - a[0], b[1] - a[1]]
        parts.append(cmds + _nums(deltas) + "z")
    return "".join(parts)


def _nums(ns: list[int]) -> str:
    """Numbers joined as SVG allows: a minus sign separates them without a space."""
    s = ""
    for n in ns:
        s += (str(n) if n < 0 or not s else f" {n}")
    return s


def regions(features: list[dict]) -> list[dict]:
    """The map's regions, each with its id, name, path, bounding box and label point."""
    found: dict[str, dict] = {}
    for f in features:
        props, geom = f["properties"], f["geometry"]
        code = props["ADM0_A3"]
        polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
        fine = code in DETAIL
        for poly in polys:
            outer = [tuple(p) for p in poly[0]]
            if outer[0] == outer[-1]:
                outer.pop()
            rid, name = _region_of(code, props, outer)
            inside = clip(outer)
            if len(inside) < 3:
                continue
            path = ring_path(inside, TOLERANCE if fine else TOLERANCE_BACKGROUND)
            small = area(path) < MIN_AREA if path else True
            if small and code not in KEEP_SMALL and rid not in KEEP_SMALL:
                continue
            if not path:  # too small to survive rounding, but kept: draw it as a dot-sized square
                x, y = (round(v) for v in project(*_centre(inside)))
                path = [(x - 1, y - 1), (x + 1, y - 1), (x + 1, y + 1), (x - 1, y + 1)]
            r = found.setdefault(rid, {"id": rid, "name": name, "detail": fine, "rings": [], "label": None})
            r["rings"].append(path)
            if rid == code.lower() or code not in PARTS:
                lx, ly = props.get("LABEL_X"), props.get("LABEL_Y")
                if lx is not None and WEST <= lx <= EAST and SOUTH <= ly <= NORTH:
                    r["label"] = project(lx, ly)
            else:
                pt = next(p for i, n, p in PARTS[code] if i == rid) if rid != REST[code][0] else None
                if pt:
                    r["label"] = project(*pt)
    out = []
    for r in found.values():
        rings = sorted(r["rings"], key=area, reverse=True)
        xs = [p[0] for ring in rings for p in ring]
        ys = [p[1] for ring in rings for p in ring]
        box = [min(xs), min(ys), max(xs), max(ys)]
        label = r["label"] or (sum(p[0] for p in rings[0]) / len(rings[0]), sum(p[1] for p in rings[0]) / len(rings[0]))
        out.append({
            "id": r["id"], "name": r["name"], "detail": r["detail"], "d": encode(rings), "box": box,
            "at": [round(label[0]), round(label[1])],
        })
    return sorted(out, key=lambda r: r["id"])


def _region_of(code: str, props: dict, outer) -> tuple[str, str]:
    for rid, name, point in PARTS.get(code, []):
        if contains(outer, point):
            return rid, name
    if code in REST:
        return REST[code]
    return code.lower(), NAMES.get(code, props["NAME"])


def _centre(ring):
    return (sum(p[0] for p in ring) / len(ring), sum(p[1] for p in ring) / len(ring))


def render(rs: list[dict]) -> str:
    lines = [
        "// Generated by scripts/make_map.py from Natural Earth's 1:50m admin-0 countries (public",
        "// domain, naturalearthdata.com). Do not edit; change the script and run it again.",
        "",
        'import type { MapFrame, MapRegion } from "./map.ts";',
        "",
        f"export const FRAME: MapFrame = {{ west: {WEST}, east: {EAST}, south: {SOUTH}, north: {NORTH}, "
        f"width: {WIDTH}, height: {HEIGHT}, kx: {KX!r}, scale: {SCALE!r} }};",
        "",
        "export const REGIONS: readonly MapRegion[] = [",
    ]
    for r in rs:
        lines.append(
            f"  {{ id: {json.dumps(r['id'])}, name: {json.dumps(r['name'])}, detail: {str(r['detail']).lower()}, "
            f"box: {json.dumps(r['box'])}, at: {json.dumps(r['at'])}, d: {json.dumps(r['d'])} }},"
        )
    lines.append("];")
    return "\n".join(lines) + "\n"


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(__doc__, file=sys.stderr)
        return 2
    with open(argv[1], encoding="utf-8") as f:
        features = json.load(f)["features"]
    sys.stdout.write(render(regions(features)))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
