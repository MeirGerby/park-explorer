import { db, regions, cities, pool } from "../index";

const seedData = [
  {
    name: "Israel",
    cities: ["Jerusalem", "Tel Aviv", "Haifa"],
  },
  {
    name: "Europe",
    cities: ["London", "Paris", "Rome"],
  },
  {
    name: "North America",
    cities: ["New York", "Toronto", "Los Angeles"],
  },
];

async function seed() {
  for (const regionData of seedData) {
    const [region] = await db
      .insert(regions)
      .values({
        name: regionData.name,
      })
      .returning();

    await db.insert(cities).values(
      regionData.cities.map((cityName) => ({
        name: cityName,
        regionId: region.id,
      })),
    );
  }

  console.log("Seed completed successfully.");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
