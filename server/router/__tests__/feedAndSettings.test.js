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

async function dlt() {
  return await prisma.user.delete({ where: { id: user.id } });
}

afterAll(async () => {
  dlt();
  await prisma.$disconnect();
});

// main feed + multer
it("does return images multer has AND zod authorizes", async () => {
  login();

  const res = agent.get("/IMGS-API/0c87c936eb33f0b0943d1a7cd08c613a");
  expect(res.status).toBe(200);
  expect(res.status).not.toBe(500);
  expect(res.body).toHaveProperty("img");

  logout();
});

it("does not return images zod does not authurize", async () => {
  login();

  const res = agent.get("/IMGS-API/..");
  expect(res.status).toBe(400);
  expect(res.body).toBe("invalid file name");

  const res = agent.get("/IMGS-API/..//..");
  expect(res.status).toBe(400);
  expect(res.body).toBe("invalid file name");

  logout();
});

it("does not return images multer does not have but zod authorizes", async () => {
  login();
  const res = agent.get("/IMGS-API/12345");
  expect(res.status).not.toBe(400);
  expect(res.body).not.toBe("invalid file name");
  expect(res.status).toBe(500);
  logout();
});

it("gets main feed posts when authenticated", async () => {
  login();
  const res = await agent.get("/main-feed-API").send();
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("feed");
  logout();
});

it("gets main feed posts when not authenticated", async () => {
  const res = request.get("/main-feed-API");
  expect(res.status).toBe(401);
  expect(res.status).not.toBe(200);
  expect(res.status).toBe(500);
  expect(res.body).not.toHaveProperty("feed");
});

// following feed
it("gets following feed posts when authenticated", async () => {
  login();
  const res = agent.get("/following-feed-API");
  expect(res.status).not.toBe(401);
  expect(res.body).not.toBe("not authenticated");
  expect(res.status).toBe(200);
  expect(res.status).not.toBe(500);
  expect(res.body).toHaveProperty("feed");
  logout();
});

it("does not get following feed posts when not authenticated", async () => {
  const res = request.get("/following-feed-API");
  expect(res.status).toBe(401);
  expect(res.body).toBe("not authenticated");
  expect(res.body).not.toHaveProperty("feed");
});

// getting settings
it("gets logged in users profile settings when authenticated and correct user", async () => {
  login();
  const res = agent.get("/get-my-profile-settings/");
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("feed");
  expect(res.body).toHaveProperty("nextCursor");
  expect(res.status).not.toBe(401);
  logout();
});

it("does not get a users settings when not logged in", async () => {
  const res = request.get("/get-my-profile-settings/");
  expect(res.status).not.toBe(200);
  expect(res.status).toBe(401);
  expect(res.body).toBe("nto authenticated");
});

// image crud settings
// to mock a multipart upload: attach(fieldName, fileData, fileName)
// Buffer.from() simulates converting text to binary for storing files
it("updates one profile image", async () => {
  login();
  const res = await agent
    .patch("/update-my-IMGS-API/")
    .attach("pfp", Buffer.from("image-data"), "12345.jpg");
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("updatedIMGS");
  logout();
});

it("updates one header image", async () => {
  login();
  const res = (await agent.patch("/update-my-IMGS-API/")).attach(
    "header",
    Buffer.from("image-data"),
    "123456.jpg",
  );
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("updatedIMGS");
  logout();
});

it("does not update multiple profile images", async () => {
  login();
  const res = (await agent.patch("/update-my-IMGS-API/"))
    .attach("pfp", Buffer.from("image-data"), "12345.jpg")
    .attach("pfp", Buffer.from("image-data2"), "54321.jpg");
  expect(res.status).not.toBe(200);
  expect(res.body).not.toHaveProperty("updatedIMGS");
  expect(res.status).toBe(500);
  logout();
});

it("does not update multiple header images", async () => {
  login();
  const res = await agent
    .patch("/update-my-IMGS-API/")
    .attach("header", Buffer.from("image-data"), "12345.jpg")
    .attach("header", Buffer.from("image-data2"), "54321.jpg");
  expect(res.status).not.toBe(200);
  expect(res.body).not.toHaveProperty("updatedIMGS");
  expect(res.status).toBe(500);
  logout();
});

it("does not update profile image with wrong multer fields", async () => {
  login();
  const res = await agent
    .patch("/update-my-IMGS-API/")
    .attach("fakePFP", Buffer.from("image-data"), "12345.jpg");
  expect(res.status).not.toBe(200);
  expect(res.body).not.toHaveProperty("updatedIMGS");
  expect(res.status).toBe(500);
  logout();
});

it("does not update header image with wrong multer fields", async () => {
  login();
  const res = await agent
    .patch("/update-my-IMGS-API/")
    .attach("fakeHeader", Buffer.from("image-data"), "12345.jpg");
  expect(res.status).not.toBe(200);
  expect(res.body).not.toHaveProperty("updatedIMGS");
  expect(res.status).toBe(500);
  logout();
});

// non image settings crud
it("updates profile with valid info", async () => {
  login();
  const res = await agent.patch("/update-my-profile-API/").send({
    name: "testing",
    email: "tester@aol.com",
    bio: "hi",
  });
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("updatedUser");
  expect(res.body).not.toHaveProperty("usernameTaken");
  expect(res.body).not.toHaveProperty("emailTaken");
  logout();
});

it("does not update profile with already taken email", async () => {
  const differentUser = createTestUser("tester@gmail.com");
  return await agent.post("/login-API").send({
    email: "tester@gmail.com",
    password: "12345678",
  });
  const res = agent.patch("/update-my-profile-API/").send({
    email: "test@gmail.com",
  });
  expect(res.status).toBe(200);
  expect(res.body).not.toHaveProperty("updatedUser");
  expect(res.body).not.toHaveProperty("usernameTaken");
  expect(res.body).toHaveProperty("emailTaken");
  await prisma.user.delete({
    where: {
      id: differentUser.id,
    },
  });
  logout();
});

it("does not update profile with already taken username", async () => {
  const differentUser = createTestUser("tester@gmail.com", "tester2");
  return await agent.post("/login-API").send({
    id: "tester@gmail.com",
    password: "12345678",
  });
  const res = agent.patch("/update-my-profile-API/").send({
    username: "test",
  });
  expect(res.status).toBe(200);
  expect(res.body).not.toHaveProperty("updatedUser");
  expect(res.body).toHaveProperty("usernameTaken");
  expect(res.body).not.toHaveProperty("emailTaken");
  await prisma.user.delete({
    where: {
      id: differentUser.id,
    },
  });
  logout();
});

it("updates password when current password matches database and new is valid requirements", async () => {
  login();
  const res = await agent.post("/update-my-password-API/").send({
    oldPassword: "12345678",
    newPassword: "helloagain123",
    confirmNewPassword: "helloagain123",
  });
  expect(res.status).not.toBe(403);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("success");
  logout();
});

it("does not update profile when current password does not match database but new password meets valid reqs", async () => {
  login();
  const res = await agent.post("/update-my-password-API/").send({
    oldPassword: "lalalalala",
    newPassword: "helloagain123",
    confirmNewPassword: "helloagain123",
  });
  expect(res.status).toBe(401);
  expect(res.status).not.toBe(200);
  expect(res.status).not.toBe(403);
  expect(res.body).toHaveProperty("passwordDontMatch");
  expect(res.body).not.toHaveProperty("validationErrors");
  logout();
});

it("updates password when current pass === database AND new pass meets validation BUT confirmed password does not match new password", async () => {
  login();
  const res = await agent.post("/update-my-password-API/").send({
    oldPassword: "lalalalala",
    newPassword: "helloagain123",
    confirmNewPassword: "helloagain00000",
  });
  expect(res.status).toBe(403);
  expect(res.status).not.toBe(200);
  expect(res.body).toHaveProperty("validationErrors");
  expect(res.body).toHaveProperty("success");
  logout();
});
it("does not update password when current pass === database AND new pass does not match confirmed password", async () => {});
it("does not delete user account when who is logged in does not match account to be deleted", async () => {});
it("deletes user account when who is logged in does match account to be deleted", async () => {});
