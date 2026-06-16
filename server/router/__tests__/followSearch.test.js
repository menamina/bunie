const app = require("../../server");
const supertest = require("supertest");
request = supertest(app);
const prisma = require("../../prisma/client");

afterAll(async () => {
  await prisma.$disconnect();
});

it("follows another user", async () => {});

it("does not follow self", async () => {});

it("it unfollows another user", async () => {});

it("searches query with at least one character", async () => {});

it("does not search query with 0 characters", async () => {});
