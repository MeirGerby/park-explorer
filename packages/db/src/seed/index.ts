import { config } from "dotenv";
import { resolve } from "node:path";
import { and, eq } from "drizzle-orm";
import {
  getDatabaseConnection,
  regions,
  cities,
  parks,
  parkImages,
  users,
} from "../index.js";

config({ path: resolve(__dirname, "../../../../.env") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required.");
}

const { db, pool } = getDatabaseConnection(connectionString);

const REGION_NAMES = ["North", "Center", "South", "Jerusalem"] as const;

const CITIES_BY_REGION: Record<(typeof REGION_NAMES)[number], string[]> = {
  North: [
    "Haifa",
    "Caesarea",
    "Jisr az-Zarqa",
    "Beit She'an",
    "Gideon",
    "Gesher",
    "Tiberias",
    "Rosh Pinna",
    "Kiriat Shmona",
    "Metula",
    "Golan Heights",
    "Katzrin"
  ],
  Center: [
    "Tel Aviv",
    "Ramat Gan",
    "Ra'anana",
    "Herzliya",
    "Kfar Saba",
    "Netanya",
    "Petah Tikva",
    "Tel Aviv-Yafo",
    "Bahan"
  ],
  South: [
    "Eilat",
    "Ashdod",
    "Ashkelon",
    "Be'er Sheva",
    "Mitzpe Ramon",
    "Ofakim",
    "Besor",
    "Dead Sea",
    "Kalya",
    "Arad",
    "Dimona",
    "Midreshet Ben-Gurion"
  ],
  Jerusalem: [
    "Jerusalem"
  ],
};


interface SeedPark {
  name: string;
  description: string;
  location: { lat: number; lng: number };
  cityName: string;
  imageUrls: string[];
}

const SEED_USER = {
  name: "Park Explorer Seed",
  email: "seed@park-explorer.local",
  // Not a valid argon2 hash — this account is a placeholder FK target for
  // seeded parks, not a real login. Login will always reject it.
  passwordHash: "unusable-seed-placeholder",
};

const SEED_PARKS: SeedPark[] = [
  {
    name: "Ramat Gan National Park",
    description:
      "An expansive park featuring a scenic lake, lush gardens, and historic monuments.",
    location: { lat: 32.0461, lng: 34.8239 },
    cityName: "Ramat Gan",
    imageUrls: ["https://picsum.photos/seed/park-1/800/600"],
  },
  {
    name: "Edith Wolfson Park",
    description:
      "A hilltop park offering sweeping panoramic views of the Tel Aviv skyline.",
    location: { lat: 32.0534, lng: 34.8052 },
    cityName: "Tel Aviv",
    imageUrls: ["https://picsum.photos/seed/park-2/800/600"],
  },
  {
    name: "Charles Clore Park",
    description:
      "A breezy beachfront park ideal for jogging, sunset viewing, and picnics.",
    location: { lat: 32.0621, lng: 34.7615 },
    cityName: "Tel Aviv",
    imageUrls: ["https://picsum.photos/seed/park-3/800/600"],
  },
  {
    name: "Independence Park",
    description:
      "A coastal park situated on a cliff overlooking the Mediterranean Sea.",
    location: { lat: 32.0911, lng: 34.7712 },
    cityName: "Tel Aviv",
    imageUrls: ["https://picsum.photos/seed/park-4/800/600"],
  },
  {
    name: "Meir Park",
    description:
      "A vibrant public park in central Tel Aviv featuring a scenic lily pond.",
    location: { lat: 32.0735, lng: 34.7738 },
    cityName: "Tel Aviv",
    imageUrls: ["https://picsum.photos/seed/park-5/800/600"],
  },
  {
    name: "Teddy Park",
    description:
      "A modern park near the Old City walls featuring a synchronized water fountain.",
    location: { lat: 31.7768, lng: 35.2265 },
    cityName: "Jerusalem",
    imageUrls: ["https://picsum.photos/seed/park-6/800/600"],
  },
  {
    name: "Wohl Rose Park",
    description:
      "A beautifully landscaped garden home to thousands of diverse rose varieties.",
    location: { lat: 31.7785, lng: 35.2043 },
    cityName: "Jerusalem",
    imageUrls: ["https://picsum.photos/seed/park-7/800/600"],
  },
  {
    name: "Jerusalem Botanical Gardens",
    description:
      "A sprawling flora sanctuary displaying diverse plants grouped by geographical origin.",
    location: { lat: 31.7684, lng: 35.2001 },
    cityName: "Jerusalem",
    imageUrls: ["https://picsum.photos/seed/park-8/800/600"],
  },
  {
    name: "Liberty Bell Park",
    description:
      "A central municipal park featuring sports courts, a playground, and a replica bell.",
    location: { lat: 31.7699, lng: 35.2224 },
    cityName: "Jerusalem",
    imageUrls: ["https://picsum.photos/seed/park-9/800/600"],
  },
  {
    name: "Hecht Park",
    description:
      "A long, linear coastal park perfect for seaside walks, sports, and cycling.",
    location: { lat: 32.8252, lng: 34.9575 },
    cityName: "Haifa",
    imageUrls: ["https://picsum.photos/seed/park-10/800/600"],
  },
  {
    name: "Louis Promenade",
    description:
      "A picturesque walkway offering breathtaking views over Haifa Bay and the north.",
    location: { lat: 32.8091, lng: 34.9822 },
    cityName: "Haifa",
    imageUrls: ["https://picsum.photos/seed/park-11/800/600"],
  },
  {
    name: "Nesher Park",
    description:
      "A green forest park famous for its pair of thrilling steel suspension bridges.",
    location: { lat: 32.7533, lng: 35.0392 },
    cityName: "Haifa",
    imageUrls: ["https://picsum.photos/seed/park-12/800/600"],
  },
  {
    name: "Ra'anana Park",
    description:
      "A highly acclaimed urban park featuring a large lake, wildlife corner, and cafes.",
    location: { lat: 32.1895, lng: 34.8512 },
    cityName: "Ra'anana",
    imageUrls: ["https://picsum.photos/seed/park-13/800/600"],
  },
  {
    name: "Herzliya Park",
    description:
      "A spacious green park containing natural winter ponds and extensive bike trails.",
    location: { lat: 32.1678, lng: 34.8211 },
    cityName: "Herzliya",
    imageUrls: ["https://picsum.photos/seed/park-14/800/600"],
  },
  {
    name: "Kfar Saba Park",
    description:
      "An eco-friendly municipal park with expansive lawns, play zones, and skating areas.",
    location: { lat: 32.1791, lng: 34.9124 },
    cityName: "Kfar Saba",
    imageUrls: ["https://picsum.photos/seed/park-15/800/600"],
  },
  {
    name: "Netanya Winter Pond Park",
    description:
      "A seasonal nature reserve hosting diverse migratory birds and local amphibians.",
    location: { lat: 32.2882, lng: 34.8395 },
    cityName: "Netanya",
    imageUrls: ["https://picsum.photos/seed/park-16/800/600"],
  },
  {
    name: "Ashdod Sea Park",
    description:
      "A massive modern park featuring musical fountains, sports facilities, and lake boating.",
    location: { lat: 31.7891, lng: 34.6295 },
    cityName: "Ashdod",
    imageUrls: ["https://picsum.photos/seed/park-17/800/600"],
  },
  {
    name: "Lachish River Park",
    description:
      "A calm riverfront promenade offering sightings of diverse wildlife and birds.",
    location: { lat: 31.8152, lng: 34.6461 },
    cityName: "Ashdod",
    imageUrls: ["https://picsum.photos/seed/park-18/800/600"],
  },
  {
    name: "Afridar Park",
    description:
      "A historic community park situated in the heart of Ashkelon's coastal district.",
    location: { lat: 31.6812, lng: 34.5574 },
    cityName: "Ashkelon",
    imageUrls: ["https://picsum.photos/seed/park-19/800/600"],
  },
  {
    name: "Be'er Sheva River Park",
    description:
      "A giant environmental oasis featuring a huge artificial lake and historic bridges.",
    location: { lat: 31.2334, lng: 34.8091 },
    cityName: "Be'er Sheva",
    imageUrls: ["https://picsum.photos/seed/park-20/800/600"],
  },
  {
    name: "Ramon Park",
    description:
      "A community park in the desert city serving as a gateway to the crater views.",
    location: { lat: 30.6092, lng: 34.8015 },
    cityName: "Mitzpe Ramon",
    imageUrls: ["https://picsum.photos/seed/park-21/800/600"],
  },
  {
    name: "Ofakim Park",
    description:
      "A quiet pine forest reserve featuring ancient cisterns and limestone caves.",
    location: { lat: 31.3112, lng: 34.6285 },
    cityName: "Ofakim",
    imageUrls: ["https://picsum.photos/seed/park-22/800/600"],
  },
  {
    name: "Eshkol National Park",
    description:
      "An expansive desert green lawns park fed by natural warm springs.",
    location: { lat: 31.2755, lng: 34.4891 },
    cityName: "Besor",
    imageUrls: ["https://picsum.photos/seed/park-23/800/600"],
  },
  {
    name: "Yarkon National Park",
    description:
      "The historical source of the river, containing Tel Afek fortress and clean springs.",
    location: { lat: 32.1052, lng: 34.9315 },
    cityName: "Petah Tikva",
    imageUrls: ["https://picsum.photos/seed/park-24/800/600"],
  },
  {
    name: "Anis Park",
    description:
      "A charming local park in Jaffa providing relaxing spots under olive trees.",
    location: { lat: 32.0395, lng: 34.7521 },
    cityName: "Tel Aviv-Yafo",
    imageUrls: ["https://picsum.photos/seed/park-25/800/600"],
  },
  {
    name: "Apollonia National Park",
    description:
      "A coastal clifftop archaeological site overlooking an ancient Crusader castle ruins.",
    location: { lat: 32.1951, lng: 34.8062 },
    cityName: "Herzliya",
    imageUrls: ["https://picsum.photos/seed/park-26/800/600"],
  },
  {
    name: "Caesarea National Park",
    description:
      "A world-renowned historical harbor park boasting a preserved Roman amphitheater.",
    location: { lat: 32.5012, lng: 34.8924 },
    cityName: "Caesarea",
    imageUrls: ["https://picsum.photos/seed/park-27/800/600"],
  },
  {
    name: "Taninim Stream Nature Reserve",
    description:
      "A historic nature reserve showcasing ancient Roman dams and water mills.",
    location: { lat: 32.5401, lng: 34.9125 },
    cityName: "Jisr az-Zarqa",
    imageUrls: ["https://picsum.photos/seed/park-28/800/600"],
  },
  {
    name: "Nahal Alexander National Park",
    description:
      "A river reserve world-famous for its population of giant softshell turtles.",
    location: { lat: 32.3952, lng: 34.8641 },
    cityName: "Netanya",
    imageUrls: ["https://picsum.photos/seed/park-29/800/600"],
  },
  {
    name: "Utopia Park",
    description:
      "An enchanting indoor tropical orchid sanctuary featuring lush botanical gardens.",
    location: { lat: 32.3361, lng: 34.9812 },
    cityName: "Bahan",
    imageUrls: ["https://picsum.photos/seed/park-30/800/600"],
  },
  {
    name: "Gan HaShlosha National Park",
    description:
      "Famous natural spring pools maintaining warm, swimmable temperatures year-round.",
    location: { lat: 32.5054, lng: 35.4452 },
    cityName: "Beit She'an",
    imageUrls: ["https://picsum.photos/seed/park-31/800/600"],
  },
  {
    name: "Ma'ayan Harod National Park",
    description:
      "A historic spring flowing from a cave, nestled against the Gilboa slopes.",
    location: { lat: 32.5492, lng: 35.3581 },
    cityName: "Gideon",
    imageUrls: ["https://picsum.photos/seed/park-32/800/600"],
  },
  {
    name: "Beit She'an National Park",
    description:
      "One of the world's most spectacular archaeological parks preserving ancient Scythopolis.",
    location: { lat: 32.5021, lng: 35.5015 },
    cityName: "Beit She'an",
    imageUrls: ["https://picsum.photos/seed/park-33/800/600"],
  },
  {
    name: "Kokhav HaYarden National Park",
    description:
      "A remote mountaintop fortress park displaying stunning Belvoir Crusader ruins.",
    location: { lat: 32.5982, lng: 35.5211 },
    cityName: "Gesher",
    imageUrls: ["https://picsum.photos/seed/park-34/800/600"],
  },
  {
    name: "Arbel National Park",
    description:
      "Dramatic vertical cliffs towering above the Sea of Galilee, ideal for hiking.",
    location: { lat: 32.8251, lng: 35.5022 },
    cityName: "Tiberias",
    imageUrls: ["https://picsum.photos/seed/park-35/800/600"],
  },
  {
    name: "Korazim National Park",
    description:
      "An ancient Jewish town site built entirely out of dark basalt stones.",
    location: { lat: 32.9124, lng: 35.5641 },
    cityName: "Rosh Pinna",
    imageUrls: ["https://picsum.photos/seed/park-36/800/600"],
  },
  {
    name: "Hula Valley Nature Reserve",
    description:
      "A premier global wetland sanctuary vital for millions of migrating water birds.",
    location: { lat: 33.1012, lng: 35.6124 },
    cityName: "Kiriat Shmona",
    imageUrls: ["https://picsum.photos/seed/park-37/800/600"],
  },
  {
    name: "Tel Dan Nature Reserve",
    description:
      "A verdant paradise featuring raging streams, ancient ruins, and dense canopy walks.",
    location: { lat: 33.2491, lng: 35.6523 },
    cityName: "Metula",
    imageUrls: ["https://picsum.photos/seed/park-38/800/600"],
  },
  {
    name: "Banias Nature Reserve",
    description:
      "Home to the country's most powerful waterfall and ancient temples of Pan.",
    location: { lat: 33.2472, lng: 35.6941 },
    cityName: "Golan Heights",
    imageUrls: ["https://picsum.photos/seed/park-39/800/600"],
  },
  {
    name: "Snir Stream Nature Reserve",
    description:
      "The longest tributary of the Jordan River, offering shady wading hiking paths.",
    location: { lat: 33.2281, lng: 35.6212 },
    cityName: "Kiriat Shmona",
    imageUrls: ["https://picsum.photos/seed/park-40/800/600"],
  },
  {
    name: "Ayoun Stream Nature Reserve",
    description:
      "A striking canyon path showcasing four exceptional perennial waterfalls, including Tanur.",
    location: { lat: 33.2681, lng: 35.5812 },
    cityName: "Metula",
    imageUrls: ["https://picsum.photos/seed/park-41/800/600"],
  },
  {
    name: "Nimrod Fortress National Park",
    description:
      "A massive medieval mountain castle fortress overlooking the northern valleys.",
    location: { lat: 33.2524, lng: 35.7145 },
    cityName: "Golan Heights",
    imageUrls: ["https://picsum.photos/seed/park-42/800/600"],
  },
  {
    name: "Yehudiya Nature Reserve",
    description:
      "A volcanic canyon network offering deep swimming pools and rugged basalt walls.",
    location: { lat: 32.9515, lng: 35.6912 },
    cityName: "Katzrin",
    imageUrls: ["https://picsum.photos/seed/park-43/800/600"],
  },
  {
    name: "Meshushim Hexagon Pool",
    description:
      "A mesmerizing geological pool enclosed by naturally formed hexagonal basalt pillars.",
    location: { lat: 32.9391, lng: 35.6542 },
    cityName: "Katzrin",
    imageUrls: ["https://picsum.photos/seed/park-44/800/600"],
  },
  {
    name: "Gamla Nature Reserve",
    description:
      "Features a dramatic ancient cliff city ruins, a huge waterfall, and nesting vultures.",
    location: { lat: 32.9015, lng: 35.7412 },
    cityName: "Katzrin",
    imageUrls: ["https://picsum.photos/seed/park-45/800/600"],
  },
  {
    name: "Ein Gedi Nature Reserve",
    description:
      "An incredible desert oasis sanctuary featuring cascading waterfalls and wild ibex.",
    location: { lat: 31.4652, lng: 35.3912 },
    cityName: "Dead Sea",
    imageUrls: ["https://picsum.photos/seed/park-46/800/600"],
  },
  {
    name: "Kumran National Park",
    description:
      "The historical desert caves site where the famous Dead Sea Scrolls were discovered.",
    location: { lat: 31.7412, lng: 35.4591 },
    cityName: "Kalya",
    imageUrls: ["https://picsum.photos/seed/park-47/800/600"],
  },
  {
    name: "Masada National Park",
    description:
      "An iconic ancient mountaintop fortress accessible via a steep trail or cable car.",
    location: { lat: 31.3122, lng: 35.3531 },
    cityName: "Arad",
    imageUrls: ["https://picsum.photos/seed/park-48/800/600"],
  },
  {
    name: "Mamshit National Park",
    description:
      "A beautifully restored ancient Nabatean desert city displaying unique architecture.",
    location: { lat: 31.0524, lng: 35.0641 },
    cityName: "Dimona",
    imageUrls: ["https://picsum.photos/seed/park-49/800/600"],
  },
  {
    name: "Avdat National Park",
    description:
      "A ruined Nabatean incense route city perched high on a desert plateau.",
    location: { lat: 30.7942, lng: 34.7731 },
    cityName: "Midreshet Ben-Gurion",
    imageUrls: ["https://picsum.photos/seed/park-50/800/600"],
  },
];

async function upsertRegion(name: string): Promise<string> {
  const [inserted] = await db
    .insert(regions)
    .values({ name })
    .onConflictDoNothing({ target: regions.name })
    .returning({ id: regions.id });

  if (inserted) {
    console.log(`  - Created region "${name}".`);
    return inserted.id;
  }

  const [existing] = await db
    .select({ id: regions.id })
    .from(regions)
    .where(eq(regions.name, name))
    .limit(1);

  if (!existing) {
    throw new Error(`Failed to upsert region "${name}".`);
  }

  console.log(`  - Region "${name}" already exists, skipping.`);
  return existing.id;
}

async function upsertCity(name: string, regionId: string): Promise<string> {
  const [existing] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(and(eq(cities.name, name), eq(cities.regionId, regionId)))
    .limit(1);

  if (existing) {
    console.log(`  - City "${name}" already exists, skipping.`);
    return existing.id;
  }

  const [created] = await db
    .insert(cities)
    .values({ name, regionId })
    .returning({ id: cities.id });

  console.log(`  - Created city "${name}".`);
  return created.id;
}

async function upsertSeedUser(): Promise<string> {
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, SEED_USER.email))
    .limit(1);

  if (existing) {
    console.log(`  - Seed user "${SEED_USER.email}" already exists, skipping.`);
    return existing.id;
  }

  const [created] = await db
    .insert(users)
    .values(SEED_USER)
    .returning({ id: users.id });

  console.log(`  - Created seed user "${SEED_USER.email}".`);
  return created.id;
}

async function upsertPark(
  park: SeedPark,
  cityId: string,
  creatorId: string,
): Promise<void> {
  const [existing] = await db
    .select({ id: parks.id })
    .from(parks)
    .where(and(eq(parks.name, park.name), eq(parks.cityId, cityId)))
    .limit(1);

  if (existing) {
    console.log(`  - Park "${park.name}" already exists, skipping.`);
    return;
  }

  const [created] = await db
    .insert(parks)
    .values({
      name: park.name,
      description: park.description,
      location: park.location,
      cityId,
      creatorId,
    })
    .returning({ id: parks.id });

  if (park.imageUrls.length > 0) {
    await db
      .insert(parkImages)
      .values(park.imageUrls.map((url) => ({ url, parkId: created.id })));
  }

  console.log(
    `  - Created park "${park.name}" with ${park.imageUrls.length} image(s).`,
  );
}

async function seed(): Promise<void> {
  console.log("Seeding regions and cities...");
  const cityIdsByName = new Map<string, string>();

  for (const regionName of REGION_NAMES) {
    const regionId = await upsertRegion(regionName);

    for (const cityName of CITIES_BY_REGION[regionName]) {
      const cityId = await upsertCity(cityName, regionId);
      cityIdsByName.set(cityName, cityId);
    }
  }

  console.log("Seeding user...");
  const creatorId = await upsertSeedUser();

  console.log("Seeding parks...");
  for (const park of SEED_PARKS) {
    const cityId = cityIdsByName.get(park.cityName);

    if (!cityId) {
      throw new Error(
        `No seeded city found for park "${park.name}" (city: ${park.cityName}).`,
      );
    }

    await upsertPark(park, cityId, creatorId);
  }

  console.log("Seed completed successfully.");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
