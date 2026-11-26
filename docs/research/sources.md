# Sources

Every claim in the dossier cites one or more entries below as `[@Key]`. `scripts/check_research.py`
(run by `.local-ci`) checks that each key resolves here and that every entry is cited.

## Which sources to trust

From most to least trusted:

1. **Peer-reviewed papers**, read in full. Primary data beats a review of it.
2. **IUCN work**: the Red List assessment and the IUCN SSC Cat Specialist Group (its taxonomy,
   *Cat News* and species pages). These are the reference for status, population and taxonomy.
3. **Peer-reviewed papers read only as an abstract.** Usable for the headline result; the
   detail waits until the full text is read.
4. **Institutional pages** (zoos, museums, university pages). Fine for well-known facts. Not
   used alone for a number or a contested point.
5. **Press, encyclopedias, Wikipedia**: only to find primary sources, never cited.

Each entry says how it was read: *full text*, *section* (the relevant pages), *abstract* or *page*.

## When sources disagree

- Write down every position, who holds it and on what evidence. Don't pick silently.
- Prefer the more recent and more direct evidence (whole genomes over a few genes, a measured
  wild animal over a record that can't be traced), unless a later source explains why not.
- Say which position the course will teach and why, marked *pending review* until the user
  agrees. Where there is no settled answer, the course teaches the disagreement itself.
- Each topic file ends with a **Disagreements** section and an **Open** list (claims still to
  check before they can go on the site).

The two known big ones:

- **Subspecies.** IUCN's Cat Classification Task Force recognises two (2017); a whole-genome study
  finds six living groups (2018). See [taxonomy](taxonomy.md).
- **Population figures.** Counts change with methods as much as with tigers; the 2022 Red List
  calls its estimate the first reasonable baseline. Covered in the conservation topic (not yet
  written), from the Red List assessment itself (Goodrich et al. 2022,
  https://www.iucnredlist.org/species/15955/214862019), which has not been read in full yet.

## Entries

- **[@Kitchener2017]** Kitchener A. C., Breitenmoser-Würsten C., Eizirik E. et al. (2017). A
  revised taxonomy of the Felidae: the final report of the Cat Classification Task Force of the
  IUCN Cat Specialist Group. *Cat News* Special Issue 11, 80 pp.; tiger at pp. 66–68.
  https://repository.si.edu/handle/10088/32616 — *section* (tiger pages, from
  https://conservewildcats.org/wp-content/uploads/sites/5/2019/08/TigerpagesCSG-revisedtaxonomy17.pdf).
- **[@Liu2018]** Liu Y.-C., Sun X., Driscoll C., et al. (2018). Genome-wide evolutionary analysis
  of natural history and adaptation in the world's tigers. *Current Biology* 28(23), 3840–3849.
  https://doi.org/10.1016/j.cub.2018.09.019 — *abstract* (full text blocked to automated
  fetches; to read).
- **[@Luo2004]** Luo S.-J., Kim J.-H., Johnson W. E., et al. (2004). Phylogeography and genetic
  ancestry of tigers (*Panthera tigris*). *PLoS Biology* 2(12), e442.
  https://doi.org/10.1371/journal.pbio.0020442 — *full text*.
- **[@Mazak2011]** Mazák J. H., Christiansen P., Kitchener A. C. (2011). Oldest known pantherine
  skull and evolution of the tiger. *PLoS ONE* 6(10), e25483.
  https://doi.org/10.1371/journal.pone.0025483 — *full text*.
- **[@Davis2010]** Davis B. W., Li G., Murphy W. J. (2010). Supermatrix and species tree methods
  resolve phylogenetic relationships within the big cats, *Panthera* (Carnivora: Felidae).
  *Molecular Phylogenetics and Evolution*.
  https://doi.org/10.1016/j.ympev.2010.01.036 — *abstract*.
- **[@Xu2013]** Xu X., Dong G.-X., Hu X.-S., et al. (2013). The genetic basis of white tigers.
  *Current Biology* 23(11), 1031–1035. https://doi.org/10.1016/j.cub.2013.04.054 — *full text*.
- **[@Sagar2021]** Sagar V., Kaelin C. B., Natesh M., et al. (2021). High frequency of an
  otherwise rare phenotype in a small and isolated tiger population. *PNAS* 118(39),
  e2025273118. https://doi.org/10.1073/pnas.2025273118 — *full text*.
- **[@Klemuk2011]** Klemuk S. A., Riede T., Walsh E. J., Titze I. R. (2011). Adapted to roar:
  functional morphology of tiger and lion vocal folds. *PLoS ONE* 6(11), e27029.
  https://doi.org/10.1371/journal.pone.0027029 — *full text*.
- **[@Karanth1995]** Karanth K. U. (1995). Estimating tiger *Panthera tigris* populations from
  camera-trap data using capture–recapture models. *Biological Conservation* 71(3), 333–338.
  https://repository.ias.ac.in/89441 — *abstract*.
- **[@CATSG]** IUCN SSC Cat Specialist Group. Tiger (*Panthera tigris*), species page.
  https://www.catsg.org/living-species-tiger — *page*, read 2026-11-26.
- **[@SINZ]** Smithsonian's National Zoo & Conservation Biology Institute. Tiger.
  https://nationalzoo.si.edu/animals/tiger — *page*, read 2026-11-26.
- **[@ADW]** Animal Diversity Web, University of Michigan. *Panthera tigris* (last updated
  2007-09-15; written largely by students). https://animaldiversity.org/accounts/Panthera_tigris/
  — *page*, read 2026-11-26. Lowest trust here: never the only source for a number on the site.
