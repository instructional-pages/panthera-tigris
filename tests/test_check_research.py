import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
from check_research import check  # noqa: E402

SOURCES = "- **[@Smith2020]** Smith (2020). Title. https://doi.org/10.1/x\n"
INDEX = "- [Sources](sources.md)\n- [Body](body.md)\n"


class CheckResearch(unittest.TestCase):
    def test_empty_folder_passes(self):
        self.assertEqual(check({}), [])

    def test_valid_dossier_passes(self):
        files = {"sources.md": SOURCES, "index.md": INDEX, "body.md": "Big [@Smith2020].\n"}
        self.assertEqual(check(files), [])

    def test_unknown_key(self):
        files = {"sources.md": SOURCES, "index.md": INDEX,
                 "body.md": "Big [@Smith2020; @Jones1999].\n"}
        self.assertEqual(check(files), ["body.md:1: @Jones1999 is not in sources.md"])

    def test_uncited_source_and_missing_link(self):
        files = {"sources.md": SOURCES + "- **[@Lee2001]** Lee (2001). No link.\n",
                 "index.md": INDEX, "body.md": "Big [@Smith2020].\n"}
        self.assertEqual(check(files), ["sources.md: @Lee2001 has no https link",
                                        "sources.md: @Lee2001 is never cited"])

    def test_malformed_citation_and_unlinked_file(self):
        files = {"sources.md": SOURCES, "index.md": INDEX,
                 "body.md": "Big [@Smith2020].\n", "eyes.md": "See [@ bad].\n"}
        self.assertEqual(check(files), ["eyes.md:1: malformed citation [@ bad]",
                                        "index.md does not link eyes.md"])

    def test_duplicate_key(self):
        files = {"sources.md": SOURCES * 2, "index.md": INDEX, "body.md": "[@Smith2020]\n"}
        self.assertEqual(check(files), ["sources.md: @Smith2020 is listed twice"])


if __name__ == "__main__":
    unittest.main()
