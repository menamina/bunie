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

// post||patch posts + comments
let firstPost;

it("makes a post with required data that is valid - no images ", async () => {
  login();
  const res = (await agent.post("/make-post-API")).send({
    title: "herro",
    body: "hi",
  });

  firstPost = res.body.post;

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("post");
  logout();
});

it("makes a post with required data that is valid - with 3 images ", async () => {
  login();
  const res = await agent
    .post("/make-post-API")
    .field("title", "testurr")
    .attach("image", Buffer.from("fake-image-data"), "test.jpg")
    .attach("image", Buffer.from("fake-image-data2"), "test2.jpg")
    .attach("image", Buffer.from("fake-image-data3"), "test3.jpg");

  firstPost = res.body.post;

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("post");
  logout();
});

it("does not make a post with more than 4 images even if required data is valid", async () => {
  login();
  const res = await agent
    .post("/make-post-API")
    .field("title", "testurr")
    .attach("image", Buffer.from("fake-image-data"), "test.jpg")
    .attach("image", Buffer.from("fake-image-data2"), "test2.jpg")
    .attach("image", Buffer.from("fake-image-data3"), "test3.jpg")
    .attach("image", Buffer.from("fake-image-data4"), "test4.jpg")
    .attach("image", Buffer.from("fake-image-data5"), "test5.jpg");

  firstPost = res.body.post;

  expect(res.status).not.toBe(201);
  expect(res.body).not.toHaveProperty("post");
  logout();
});

it("does not make a post with missing required data (title)", async () => {
  login();
  const res = await agent.post("/make-post-API").send({ body: "hello" });
  expect(res.status).not.toBe(201);
  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty("error");
  logout();
});

it("updates a post with valid id and valid required data", async () => {
  login();
  const res = await agent.post(`/update-post/${firstPost}`).send({
    title: "notHerro",
  });
  expect(res.status).toBe(200);
  expectCookies(res.body).toHaveProperty("updatedPost");
  logout();
});

let firstComment;

it("makes a comment with valid post id", async () => {
  login();
  const res = await agent.post(`/make-comment-API`).send({
    pID: firstPost,
    body: "numunumu",
  });
  firstComment = res.body.comment.id;
  expect(res.status).toBe(201);
  expectCookies(res.body).toHaveProperty("comment");
  logout();
});

it("does not make a comment with inalid post id", async () => {
  login();
  const res = await agent.post(`/make-comment-API`).send({
    pID: 394838,
    body: "numunumu",
  });
  expect(res.status).not.toBe(201);
  expectCookies(res.body).not.toHaveProperty("comment");
  logout();
});

it("updates a comment with valid id and valid required data", async () => {
  login();
  const res = await agent.post(`/update-comment/${firstComment}`).send({
    commentToUpdate: firstPost,
    body: "huminahumina",
  });
  expect(res.status).toBe(200);
  expectCookies(res.body).toHaveProperty("updatedComment");
  logout();
});

it("does not update a comment with valid id and invalid required data", async () => {
  login();
  const res = await agent.post(`/update-comment/${firstComment}`).send({
    commentToUpdate: firstPost,
    body: "",
  });
  expect(res.status).not.toBe(200);
  expectCookies(res.body).not.toHaveProperty("updatedComment");
  logout();
});

// likes

it("gets post by valid id", async () => {});

it("does not get post by invalid id", async () => {});

it("gets comment by valid id", async () => {});

it("does not get comment by invalid id", async () => {});

it("it likes a post with a valid id", async () => {});

it("unlikes a post");

it("it does not like a post with a invalid id", async () => {});

it("likes a comment with valid id", async () => {});

it("unlikes a post");

it("does not like a comment with invalid id", async () => {});

// deleting posts + comments

it("deletes a post");
it("deletes a comment");
