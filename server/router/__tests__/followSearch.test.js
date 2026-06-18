const app = require("../../server");
const supertest = require("supertest");
const request = supertest(app);
const agent = supertest.agent(app);
const prisma = require("../../prisma/client");
const { passwordGenie } = require("../../utils/password");

// helper functions
let user;
let otherUser;

async function createTestUser(
  email = "test@gmail.com",
  username = "test",
  password = "12345678",
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

async function login() {
  await agent.post("/login-API").send({
    email: "test@gmail.com",
    password: "12345678",
  });
}

async function logout() {
  await agent.post("/log-out");
}

async function dlt(userID) {
  await prisma.user.delete({ where: { id: userID } });
}

beforeAll(async () => {
  await prisma.user.deleteMany({});
  user = await createTestUser();
  otherUser = await createTestUser("other@gmail.com", "otherUser");
});

beforeEach(async () => {
  await login();
});

afterEach(async () => {
  await prisma.followRelation.deleteMany({
    where: {
      OR: [{ follower: user.id }, { following: user.id }],
    },
  });
  await logout();
});

afterAll(async () => {
  await dlt(user.id);
  await dlt(otherUser.id);
  await prisma.$disconnect();
});

it("follows another user", async () => {
  const res = await agent.post(`/follow/${otherUser.id}`);
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("following");
  expect(res.body.following).toBe(true);
});

it("does not follow self", async () => {
  const res = await agent.post(`/follow/${user.id}`);
  expect(res.status).toBe(400);
  expect(res.body.success).toBe(false);
});

it("it unfollows another user", async () => {
  await agent.post(`/follow/${otherUser.id}`);

  const res = await agent.post(`/follow/${otherUser.id}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("following");
  expect(res.body.following).toBe(false);
});

it("searches query with at least one character", async () => {
  const res = await agent.get("/search-API?querySearch=test&tabView=top");
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("usersWithQuery");
  expect(res.body).toHaveProperty("postsWithQuery");
  expect(res.body).toHaveProperty("nextCursor");
});

it("does not search query with 0 characters", async () => {
  const res = await agent.get("/search-API?querySearch=");
  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty("error");
});
