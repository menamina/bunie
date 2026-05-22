import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { faker } from "@faker-js/faker";

const { Pool } = pg;

const connection = process.env.DATABASEURL;
const pool = new Pool({ connectionString: connection });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function generateLines(lineCount = { min: 5, max: 15 }) {
  let numLines;
  if (typeof lineCount === "number") {
    numLines = lineCount;
  } else {
    numLines =
      Math.floor(Math.random() * (lineCount.max - lineCount.min + 1)) +
      lineCount.min;
  }

  return Array(numLines)
    .fill(null)
    .map(() => faker.lorem.sentence())
    .join(" ");
}

async function main() {
  console.log("🌱 Starting to seed posts...");

  const user = await prisma.user.findUnique({
    where: { username: "mena" },
  });

  if (!user) {
    console.error('❌ User "mena" not found in database!');
    process.exit(1);
  }

  const posts = [];

  for (let i = 0; i < 30; i++) {
    const post = await prisma.posts.create({
      data: {
        madeBy: user.id,
        title: faker.lorem.sentence({ min: 3, max: 8 }),
        body: generateLines({ min: 100, max: 500 }),
      },
    });
    posts.push(post);
  }

  console.log(`✅ Created ${posts.length} posts for user "${user.username}"`);
  console.log("\n🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
