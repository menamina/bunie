const app = require("../../server");
const supertest = require("supertest");
const request = supertest(app);
const agent = supertest.agent(app);
const prisma = require("../../prisma/client");

async function createTestUser(
  email = "test@gmail.com",
  username = "test",
  password = "hello",
) {
  const hashedPassword = await passwordGenie(password);
  return await prisma.user.create({
    data: {
      name: "Test User",
      username,
      email,
      saltedHash: hashedPassword,
      profile: { create: { bio: null } },
    },
  });
}

afterAll(async () => {
  await prisma.$disconnect();
});

// main feed
it("does not return images multer does not have", async () => {});

it("gets main feed posts when authenticated", async () => {
  const res = await agent.get("/main-feed-API").send();
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("feed");
});

it("gets main feed posts when not authenticated", async () => {});

// following feed
it("gets following feed posts when authenticated", async () => {});

it("does not get following feed posts when not authenticated", async () => {});

// getting settings
it("gets logged in users profile settings when authenticated and correct user", async () => {});

it("does not get a users settings when not logged in", async () => {});

it("does not get a users settings when logged in but NOT correct user", async () => {});

// image crud settings
it("updates one profile image", async () => {});
it("updates one header image", async () => {});
it("does not update multiple profile images", async () => {});
it("does not update multiple header images", async () => {});
it("does not update profile image with wrong multer fields", async () => {});
it("does not update header image with wrong multer fields", async () => {});

// non image settings crud
it("updates profile with valid info", async () => {});
it("does not update profile with non valid info", async () => {});
it("updates password when current password matches database", async () => {});
it("does not update profile when current password does not match database", async () => {});
it("updates password when current pass === database AND new pass meets validation AND confirmed password is matches new password", async () => {});
it("does not update password when current pass === database AND new pass does not match confirmed password", async () => {});
it("does not delete user account when who is logged in does not match account to be deleted", async () => {});
it("deletes user account when who is logged in does match account to be deleted", async () => {});
