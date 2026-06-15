const app = require("../../server");
const supertest = require("supertest");
request = supertest(app);
const prisma = require("../../prisma/client");

afterAll(async () => {
  await prisma.$disconnect();
});

// sign up

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

  // Verify user was created in database
  const user = await prisma.user.findUnique({
    where: { username: uniqueUsername },
  });
  expect(user.name).toBe("Test");
  expect(user.email).toBe(uniqueEmail);

  // Clean up - delete the test user
  await prisma.user.delete({ where: { id: user.id } });
});

it("rejects a user signing up with no username with POST", async () => {
  const uniqueEmail = `test@example.com`;

  const res = await request.post("/sign-up-API").send({
    name: "Test",
    email: uniqueEmail,
    password: "testpassword123",
    confirmPassword: "testpassword123",
  });

  expect(res.status).toBe(400);
  expect(res.body.validationErrors).toBeDefined();

  // Verify user was NOT created in database
  const user = await prisma.user.findUnique({
    where: { username: uniqueUsername },
  });
  expect(user).toBe(null);
});

// login

it("logs user in with valid info", async () => {
  const password = await passwordGenie("hello");

  const test = await prisma.user.create({
    data: {
      name: "test",
      username: "test",
      email: "test@gmail.com",
      saltedHash: password,
      profile: { create: { bio: null } },
    },
  });

  const res = await request.post("/login-API").send({
    email: "test@gmail.com",
    password: "hello",
  });

  expect(res.status).toBe(200);
  expect(response.body.user.email).toBe("test@gmail.com");
  await prisma.user.delete({ where: { id: test.id } });
});

it("rejects login req that has invalid info", async () => {
  const password = await passwordGenie("hello");

  const test = await prisma.user.create({
    data: {
      name: "test",
      username: "test",
      email: "test@gmail.com",
      saltedHash: password,
      profile: { create: { bio: null } },
    },
  });

  const res = await request.post("/login-API").send({
    email: "test@gmail.com",
    password: "byebye",
  });

  expect(res.status).toBe(404);
  expect(response.body.message).toBe("Incorrect password");
  await prisma.user.delete({ where: { id: test.id } });
});

// logout
it("logs user out successfully", async () => {
  const { passwordGenie } = require("../../utils/password");
  const password = await passwordGenie("hello");

  const test = await prisma.user.create({
    data: {
      name: "test",
      username: "test_logout",
      email: "testlogout@gmail.com",
      saltedHash: password,
      profile: { create: { bio: null } },
    },
  });

  const agent = supertest.agent(app);

  await agent.post("/login-API").send({
    email: "testlogout@gmail.com",
    password: "hello",
  });

  const res = await agent.post("/log-out");

  expect(res.status).toBe(200);
  expect(res.body).toEqual({ success: true });

  await prisma.user.delete({ where: { id: test.id } });
});

it("does not user out successfully", async () => {
  const { passwordGenie } = require("../../utils/password");
  const password = await passwordGenie("hello");

  const test = await prisma.user.create({
    data: {
      name: "test",
      username: "test_logout",
      email: "testlogout@gmail.com",
      saltedHash: password,
      profile: { create: { bio: null } },
    },
  });



  await request.post("/login-API").send({
    email: "testlogout@gmail.com",
    password: "hello",
  });

  const res = await agent.post("/log-out");

  expect(res.status).not.toBe(200);
  expect(res.body).not.toEqual({ success: true });

  await prisma.user.delete({ where: { id: test.id } });
});


beforeEach(() => {
    const test = await prisma.user.findUnique({
        where: {
            username: "test"
        }
    })
  await prisma.user.delete({ where: { id: test.id } })


  const password = await passwordGenie("hello");

  const test = await prisma.user.create({
    data: {
      name: "test",
      username: "test",
      email: "test@gmail.com",
      saltedHash: password,
      profile: { create: { bio: null } },
    },
  });

})



