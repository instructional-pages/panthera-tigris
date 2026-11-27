import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
import make_map  # noqa: E402

SQUARE = [(0, 0), (10, 0), (10, 10), (0, 10)]


class Clip(unittest.TestCase):
    def test_keeps_a_ring_inside_the_box(self):
        self.assertEqual(make_map.clip(SQUARE, -1, 11, -1, 11), SQUARE)

    def test_cuts_a_ring_at_the_box(self):
        out = make_map.clip(SQUARE, 5, 20, -5, 20)
        self.assertEqual(sorted(out), [(5, 0), (5, 10), (10, 0), (10, 10)])

    def test_drops_a_ring_outside_the_box(self):
        self.assertEqual(make_map.clip(SQUARE, 20, 30, 20, 30), [])


class Simplify(unittest.TestCase):
    def test_drops_points_close_to_the_line(self):
        line = [(0, 0), (1, 0.1), (2, -0.1), (3, 0), (4, 5), (5, 0)]
        self.assertEqual(make_map.simplify(line, 0.5), [(0, 0), (3, 0), (4, 5), (5, 0)])

    def test_keeps_short_lines(self):
        self.assertEqual(make_map.simplify([(0, 0), (1, 1)], 5), [(0, 0), (1, 1)])


class Geometry(unittest.TestCase):
    def test_area_and_contains(self):
        self.assertEqual(make_map.area(SQUARE), 100)
        self.assertTrue(make_map.contains(SQUARE, (5, 5)))
        self.assertFalse(make_map.contains(SQUARE, (15, 5)))

    def test_project_maps_the_frame_corners(self):
        self.assertEqual(make_map.project(make_map.WEST, make_map.NORTH), (0, 0))
        x, y = make_map.project(make_map.EAST, make_map.SOUTH)
        self.assertEqual((round(x), round(y)), (make_map.WIDTH, make_map.HEIGHT))


class Encode(unittest.TestCase):
    def test_writes_compact_relative_path_data(self):
        self.assertEqual(make_map.encode([[(10, 20), (13, 20), (13, 15)]]), "M10 20l3 0 0-5z")

    def test_writes_one_subpath_per_ring(self):
        self.assertEqual(make_map.encode([[(0, 0), (1, 0), (1, 1)], [(5, 5), (4, 5), (4, 4)]]), "M0 0l1 0 0 1zM5 5l-1 0 0-1z")


if __name__ == "__main__":
    unittest.main()
