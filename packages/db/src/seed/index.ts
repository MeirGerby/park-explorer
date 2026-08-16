import { config } from "dotenv";
import { resolve } from "node:path";
import { and, eq } from "drizzle-orm";
import { getDatabaseConnection, regions, cities, parks, parkImages, users } from "../index.js";

config({ path: resolve(__dirname, "../../../../.env") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required.");
}

const { db, pool } = getDatabaseConnection(connectionString);

const REGION_NAMES = ["North", "Center", "South", "Jerusalem"] as const;

const CITIES_BY_REGION: Record<(typeof REGION_NAMES)[number], string[]> = {
  North: ["Haifa"],
  Center: ["Tel Aviv"],
  South: ["Eilat"],
  Jerusalem: ["Jerusalem"],
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
    name: "HaYarkon Park",
    description: "A large urban park along the Yarkon River.",
    location: { lat: 32.1024, lng: 34.8081 },
    cityName: "Tel Aviv",
    imageUrls: [
      "https://picsum.photos/seed/hayarkon-1/800/600",
      "https://picsum.photos/seed/hayarkon-2/800/600",
    ],
  },
  {
    name: "Gan Sacher",
    description: "Jerusalem's largest municipal park, popular for picnics.",
    location: { lat: 31.7818, lng: 35.2049 },
    cityName: "Jerusalem",
    imageUrls: ["https://picsum.photos/seed/gan-sacher/800/600"],
  },
  {
    name: "Denya Park",
    description: "A green ridge park overlooking the Carmel coast.",
    location: { lat: 32.7796, lng: 34.9892 },
    cityName: "Haifa",
    imageUrls: ["https://picsum.photos/seed/denya-park/800/600"],
  },
  {
    name: "Timna Park",
    description: "A desert nature park known for ancient copper mines.",
    location: { lat: 29.7797, lng: 34.9678 },
    cityName: "Eilat",
    imageUrls: [
      "https://picsum.photos/seed/timna-1/800/600",
      "https://picsum.photos/seed/timna-2/800/600",
    ],
  },
  {
    name: "Coral Beach Nature Reserve",
    description: "A protected coastal reserve on the Red Sea.",
    location: { lat: 29.5027, lng: 34.9198 },
    cityName: "Eilat",
    imageUrls: ["https://picsum.photos/seed/coral-beach/800/600"],
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

async function upsertPark(park: SeedPark, cityId: string, creatorId: string): Promise<void> {
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
    await db.insert(parkImages).values(
      park.imageUrls.map((url) => ({ url, parkId: created.id })),
    );
  }

  console.log(`  - Created park "${park.name}" with ${park.imageUrls.length} image(s).`);
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
      throw new Error(`No seeded city found for park "${park.name}" (city: ${park.cityName}).`);
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
