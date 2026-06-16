const app = require("../../server");
const supertest = require("supertest");
request = supertest(app);
const prisma = require("../../prisma/client");

afterAll(async () => {
  await prisma.$disconnect();
});

it("gets logged in users profile");

it("gets users profile with an account that is active", async () => {});

it("does not users profile with an account that is deleted", async () => {});

it("gets users follower count by username", async () => {});

it("gets users following count by username", async () => {});

it("gets users posts by username", async () => {});

it("gets users inventory by username", async () => {});

it("gets users in progress by username", async () => {});

it("gets users limbo by username", async () => {});

it("gets users decluttered by username", async () => {});

it("gets users finished by username", async () => {});

it("gets users liked posts and comments by id", async () => {});

// inventory
it("adds item to inventory with image", async () => {});

it("does not add item to inventory without image", async () => {});

it("updates inventory with valid data and image", async () => {});

it("does not update inventory without an image", async () => {});

it("deletes an item from specific selection by product id", async () => {});
