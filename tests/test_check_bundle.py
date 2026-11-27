import contextlib
import io
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
import check_bundle  # noqa: E402


def run(argv):
    with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
        return check_bundle.main(argv)


class CheckBundleTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        (self.root / "assets").mkdir()
        (self.root / "index.html").write_bytes(b"<p>hi</p>" * 100)
        (self.root / "assets" / "a.js").write_bytes(bytes(range(256)) * 8)

    def tearDown(self):
        self.tmp.cleanup()

    def test_sizes_every_file_including_nested(self):
        sizes = check_bundle.gzipped_sizes(self.root)
        self.assertEqual(sorted(sizes), ["assets/a.js", "index.html"])
        self.assertLess(sizes["index.html"], 900)  # repetitive text compresses

    def test_passes_under_budget_and_fails_over(self):
        total = sum(check_bundle.gzipped_sizes(self.root).values())
        self.assertEqual(run(["x", str(self.root), str(total / 1000)]), 0)
        self.assertEqual(run(["x", str(self.root), str((total - 1) / 1000)]), 1)

    def test_missing_build_fails(self):
        self.assertEqual(run(["x", str(self.root / "nope")]), 1)


if __name__ == "__main__":
    unittest.main()
