const app = require("../../server");
const supertest = require("supertest");
request = supertest(app);
const prisma = require("../../prisma/client");

afterAll(async () => {
  await prisma.$disconnect();
});
