const app = require("../../server");
const supertest = require("supertest");
request = supertest(app);
const prisma = require("../../prisma/client");

afterAll(async () => {
  await prisma.$disconnect();
});

it("gets another users profile with an account that is active", async () => {});

it("does not another users profile with an account that is deleted", async () => {});

it("gets another users follower count by username", async () => {});

it("gets another users following count by username", async () => {});

it("gets another users posts by username", async () => {});

it("gets another users inventory by username", async () => {});

it("gets another users in progress by username", async () => {});

it("gets another users limbo by username", async () => {});

it("gets another users decluttered by username", async () => {});

it("gets another users finished by username", async () => {});

it("gets another users liked posts and comments by username", async () => {});
