// The course's few photos: openly licensed files from Wikimedia Commons, bundled with the site
// (no request leaves it) and credited under each picture and in the lesson's picture list.
// Pure data, so the credits are checked without a browser. Each licence was read on the file's
// own Commons page (see docs/DECISIONS.md).

/** The licences a photo may carry: public-domain dedication, or attribution (share-alike allowed). */
export const LICENCES = {
  "CC0 1.0": "https://creativecommons.org/publicdomain/zero/1.0/",
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
} as const;

export type Licence = keyof typeof LICENCES;

export interface Photo {
  /** File name under src/photos/ (AVIF, resized and re-encoded from the original). */
  readonly file: string;
  /** A short name for the credits list. */
  readonly title: string;
  /** What the picture shows, for people who can't see it. */
  readonly alt: string;
  /** The caption under it: what it shows and why it is here. */
  readonly caption: string;
  /** Who made it, as the file page credits them. */
  readonly author: string;
  readonly licence: Licence;
  /** The file's page on Wikimedia Commons, where the licence was read. */
  readonly source: string;
  /** Changes made for the course, which the attribution licences ask to be stated. */
  readonly changes: string;
}

export const PHOTOS = {
  chitwan: {
    file: "chitwan-tiger.avif",
    title: "A tiger in Chitwan National Park",
    alt: "A tiger crouched in tall green grass, looking straight at the camera through the blades.",
    caption: "A real tiger in Chitwan National Park, Nepal, in 2023: the park where Junu's story is set.",
    author: "Supradai",
    licence: "CC BY 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Royal_Bengal_Tiger_looking_at_me_while_photographing,_capture_at_Chitwan_National_Park_(cropped).jpg",
    changes: "resized",
  },
  cameraTrap: {
    file: "sumatra-camera-trap.avif",
    title: "A camera-trap photo of a wild tiger in Sumatra",
    alt: "A tiger's face at night, close to the lens, lit by the camera's flash, its eyes glowing and the stripes on its face sharp.",
    caption: "A real camera-trap photo: a wild tiger in Sumatra, face on to the camera. Matching uses the stripes on the sides, as in the drawings below.",
    author: "Arddu (Flickr)",
    licence: "CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Wild_Sumatran_tiger.jpg",
    changes: "re-encoded",
  },
  blake: {
    file: "blake-tyger.avif",
    title: "William Blake, \"The Tyger\"",
    alt: "A hand-coloured printed page: the title \"The Tyger\", six verses in a column, a tree up the right side and a striped tiger walking along the bottom.",
    caption: "Blake's own page, titled \"The Tyger\": he printed the poem and its picture from a plate he etched himself, and this copy was coloured by hand. It is in the Metropolitan Museum of Art, New York.",
    author: "William Blake; photograph by the Metropolitan Museum of Art",
    licence: "CC0 1.0",
    source: "https://commons.wikimedia.org/wiki/File:Songs_of_Innocence_and_of_Experience-_The_Tyger_MET_DR384.jpg",
    changes: "resized",
  },
} as const satisfies Record<string, Photo>;
