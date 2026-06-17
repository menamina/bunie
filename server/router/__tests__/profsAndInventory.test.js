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
  dlt(user.id);
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
  expect(res.body).toHaveProperty("noInProgress");
  expect(res.body.noInProgress).toBe(true);
  logout();
});

it("gets users limbo by username", async () => {
  login();
  const res = await agent.get(`/get-user-limbo/${user.username}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("limbo");
  expect(res.body.limbo).toBe(true);
  logout();
});

it("gets users decluttered by username", async () => {
  login();
  const res = await agent.get(`/get-user-decluttered/${user.username}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("noDecluttered");
  expect(res.body.noDecluttered).toBe(true);
  logout();
});

it("gets users finished by username", async () => {
  login();
  const res = await agent.get(`/get-user-finished/${user.username}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("noFinished");
  expect(res.body.noFinished).toBe(true);
  logout();
});

it("gets users liked posts and comments by id", async () => {
  login();
  const res = await agent.get(`/get-user-likes/${user.id}`);
  expect(res.status).toBe(200);
  expect(res.body.likesOrdered).toBe([]);
  expect(res.body.nextCursor).toBe(null);
  logout();
});

// inventory
let inventoryProdID;
it("adds item to inventory with image and req data valid", async () => {
  login();
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
  logout();
});

it("does not add item to inventory without required data but has an image", async () => {
  login();
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
  logout();
});

it("does not add item to inventory without image", async () => {
  login();
  const res = await agent
    .post("/add-to-inventory-API")
    .field("brand", "Test Brand")
    .field("product", "Test Product")
    .field("category", "Test Category")
    .field("price", "19.99")
    .field("status", "in-progress");

  expect(res.status).not.toBe(200);
  expect(res.body).not.toHaveProperty("addedProduct");
  logout();
});

it("updates inventory with valid data and image", async () => {
  login();
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
  logout();
});

it("does not update inventory without an image", async () => {
  login();
  const res = await agent
    .post(`/update-inventory-status/${inventoryProdID}`)
    .field("brand", "111111")
    .field("product", "Test")
    .field("category", " Category")
    .field("price", "100")
    .field("status", "in-progress");

  expect(res.status).not.toBe(201);
  expect(res.body).not.toHaveProperty("updatedProduct");
  logout();
});

it("deletes an item from specific selection by product id", async () => {
  login();
  const res = await agent.delete(`delete-from-where:/${inventoryProdID}`);
  expect(res.status).toBe(20);
  expect(res.body).not.toHaveProperty("success");
  expect(res.body.success).toBe(true);
  logout();
});
