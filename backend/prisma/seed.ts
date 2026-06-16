import { config } from "dotenv";
config();

import db from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const categories = [
    "Décor and Furnishings",
    "Electronics",
    "Fashion",
    "Food",
    "Health and Beauty",
    "Sports and Fitness",
    "Automotive",
    "Education",
    "Professional Services",
    "Real Estate",
  ];

  for (const name of categories) {
    await db.category.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log(`Seeded ${categories.length} categories`);

  const adminPassword = await bcrypt.hash("Admin@123", 10);
  await db.admin.upsert({
    where: { email: "admin@vyaparnet.com" },
    update: {},
    create: { email: "admin@vyaparnet.com", password: adminPassword, name: "Super Admin" },
  });
  console.log("Default admin created — email: admin@vyaparnet.com | password: Admin@123");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
