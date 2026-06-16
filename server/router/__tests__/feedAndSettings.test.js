const app = require("../../server");
const supertest = require("supertest");
request = supertest(app);
const prisma = require("../../prisma/client");

afterAll(async () => {
  await prisma.$disconnect();
});

// main feed
it("gets main feed posts when authenticated", async () => {});

it("gets main feed posts when not authenticated", async () => {});

// following feed
it("gets following feed posts when authenticated", async () => {});

it("gets following feed posts when not authenticated", async () => {});

//
it("gets logged in users profile settings when authenticated and correct user", async () => {});

it("does not get a users settings when not logged in", async () => {});

it("does not get a users settings when logged in but NOT correct user", async () => {});
