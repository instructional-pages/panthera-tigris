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
  calls its estimate the first reasonably rigorous one, a baseline rather than a trend
  [@Goodrich2022]. See [conservation](conservation.md).

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
- **[@Miller2013]** Miller C. S., Hebblewhite M., Petrunenko Y. K., et al. (2013). Estimating Amur
  tiger (*Panthera tigris altaica*) kill rates and potential consumption rates using global
  positioning system collars. *Journal of Mammalogy* 94(4), 845–855.
  https://doi.org/10.1644/12-MAMM-A-209.1 — *full text* (from
  https://www.umt.edu/ungulate-ecology-lab/files/miller2013jm.pdf).
- **[@Hayward2012]** Hayward M. W., Jędrzejewski W., Jędrzejewska B. (2012). Prey preferences of
  the tiger *Panthera tigris*. *Journal of Zoology* 286(3), 221–231.
  https://doi.org/10.1111/j.1469-7998.2011.00871.x — *abstract* (from the Bangor University
  research portal).
- **[@Smith1989]** Smith J. L. D., McDougal C., Miquelle D. (1989). Scent marking in free-ranging
  tigers, *Panthera tigris*. *Animal Behaviour* 37, 1–10.
  https://doi.org/10.1016/0003-3472(89)90001-8 — *abstract* (from the University of Minnesota
  research portal).
- **[@Smith1993]** Smith J. L. D. (1993). The role of dispersal in structuring the Chitwan tiger
  population. *Behaviour* 124(3–4), 165–195. https://doi.org/10.1163/156853993X00560 —
  *abstract* (from the University of Minnesota research portal).
- **[@Gour2013]** Gour D. S., Bhagavatula J., Bhavanishankar M., et al. (2013). Philopatry and
  dispersal patterns in tiger (*Panthera tigris*). *PLoS ONE* 8(7), e66956.
  https://doi.org/10.1371/journal.pone.0066956 — *abstract*.
- **[@Liu2024]** Liu Y., Dodge S., Simcharoen A., Ahearn S. C., Smith J. L. D. (2024). Analyzing
  tiger interaction and home range shifts using a time-geographic approach. *Movement Ecology*
  12, 13. https://doi.org/10.1186/s40462-024-00454-0 — *full text* (via Europe PMC,
  PMC10838465).
- **[@Bergevin2012]** Bergevin C., Walsh E. J., McGee J., Shera C. A. (2012). Probing cochlear
  tuning and tonotopy in the tiger using otoacoustic emissions. *Journal of Comparative
  Physiology A* 198, 617–624. https://doi.org/10.1007/s00359-012-0734-1 — *full text* (authors'
  manuscript, from
  https://yorku.ca/professor/cberge/wp-content/uploads/sites/754/2023/02/2012bergevinJCP.pdf).
- **[@Burger2008]** Burger B. V., Viviers M. Z., Bekker J. P., et al. (2008). Chemical
  characterization of territorial marking fluid of male Bengal tiger, *Panthera tigris*.
  *Journal of Chemical Ecology* 34(5), 659–671. https://doi.org/10.1007/s10886-008-9462-y —
  *abstract*.
- **[@Banks2015]** Banks M. S., Sprague W. W., Schmoll J., Parnell J. A., Love G. D. (2015). Why
  do animal eyes have pupils of different shapes? *Science Advances* 1, e1500391.
  https://doi.org/10.1126/sciadv.1500391 — *full text* (via Europe PMC, PMC4643806).
- **[@Goodrich2022]** Goodrich J., Wibisono H., Miquelle D., Lynam A. J., Sanderson E., Chapman S.,
  Gray T. N. E., Chanchani P., Harihar A. (2022). *Panthera tigris*. The IUCN Red List of
  Threatened Species 2022: e.T15955A214862019.
  https://doi.org/10.2305/IUCN.UK.2022-1.RLTS.T15955A214862019.en — *full text* (the assessment
  PDF, from a copy hosted by the Nature Conservation Foundation, India:
  https://www.ncf-india.org/publications/panthera-tigris-2; the Red List site blocks automated
  fetches). Its Supplementary Information (estimates by country) is a separate file, not read.
- **[@Sanderson2023]** Sanderson E. W., Miquelle D. G., Fisher K., et al. (2023). Range-wide
  trends in tiger conservation landscapes, 2001–2020. *Frontiers in Conservation Science* 4,
  1191280. https://doi.org/10.3389/fcosc.2023.1191280 — *full text* (CC BY).
- **[@Karanth2004]** Karanth K. U., Nichols J. D., Kumar N. S., Link W. A., Hines J. E. (2004).
  Tigers and their prey: predicting carnivore densities from prey abundance. *PNAS* 101(14),
  4854–4858. https://doi.org/10.1073/pnas.0306210101 — *abstract*.
- **[@Karanth2000]** Karanth K. U., Sunquist M. E. (2000). Behavioural correlates of predation by
  tiger (*Panthera tigris*), leopard (*Panthera pardus*) and dhole (*Cuon alpinus*) in Nagarahole,
  India. *Journal of Zoology* 250(2), 255–265.
  https://doi.org/10.1111/j.1469-7998.2000.tb01076.x — *abstract* (from Crossref).
- **[@Steinmetz2013]** Steinmetz R., Seuaturien N., Chutipong W. (2013). Tigers, leopards, and
  dholes in a half-empty forest: assessing species interactions in a guild of threatened
  carnivores. *Biological Conservation* 163, 68–78.
  https://doi.org/10.1016/j.biocon.2012.12.016 — *abstract* (from Europe PMC).
- **[@Harihar2011]** Harihar A., Pandav B., Goyal S. P. (2011). Responses of leopard *Panthera
  pardus* to the recovery of a tiger *Panthera tigris* population. *Journal of Applied Ecology*
  48(4), 806–814. https://doi.org/10.1111/j.1365-2664.2011.01981.x — *abstract* (from Europe PMC).
- **[@Wang2009]** Wang S., Macdonald D. W. (2009). Feeding habits and niche partitioning in a
  predator guild composed of tigers, leopards and dholes in a temperate ecosystem in central
  Bhutan. *Journal of Zoology* 277(4), 275–283.
  https://doi.org/10.1111/j.1469-7998.2008.00537.x — *abstract* (from Crossref).
- **[@Krishnakumar2022]** Krishnakumar B., Nagarajan R., Selvan K. (2022). Diet composition
  and prey preference of tiger, leopard, and dhole in Kalakkad-Mundanthurai Tiger Reserve,
  southern Western Ghats, India. *Mammal Study* 47(2), 141–153.
  https://doi.org/10.3106/ms2020-0058 — *abstract* (from Crossref).
- **[@Liu2026]** Liu Y., Dodge S., Simcharoen A., Smith J. L. D., Ahearn S. C. (2026). Avoidance
  dynamics in tiger-leopard coexistence: a time-geographic approach. *Movement Ecology* 14, 72.
  https://doi.org/10.1186/s40462-026-00681-7 — *section* (abstract, introduction and methods,
  via Europe PMC, PMC13673898).
- **[@Kandel2025]** Kandel S. R., Panthi S., Shrestha B., Subedi N., Kadariya R. (2025). Habitat
  overlap of tiger and leopard in Banke-Bardia Complex. *Ecology and Evolution* 15, e72592.
  https://doi.org/10.1002/ece3.72592 — *section* (abstract and introduction, via Europe PMC,
  PMC12670131).
- **[@Carter2019]** Carter N. H., Levin S. A., Grimm V. (2019). Effects of human-induced prey
  depletion on large carnivores in protected areas: lessons from modeling tiger populations in
  stylized spatial scenarios. *Ecology and Evolution* 9, 11298–11313.
  https://doi.org/10.1002/ece3.5632 — *abstract* (via Europe PMC, PMC6802045).
- **[@NTCA2023]** Qureshi Q., Jhala Y. V., Yadav S. P., Mallick A. (eds) (2023). *Status of
  tigers, co-predators and prey in India, 2022* (summary). National Tiger Conservation Authority,
  New Delhi, and Wildlife Institute of India, Dehradun. ISBN 81-85496-92-7.
  https://ntca.gov.in/assets/uploads/Reports/AITM/status_of_tiger-copredators-2022.pdf —
  *section* (the 10-page summary with the estimates table, from
  https://conservewildcats.org/wp-content/uploads/sites/5/2023/08/India-IndiaStatusofTigers2022.pdf;
  the full 494-page report not read). A government report: its methods are peer-reviewed in
  earlier cycles, but the counting body is also the one reporting success.
- **[@IUCN2026Nepal]** IUCN (2026-07-29). Tiger census: Nepal's tiger number increases to 429.
  https://iucn.org/story/202607/tiger-census-nepals-tiger-number-increases-429 — *page*, read
  2026-11-26. Reports the government's census; the technical report was not yet published.
- **[@Duangchantrasiri2016]** Duangchantrasiri S., Umponjan M., Simcharoen S., et al. (2016).
  Dynamics of a low-density tiger population in Southeast Asia in the context of improved law
  enforcement. *Conservation Biology* 30(3), 639–648. https://doi.org/10.1111/cobi.12655 —
  *abstract* (from Europe PMC).
- **[@Chapron2008]** Chapron G., Miquelle D. G., Lambert A., Goodrich J. M., Legendre S., Clobert
  J. (2008). The impact on tigers of poaching versus prey depletion. *Journal of Applied Ecology*
  45(6), 1667–1674. https://doi.org/10.1111/j.1365-2664.2008.01538.x — *abstract* (from Europe
  PMC).
- **[@Goodrich2010]** Goodrich J. M. (2010). Human–tiger conflict: a review and call for
  comprehensive plans. *Integrative Zoology* 5(4), 300–312.
  https://doi.org/10.1111/j.1749-4877.2010.00218.x — *abstract* (from Crossref).
- **[@Inskip2009]** Inskip C., Zimmermann A. (2009). Human-felid conflict: a review of patterns and
  priorities worldwide. *Oryx* 43(1), 18–34. https://doi.org/10.1017/S003060530899030X —
  *full text* (Cambridge Core).
- **[@Gurung2008]** Gurung B., Smith J. L. D., McDougal C., Karki J. B., Barlow A. (2008). Factors
  associated with human-killing tigers in Chitwan National Park, Nepal. *Biological
  Conservation* 141(12), 3069–3078. https://doi.org/10.1016/j.biocon.2008.09.013 — *abstract*
  (from Europe PMC).
- **[@Dhakal2026]** Dhakal B. K., Lamichhane B. R., Kandel S., Subedi N., Low M., Silwal T. (2026).
  Tigers in the neighborhood: factors associated with fatal tiger attacks in a human-dominated
  landscape, Nepal. *Ecology and Evolution* 16, e74206. https://doi.org/10.1002/ece3.74206 —
  *full text* (via Europe PMC, PMC13478372).
- **[@Shrestha2026]** Shrestha A., Pradhan N. M. B., Subedi N., et al. (2026). Human–tiger conflict
  in and around Chitwan–Parsa National Parks: status, trends, contributing factors, mitigation
  strategies, and community perceptions. *Ecology and Evolution* 16, e73920.
  https://doi.org/10.1002/ece3.73920 — *full text* (via Europe PMC, PMC13373457).
- **[@Struebig2018]** Struebig M. J., Linkie M., Deere N. J., et al. (2018). Addressing human-tiger
  conflict using socio-ecological information on tolerance and risk. *Nature Communications* 9,
  3455. https://doi.org/10.1038/s41467-018-05983-y — *full text* (via Europe PMC, PMC6110717).
- **[@Thinley2018]** Thinley P., Rajaratnam R., Lassoie J. P., et al. (2018). The ecological benefit
  of tigers (*Panthera tigris*) to farmers in reducing crop and livestock losses in the eastern
  Himalayas. *Biological Conservation* 219, 119–125.
  https://doi.org/10.1016/j.biocon.2018.01.015 — *abstract* (from Europe PMC).
- **[@Wong2019]** Wong R., Krishnasamy K. (2019). *Skin and Bones Unresolved: An Analysis of Tiger
  Seizures from 2000–2018*. TRAFFIC, Petaling Jaya, Malaysia.
  https://www.traffic.org/site/assets/files/12344/skin_and_bones_unresolved-web-1.pdf — *full
  text*. TRAFFIC is a wildlife-trade monitoring NGO, not peer-reviewed; its seizure figures are
  compiled from official and press records and are a minimum.
- **[@ElvesPowell2024]** Elves-Powell J., Lee H., Axmacher J. C., Durant S. M. (2024). Turning the
  tide on big cat trade: expert opinion on trends and conservation lessons from the Republic of
  Korea. *PLoS ONE* 19(5), e0299783. https://doi.org/10.1371/journal.pone.0299783 — *full text*
  (via Europe PMC, PMC11095708).
- **[@Armstrong2024]** Armstrong E. E., Mooney J. A., Solari K. A., et al. (2024). Unraveling the
  genomic diversity and admixture history of captive tigers in the United States. *PNAS* 121,
  e2402924121. https://doi.org/10.1073/pnas.2402924121 — *full text* (via Europe PMC,
  PMC11441546).
- **[@Nair2021]** Nair R., Dhee, Patil O., Surve N., Andheria A., Linnell J. D. C., Athreya V.
  (2021). Sharing spaces and entanglements with big cats: the Warli and their Waghoba in
  Maharashtra, India. *Frontiers in Conservation Science* 2, 683356.
  https://doi.org/10.3389/fcosc.2021.683356 — *full text* (CC BY).
- **[@Welch2016]** Welch P. B. (2016-10-10). The tiger within. *BiblioAsia* 12(3), National Library
  Board, Singapore. https://biblioasia.nlb.gov.sg/vol-12/issue-3/oct-dec-2016/the-tiger-within/ —
  *page*, read 2026-11-26. A magazine essay by an Asian art historian, with endnotes; fine for
  motifs and well-known history, not for contested points.
- **[@CMA1960]** Cleveland Museum of Art. *Durga Slaying Mahisha*, c. 1700–1710, Pahari kingdoms,
  accession 1960.51. https://www.clevelandart.org/art/1960.51 — *page*, read 2026-11-26.
- **[@PMA101270]** Philadelphia Museum of Art. *The Great Goddess as Ishwari, with Bhadragaura*,
  c. 1700–1725, object 101270. https://philamuseum.org/collection/object/101270 — *page*, read
  2026-11-26.
- **[@Blake]** Blake W. "The Tyger", in *Songs of Innocence and of Experience* (R. Brimley Johnson,
  London, 1901 edition). Project Gutenberg eBook #1934.
  https://gutenberg.pglaf.org/1/9/3/1934/1934-0.txt — *full text*.
- **[@Kipling]** Kipling R. *The Jungle Book*, "Mowgli's Brothers". Project Gutenberg eBook #236.
  https://gutenberg.pglaf.org/2/3/236/236-0.txt — *section* (the opening chapter).
- **[@NTCAProjectTiger]** National Tiger Conservation Authority, Government of India. About us
  (Project Tiger, technical and financial support). https://ntca.gov.in/p/about-us — *page*, read
  2026-11-26.
