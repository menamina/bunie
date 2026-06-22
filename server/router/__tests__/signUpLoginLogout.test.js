const app = require("../../server");
const supertest = require("supertest");
const request = supertest(app);
const prisma = require("../../prisma/client");
const { passwordGenie } = require("../../utils/password");

jest.setTimeout(5500);

// helper functions
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

beforeAll(async () => {
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

// signing up

describe("signup API", () => {
  it("signs up a user with POST", async () => {
    const uniqueUsername = `testuser`;
    const uniqueEmail = `test@example.com`;

    const res = await request.post("/sign-up-API").send({
      name: "Test",
      username: uniqueUsername,
      email: uniqueEmail,
      password: "testpassword123",
      confirmPassword: "testpassword123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ success: true });

    const user = await prisma.user.findUnique({
      where: { username: uniqueUsername },
    });
    expect(user.name).toBe("Test");
    expect(user.email).toBe(uniqueEmail);

    await prisma.user.delete({ where: { id: user.id } });
  });

  it("rejects a user signing up with no username", async () => {
    const uniqueEmail = `test@example.com`;

    const res = await request.post("/sign-up-API").send({
      name: "Test",
      email: uniqueEmail,
      password: "testpassword123",
      confirmPassword: "testpassword123",
    });

    expect(res.status).toBe(400);
    expect(res.body.validationErrors).toBeDefined();
  });

  it("rejects sign up if there is a user with a taken email", async () => {
    const existingUser = await createTestUser(
      "duplicate@gmail.com",
      "uniqueusername",
    );

    const res = await request.post("/sign-up-API").send({
      name: "New User",
      username: "differentusername",
      email: "duplicate@gmail.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Email in use");

    await prisma.user.delete({ where: { id: existingUser.id } });
  });

  it("rejects sign up if there is a user with taken username", async () => {
    const existingUser = await createTestUser(
      "unique@gmail.com",
      "duplicateusername",
    );

    const res = await request.post("/sign-up-API").send({
      name: "New User",
      username: "duplicateusername",
      email: "different@gmail.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Username in use");

    await prisma.user.delete({ where: { id: existingUser.id } });
  });
});

// logging in

describe("logging in API", () => {
  it("logs user in with valid info", async () => {
    const testUser = await createTestUser(
      "login@gmail.com",
      "loginuser",
      "hello",
    );

    const res = await request.post("/login-API").send({
      email: "login@gmail.com",
      password: "hello",
    });

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe("login@gmail.com");

    await prisma.user.delete({ where: { id: testUser.id } });
  });

  it("rejects login request with incorrect password", async () => {
    const testUser = await createTestUser(
      "wrongpass@gmail.com",
      "wrongpassuser",
      "hello",
    );

    const res = await request.post("/login-API").send({
      email: "wrongpass@gmail.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Incorrect password");

    await prisma.user.delete({ where: { id: testUser.id } });
  });

  it("rejects login request with non-existent email", async () => {
    const res = await request.post("/login-API").send({
      email: "nonexistent@gmail.com",
      password: "anypassword",
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No user found with that email");
  });

  //  logging out

  it("logs user out successfully", async () => {
    const testUser = await createTestUser(
      "logout@gmail.com",
      "logoutuser",
      "hello",
    );

    const agent = supertest.agent(app);

    await agent.post("/login-API").send({
      email: "logout@gmail.com",
      password: "hello",
    });

    const res = await agent.post("/log-out");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });

    await prisma.user.delete({ where: { id: testUser.id } });
  });
});
