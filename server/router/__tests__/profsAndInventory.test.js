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
  await prisma.user.deleteMany({});
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

it("gets logged in users profile", async () => {
  const res = await agent.get("/profile-API/test");
  expect(res.status).toBe(200);
  expect(res.body.username).toEqual("test");
});

it("gets users profile with an account that is active", async () => {
  const newUser = await createTestUser("faker@gmail.com", "notTest");
  const res = await agent.get(`/profile-API/${newUser.username}`);
  expect(res.status).toBe(200);
  expect(res.body.username).toEqual(newUser.username);
  await dlt(newUser.id);
});

it("does not get users profile with an account that is deleted or nonexistant", async () => {
  const res = await agent.get("/profile-API/notTest");
  expect(res.status).toBe(404);
  expect(res.body).toHaveProperty("noUserFound");
});

it("gets users follower count by username", async () => {
  const res = await agent.get(`/get-user-followers/${user.username}`);
  expect(res.status).toBe(404);
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toBe("no followers");
});

it("gets users following count by username", async () => {
  const res = await agent.get(`/get-user-following/${user.username}`);
  expect(res.status).toBe(404);
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toBe("no followings");
});

it("gets users posts by username", async () => {
  const res = await agent.get(`/get-user-following/${user.username}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("feed");
  expect(res.body.feed).toBe([]);
  expect(res.body.nextCursor).toBe(null);
});

it("gets users inventory by username", async () => {
  const res = await agent.get(`/get-user-inventory/${user.username}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("noInventory");
  expect(res.body.noInventory).toBe(true);
});

it("gets users in progress by username", async () => {
  const res = await agent.get(`/get-user-in-progress/${user.username}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("noInProgress");
  expect(res.body.noInProgress).toBe(true);
});

it("gets users limbo by username", async () => {
  const res = await agent.get(`/get-user-limbo/${user.username}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("limbo");
  expect(res.body.limbo).toBe(true);
});

it("gets users decluttered by username", async () => {
  const res = await agent.get(`/get-user-decluttered/${user.username}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("noDecluttered");
  expect(res.body.noDecluttered).toBe(true);
});

it("gets users finished by username", async () => {
  const res = await agent.get(`/get-user-finished/${user.username}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("noFinished");
  expect(res.body.noFinished).toBe(true);
});

it("gets users liked posts and comments by id", async () => {
  const res = await agent.get(`/get-user-likes/${user.id}`);
  expect(res.status).toBe(200);
  expect(res.body.likesOrdered).toBe([]);
  expect(res.body.nextCursor).toBe(null);
});

// inventory
let inventoryProdID;
it("adds item to inventory with image and req data valid", async () => {
  const res = await agent
    .post("/add-to-inventory-API")
    .field("brand", "Test Brand")
    .field("product", "Test Product")
    .field("category", "Test Category")
    .field("price", "19.99")
    .field("status", "in-progress")
    .attach("image", Buffer.from("fake-image-data"), "test.jpg");

  inventoryProdID = res.body.id;

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("addedProduct");
});

it("does not add item to inventory without required data but has an image", async () => {
  const res = await agent
    .post("/add-to-inventory-API")
    .field("brand", "Test Brand")
    .field("product", "Test Product")
    // .field("category", "Test Category")
    .field("price", "19.99")
    .field("status", "in-progress")
    .attach("image", Buffer.from("fake-image-data"), "test.jpg");

  expect(res.status).not.toBe(200);
  expect(res.body).not.toHaveProperty("addedProduct");
});

it("does not add item to inventory without image", async () => {
  const res = await agent
    .post("/add-to-inventory-API")
    .field("brand", "Test Brand")
    .field("product", "Test Product")
    .field("category", "Test Category")
    .field("price", "19.99")
    .field("status", "in-progress");

  expect(res.status).not.toBe(200);
  expect(res.body).not.toHaveProperty("addedProduct");
});

it("updates inventory with valid data and image", async () => {
  const res = await agent
    .post(`/update-inventory-status/${inventoryProdID}`)
    .field("brand", "nooooo")
    .field("product", "Test")
    .field("category", " Category")
    .field("price", "100")
    .field("status", "in-progress")
    .attach("image", Buffer.from("fake-image-data"), "test.jpg");

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("updatedProduct");
});

it("does not update inventory without an image", async () => {
  const res = await agent
    .post(`/update-inventory-status/${inventoryProdID}`)
    .field("brand", "111111")
    .field("product", "Test")
    .field("category", " Category")
    .field("price", "100")
    .field("status", "in-progress");

  expect(res.status).not.toBe(201);
  expect(res.body).not.toHaveProperty("updatedProduct");
});

it("deletes an item from specific selection by product id", async () => {
  const res = await agent.delete(`delete-from-where:/${inventoryProdID}`);
  expect(res.status).toBe(20);
  expect(res.body).not.toHaveProperty("success");
  expect(res.body.success).toBe(true);
});
