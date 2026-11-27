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
  Gour2013: {
    cite: "Gour D. S., Bhagavatula J., Bhavanishankar M. et al. (2013). Philopatry and dispersal patterns in tiger (Panthera tigris). PLoS ONE 8(7), e66956.",
    url: "https://doi.org/10.1371/journal.pone.0066956",
  },
  Kerley2003: {
    cite:
      "Kerley L. L., Goodrich J. M., Miquelle D. G., Smirnov E. N., Quigley H. B., Hornocker M. G. (2003). Reproductive parameters of wild female Amur (Siberian) tigers (Panthera tigris altaica). Journal of Mammalogy 84(1), 288–298.",
    url: "https://doi.org/10.1644/1545-1542(2003)084%3C0288:RPOWFA%3E2.0.CO;2",
  },
  Karanth1995: {
    cite:
      "Karanth K. U. (1995). Estimating tiger Panthera tigris populations from camera-trap data using capture–recapture models. Biological Conservation 71(3), 333–338.",
    url: "https://repository.ias.ac.in/89441",
  },
  Xu2013: {
    cite: "Xu X., Dong G.-X., Hu X.-S. et al. (2013). The genetic basis of white tigers. Current Biology 23(11), 1031–1035.",
    url: "https://doi.org/10.1016/j.cub.2013.04.054",
  },
  Sagar2021: {
    cite:
      "Sagar V., Kaelin C. B., Natesh M. et al. (2021). High frequency of an otherwise rare phenotype in a small and isolated tiger population. PNAS 118(39), e2025273118.",
    url: "https://doi.org/10.1073/pnas.2025273118",
  },
  Klemuk2011: {
    cite: "Klemuk S. A., Riede T., Walsh E. J., Titze I. R. (2011). Adapted to roar: functional morphology of tiger and lion vocal folds. PLoS ONE 6(11), e27029.",
    url: "https://doi.org/10.1371/journal.pone.0027029",
  },
  Bergevin2012: {
    cite:
      "Bergevin C., Walsh E. J., McGee J., Shera C. A. (2012). Probing cochlear tuning and tonotopy in the tiger using otoacoustic emissions. Journal of Comparative Physiology A 198, 617–624.",
    url: "https://doi.org/10.1007/s00359-012-0734-1",
  },
  Smith1989: {
    cite: "Smith J. L. D., McDougal C., Miquelle D. (1989). Scent marking in free-ranging tigers, Panthera tigris. Animal Behaviour 37, 1–10.",
    url: "https://doi.org/10.1016/0003-3472(89)90001-8",
  },
  Burger2008: {
    cite:
      "Burger B. V., Viviers M. Z., Bekker J. P. et al. (2008). Chemical characterization of territorial marking fluid of male Bengal tiger, Panthera tigris. Journal of Chemical Ecology 34(5), 659–671.",
    url: "https://doi.org/10.1007/s10886-008-9462-y",
  },
  Banks2015: {
    cite: "Banks M. S., Sprague W. W., Schmoll J., Parnell J. A., Love G. D. (2015). Why do animal eyes have pupils of different shapes? Science Advances 1, e1500391.",
    url: "https://doi.org/10.1126/sciadv.1500391",
  },
  NCVS: {
    cite: "National Center for Voice and Speech. Factors influencing fundamental frequency.",
    url: "https://ncvs.org/tutorials/factors-influencing-fundamental-frequency/",
  },
  SydneyVoiceLab: {
    cite:
      "Sydney Voice Lab, University of Sydney (2025). Acoustic analysis normative data reference sheet, v4.0 (adult speaking pitch from Leung, Oates, Papp and Chan 2022, Journal of Voice 36(3)).",
    url: "https://www.sydney.edu.au/content/dam/corporate/documents/faculty-of-medicine-and-health/research/research-centres/sydney-voice-lab/acoustic-analysis-normative-data-reference-sheet-20250416_v4.0-sydney-voice-lab.pdf.coredownload.pdf",
  },
  Miller2013: {
    cite:
      "Miller C. S., Hebblewhite M., Petrunenko Y. K. et al. (2013). Estimating Amur tiger (Panthera tigris altaica) kill rates and potential consumption rates using global positioning system collars. Journal of Mammalogy 94(4), 845–855.",
    url: "https://doi.org/10.1644/12-MAMM-A-209.1",
  },
  Hayward2012: {
    cite: "Hayward M. W., Jędrzejewski W., Jędrzejewska B. (2012). Prey preferences of the tiger Panthera tigris. Journal of Zoology 286(3), 221–231.",
    url: "https://doi.org/10.1111/j.1469-7998.2011.00871.x",
  },
  Bhandari2017: {
    cite: "Bhandari S., Chalise M. K., Pokharel C. P. (2017). Diet of Bengal tigers (Panthera tigris tigris) in Chitwan National Park, Nepal. European Journal of Ecology 3(1), 80–84.",
    url: "https://doi.org/10.1515/eje-2017-0008",
  },
  Liu2024: {
    cite:
      "Liu Y., Dodge S., Simcharoen A., Ahearn S. C., Smith J. L. D. (2024). Analyzing tiger interaction and home range shifts using a time-geographic approach. Movement Ecology 12, 13.",
    url: "https://doi.org/10.1186/s40462-024-00454-0",
  },
  Goodrich2022: {
    cite:
      "Goodrich J., Wibisono H., Miquelle D. et al. (2022). Panthera tigris. The IUCN Red List of Threatened Species 2022: e.T15955A214862019.",
    url: "https://doi.org/10.2305/IUCN.UK.2022-1.RLTS.T15955A214862019.en",
  },
  Sanderson2023: {
    cite:
      "Sanderson E. W., Miquelle D. G., Fisher K. et al. (2023). Range-wide trends in tiger conservation landscapes, 2001–2020. Frontiers in Conservation Science 4, 1191280.",
    url: "https://doi.org/10.3389/fcosc.2023.1191280",
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
  Karanth2004: {
    cite: "Karanth K. U., Nichols J. D., Kumar N. S., Link W. A., Hines J. E. (2004). Tigers and their prey: predicting carnivore densities from prey abundance. PNAS 101(14), 4854–4858.",
    url: "https://doi.org/10.1073/pnas.0306210101",
  },
  Karanth2000: {
    cite: "Karanth K. U., Sunquist M. E. (2000). Behavioural correlates of predation by tiger (Panthera tigris), leopard (Panthera pardus) and dhole (Cuon alpinus) in Nagarahole, India. Journal of Zoology 250(2), 255–265.",
    url: "https://doi.org/10.1111/j.1469-7998.2000.tb01076.x",
  },
  Steinmetz2013: {
    cite: "Steinmetz R., Seuaturien N., Chutipong W. (2013). Tigers, leopards, and dholes in a half-empty forest: assessing species interactions in a guild of threatened carnivores. Biological Conservation 163, 68–78.",
    url: "https://doi.org/10.1016/j.biocon.2012.12.016",
  },
  Harihar2011: {
    cite: "Harihar A., Pandav B., Goyal S. P. (2011). Responses of leopard Panthera pardus to the recovery of a tiger Panthera tigris population. Journal of Applied Ecology 48(4), 806–814.",
    url: "https://doi.org/10.1111/j.1365-2664.2011.01981.x",
  },
  Liu2026: {
    cite: "Liu Y., Dodge S., Simcharoen A., Smith J. L. D., Ahearn S. C. (2026). Avoidance dynamics in tiger-leopard coexistence: a time-geographic approach. Movement Ecology 14, 72.",
    url: "https://doi.org/10.1186/s40462-026-00681-7",
  },
  Carter2019: {
    cite: "Carter N. H., Levin S. A., Grimm V. (2019). Effects of human-induced prey depletion on large carnivores in protected areas: lessons from modeling tiger populations in stylized spatial scenarios. Ecology and Evolution 9, 11298–11313.",
    url: "https://doi.org/10.1002/ece3.5632",
  },  Goodrich2010: {
    cite: "Goodrich J. M. (2010). Human–tiger conflict: a review and call for comprehensive plans. Integrative Zoology 5(4), 300–312.",
    url: "https://doi.org/10.1111/j.1749-4877.2010.00218.x",
  },
  Inskip2009: {
    cite: "Inskip C., Zimmermann A. (2009). Human-felid conflict: a review of patterns and priorities worldwide. Oryx 43(1), 18–34.",
    url: "https://doi.org/10.1017/S003060530899030X",
  },
  Gurung2008: {
    cite: "Gurung B., Smith J. L. D., McDougal C., Karki J. B., Barlow A. (2008). Factors associated with human-killing tigers in Chitwan National Park, Nepal. Biological Conservation 141(12), 3069–3078.",
    url: "https://doi.org/10.1016/j.biocon.2008.09.013",
  },
  Dhakal2026: {
    cite: "Dhakal B. K., Lamichhane B. R., Kandel S., Subedi N., Low M., Silwal T. (2026). Tigers in the neighborhood: factors associated with fatal tiger attacks in a human-dominated landscape, Nepal. Ecology and Evolution 16, e74206.",
    url: "https://doi.org/10.1002/ece3.74206",
  },
  Shrestha2026: {
    cite: "Shrestha A., Pradhan N. M. B., Subedi N. et al. (2026). Human–tiger conflict in and around Chitwan–Parsa National Parks: status, trends, contributing factors, mitigation strategies, and community perceptions. Ecology and Evolution 16, e73920.",
    url: "https://doi.org/10.1002/ece3.73920",
  },
  Struebig2018: {
    cite: "Struebig M. J., Linkie M., Deere N. J. et al. (2018). Addressing human-tiger conflict using socio-ecological information on tolerance and risk. Nature Communications 9, 3455.",
    url: "https://doi.org/10.1038/s41467-018-05983-y",
  },
  Thinley2018: {
    cite: "Thinley P., Rajaratnam R., Lassoie J. P. et al. (2018). The ecological benefit of tigers (Panthera tigris) to farmers in reducing crop and livestock losses in the eastern Himalayas. Biological Conservation 219, 119–125.",
    url: "https://doi.org/10.1016/j.biocon.2018.01.015",
  },
  Wong2019: {
    cite: "Wong R., Krishnasamy K. (2019). Skin and Bones Unresolved: An Analysis of Tiger Seizures from 2000–2018. TRAFFIC, Petaling Jaya, Malaysia.",
    url: "https://www.traffic.org/site/assets/files/12344/skin_and_bones_unresolved-web-1.pdf",
  },
  ElvesPowell2024: {
    cite: "Elves-Powell J., Lee H., Axmacher J. C., Durant S. M. (2024). Turning the tide on big cat trade: expert opinion on trends and conservation lessons from the Republic of Korea. PLoS ONE 19(5), e0299783.",
    url: "https://doi.org/10.1371/journal.pone.0299783",
  },
  Armstrong2024: {
    cite: "Armstrong E. E., Mooney J. A., Solari K. A. et al. (2024). Unraveling the genomic diversity and admixture history of captive tigers in the United States. PNAS 121, e2402924121.",
    url: "https://doi.org/10.1073/pnas.2402924121",
  },
};
