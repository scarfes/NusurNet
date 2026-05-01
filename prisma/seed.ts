// =============================================================================
// NusurNet — Database seed (Sprint 1 Phase 4)
// =============================================================================
// Populates the catalog with realistic data:
//   - ~40 Italian cities (regional capitals + major university cities)
//   - 3 universities (Statale Milano, Politecnico Torino, UniBo) + courses
//   - 5 scholarships, linked to universities
//   - 5 services (codice fiscale, permesso di soggiorno, etc.) IT + FR
//   - 9 resource points (Caritas, Questura, Comune in 3 cities)
//   - 12 journey steps with IT + FR translations
//
// Idempotent: every record is upserted by a stable natural key (slug, etc.).
// You can re-run this seed safely; it will not duplicate rows.
//
// Run: npm run db:seed     (or: npx tsx prisma/seed.ts)
// =============================================================================

import {
  PrismaClient,
  Locale,
  DegreeType,
  ServiceCategory,
  ResourcePointType,
  JourneyStepCategory,
} from "@prisma/client";

const db = new PrismaClient();

// =============================================================================
// 1. CITIES
// =============================================================================
// nameFr is only set when the French exonym differs from the Italian name.

const cities = [
  // Lombardia
  { slug: "milano", nameIt: "Milano", nameFr: "Milan", region: "Lombardia", province: "MI", lat: 45.4642, lng: 9.19 },
  { slug: "pavia", nameIt: "Pavia", nameFr: "Pavie", region: "Lombardia", province: "PV", lat: 45.1847, lng: 9.1582 },
  { slug: "brescia", nameIt: "Brescia", region: "Lombardia", province: "BS", lat: 45.5416, lng: 10.2118 },
  { slug: "bergamo", nameIt: "Bergamo", region: "Lombardia", province: "BG", lat: 45.6983, lng: 9.6773 },

  // Piemonte / Valle d'Aosta
  { slug: "torino", nameIt: "Torino", nameFr: "Turin", region: "Piemonte", province: "TO", lat: 45.0703, lng: 7.6869 },
  { slug: "aosta", nameIt: "Aosta", nameFr: "Aoste", region: "Valle d'Aosta", province: "AO", lat: 45.7372, lng: 7.3148 },

  // Liguria
  { slug: "genova", nameIt: "Genova", nameFr: "Gênes", region: "Liguria", province: "GE", lat: 44.4056, lng: 8.9463 },

  // Veneto / Trentino / Friuli-Venezia Giulia
  { slug: "venezia", nameIt: "Venezia", nameFr: "Venise", region: "Veneto", province: "VE", lat: 45.4408, lng: 12.3155 },
  { slug: "padova", nameIt: "Padova", nameFr: "Padoue", region: "Veneto", province: "PD", lat: 45.4064, lng: 11.8768 },
  { slug: "verona", nameIt: "Verona", nameFr: "Vérone", region: "Veneto", province: "VR", lat: 45.4384, lng: 10.9916 },
  { slug: "trento", nameIt: "Trento", nameFr: "Trente", region: "Trentino-Alto Adige", province: "TN", lat: 46.0664, lng: 11.1257 },
  { slug: "trieste", nameIt: "Trieste", region: "Friuli-Venezia Giulia", province: "TS", lat: 45.6495, lng: 13.7768 },

  // Emilia-Romagna
  { slug: "bologna", nameIt: "Bologna", nameFr: "Bologne", region: "Emilia-Romagna", province: "BO", lat: 44.4949, lng: 11.3426 },
  { slug: "modena", nameIt: "Modena", nameFr: "Modène", region: "Emilia-Romagna", province: "MO", lat: 44.6471, lng: 10.9252 },
  { slug: "parma", nameIt: "Parma", nameFr: "Parme", region: "Emilia-Romagna", province: "PR", lat: 44.8015, lng: 10.3279 },
  { slug: "ferrara", nameIt: "Ferrara", nameFr: "Ferrare", region: "Emilia-Romagna", province: "FE", lat: 44.8378, lng: 11.6195 },

  // Toscana
  { slug: "firenze", nameIt: "Firenze", nameFr: "Florence", region: "Toscana", province: "FI", lat: 43.7696, lng: 11.2558 },
  { slug: "pisa", nameIt: "Pisa", nameFr: "Pise", region: "Toscana", province: "PI", lat: 43.7228, lng: 10.4017 },
  { slug: "siena", nameIt: "Siena", nameFr: "Sienne", region: "Toscana", province: "SI", lat: 43.3188, lng: 11.3308 },

  // Marche / Umbria
  { slug: "ancona", nameIt: "Ancona", nameFr: "Ancône", region: "Marche", province: "AN", lat: 43.6158, lng: 13.5189 },
  { slug: "urbino", nameIt: "Urbino", region: "Marche", province: "PU", lat: 43.7264, lng: 12.6365 },
  { slug: "macerata", nameIt: "Macerata", region: "Marche", province: "MC", lat: 43.3007, lng: 13.4536 },
  { slug: "perugia", nameIt: "Perugia", nameFr: "Pérouse", region: "Umbria", province: "PG", lat: 43.1107, lng: 12.3908 },

  // Lazio
  { slug: "roma", nameIt: "Roma", nameFr: "Rome", region: "Lazio", province: "RM", lat: 41.9028, lng: 12.4964 },

  // Abruzzo / Molise
  { slug: "laquila", nameIt: "L'Aquila", region: "Abruzzo", province: "AQ", lat: 42.3498, lng: 13.3995 },
  { slug: "campobasso", nameIt: "Campobasso", region: "Molise", province: "CB", lat: 41.563, lng: 14.6555 },

  // Campania
  { slug: "napoli", nameIt: "Napoli", nameFr: "Naples", region: "Campania", province: "NA", lat: 40.8518, lng: 14.2681 },
  { slug: "salerno", nameIt: "Salerno", nameFr: "Salerne", region: "Campania", province: "SA", lat: 40.6824, lng: 14.7681 },

  // Puglia / Basilicata / Calabria
  { slug: "bari", nameIt: "Bari", region: "Puglia", province: "BA", lat: 41.1171, lng: 16.8719 },
  { slug: "lecce", nameIt: "Lecce", region: "Puglia", province: "LE", lat: 40.3515, lng: 18.175 },
  { slug: "potenza", nameIt: "Potenza", region: "Basilicata", province: "PZ", lat: 40.6443, lng: 15.8051 },
  { slug: "catanzaro", nameIt: "Catanzaro", region: "Calabria", province: "CZ", lat: 38.9098, lng: 16.5877 },
  { slug: "cosenza", nameIt: "Cosenza", region: "Calabria", province: "CS", lat: 39.2982, lng: 16.2536 },
  { slug: "reggio-calabria", nameIt: "Reggio Calabria", region: "Calabria", province: "RC", lat: 38.1107, lng: 15.65 },

  // Sicilia
  { slug: "palermo", nameIt: "Palermo", nameFr: "Palerme", region: "Sicilia", province: "PA", lat: 38.1157, lng: 13.3613 },
  { slug: "catania", nameIt: "Catania", region: "Sicilia", province: "CT", lat: 37.5079, lng: 15.083 },
  { slug: "messina", nameIt: "Messina", nameFr: "Messine", region: "Sicilia", province: "ME", lat: 38.1938, lng: 15.554 },

  // Sardegna
  { slug: "cagliari", nameIt: "Cagliari", region: "Sardegna", province: "CA", lat: 39.2238, lng: 9.1217 },
  { slug: "sassari", nameIt: "Sassari", region: "Sardegna", province: "SS", lat: 40.7259, lng: 8.5556 },
];

async function seedCities() {
  console.log("🏙️  Seeding cities...");
  for (const city of cities) {
    await db.city.upsert({
      where: { slug: city.slug },
      update: city,
      create: city,
    });
  }
  console.log(`   ✓ ${cities.length} cities`);
}

// =============================================================================
// 2. UNIVERSITIES + TRANSLATIONS + COURSES
// =============================================================================

type CourseSeed = {
  nameIt: string;
  nameEn?: string;
  degreeType: DegreeType;
  durationYears: number;
  language: string[];
  tuitionEurMin?: number;
  tuitionEurMax?: number;
};

const universities: Array<{
  slug: string;
  citySlug: string;
  website: string;
  emailAdm: string;
  isPublic: boolean;
  qsRanking?: number;
  foundedYear: number;
  translations: { locale: Locale; name: string; shortName?: string; description: string; admissionsUrl?: string }[];
  courses: CourseSeed[];
}> = [
  {
    slug: "statale-milano",
    citySlug: "milano",
    website: "https://www.unimi.it",
    emailAdm: "informastudenti@unimi.it",
    isPublic: true,
    qsRanking: 324,
    foundedYear: 1924,
    translations: [
      {
        locale: Locale.IT,
        name: "Università degli Studi di Milano",
        shortName: "UniMi",
        description:
          "Università pubblica di ricerca con sede a Milano, fondata nel 1924. Offre corsi in tutte le aree disciplinari, dalla medicina alla giurisprudenza, dalle scienze umanistiche all'informatica.",
        admissionsUrl: "https://www.unimi.it/it/studiare/iscriversi-e-frequentare",
      },
      {
        locale: Locale.FR,
        name: "Université des Études de Milan",
        shortName: "UniMi",
        description:
          "Université publique de recherche basée à Milan, fondée en 1924. Propose des cursus dans tous les domaines: médecine, droit, lettres, informatique, sciences.",
        admissionsUrl: "https://www.unimi.it/it/studiare/iscriversi-e-frequentare",
      },
    ],
    courses: [
      { nameIt: "Lettere", degreeType: DegreeType.TRIENNALE, durationYears: 3, language: ["it"], tuitionEurMin: 156, tuitionEurMax: 4000 },
      { nameIt: "Giurisprudenza", degreeType: DegreeType.CICLO_UNICO, durationYears: 5, language: ["it"], tuitionEurMin: 156, tuitionEurMax: 4000 },
      { nameIt: "Medicina e Chirurgia", degreeType: DegreeType.CICLO_UNICO, durationYears: 6, language: ["it"], tuitionEurMin: 156, tuitionEurMax: 4000 },
      { nameIt: "Informatica", degreeType: DegreeType.TRIENNALE, durationYears: 3, language: ["it"], tuitionEurMin: 156, tuitionEurMax: 4000 },
      { nameIt: "International Politics, Law and Economics", nameEn: "International Politics, Law and Economics", degreeType: DegreeType.TRIENNALE, durationYears: 3, language: ["en"], tuitionEurMin: 156, tuitionEurMax: 4000 },
      { nameIt: "Data Science and Economics", nameEn: "Data Science and Economics", degreeType: DegreeType.MAGISTRALE, durationYears: 2, language: ["en"], tuitionEurMin: 156, tuitionEurMax: 4000 },
    ],
  },
  {
    slug: "politecnico-torino",
    citySlug: "torino",
    website: "https://www.polito.it",
    emailAdm: "international.students@polito.it",
    isPublic: true,
    qsRanking: 252,
    foundedYear: 1859,
    translations: [
      {
        locale: Locale.IT,
        name: "Politecnico di Torino",
        shortName: "PoliTo",
        description:
          "Università pubblica tecnica con sede a Torino, fondata nel 1859. Specializzata in ingegneria, architettura e design. Forte vocazione internazionale con numerosi corsi in lingua inglese.",
        admissionsUrl: "https://apply.polito.it",
      },
      {
        locale: Locale.FR,
        name: "École Polytechnique de Turin",
        shortName: "PoliTo",
        description:
          "Université publique technique de Turin, fondée en 1859. Spécialisée en ingénierie, architecture et design. Forte dimension internationale avec de nombreux cursus en anglais.",
        admissionsUrl: "https://apply.polito.it",
      },
    ],
    courses: [
      { nameIt: "Ingegneria Informatica", degreeType: DegreeType.TRIENNALE, durationYears: 3, language: ["it"], tuitionEurMin: 156, tuitionEurMax: 2800 },
      { nameIt: "Ingegneria Civile", degreeType: DegreeType.TRIENNALE, durationYears: 3, language: ["it"], tuitionEurMin: 156, tuitionEurMax: 2800 },
      { nameIt: "Architettura", degreeType: DegreeType.MAGISTRALE, durationYears: 2, language: ["it"], tuitionEurMin: 156, tuitionEurMax: 2800 },
      { nameIt: "Computer Engineering", nameEn: "Computer Engineering", degreeType: DegreeType.MAGISTRALE, durationYears: 2, language: ["en"], tuitionEurMin: 156, tuitionEurMax: 2800 },
      { nameIt: "Mechatronic Engineering", nameEn: "Mechatronic Engineering", degreeType: DegreeType.MAGISTRALE, durationYears: 2, language: ["en"], tuitionEurMin: 156, tuitionEurMax: 2800 },
      { nameIt: "Design Sistemico", degreeType: DegreeType.MAGISTRALE, durationYears: 2, language: ["it"], tuitionEurMin: 156, tuitionEurMax: 2800 },
    ],
  },
  {
    slug: "unibo",
    citySlug: "bologna",
    website: "https://www.unibo.it",
    emailAdm: "internationaldesk@unibo.it",
    isPublic: true,
    qsRanking: 133,
    foundedYear: 1088,
    translations: [
      {
        locale: Locale.IT,
        name: "Alma Mater Studiorum - Università di Bologna",
        shortName: "UniBo",
        description:
          "L'Alma Mater Studiorum è l'università più antica del mondo occidentale, fondata nel 1088. Offre più di 200 corsi di laurea in 11 scuole, con sedi anche a Cesena, Forlì, Ravenna e Rimini.",
        admissionsUrl: "https://www.unibo.it/en/study/enrolment-transfer-and-final-examination",
      },
      {
        locale: Locale.FR,
        name: "Alma Mater Studiorum - Université de Bologne",
        shortName: "UniBo",
        description:
          "L'Alma Mater Studiorum est la plus ancienne université du monde occidental, fondée en 1088. Plus de 200 cursus dans 11 écoles, avec des antennes à Cesena, Forlì, Ravenne et Rimini.",
        admissionsUrl: "https://www.unibo.it/en/study/enrolment-transfer-and-final-examination",
      },
    ],
    courses: [
      { nameIt: "Lettere", degreeType: DegreeType.TRIENNALE, durationYears: 3, language: ["it"], tuitionEurMin: 156, tuitionEurMax: 3000 },
      { nameIt: "Medicina e Chirurgia", degreeType: DegreeType.CICLO_UNICO, durationYears: 6, language: ["it"], tuitionEurMin: 156, tuitionEurMax: 3000 },
      { nameIt: "Giurisprudenza", degreeType: DegreeType.CICLO_UNICO, durationYears: 5, language: ["it"], tuitionEurMin: 156, tuitionEurMax: 3000 },
      { nameIt: "Economics and Finance", nameEn: "Economics and Finance", degreeType: DegreeType.MAGISTRALE, durationYears: 2, language: ["en"], tuitionEurMin: 156, tuitionEurMax: 3000 },
      { nameIt: "Computer Science and Engineering", nameEn: "Computer Science and Engineering", degreeType: DegreeType.MAGISTRALE, durationYears: 2, language: ["en"], tuitionEurMin: 156, tuitionEurMax: 3000 },
      { nameIt: "Discipline delle Arti, della Musica e dello Spettacolo", degreeType: DegreeType.TRIENNALE, durationYears: 3, language: ["it"], tuitionEurMin: 156, tuitionEurMax: 3000 },
    ],
  },
];

async function seedUniversities() {
  console.log("🎓 Seeding universities, translations, courses...");

  for (const uni of universities) {
    const city = await db.city.findUniqueOrThrow({ where: { slug: uni.citySlug } });

    const universityRow = await db.university.upsert({
      where: { slug: uni.slug },
      update: {
        cityId: city.id,
        website: uni.website,
        emailAdm: uni.emailAdm,
        isPublic: uni.isPublic,
        qsRanking: uni.qsRanking,
        foundedYear: uni.foundedYear,
      },
      create: {
        slug: uni.slug,
        cityId: city.id,
        website: uni.website,
        emailAdm: uni.emailAdm,
        isPublic: uni.isPublic,
        qsRanking: uni.qsRanking,
        foundedYear: uni.foundedYear,
      },
    });

    // Translations (composite PK upsert)
    for (const t of uni.translations) {
      await db.universityTranslation.upsert({
        where: { universityId_locale: { universityId: universityRow.id, locale: t.locale } },
        update: t,
        create: { ...t, universityId: universityRow.id },
      });
    }

    // Courses: simplest idempotent strategy is delete + create.
    // No FK dependencies on Course (Order points to Service, not Course).
    await db.course.deleteMany({ where: { universityId: universityRow.id } });
    await db.course.createMany({
      data: uni.courses.map((c) => ({ ...c, universityId: universityRow.id })),
    });
  }

  const totalCourses = universities.reduce((sum, u) => sum + u.courses.length, 0);
  console.log(`   ✓ ${universities.length} universities, ${universities.length * 2} translations, ${totalCourses} courses`);
}

// =============================================================================
// 3. SCHOLARSHIPS (linked to universities via M2M)
// =============================================================================

const scholarships = [
  {
    slug: "dsu-lombardia",
    titleIt: "Borsa di studio DSU Lombardia",
    titleFr: "Bourse d'études DSU Lombardie",
    provider: "Regione Lombardia",
    amountEur: 5500,
    deadline: new Date("2026-09-15"),
    applyUrl: "https://www.dsu.mi.it",
    eligibility: {
      incomeMaxEur: 27947,
      degreeTypes: ["TRIENNALE", "MAGISTRALE", "CICLO_UNICO"],
      residencyRequirement: "Iscrizione a un'università lombarda",
    },
    description:
      "Borsa di studio regionale erogata dal Diritto allo Studio Universitario per studenti iscritti alle università della Lombardia con ISEE inferiore alla soglia.",
    isPublished: true,
    universitySlugs: ["statale-milano"],
  },
  {
    slug: "edisu-piemonte",
    titleIt: "Borsa di studio EDISU Piemonte",
    titleFr: "Bourse EDISU Piémont",
    provider: "EDISU Piemonte",
    amountEur: 5300,
    deadline: new Date("2026-09-05"),
    applyUrl: "https://www.edisu.piemonte.it",
    eligibility: {
      incomeMaxEur: 27947,
      degreeTypes: ["TRIENNALE", "MAGISTRALE", "CICLO_UNICO", "DOTTORATO"],
      residencyRequirement: "Iscrizione a un'università piemontese",
    },
    description:
      "Borsa di studio regionale dell'Ente per il Diritto allo Studio Universitario del Piemonte. Comprende contributo monetario, alloggio e mensa.",
    isPublished: true,
    universitySlugs: ["politecnico-torino"],
  },
  {
    slug: "ergo-bologna",
    titleIt: "Borsa di studio ER.GO",
    titleFr: "Bourse ER.GO Émilie-Romagne",
    provider: "ER.GO - Azienda Regionale per il Diritto agli Studi Superiori",
    amountEur: 6000,
    deadline: new Date("2026-09-01"),
    applyUrl: "https://www.er-go.it",
    eligibility: {
      incomeMaxEur: 27726,
      degreeTypes: ["TRIENNALE", "MAGISTRALE", "CICLO_UNICO", "DOTTORATO"],
      residencyRequirement: "Iscrizione a un'università dell'Emilia-Romagna",
    },
    description:
      "Borsa erogata da ER.GO per studenti universitari in Emilia-Romagna. Include posto alloggio e servizio mensa per studenti fuori sede.",
    isPublished: true,
    universitySlugs: ["unibo"],
  },
  {
    slug: "maeci-borse-italiane",
    titleIt: "Borse di studio del Governo Italiano per studenti stranieri",
    titleFr: "Bourses du Gouvernement Italien pour étudiants étrangers",
    provider: "Ministero degli Affari Esteri e della Cooperazione Internazionale (MAECI)",
    amountEur: 9000,
    deadline: new Date("2026-06-09"),
    applyUrl: "https://studyinitaly.esteri.it",
    eligibility: {
      citizenship: ["TN", "MA", "DZ", "EG", "LB", "JO", "SY", "PS"],
      degreeTypes: ["MAGISTRALE", "DOTTORATO", "MASTER_I_LIVELLO", "MASTER_II_LIVELLO"],
      ageMaxYears: 28,
    },
    description:
      "Borsa annuale del Ministero degli Affari Esteri italiano per studenti stranieri provenienti da Paesi prioritari. Copre tasse universitarie, vitto, alloggio e assicurazione sanitaria.",
    isPublished: true,
    universitySlugs: ["statale-milano", "politecnico-torino", "unibo"],
  },
  {
    slug: "invest-your-talent",
    titleIt: "Invest Your Talent in Italy",
    titleFr: "Invest Your Talent in Italy",
    provider: "MAECI / Uni-Italia / ICE",
    amountEur: 8000,
    deadline: new Date("2026-04-30"),
    applyUrl: "https://www.investyourtalent.esteri.it",
    eligibility: {
      citizenship: ["TN", "MA", "DZ", "EG", "TR", "BR", "MX", "CO", "VN", "ID", "TH", "KZ", "AZ"],
      degreeTypes: ["MAGISTRALE"],
      fieldsOfStudy: ["Engineering", "Architecture", "Economics", "Management", "Design"],
    },
    description:
      "Programma del Governo Italiano che offre borse di studio per Master di II livello in ingegneria, architettura, economia, management e design, con stage in aziende italiane.",
    isPublished: true,
    universitySlugs: ["politecnico-torino", "unibo"],
  },
];

async function seedScholarships() {
  console.log("💰 Seeding scholarships...");

  for (const sch of scholarships) {
    const { universitySlugs, ...data } = sch;
    const universityIds = await db.university.findMany({
      where: { slug: { in: universitySlugs } },
      select: { id: true },
    });
    const connectIds = universityIds.map((u) => ({ id: u.id }));

    await db.scholarship.upsert({
      where: { slug: data.slug },
      update: { ...data, universities: { set: connectIds } },
      create: { ...data, universities: { connect: connectIds } },
    });
  }
  console.log(`   ✓ ${scholarships.length} scholarships`);
}

// =============================================================================
// 4. SERVICES + TRANSLATIONS + INITIAL VERSION SNAPSHOT
// =============================================================================

const services = [
  {
    slug: "codice-fiscale",
    category: ServiceCategory.ADMINISTRATIVE,
    iconKey: "id-card",
    estimatedDays: 1,
    costEurMin: 0,
    costEurMax: 0,
    isPremium: false,
    isPublished: true,
    translations: [
      {
        locale: Locale.IT,
        title: "Ottenere il Codice Fiscale",
        summary:
          "Il codice fiscale è un identificativo personale obbligatorio per qualsiasi rapporto con la pubblica amministrazione italiana, le banche e i datori di lavoro.",
        bodyMd:
          "## Cos'è il codice fiscale\n\nIl codice fiscale è un codice alfanumerico di 16 caratteri usato dall'amministrazione italiana per identificare ogni persona fisica. È necessario per aprire un conto in banca, firmare un contratto di lavoro o di affitto, iscriversi al Servizio Sanitario Nazionale.\n\n## Come richiederlo\n\n1. Recati a un'Agenzia delle Entrate con il passaporto e il visto.\n2. Compila il modulo AA4/8.\n3. Il codice viene rilasciato gratuitamente, in genere lo stesso giorno.\n\n## Tempi\n\nIn molti casi il rilascio è immediato.",
        documents: [
          { key: "passport", labelIt: "Passaporto in corso di validità", labelFr: "Passeport en cours de validité" },
          { key: "visa", labelIt: "Visto d'ingresso", labelFr: "Visa d'entrée" },
          { key: "form_aa48", labelIt: "Modulo AA4/8 compilato", labelFr: "Formulaire AA4/8 rempli" },
        ],
        metaKeywords: "codice fiscale, identificativo, agenzia entrate",
      },
      {
        locale: Locale.FR,
        title: "Obtenir le Codice Fiscale",
        summary:
          "Le codice fiscale est un identifiant personnel obligatoire pour toute démarche avec l'administration italienne, les banques et les employeurs.",
        bodyMd:
          "## Qu'est-ce que le codice fiscale\n\nLe codice fiscale est un code alphanumérique de 16 caractères utilisé par l'administration italienne pour identifier chaque personne. Indispensable pour ouvrir un compte bancaire, signer un contrat de travail ou de location, s'inscrire au Service de Santé National.\n\n## Comment l'obtenir\n\n1. Rendez-vous à une Agenzia delle Entrate avec passeport et visa.\n2. Remplissez le formulaire AA4/8.\n3. Le code est délivré gratuitement, en général le jour même.\n\n## Délais\n\nDans la plupart des cas, la délivrance est immédiate.",
        documents: [
          { key: "passport", labelIt: "Passaporto in corso di validità", labelFr: "Passeport en cours de validité" },
          { key: "visa", labelIt: "Visto d'ingresso", labelFr: "Visa d'entrée" },
          { key: "form_aa48", labelIt: "Modulo AA4/8 compilato", labelFr: "Formulaire AA4/8 rempli" },
        ],
        metaKeywords: "codice fiscale, identifiant, agenzia entrate",
      },
    ],
  },
  {
    slug: "permesso-soggiorno",
    category: ServiceCategory.ADMINISTRATIVE,
    iconKey: "shield-check",
    estimatedDays: 90,
    costEurMin: 100,
    costEurMax: 200,
    isPremium: false,
    isPublished: true,
    translations: [
      {
        locale: Locale.IT,
        title: "Richiedere il Permesso di Soggiorno",
        summary:
          "Documento obbligatorio per i cittadini extra-UE che soggiornano in Italia per più di 90 giorni. Va richiesto entro 8 giorni lavorativi dall'arrivo.",
        bodyMd:
          "## Quando richiederlo\n\nEntro **8 giorni lavorativi** dall'ingresso in Italia.\n\n## Procedura\n\n1. Ritira il kit giallo presso un ufficio postale abilitato (Sportello Amico).\n2. Compila il modulo e allega i documenti richiesti.\n3. Paga il bollettino postale (€70,46 + €30,46 contributo).\n4. Spedisci il kit. Riceverai data e ora dell'appuntamento in Questura.\n5. Recati in Questura per il fotosegnalamento.\n\n## Tempi di rilascio\n\nDa 60 a 120 giorni in media. Nel frattempo conserva la ricevuta postale: ha valore di permesso temporaneo.",
        documents: [
          { key: "passport_copy", labelIt: "Copia del passaporto", labelFr: "Copie du passeport" },
          { key: "visa_copy", labelIt: "Copia del visto", labelFr: "Copie du visa" },
          { key: "marca_bollo", labelIt: "Marca da bollo da €16", labelFr: "Timbre fiscal de 16 €" },
          { key: "photos", labelIt: "4 foto tessera", labelFr: "4 photos d'identité" },
          { key: "enrollment", labelIt: "Certificato di iscrizione (per studenti)", labelFr: "Certificat d'inscription (pour étudiants)" },
        ],
        metaKeywords: "permesso di soggiorno, questura, kit giallo",
      },
      {
        locale: Locale.FR,
        title: "Demander le Permis de Séjour",
        summary:
          "Document obligatoire pour les ressortissants hors UE qui séjournent en Italie plus de 90 jours. À demander dans les 8 jours ouvrables après l'arrivée.",
        bodyMd:
          "## Quand le demander\n\nDans les **8 jours ouvrables** suivant l'entrée en Italie.\n\n## Procédure\n\n1. Retirez le kit jaune dans un bureau de poste habilité (Sportello Amico).\n2. Remplissez le formulaire et joignez les pièces demandées.\n3. Payez le bulletin postal (70,46 € + 30,46 € de contribution).\n4. Expédiez le kit. Vous recevrez la date et l'heure du rendez-vous à la Questura.\n5. Présentez-vous à la Questura pour le relevé d'empreintes.\n\n## Délais de délivrance\n\nDe 60 à 120 jours en moyenne. Conservez le reçu postal : il fait office de permis temporaire.",
        documents: [
          { key: "passport_copy", labelIt: "Copia del passaporto", labelFr: "Copie du passeport" },
          { key: "visa_copy", labelIt: "Copia del visto", labelFr: "Copie du visa" },
          { key: "marca_bollo", labelIt: "Marca da bollo da €16", labelFr: "Timbre fiscal de 16 €" },
          { key: "photos", labelIt: "4 foto tessera", labelFr: "4 photos d'identité" },
          { key: "enrollment", labelIt: "Certificato di iscrizione (per studenti)", labelFr: "Certificat d'inscription (pour étudiants)" },
        ],
        metaKeywords: "permis de séjour, questura, kit jaune",
      },
    ],
  },
  {
    slug: "tessera-sanitaria",
    category: ServiceCategory.HEALTH,
    iconKey: "heart-pulse",
    estimatedDays: 30,
    costEurMin: 0,
    costEurMax: 150,
    isPremium: false,
    isPublished: true,
    translations: [
      {
        locale: Locale.IT,
        title: "Iscrizione al Servizio Sanitario Nazionale e Tessera Sanitaria",
        summary:
          "Iscriversi al SSN dà accesso al medico di base, alle prestazioni ospedaliere e ai farmaci a prezzo agevolato. La tessera sanitaria è il documento che lo attesta.",
        bodyMd:
          "## Iscrizione obbligatoria o volontaria\n\nGli studenti extra-UE possono iscriversi **volontariamente** pagando un contributo annuale (€149,77 nel 2024). Lavoratori, familiari di cittadini italiani e rifugiati hanno iscrizione obbligatoria gratuita.\n\n## Dove\n\nPresso l'ASL del Comune di residenza o domicilio.\n\n## Documenti\n\n- Passaporto e permesso di soggiorno (o ricevuta postale)\n- Codice fiscale\n- Autocertificazione di residenza/domicilio\n- Ricevuta del versamento del contributo (se iscrizione volontaria)",
        documents: [
          { key: "passport", labelIt: "Passaporto", labelFr: "Passeport" },
          { key: "permesso", labelIt: "Permesso di soggiorno o ricevuta", labelFr: "Permis de séjour ou reçu" },
          { key: "codice_fiscale", labelIt: "Codice fiscale", labelFr: "Codice fiscale" },
          { key: "residency_proof", labelIt: "Autocertificazione di residenza", labelFr: "Attestation de résidence" },
        ],
        metaKeywords: "tessera sanitaria, ssn, asl, medico di base",
      },
      {
        locale: Locale.FR,
        title: "Inscription au Service de Santé National et Carte Sanitaire",
        summary:
          "L'inscription au SSN donne accès au médecin traitant, aux soins hospitaliers et aux médicaments à tarif réduit. La tessera sanitaria est le document qui l'atteste.",
        bodyMd:
          "## Inscription obligatoire ou volontaire\n\nLes étudiants hors UE peuvent s'inscrire **volontairement** en payant une cotisation annuelle (149,77 € en 2024). Les travailleurs, les membres de familles de citoyens italiens et les réfugiés bénéficient d'une inscription obligatoire gratuite.\n\n## Où\n\nÀ l'ASL de la commune de résidence ou de domicile.\n\n## Documents\n\n- Passeport et permis de séjour (ou reçu postal)\n- Codice fiscale\n- Attestation sur l'honneur de résidence/domicile\n- Reçu de paiement de la cotisation (si inscription volontaire)",
        documents: [
          { key: "passport", labelIt: "Passaporto", labelFr: "Passeport" },
          { key: "permesso", labelIt: "Permesso di soggiorno o ricevuta", labelFr: "Permis de séjour ou reçu" },
          { key: "codice_fiscale", labelIt: "Codice fiscale", labelFr: "Codice fiscale" },
          { key: "residency_proof", labelIt: "Autocertificazione di residenza", labelFr: "Attestation de résidence" },
        ],
        metaKeywords: "carte sanitaire, ssn, asl, médecin traitant",
      },
    ],
  },
  {
    slug: "residenza",
    category: ServiceCategory.ADMINISTRATIVE,
    iconKey: "home",
    estimatedDays: 45,
    costEurMin: 0,
    costEurMax: 30,
    isPremium: false,
    isPublished: true,
    translations: [
      {
        locale: Locale.IT,
        title: "Iscrizione anagrafica (Residenza)",
        summary:
          "La residenza ufficiale presso il Comune dà diritto a numerosi servizi: medico di base, agevolazioni fiscali, accesso al sistema scolastico per i figli.",
        bodyMd:
          "## Quando richiederla\n\nEntro **20 giorni** dal trasferimento del domicilio abituale in Italia.\n\n## Dove\n\nPresso l'Anagrafe del Comune di residenza, spesso anche online.\n\n## Procedura\n\n1. Compila la dichiarazione di residenza.\n2. Allega documenti d'identità, codice fiscale, permesso di soggiorno e contratto di affitto registrato (o dichiarazione del proprietario).\n3. Entro 45 giorni la Polizia Municipale verifica l'effettiva dimora con una visita.",
        documents: [
          { key: "passport", labelIt: "Passaporto", labelFr: "Passeport" },
          { key: "permesso", labelIt: "Permesso di soggiorno", labelFr: "Permis de séjour" },
          { key: "codice_fiscale", labelIt: "Codice fiscale", labelFr: "Codice fiscale" },
          { key: "rental_contract", labelIt: "Contratto di affitto registrato", labelFr: "Contrat de location enregistré" },
        ],
        metaKeywords: "residenza, anagrafe, comune",
      },
      {
        locale: Locale.FR,
        title: "Inscription à l'État civil (Résidence)",
        summary:
          "La résidence officielle auprès de la commune donne droit à de nombreux services : médecin traitant, avantages fiscaux, accès au système scolaire pour les enfants.",
        bodyMd:
          "## Quand la demander\n\nDans les **20 jours** suivant le transfert du domicile habituel en Italie.\n\n## Où\n\nÀ l'Anagrafe de la commune de résidence, souvent en ligne aussi.\n\n## Procédure\n\n1. Remplissez la déclaration de résidence.\n2. Joignez pièces d'identité, codice fiscale, permis de séjour et contrat de location enregistré (ou déclaration du propriétaire).\n3. Sous 45 jours, la Police Municipale vérifie la résidence effective lors d'une visite.",
        documents: [
          { key: "passport", labelIt: "Passaporto", labelFr: "Passeport" },
          { key: "permesso", labelIt: "Permesso di soggiorno", labelFr: "Permis de séjour" },
          { key: "codice_fiscale", labelIt: "Codice fiscale", labelFr: "Codice fiscale" },
          { key: "rental_contract", labelIt: "Contratto di affitto registrato", labelFr: "Contrat de location enregistré" },
        ],
        metaKeywords: "résidence, anagrafe, commune",
      },
    ],
  },
  {
    slug: "conto-corrente",
    category: ServiceCategory.FINANCE,
    iconKey: "landmark",
    estimatedDays: 7,
    costEurMin: 0,
    costEurMax: 100,
    isPremium: false,
    isPublished: true,
    translations: [
      {
        locale: Locale.IT,
        title: "Aprire un Conto Corrente",
        summary:
          "Avere un conto corrente con IBAN italiano è praticamente indispensabile per ricevere lo stipendio, pagare l'affitto e attivare le utenze.",
        bodyMd:
          "## Tipi di conto\n\n- **Conto tradizionale** (ING, Intesa, Unicredit): canone mensile €0–10, sportelli fisici.\n- **Conto online** (Revolut, N26, Hype, Buddybank): apertura via app in 10 minuti, gratuito o quasi.\n\n## Documenti necessari\n\n- Documento d'identità\n- Codice fiscale\n- Permesso di soggiorno (per non-UE)\n- Talvolta richiesto un giustificativo di domicilio\n\n## Consiglio per studenti\n\nMolte banche offrono conti gratuiti per studenti under 30. Le banche online sono più rapide ma alcune (Revolut, N26) hanno un IBAN estero che può creare problemi con il datore di lavoro o l'università.",
        documents: [
          { key: "id", labelIt: "Documento d'identità", labelFr: "Pièce d'identité" },
          { key: "codice_fiscale", labelIt: "Codice fiscale", labelFr: "Codice fiscale" },
          { key: "permesso", labelIt: "Permesso di soggiorno (extra-UE)", labelFr: "Permis de séjour (hors UE)" },
        ],
        metaKeywords: "conto corrente, banca, iban, n26, revolut",
      },
      {
        locale: Locale.FR,
        title: "Ouvrir un Compte Bancaire",
        summary:
          "Disposer d'un compte courant avec IBAN italien est quasi indispensable pour percevoir un salaire, payer le loyer et activer les abonnements.",
        bodyMd:
          "## Types de comptes\n\n- **Compte traditionnel** (ING, Intesa, Unicredit) : abonnement mensuel 0–10 €, agences physiques.\n- **Compte en ligne** (Revolut, N26, Hype, Buddybank) : ouverture via appli en 10 minutes, gratuit ou quasi.\n\n## Documents nécessaires\n\n- Pièce d'identité\n- Codice fiscale\n- Permis de séjour (pour non-UE)\n- Parfois un justificatif de domicile\n\n## Conseil pour étudiants\n\nDe nombreuses banques offrent des comptes gratuits aux étudiants de moins de 30 ans. Les banques en ligne sont plus rapides, mais certaines (Revolut, N26) ont un IBAN étranger qui peut poser problème à l'employeur ou à l'université.",
        documents: [
          { key: "id", labelIt: "Documento d'identità", labelFr: "Pièce d'identité" },
          { key: "codice_fiscale", labelIt: "Codice fiscale", labelFr: "Codice fiscale" },
          { key: "permesso", labelIt: "Permesso di soggiorno (extra-UE)", labelFr: "Permis de séjour (hors UE)" },
        ],
        metaKeywords: "compte bancaire, banque, iban, n26, revolut",
      },
    ],
  },
];

async function seedServices() {
  console.log("📋 Seeding services + translations + initial version...");

  for (const svc of services) {
    const { translations, ...data } = svc;

    const serviceRow = await db.service.upsert({
      where: { slug: data.slug },
      update: data,
      create: { ...data, currentVersion: 1 },
    });

    for (const t of translations) {
      await db.serviceTranslation.upsert({
        where: { serviceId_locale: { serviceId: serviceRow.id, locale: t.locale } },
        update: t,
        create: { ...t, serviceId: serviceRow.id },
      });
    }

    // Initial version snapshot (only created if no version yet — keeps history clean on reseed).
    const existingVersion = await db.serviceVersion.findUnique({
      where: { serviceId_version: { serviceId: serviceRow.id, version: 1 } },
    });
    if (!existingVersion) {
      await db.serviceVersion.create({
        data: {
          serviceId: serviceRow.id,
          version: 1,
          editorId: null, // seed has no user yet
          snapshot: { service: data, translations },
          changeNote: "Initial seed version",
        },
      });
    }
  }

  console.log(`   ✓ ${services.length} services, ${services.length * 2} translations, ${services.length} initial versions`);
}

// =============================================================================
// 5. RESOURCE POINTS + TRANSLATIONS
// =============================================================================

const resourcePoints = [
  // Caritas
  {
    slug: "caritas-ambrosiana-milano",
    type: ResourcePointType.CARITAS,
    citySlug: "milano",
    nameIt: "Caritas Ambrosiana",
    address: "Via San Bernardino 4, 20122 Milano",
    lat: 45.4622,
    lng: 9.193,
    phone: "+39 02 7637 271",
    email: "info@caritasambrosiana.it",
    website: "https://www.caritasambrosiana.it",
    openingHours: { mon: ["09:00-13:00", "14:00-17:00"], tue: ["09:00-13:00", "14:00-17:00"], wed: ["09:00-13:00"], thu: ["09:00-13:00", "14:00-17:00"], fri: ["09:00-13:00"], sat: [], sun: [] },
    isVerified: true,
    translations: [
      { locale: Locale.IT, description: "Servizi di accoglienza, mensa, sportello legale e orientamento per migranti, rifugiati e persone in difficoltà.", servicesNote: "Operatori parlano arabo il martedì e francese il giovedì." },
      { locale: Locale.FR, description: "Services d'accueil, restauration, permanence juridique et orientation pour migrants, réfugiés et personnes en difficulté.", servicesNote: "Le personnel parle arabe le mardi et français le jeudi." },
    ],
  },
  {
    slug: "caritas-torino",
    type: ResourcePointType.CARITAS,
    citySlug: "torino",
    nameIt: "Caritas Diocesana di Torino",
    address: "Via Val della Torre 3, 10149 Torino",
    lat: 45.0856,
    lng: 7.665,
    phone: "+39 011 5156 311",
    email: "info@caritastorino.it",
    website: "https://www.caritastorino.it",
    openingHours: { mon: ["09:00-12:30"], tue: ["09:00-12:30", "15:00-18:00"], wed: ["09:00-12:30"], thu: ["09:00-12:30", "15:00-18:00"], fri: ["09:00-12:30"], sat: [], sun: [] },
    isVerified: true,
    translations: [
      { locale: Locale.IT, description: "Centro d'ascolto, mensa, dormitori e sportello migranti.", servicesNote: null },
      { locale: Locale.FR, description: "Centre d'écoute, restauration, hébergements et permanence migrants.", servicesNote: null },
    ],
  },
  {
    slug: "caritas-bologna",
    type: ResourcePointType.CARITAS,
    citySlug: "bologna",
    nameIt: "Caritas Diocesana di Bologna",
    address: "Via Riva di Reno 57, 40122 Bologna",
    lat: 44.4972,
    lng: 11.3382,
    phone: "+39 051 221 296",
    email: "segreteria@caritasbologna.it",
    website: "https://www.caritasbologna.it",
    openingHours: { mon: ["09:00-12:30"], tue: ["09:00-12:30", "15:00-18:00"], wed: ["09:00-12:30"], thu: ["09:00-12:30"], fri: ["09:00-12:30"], sat: [], sun: [] },
    isVerified: true,
    translations: [
      { locale: Locale.IT, description: "Servizi sociali, sportello legale per migranti, ascolto e orientamento.", servicesNote: null },
      { locale: Locale.FR, description: "Services sociaux, permanence juridique pour migrants, écoute et orientation.", servicesNote: null },
    ],
  },
  // Questure
  {
    slug: "questura-milano",
    type: ResourcePointType.QUESTURA,
    citySlug: "milano",
    nameIt: "Questura di Milano - Ufficio Immigrazione",
    address: "Via Montebello 26, 20121 Milano",
    lat: 45.4756,
    lng: 9.1947,
    phone: "+39 02 62261",
    website: "https://questure.poliziadistato.it/Milano",
    openingHours: { mon: ["08:30-12:30"], tue: ["08:30-12:30"], wed: ["08:30-12:30", "14:30-16:30"], thu: ["08:30-12:30"], fri: ["08:30-12:30"], sat: [], sun: [] },
    isVerified: true,
    translations: [
      { locale: Locale.IT, description: "Ufficio Immigrazione: rilascio e rinnovo del permesso di soggiorno, ricongiungimento familiare, asilo politico.", servicesNote: "Accesso solo su appuntamento ricevuto via posta dopo l'invio del kit giallo." },
      { locale: Locale.FR, description: "Bureau de l'Immigration : délivrance et renouvellement du permis de séjour, regroupement familial, asile politique.", servicesNote: "Accès uniquement sur rendez-vous reçu par courrier après l'envoi du kit jaune." },
    ],
  },
  {
    slug: "questura-torino",
    type: ResourcePointType.QUESTURA,
    citySlug: "torino",
    nameIt: "Questura di Torino - Ufficio Immigrazione",
    address: "Corso Vinzaglio 10, 10121 Torino",
    lat: 45.0741,
    lng: 7.6722,
    phone: "+39 011 5588 111",
    website: "https://questure.poliziadistato.it/Torino",
    openingHours: { mon: ["08:30-12:00"], tue: ["08:30-12:00"], wed: ["08:30-12:00"], thu: ["08:30-12:00"], fri: ["08:30-12:00"], sat: [], sun: [] },
    isVerified: true,
    translations: [
      { locale: Locale.IT, description: "Ufficio Immigrazione di Torino. Pratiche relative al permesso di soggiorno e all'asilo.", servicesNote: null },
      { locale: Locale.FR, description: "Bureau de l'Immigration de Turin. Démarches pour le permis de séjour et l'asile.", servicesNote: null },
    ],
  },
  {
    slug: "questura-bologna",
    type: ResourcePointType.QUESTURA,
    citySlug: "bologna",
    nameIt: "Questura di Bologna - Ufficio Immigrazione",
    address: "Via Bovi Campeggi 13, 40131 Bologna",
    lat: 44.5054,
    lng: 11.3431,
    phone: "+39 051 6401 111",
    website: "https://questure.poliziadistato.it/Bologna",
    openingHours: { mon: ["08:30-12:00"], tue: ["08:30-12:00"], wed: ["08:30-12:00", "15:00-17:00"], thu: ["08:30-12:00"], fri: ["08:30-12:00"], sat: [], sun: [] },
    isVerified: true,
    translations: [
      { locale: Locale.IT, description: "Ufficio Immigrazione della Questura di Bologna.", servicesNote: null },
      { locale: Locale.FR, description: "Bureau de l'Immigration de la Questura de Bologne.", servicesNote: null },
    ],
  },
  // Comuni - Anagrafe
  {
    slug: "comune-milano-anagrafe",
    type: ResourcePointType.COMUNE,
    citySlug: "milano",
    nameIt: "Comune di Milano - Anagrafe Centrale",
    address: "Via Larga 12, 20122 Milano",
    lat: 45.4621,
    lng: 9.1924,
    phone: "+39 02 02 02",
    website: "https://www.comune.milano.it",
    openingHours: { mon: ["08:30-15:30"], tue: ["08:30-15:30"], wed: ["08:30-15:30"], thu: ["08:30-15:30"], fri: ["08:30-12:00"], sat: [], sun: [] },
    isVerified: true,
    translations: [
      { locale: Locale.IT, description: "Iscrizione anagrafica, certificati di residenza, cambi di indirizzo. Su appuntamento.", servicesNote: null },
      { locale: Locale.FR, description: "Inscription à l'état civil, certificats de résidence, changements d'adresse. Sur rendez-vous.", servicesNote: null },
    ],
  },
  {
    slug: "comune-torino-anagrafe",
    type: ResourcePointType.COMUNE,
    citySlug: "torino",
    nameIt: "Comune di Torino - Anagrafe Centrale",
    address: "Via della Consolata 23, 10122 Torino",
    lat: 45.0743,
    lng: 7.6816,
    phone: "+39 011 011 26800",
    website: "https://www.comune.torino.it",
    openingHours: { mon: ["08:15-15:00"], tue: ["08:15-15:00"], wed: ["08:15-15:00"], thu: ["08:15-15:00"], fri: ["08:15-13:00"], sat: [], sun: [] },
    isVerified: true,
    translations: [
      { locale: Locale.IT, description: "Servizi anagrafici della Città di Torino: residenza, cittadinanza, certificati.", servicesNote: null },
      { locale: Locale.FR, description: "Services d'état civil de la Ville de Turin : résidence, citoyenneté, certificats.", servicesNote: null },
    ],
  },
  {
    slug: "comune-bologna-anagrafe",
    type: ResourcePointType.COMUNE,
    citySlug: "bologna",
    nameIt: "Comune di Bologna - Anagrafe",
    address: "Piazza Liber Paradisus 10, 40129 Bologna",
    lat: 44.5076,
    lng: 11.3601,
    phone: "+39 051 219 6800",
    website: "https://www.comune.bologna.it",
    openingHours: { mon: ["08:30-13:00"], tue: ["08:30-13:00", "14:30-17:00"], wed: ["08:30-13:00"], thu: ["08:30-13:00", "14:30-17:00"], fri: ["08:30-13:00"], sat: [], sun: [] },
    isVerified: true,
    translations: [
      { locale: Locale.IT, description: "Anagrafe del Comune di Bologna. Iscrizioni anagrafiche e certificati.", servicesNote: null },
      { locale: Locale.FR, description: "Anagrafe de la Commune de Bologne. Inscriptions à l'état civil et certificats.", servicesNote: null },
    ],
  },
];

async function seedResourcePoints() {
  console.log("📍 Seeding resource points...");

  for (const point of resourcePoints) {
    const { translations, citySlug, ...data } = point;
    const city = await db.city.findUniqueOrThrow({ where: { slug: citySlug } });

    const pointRow = await db.resourcePoint.upsert({
      where: { slug: data.slug },
      update: { ...data, cityId: city.id },
      create: { ...data, cityId: city.id },
    });

    for (const t of translations) {
      await db.resourcePointTranslation.upsert({
        where: { resourcePointId_locale: { resourcePointId: pointRow.id, locale: t.locale } },
        update: t,
        create: { ...t, resourcePointId: pointRow.id },
      });
    }
  }

  console.log(`   ✓ ${resourcePoints.length} resource points, ${resourcePoints.length * 2} translations`);
}

// =============================================================================
// 6. JOURNEY STEPS + TRANSLATIONS
// =============================================================================

const journeySteps = [
  // PRE_DEPARTURE
  {
    key: "obtain_passport",
    category: JourneyStepCategory.PRE_DEPARTURE,
    orderIndex: 1,
    iconKey: "book-marked",
    isOptional: false,
    serviceSlug: null,
    translations: [
      { locale: Locale.IT, title: "Ottenere il passaporto", description: "Richiedi un passaporto valido almeno 6 mesi oltre la data prevista di rientro." },
      { locale: Locale.FR, title: "Obtenir le passeport", description: "Demandez un passeport valable au moins 6 mois après la date prévue de retour." },
    ],
  },
  {
    key: "apply_visa",
    category: JourneyStepCategory.PRE_DEPARTURE,
    orderIndex: 2,
    iconKey: "stamp",
    isOptional: false,
    serviceSlug: null,
    translations: [
      { locale: Locale.IT, title: "Richiedere il visto studente", description: "Presso il Consolato Italiano nel tuo Paese. Tempi di rilascio: 1-3 mesi." },
      { locale: Locale.FR, title: "Demander le visa étudiant", description: "Auprès du Consulat d'Italie dans votre pays. Délais : 1 à 3 mois." },
    ],
  },
  {
    key: "apply_university",
    category: JourneyStepCategory.PRE_DEPARTURE,
    orderIndex: 3,
    iconKey: "graduation-cap",
    isOptional: false,
    serviceSlug: null,
    translations: [
      { locale: Locale.IT, title: "Iscriversi all'università", description: "Pre-iscrizione obbligatoria via portale Universitaly + lettera di accettazione dell'università." },
      { locale: Locale.FR, title: "Postuler à l'université", description: "Pré-inscription obligatoire via le portail Universitaly + lettre d'acceptation de l'université." },
    ],
  },
  // ARRIVAL
  {
    key: "arrive_italy",
    category: JourneyStepCategory.ARRIVAL,
    orderIndex: 4,
    iconKey: "plane-landing",
    isOptional: false,
    serviceSlug: null,
    translations: [
      { locale: Locale.IT, title: "Arrivo in Italia", description: "Conserva il timbro di ingresso sul passaporto: ti servirà per le pratiche successive." },
      { locale: Locale.FR, title: "Arrivée en Italie", description: "Conservez le tampon d'entrée sur le passeport : il vous servira pour les démarches suivantes." },
    ],
  },
  // ADMINISTRATIVE
  {
    key: "obtain_codice_fiscale",
    category: JourneyStepCategory.ADMINISTRATIVE,
    orderIndex: 5,
    iconKey: "id-card",
    isOptional: false,
    serviceSlug: "codice-fiscale",
    translations: [
      { locale: Locale.IT, title: "Ottenere il codice fiscale", description: "Indispensabile per qualsiasi pratica burocratica, bancaria o lavorativa in Italia." },
      { locale: Locale.FR, title: "Obtenir le codice fiscale", description: "Indispensable pour toute démarche administrative, bancaire ou professionnelle en Italie." },
    ],
  },
  {
    key: "apply_permesso_soggiorno",
    category: JourneyStepCategory.ADMINISTRATIVE,
    orderIndex: 6,
    iconKey: "shield-check",
    isOptional: false,
    serviceSlug: "permesso-soggiorno",
    translations: [
      { locale: Locale.IT, title: "Richiedere il permesso di soggiorno", description: "Entro 8 giorni lavorativi dall'arrivo. Necessario per soggiorni superiori a 90 giorni." },
      { locale: Locale.FR, title: "Demander le permis de séjour", description: "Dans les 8 jours ouvrables après l'arrivée. Obligatoire pour les séjours supérieurs à 90 jours." },
    ],
  },
  {
    key: "register_residency",
    category: JourneyStepCategory.ADMINISTRATIVE,
    orderIndex: 7,
    iconKey: "home",
    isOptional: false,
    serviceSlug: "residenza",
    translations: [
      { locale: Locale.IT, title: "Iscrizione anagrafica (residenza)", description: "Presso l'Anagrafe del Comune di residenza, una volta firmato il contratto di affitto." },
      { locale: Locale.FR, title: "Inscription à l'état civil (résidence)", description: "À l'Anagrafe de la commune de résidence, une fois le contrat de location signé." },
    ],
  },
  // HOUSING
  {
    key: "find_housing",
    category: JourneyStepCategory.HOUSING,
    orderIndex: 8,
    iconKey: "home-search",
    isOptional: false,
    serviceSlug: null,
    translations: [
      { locale: Locale.IT, title: "Trovare un alloggio", description: "Stanza in appartamento condiviso, residenze universitarie (DSU), studentati privati o affitto solo." },
      { locale: Locale.FR, title: "Trouver un logement", description: "Chambre en colocation, résidences universitaires (DSU), résidences privées ou location seule." },
    ],
  },
  // EDUCATION
  {
    key: "enroll_university",
    category: JourneyStepCategory.EDUCATION,
    orderIndex: 9,
    iconKey: "school",
    isOptional: false,
    serviceSlug: null,
    translations: [
      { locale: Locale.IT, title: "Immatricolazione all'università", description: "Conferma dell'iscrizione, pagamento delle tasse e ritiro del badge." },
      { locale: Locale.FR, title: "Immatriculation à l'université", description: "Confirmation d'inscription, paiement des frais et récupération du badge." },
    ],
  },
  // INTEGRATION
  {
    key: "open_bank_account",
    category: JourneyStepCategory.INTEGRATION,
    orderIndex: 10,
    iconKey: "landmark",
    isOptional: false,
    serviceSlug: "conto-corrente",
    translations: [
      { locale: Locale.IT, title: "Aprire un conto corrente", description: "IBAN italiano necessario per stipendio, affitto e bollette." },
      { locale: Locale.FR, title: "Ouvrir un compte bancaire", description: "IBAN italien nécessaire pour salaire, loyer et factures." },
    ],
  },
  {
    key: "get_health_card",
    category: JourneyStepCategory.INTEGRATION,
    orderIndex: 11,
    iconKey: "heart-pulse",
    isOptional: false,
    serviceSlug: "tessera-sanitaria",
    translations: [
      { locale: Locale.IT, title: "Iscrizione al SSN e tessera sanitaria", description: "Accesso al medico di base e prestazioni ospedaliere." },
      { locale: Locale.FR, title: "Inscription au SSN et carte sanitaire", description: "Accès au médecin traitant et soins hospitaliers." },
    ],
  },
  {
    key: "learn_italian",
    category: JourneyStepCategory.INTEGRATION,
    orderIndex: 12,
    iconKey: "languages",
    isOptional: true,
    serviceSlug: null,
    translations: [
      { locale: Locale.IT, title: "Imparare l'italiano", description: "Corsi gratuiti CPIA, scuole di lingua o piattaforme online. Anche se i corsi sono in inglese, l'italiano resta indispensabile per la vita quotidiana." },
      { locale: Locale.FR, title: "Apprendre l'italien", description: "Cours gratuits CPIA, écoles de langues ou plateformes en ligne. Même si les cursus sont en anglais, l'italien reste indispensable au quotidien." },
    ],
  },
];

async function seedJourneySteps() {
  console.log("🗺️  Seeding journey steps...");

  for (const step of journeySteps) {
    const { translations, ...data } = step;

    const stepRow = await db.journeyStep.upsert({
      where: { key: data.key },
      update: data,
      create: data,
    });

    for (const t of translations) {
      await db.journeyStepTranslation.upsert({
        where: { stepId_locale: { stepId: stepRow.id, locale: t.locale } },
        update: t,
        create: { ...t, stepId: stepRow.id },
      });
    }
  }

  console.log(`   ✓ ${journeySteps.length} journey steps, ${journeySteps.length * 2} translations`);
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log("\n🌱 Seeding NusurNet database...\n");
  const start = Date.now();

  await seedCities();
  await seedUniversities();
  await seedScholarships();
  await seedServices();
  await seedResourcePoints();
  await seedJourneySteps();

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`\n✅ Seed complete in ${elapsed}s\n`);
}

main()
  .catch((e) => {
    console.error("\n❌ Seed failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
