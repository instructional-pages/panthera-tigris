// The sources the site cites, copied from docs/research/sources.md (a test checks that each
// key and link still match the dossier).

export interface Source {
  readonly cite: string;
  readonly url: string;
}

const catsg = (name: string, slug: string): Source => ({
  cite: `IUCN SSC Cat Specialist Group. ${name}, species page.`,
  url: `https://www.catsg.org/${slug}`,
});

export const SOURCES: Readonly<Record<string, Source>> = {
  Kitchener2017: {
    cite:
      "Kitchener A. C., Breitenmoser-Würsten C., Eizirik E. et al. (2017). A revised taxonomy of the Felidae. Cat News Special Issue 11.",
    url: "https://repository.si.edu/handle/10088/32616",
  },
  Mazak2011: {
    cite:
      "Mazák J. H., Christiansen P., Kitchener A. C. (2011). Oldest known pantherine skull and evolution of the tiger. PLoS ONE 6(10), e25483.",
    url: "https://doi.org/10.1371/journal.pone.0025483",
  },
  Davis2010: {
    cite:
      "Davis B. W., Li G., Murphy W. J. (2010). Supermatrix and species tree methods resolve phylogenetic relationships within the big cats, Panthera. Molecular Phylogenetics and Evolution.",
    url: "https://doi.org/10.1016/j.ympev.2010.01.036",
  },
  Luo2004: {
    cite:
      "Luo S.-J., Kim J.-H., Johnson W. E. et al. (2004). Phylogeography and genetic ancestry of tigers (Panthera tigris). PLoS Biology 2(12), e442.",
    url: "https://doi.org/10.1371/journal.pbio.0020442",
  },
  Liu2018: {
    cite:
      "Liu Y.-C., Sun X., Driscoll C. et al. (2018). Genome-wide evolutionary analysis of natural history and adaptation in the world's tigers. Current Biology 28(23), 3840–3849.",
    url: "https://doi.org/10.1016/j.cub.2018.09.019",
  },
  Smith1993: {
    cite: "Smith J. L. D. (1993). The role of dispersal in structuring the Chitwan tiger population. Behaviour 124(3–4), 165–195.",
    url: "https://doi.org/10.1163/156853993X00560",
  },
  SINZ: {
    cite: "Smithsonian's National Zoo & Conservation Biology Institute. Tiger.",
    url: "https://nationalzoo.si.edu/animals/tiger",
  },
  CATSG: catsg("Tiger (Panthera tigris)", "living-species-tiger"),
  CATSGLion: catsg("Lion (Panthera leo)", "living-species-lions"),
  CATSGLeopard: catsg("Leopard (Panthera pardus)", "living-species-leopard"),
  CATSGJaguar: catsg("Jaguar (Panthera onca)", "living-species-jaguar"),
  CATSGSnowLeopard: catsg("Snow leopard (Panthera uncia)", "living-species-snowleopard"),
  CATSGCloudedLeopard: catsg("Mainland clouded leopard (Neofelis nebulosa)", "living-species-cloudedleopard"),
  CATSGSundaCloudedLeopard: catsg(
    "Sunda clouded leopard (Neofelis diardi)",
    "living-species-sundacloudedleopard",
  ),
};
