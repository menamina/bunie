const app = require("../../server");
const supertest = require("supertest");
const request = supertest(app);
const agent = supertest.agent(app);
const prisma = require("../../prisma/client");
const { passwordGenie } = require("../../utils/password");

// helper functions
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

const user = createTestUser();

const agent = supertest.agent(app);

async function login() {
  return await agent.post("/login-API").send({
    email: "test@gmail.com",
    password: "12345678",
  });
}

async function logout() {
  return await agent.post("/log-out");
}

async function dlt(userID) {
  return await prisma.user.delete({ where: { id: userID } });
}

afterAll(async () => {
  dlt();
  await prisma.$disconnect();
});

it("gets logged in users profile", async () => {
  login();
  const res = await agent.get("/profile-API/test");
  expect(res.status).toBe(200);
  expect(res.body.username).toEqual("test");
  logout();
});

it("gets users profile with an account that is active", async () => {
  const newUser = createTestUser("faker@gmail.com", "notTest");
  login();
  const res = await agent.get(`/profile-API/${newUser.username}`);
  expect(res.status).toBe(200);
  expect(res.body.username).toEqual(newUser.username);
  dlt(newUser.id);
  logout();
});

it("does not get users profile with an account that is deleted or nonexistant", async () => {
  login();
  const res = await agent.get("/profile-API/notTest");
  expect(res.status).toBe(404);
  expect(res.body).toHaveProperty("noUserFound");
  logout();
});

it("gets users follower count by username", async () => {
  login();
  const res = await agent.get(`/get-user-followers/${user.username}`);
  expect(res.status).toBe(404);
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toBe("no followers");
  logout();
});

it("gets users following count by username", async () => {
  login();
  const res = await agent.get(`/get-user-following/${user.username}`);
  expect(res.status).toBe(404);
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toBe("no followings");
  logout();
});

it("gets users posts by username", async () => {
  login();
  const res = await agent.get(`/get-user-following/${user.username}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("feed");
  expect(res.body.feed).toBe([]);
  expect(res.body.nextCursor).toBe(null);
  logout();
});

it("gets users inventory by username", async () => {
  login();
  const res = await agent.get(`/get-user-inventory/${user.username}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("noInventory");
  expect(res.body.noInventory).toBe(true);
  logout();
});

it("gets users in progress by username", async () => {
  login();
  const res = await agent.get(`/get-user-in-progress/${user.username}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("noInventory");
  expect(res.body.noInventory).toBe(true);
  logout();
});

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
