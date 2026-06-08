/* WikiBio — Mock profile data */

const PROFILES = [
  {
    id: "elena-marchetti",
    name: "Elena Marchetti",
    italicLast: "Marchetti",
    category: "Cinematographer",
    tier: "gold",
    born: 1984,
    birthDate: "March 14, 1984",
    nationality: "Italian",
    location: "Rome → Los Angeles",
    short: "Italian-American cinematographer known for natural-light portraiture and her three-time collaboration with director Marisa Vello.",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&auto=format&fit=crop",
    color: "#A23B2D",
    views: "2.4M",
    followers: "184k",
    profileNumber: "047",
    socials: [
      { kind: "instagram", handle: "@elenamarchetti.dp" },
      { kind: "imdb", handle: "nm-2837451" },
      { kind: "x", handle: "@elenamdp" },
      { kind: "site", handle: "elenamarchetti.com" }
    ],
    tags: ["Cinema", "Director of Photography", "Cannes 2022", "Sundance Alumna"],
    fields: [
      ["Born", "March 14, 1984 — Bologna, Italy"],
      ["Education", "Centro Sperimentale di Cinematografia, AFI"],
      ["Years active", "2008 – present"],
      ["Awards", "ASC Spotlight (2019), Camerimage Bronze Frog (2022)"],
      ["Notable works", "The Salt Houses, Long Was the Summer, Vela"],
      ["Represented by", "WME — Independent Artists"],
    ],
    sections: [
      {
        title: "Early Life",
        body: "Elena Marchetti was born in Bologna to a textile engineer and a stage actress, and spent her childhood between Italy's industrial north and her grandparents' coastal home in Termoli. She has spoken often about how the soft, salt-bleached light of the Adriatic — and the long shadows of her father's mill — shaped her early eye. She began making 8mm films at fourteen using a Russian Quarz camera bought at a flea market in Bologna."
      },
      {
        title: "Career",
        body: "After graduating from the Centro Sperimentale di Cinematografia in 2008, Marchetti worked as a camera assistant on a string of Italian and French productions before her breakout as director of photography on the 2014 anthology Le Stanze di Sale (The Salt Houses), which premiered at the Venice Critics' Week. Her work has since spanned American independent film, music video, and high-end documentary. She is best known for a restrained, naturalistic style — handheld with long lenses, motivated by practical sources, often graded warm and slightly faded — that critics have called \"a Northern Italian answer to the New Hollywood.\""
      },
      {
        title: "Style & Influences",
        body: "Marchetti cites Vittorio Storaro, Néstor Almendros, and the painter Giorgio Morandi as primary influences. She works almost exclusively with prime lenses (frequently Cooke S4s and Zeiss Super Speeds) and prefers single-source lighting setups, often softened through silk or bounced from the floor. She is one of the few working DPs to still shoot regularly on 35mm and Super 16."
      },
      {
        title: "Personal Life",
        body: "Marchetti lives between Los Angeles and Rome with her partner, the editor Sam Kuroda, and their daughter. She is a long-time board member of the Sicilia Queer Filmfest and teaches an annual master class at AFI Conservatory."
      }
    ],
    filmography: [
      { year: 2024, title: "Vela", role: "Director of Photography", note: "dir. M. Vello — Cannes Competition" },
      { year: 2022, title: "Long Was the Summer", role: "Director of Photography", note: "dir. M. Vello — Camerimage Bronze Frog" },
      { year: 2019, title: "Pacific Quiet", role: "Director of Photography", note: "dir. T. Akande — Sundance Premiere" },
      { year: 2017, title: "Notturno", role: "Cinematographer (segment)", note: "Anthology — Venice Days" },
      { year: 2014, title: "The Salt Houses", role: "Director of Photography", note: "dir. C. Bellucci — Venice Critics' Week" },
    ],
    awards: [
      { year: 2024, award: "Cannes Vulcain Prize — Technical Artist", for: "Vela" },
      { year: 2022, award: "Camerimage Bronze Frog", for: "Long Was the Summer" },
      { year: 2019, award: "ASC Spotlight Award", for: "Pacific Quiet" },
      { year: 2015, award: "David di Donatello — Best Cinematography (nom.)", for: "The Salt Houses" },
    ],
    sources: [
      "Sight & Sound, vol. 33 no. 4, \"The Salt-Bleached Frame: Elena Marchetti\" (April 2023)",
      "American Cinematographer interview, July 2022",
      "Centro Sperimentale di Cinematografia alumni records",
      "Cannes Film Festival official catalogue, 2024"
    ],
    related: ["jules-okafor", "marisa-vello", "noor-rahimi", "ezra-banks"]
  },

  {
    id: "jules-okafor",
    name: "Jules Okafor",
    italicLast: "Okafor",
    category: "Architect",
    tier: "gold",
    born: 1979,
    birthDate: "September 2, 1979",
    nationality: "Nigerian-British",
    location: "Lagos · London",
    short: "Principal of Okafor Studio, known for civic buildings in laterite and rammed earth across West Africa and a 2023 Aga Khan Award.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80&auto=format&fit=crop",
    color: "#B07A2A",
    views: "1.1M",
    followers: "92k",
    profileNumber: "048",
    socials: [
      { kind: "site", handle: "okaforstudio.co" },
      { kind: "instagram", handle: "@okafor.studio" },
      { kind: "linkedin", handle: "/in/julesokafor" },
    ],
    tags: ["Architecture", "Rammed Earth", "Civic Design", "Aga Khan 2023"],
    fields: [
      ["Born", "September 2, 1979 — Enugu, Nigeria"],
      ["Education", "AA School of Architecture (London)"],
      ["Practice", "Okafor Studio — founded 2011"],
      ["Awards", "Aga Khan Award (2023), RIBA International (2021)"],
      ["Teaching", "Visiting Professor, Yale School of Architecture"],
    ],
    sections: [
      {
        title: "Early Life",
        body: "Jules Okafor was born in Enugu, Nigeria, and moved with his family to Peckham, South London at the age of nine. He studied physics at Imperial College before transferring to the Architectural Association, where he won the AA Foundation prize in his diploma year."
      },
      {
        title: "Practice",
        body: "Okafor founded his eponymous studio in Lagos in 2011 with the architect Nneka Eze (a partnership that ended amicably in 2018). The studio is known for its restrained palette of laterite, rammed earth, and locally-fired brick, and for an emphasis on passive cooling and communal courtyards. Major built works include the Ibadan Civic Library (2018), the Bui Health Pavilion in Ghana (2021), and the recently completed Eko Atlantic Cultural Centre."
      },
      {
        title: "Critical Reception",
        body: "Critics have placed Okafor in conversation with Diébédo Francis Kéré and Mariam Issoufou Kamara as part of a generation re-grounding African architecture in vernacular materials and labor. He has been firm in resisting the \"sustainable architecture\" label, preferring \"common-sense building.\""
      },
    ],
    awards: [
      { year: 2023, award: "Aga Khan Award for Architecture", for: "Bui Health Pavilion" },
      { year: 2021, award: "RIBA International Prize (shortlist)", for: "Ibadan Civic Library" },
      { year: 2019, award: "Architectural Review Emerging Architect", for: "Studio body of work" },
    ],
    sources: [
      "Architectural Review, March 2022, \"Common-sense buildings: Okafor Studio\"",
      "Aga Khan Trust for Culture, 2023 Cycle Jury Citation",
      "RIBA Journal, August 2021"
    ],
    related: ["noor-rahimi", "elena-marchetti", "ezra-banks", "kaia-wren"]
  },

  {
    id: "noor-rahimi",
    name: "Noor Rahimi",
    italicLast: "Rahimi",
    category: "Composer",
    tier: "gold",
    born: 1991,
    birthDate: "June 21, 1991",
    nationality: "Iranian-Canadian",
    location: "Montréal",
    short: "Composer for film and the concert hall, recipient of the 2024 Glenn Gould Protégé Prize.",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1465225314224-587cd83d322b?w=1600&q=80&auto=format&fit=crop",
    color: "#5B6B8C",
    views: "612k",
    followers: "48k",
    profileNumber: "049",
    socials: [
      { kind: "site", handle: "noorrahimi.com" },
      { kind: "instagram", handle: "@n.rahimi" },
      { kind: "x", handle: "@noor_writes" },
    ],
    tags: ["Composer", "Film Score", "Contemporary Classical"],
    fields: [
      ["Born", "June 21, 1991 — Tehran, Iran"],
      ["Education", "McGill, IRCAM (residency)"],
      ["Notable scores", "Vela (2024), The North Door (2022)"],
      ["Awards", "Glenn Gould Protégé (2024)"],
    ],
    sections: [
      { title: "Early Life", body: "Noor Rahimi was born in Tehran and emigrated with her family to Montréal in 2003. She trained classically on santur and piano before studying composition at McGill under Brian Cherney." },
      { title: "Work", body: "Rahimi is equally at home in the concert hall and in film. Her 2021 violin concerto Roznameh was premiered by Leila Josefowicz with the LA Phil; her score for Elena Marchetti and Marisa Vello's Vela earned her a Cannes Soundtrack Award nomination. Her music is characterized by long, breath-paced melodic lines, micro-tonal inflections drawn from Persian dastgāh, and an unsentimental approach to silence." }
    ],
    sources: ["NPR Music feature, 2024", "Cannes 2024 program notes"],
    related: ["elena-marchetti", "ezra-banks", "marisa-vello"]
  },

  {
    id: "ezra-banks",
    name: "Ezra Banks",
    italicLast: "Banks",
    category: "Athlete",
    tier: "silver",
    born: 1997,
    birthDate: "November 4, 1997",
    nationality: "American",
    location: "Eugene, OR",
    short: "Middle-distance runner and 2024 Olympic bronze medalist in the 1500m.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=80&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&q=80&auto=format&fit=crop",
    color: "#C75146",
    views: "3.2M", followers: "412k",
    profileNumber: "050",
    socials: [
      { kind: "instagram", handle: "@ezrabanks" },
      { kind: "x", handle: "@ezrabanks1500" },
    ],
    tags: ["Track & Field", "1500m", "Olympian"],
    fields: [
      ["Born", "Nov 4, 1997 — Portland, OR"],
      ["Club", "Bowerman Track Club"],
      ["Personal best", "3:29.41 (1500m)"],
      ["Coached by", "Jerry Schumacher"],
    ],
    sections: [
      { title: "Career", body: "Banks ran collegiately at Oregon (2016–2020) where he won three NCAA titles in the mile and 1500m. He turned professional with Bowerman Track Club and finished fourth at the 2022 World Championships before claiming bronze at the Paris 2024 Olympics, his first global podium finish." }
    ],
    sources: ["World Athletics profile", "Track & Field News Aug 2024"],
    related: ["elena-marchetti", "jules-okafor"]
  },

  {
    id: "kaia-wren",
    name: "Kaia Wren",
    italicLast: "Wren",
    category: "Author",
    tier: "gold",
    born: 1976,
    birthDate: "August 8, 1976",
    nationality: "New Zealander",
    location: "Wellington",
    short: "Novelist and essayist; her 2021 novel A Map of the Quiet Places won the Booker Prize.",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&q=80&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80&auto=format&fit=crop",
    color: "#3F6B5C",
    views: "1.9M", followers: "210k",
    profileNumber: "051",
    socials: [{ kind: "site", handle: "kaiawren.co.nz" }, { kind: "instagram", handle: "@kaia.wren" }],
    tags: ["Literature", "Booker 2021", "Essays"],
    fields: [
      ["Born", "August 8, 1976 — Whanganui, NZ"],
      ["Education", "Victoria University of Wellington"],
      ["Awards", "Booker Prize (2021), Ockham NZ Book Award (2018, 2021)"],
      ["Publisher", "Te Herenga Waka University Press / Granta (UK)"],
    ],
    sections: [
      { title: "Work", body: "Wren is the author of three novels and one essay collection. Her work, often set on the wind-stripped coasts of the lower North Island, has been praised for its precise, almost geological prose and its refusal of sentimental closure. The judges of the 2021 Booker called A Map of the Quiet Places \"a book that listens before it speaks.\"" }
    ],
    sources: ["The Booker Prize Foundation, 2021"],
    related: ["noor-rahimi", "elena-marchetti"]
  },

  {
    id: "marisa-vello",
    name: "Marisa Vello",
    italicLast: "Vello",
    category: "Director",
    tier: "gold",
    born: 1981,
    birthDate: "May 30, 1981",
    nationality: "Brazilian-Portuguese",
    location: "Lisbon",
    short: "Filmmaker whose triptych with cinematographer Elena Marchetti has redefined contemporary European auteur cinema.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=1600&q=80&auto=format&fit=crop",
    color: "#7B4FA0",
    views: "2.0M", followers: "168k",
    profileNumber: "052",
    socials: [{ kind: "instagram", handle: "@marisa.vello" }, { kind: "imdb", handle: "nm-9912034" }],
    tags: ["Cinema", "Director", "Cannes"],
    fields: [
      ["Born", "May 30, 1981 — São Paulo, Brazil"],
      ["Education", "Escola Superior de Teatro e Cinema, Lisbon"],
      ["Notable works", "Vela, Long Was the Summer, The North Door"],
    ],
    sections: [
      { title: "Career", body: "Vello debuted with the formally severe Casa Sem Janelas (2009) and has since become one of the most acclaimed European auteurs of her generation. Her ongoing collaboration with cinematographer Elena Marchetti is widely considered one of the defining director–DP pairings of the 2020s." }
    ],
    sources: ["Cinema Scope, Issue 96"],
    related: ["elena-marchetti", "noor-rahimi"]
  },

  {
    id: "atlas-coffee",
    name: "Atlas Coffee Roasters",
    italicLast: "Roasters",
    category: "Brand",
    tier: "silver",
    born: 2014,
    birthDate: "Founded 2014",
    nationality: "United States",
    location: "Brooklyn, NY",
    short: "Specialty coffee company sourcing single-estate lots from East Africa and Central America; eight retail locations across the US Northeast.",
    photo: "https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=900&q=80&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80&auto=format&fit=crop",
    color: "#6B4423",
    views: "486k", followers: "62k",
    profileNumber: "053",
    socials: [{ kind: "site", handle: "atlascoffee.co" }, { kind: "instagram", handle: "@atlas.roasters" }],
    tags: ["Coffee", "Specialty", "B-Corp"],
    fields: [
      ["Founded", "2014 — Brooklyn, NY"],
      ["Founders", "Wren Halaby, Sam Otieno"],
      ["Locations", "8 retail cafés"],
      ["Certification", "B-Corp, Smithsonian Bird-Friendly"],
    ],
    sections: [
      { title: "About", body: "Atlas was founded above a hardware store in Williamsburg in 2014 by Wren Halaby and Sam Otieno, both formerly of Stumptown. The company built its reputation on a small, rotating menu of single-estate East African coffees and on long-term, multi-year contracts with producer co-operatives in Kenya, Ethiopia, and Honduras." }
    ],
    sources: ["Sprudge profile, 2022", "Eater NY review, 2023"],
    related: ["jules-okafor"]
  },

  {
    id: "dr-amara-osei",
    name: "Dr. Amara Osei",
    italicLast: "Osei",
    category: "Scientist",
    tier: "gold",
    born: 1972,
    birthDate: "October 19, 1972",
    nationality: "Ghanaian-American",
    location: "Cambridge, MA",
    short: "Computational biologist; MacArthur Fellow (2019); director of the Osei Lab at the Broad Institute.",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&q=80&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1600&q=80&auto=format&fit=crop",
    color: "#2A5C8F",
    views: "880k", followers: "54k",
    profileNumber: "054",
    socials: [{ kind: "site", handle: "oseilab.org" }, { kind: "x", handle: "@amaraosei" }],
    tags: ["Genomics", "MacArthur 2019", "Broad Institute"],
    fields: [
      ["Born", "Oct 19, 1972 — Accra, Ghana"],
      ["Education", "MIT (PhD), Cape Coast (BSc)"],
      ["Awards", "MacArthur Fellowship (2019), NAS member"],
      ["h-index", "84"],
    ],
    sections: [
      { title: "Research", body: "Osei is best known for her work on the population genetics of recent human adaptation, including landmark 2014 and 2021 papers on the genetic architecture of sickle-cell resistance and malarial co-evolution across West Africa. She founded the Osei Lab in 2016." }
    ],
    sources: ["MacArthur Foundation 2019 cohort", "Nature Genetics 53, 12 (2021)"],
    related: ["jules-okafor", "kaia-wren"]
  },

  {
    id: "soren-vask",
    name: "Søren Våsk",
    italicLast: "Våsk",
    category: "Designer",
    tier: "silver",
    born: 1988,
    birthDate: "February 11, 1988",
    nationality: "Danish",
    location: "Copenhagen",
    short: "Industrial designer; partner at Studio Våsk; chair of the 2024 Stockholm Design Week.",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&q=80&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80&auto=format&fit=crop",
    color: "#4F6F52",
    views: "320k", followers: "29k",
    profileNumber: "055",
    socials: [{ kind: "site", handle: "studio-vask.dk" }, { kind: "instagram", handle: "@studio.vask" }],
    tags: ["Industrial Design", "Furniture", "Lighting"],
    fields: [
      ["Born", "Feb 11, 1988 — Aarhus, Denmark"],
      ["Education", "Royal Danish Academy"],
      ["Clients", "Hay, Muuto, Louis Poulsen, Vitra"],
    ],
    sections: [
      { title: "Practice", body: "Våsk co-founded his Copenhagen studio in 2014. He is known for soft-edged, low-profile furniture and a continuing series of bowl-shaped pendant lights produced with Louis Poulsen." }
    ],
    sources: ["Wallpaper* Mar 2024"],
    related: ["jules-okafor", "elena-marchetti"]
  },

  {
    id: "tilly-ono",
    name: "Tilly Ono",
    italicLast: "Ono",
    category: "Musician",
    tier: "silver",
    born: 1995,
    birthDate: "December 3, 1995",
    nationality: "Japanese-Australian",
    location: "Naarm / Melbourne",
    short: "Singer-songwriter and producer; 2024 ARIA Album of the Year for Soft Animal Days.",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&q=80&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&q=80&auto=format&fit=crop",
    color: "#D9826B",
    views: "5.1M", followers: "640k",
    profileNumber: "056",
    socials: [{ kind: "instagram", handle: "@tillyono" }, { kind: "site", handle: "tillyono.com" }],
    tags: ["Music", "ARIA 2024", "Producer"],
    fields: [
      ["Born", "Dec 3, 1995 — Melbourne, Australia"],
      ["Label", "Mistletone / Ninja Tune (worldwide)"],
      ["Awards", "ARIA Album of the Year 2024"],
    ],
    sections: [
      { title: "Career", body: "Tilly Ono began releasing bedroom recordings on Bandcamp in 2017. Her breakthrough album Soft Animal Days (2024) drew comparisons to Joni Mitchell's Hejira for its loose-rein guitar work and confessional lyricism." }
    ],
    sources: ["The Monthly, May 2024"],
    related: ["noor-rahimi", "kaia-wren"]
  },

  {
    id: "ravi-shenoy",
    name: "Ravi Shenoy",
    italicLast: "Shenoy",
    category: "Founder",
    tier: "free",
    born: 1986,
    birthDate: "July 22, 1986",
    nationality: "Indian",
    location: "Bengaluru",
    short: "Co-founder and CEO of Drift Mobility; previously product lead at Ola.",
    photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=900&q=80&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80&auto=format&fit=crop",
    color: "#3F6B5C",
    views: "180k", followers: "18k",
    profileNumber: "057",
    socials: [{ kind: "linkedin", handle: "/in/ravishenoy" }, { kind: "x", handle: "@ravi_shenoy" }],
    tags: ["Mobility", "Startups", "Bengaluru"],
    fields: [
      ["Born", "July 22, 1986 — Mangalore, India"],
      ["Education", "IIT Bombay, Stanford GSB"],
      ["Current", "CEO, Drift Mobility"],
    ],
    sections: [
      { title: "Career", body: "Shenoy spent six years at Ola in product roles before co-founding Drift Mobility in 2021, an electric two-wheeler subscription service now operating in seven Indian cities." }
    ],
    sources: ["The Ken, Sept 2023"],
    related: ["dr-amara-osei", "atlas-coffee"]
  },

  {
    id: "hana-petrova",
    name: "Hana Petrová",
    italicLast: "Petrová",
    category: "Ballet",
    tier: "silver",
    born: 1994,
    birthDate: "April 4, 1994",
    nationality: "Czech",
    location: "Paris",
    short: "Première danseuse, Paris Opera Ballet; widely tipped for promotion to étoile in the 2026 season.",
    photo: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=900&q=80&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1600&q=80&auto=format&fit=crop",
    color: "#A05B7A",
    views: "740k", followers: "98k",
    profileNumber: "058",
    socials: [{ kind: "instagram", handle: "@h.petrova" }],
    tags: ["Ballet", "Paris Opera"],
    fields: [
      ["Born", "April 4, 1994 — Brno, Czechia"],
      ["Training", "Vaganova Academy, St Petersburg"],
      ["Company", "Paris Opera Ballet (since 2017)"],
    ],
    sections: [
      { title: "Career", body: "Petrová joined the Paris Opera Ballet as a quadrille in 2017 after four years at the Mariinsky's affiliated Vaganova Academy. She was promoted to première danseuse in 2023." }
    ],
    sources: ["Dance Magazine, Jan 2024"],
    related: ["noor-rahimi", "marisa-vello"]
  }
];

const CATEGORIES = [
  "Cinematographer","Director","Composer","Musician","Author","Architect",
  "Athlete","Scientist","Designer","Founder","Brand","Ballet","Actor","Artist","Chef"
];

const PROFILE_MAP = Object.fromEntries(PROFILES.map(p => [p.id, p]));

window.PROFILES = PROFILES;
window.PROFILE_MAP = PROFILE_MAP;
window.CATEGORIES = CATEGORIES;
