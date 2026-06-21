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

// main feed + multer
it("does return images multer has AND zod authorizes", async () => {
  const res = await agent.get("/IMGS-API/0c87c936eb33f0b0943d1a7cd08c613a");
  expect(res.status).toBe(200);
  expect(res.status).not.toBe(500);
  expect(res.body).toHaveProperty("data");
  expect(res.body.type).toBe("Buffer");
});

it("does not return images zod does not authurize", async () => {
  const res = await agent.get("/IMGS-API/..");
  expect(res.status).toBe(400);
  expect(res.body).toBe("invalid file name");

  const res2 = await agent.get("/IMGS-API/..//..");
  expect(res2.status).toBe(400);
  expect(res2.body).toBe("invalid file name");
});

it("does not return images multer does not have but zod authorizes", async () => {
  const res = await agent.get("/IMGS-API/12345");
  expect(res.status).not.toBe(400);
  expect(res.body).not.toBe("invalid file name");
  expect(res.status).toBe(500);
});

it("gets main feed posts when authenticated", async () => {
  const res = await agent.get("/main-feed-API").send();
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("feed");
});

it("does not get main feed posts when not authenticated", async () => {
  const res = await request.get("/main-feed-API");
  expect(res.status).toBe(401);
  expect(res.body).not.toHaveProperty("feed");
});

// following feed
it("gets following feed posts when authenticated", async () => {
  const res = await agent.get("/following-feed-API");
  expect(res.status).not.toBe(401);
  expect(res.body).not.toBe("not authenticated");
  expect(res.status).toBe(200);
  expect(res.status).not.toBe(500);
  expect(res.body).toHaveProperty("feed");
});

it("does not get following feed posts when not authenticated", async () => {
  const res = await request.get("/following-feed-API");
  expect(res.status).toBe(401);
  expect(res.body.message).toBe("not authenticated");
  expect(res.body).not.toHaveProperty("feed");
});

// getting settings
it("gets logged in users profile settings when authenticated and correct user", async () => {
  const res = await agent.get("/get-my-profile-settings/");
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("userProfSettings");
  expect(res.status).not.toBe(500);
});

it("does not get a users settings when not logged in", async () => {
  const res = await request.get("/get-my-profile-settings/");
  expect(res.status).not.toBe(200);
  expect(res.status).toBe(401);
  expect(res.body.message).toBe("not authenticated");
});

// image crud settings
// to mock a multipart upload: attach(fieldName, fileData, fileName)
// Buffer.from() simulates converting text to binary for storing files
it("updates one profile image", async () => {
  const res = await agent
    .patch("/update-my-IMGS-API/")
    .attach("pfp", Buffer.from("image-data"), "12345.jpg");
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("updatedIMGS");
});

it("updates one header image", async () => {
  const res = await agent
    .patch("/update-my-IMGS-API/")
    .attach("header", Buffer.from("image-data"), "123456.jpg");
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("updatedIMGS");
});

it("does not update multiple profile images", async () => {
  const res = await agent
    .patch("/update-my-IMGS-API/")
    .attach("pfp", Buffer.from("image-data"), "12345.jpg")
    .attach("pfp", Buffer.from("image-data2"), "54321.jpg");
  expect(res.status).not.toBe(200);
  expect(res.body).not.toHaveProperty("updatedIMGS");
  expect(res.status).toBe(500);
});

it("does not update multiple header images", async () => {
  const res = await agent
    .patch("/update-my-IMGS-API/")
    .attach("header", Buffer.from("image-data"), "12345.jpg")
    .attach("header", Buffer.from("image-data2"), "54321.jpg");
  expect(res.status).not.toBe(200);
  expect(res.body).not.toHaveProperty("updatedIMGS");
  expect(res.status).toBe(500);
});

it("does not update profile image with wrong multer fields", async () => {
  const res = await agent
    .patch("/update-my-IMGS-API/")
    .attach("fakePFP", Buffer.from("image-data"), "12345.jpg");
  expect(res.status).not.toBe(200);
  expect(res.body).not.toHaveProperty("updatedIMGS");
  expect(res.status).toBe(500);
});

it("does not update header image with wrong multer fields", async () => {
  const res = await agent
    .patch("/update-my-IMGS-API/")
    .attach("fakeHeader", Buffer.from("image-data"), "12345.jpg");
  expect(res.status).not.toBe(200);
  expect(res.body).not.toHaveProperty("updatedIMGS");
  expect(res.status).toBe(500);
});

// non image settings crud
it("updates profile with valid info", async () => {
  const res = await agent.patch("/update-my-profile-API/").send({
    name: "testing",
    email: "tester@aol.com",
    bio: "hi",
  });
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("email");
  expect(res.body).toHaveProperty("username");
  expect(res.body).not.toHaveProperty("usernameTaken");
  expect(res.body).not.toHaveProperty("emailTaken");
});

it("does not update profile with already taken email", async () => {
  const differentUser = await createTestUser("tester@gmail.com", "tester");

  await agent.post("/login-API").send({
    email: "tester@gmail.com",
    password: "12345678",
  });

  const res = await agent.patch("/update-my-profile-API/").send({
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
});

it("does not update profile with already taken username", async () => {
  const differentUser = await createTestUser("tester@gmail.com", "tester2");
  await agent.post("/login-API").send({
    email: "tester@gmail.com",
    password: "12345678",
  });
  const res = await agent.patch("/update-my-profile-API/").send({
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
});

it("updates password when current password matches database and new is valid requirements", async () => {
  const res = await agent.post("/update-my-password-API/").send({
    oldPassword: "12345678",
    newPassword: "helloagain123",
    confirmNewPassword: "helloagain123",
  });
  expect(res.status).not.toBe(403);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("success");

  await agent.post("/login-API").send({
    email: "test@gmail.com",
    password: "helloagain123",
  });

  const res2 = await agent.post("/update-my-password-API/").send({
    oldPassword: "helloagain123",
    newPassword: "12345678",
    confirmNewPassword: "12345678",
  });
  expect(res2.status).not.toBe(403);
  expect(res2.status).toBe(200);
  expect(res2.body).toHaveProperty("success");
});

it("does not update profile when current password does not match database but new password meets valid reqs", async () => {
  const res = await agent.post("/update-my-password-API/").send({
    oldPassword: "lalalalala",
    newPassword: "helloagain123",
    confirmNewPassword: "helloagain123",
  });
  expect(res.status).toBe(401);
  expect(res.status).not.toBe(200);
  expect(res.status).not.toBe(403);
  expect(res.body.message).toHaveProperty("passwordDontMatch");
  expect(res.body).not.toHaveProperty("validationErrors");
});

it("updates password when current pass === database AND new pass meets validation BUT confirmed password does not match new password", async () => {
  const res = await agent.post("/update-my-password-API/").send({
    oldPassword: "12345678",
    newPassword: "helloagain123",
    confirmNewPassword: "helloagain00000",
  });
  expect(res.status).toBe(403);
  expect(res.status).not.toBe(200);
  expect(res.body).toHaveProperty("validationErrors");
  expect(res.body).not.toHaveProperty("success");
});

it("deletes user account when who is logged in does match account to be deleted", async () => {
  const res = await agent.delete("/delete-my-account-API");
  expect(res.status).toBe(200);
  expect(res.status).not.toBe(401);
  expect(res.body).toHaveProperty("userDeleted");
});
