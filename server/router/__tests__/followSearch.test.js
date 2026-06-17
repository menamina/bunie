const app = require("../../server");
const supertest = require("supertest");
const request = supertest(app);
const agent = supertest.agent(app);
const prisma = require("../../prisma/client");
const { passwordGenie } = require("../../utils/password");

// helper functions
let user;

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
  user = await createTestUser();
});

beforeEach(async () => {
  await login();
});

afterEach(async () => {
  await logout();
});

afterAll(async () => {
  await dlt(user.id);
  await prisma.$disconnect();
});

it("follows another user", async () => {});

it("does not follow self", async () => {});

it("it unfollows another user", async () => {});

it("searches query with at least one character", async () => {});

it("does not search query with 0 characters", async () => {});
