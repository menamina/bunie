const app = require("../../server");
const supertest = require("supertest");
const request = supertest(app);
const agent = supertest.agent(app);
const prisma = require("../../prisma/client");
const { passwordGenie } = require("../../utils/password");

jest.setTimeout(5500);

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

// post||patch posts + comments
let firstPost;
let secondPost;

describe("post CRUDing", () => {
  it("makes a post with required data that is valid - no images ", async () => {
    const res = await agent.post("/make-post-API").send({
      title: "herro",
      body: "hi",
    });

    firstPost = res.body.post.id;

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("post");
  });

  it("makes a post with required data that is valid - with 3 images ", async () => {
    const res = await agent
      .post("/make-post-API")
      .field("title", "testurr")
      .field("body", "test body")
      .attach("image", Buffer.from("fake-image-data"), "test.jpg")
      .attach("image", Buffer.from("fake-image-data2"), "test2.jpg")
      .attach("image", Buffer.from("fake-image-data3"), "test3.jpg");

    secondPost = res.body.post.id;

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("post");
  });

  it("does not make a post with more than 4 images even if required data is valid", async () => {
    const res = await agent
      .post("/make-post-API")
      .field("title", "testurr")
      .field("body", "body text")
      .attach("image", Buffer.from("fake-image-data"), "test.jpg")
      .attach("image", Buffer.from("fake-image-data2"), "test2.jpg")
      .attach("image", Buffer.from("fake-image-data3"), "test3.jpg")
      .attach("image", Buffer.from("fake-image-data4"), "test4.jpg")
      .attach("image", Buffer.from("fake-image-data5"), "test5.jpg");

    expect(res.status).not.toBe(201);
    expect(res.body).not.toHaveProperty("post");
  });

  it("does not make a post with missing required data (title)", async () => {
    const res = await agent.post("/make-post-API").send({ body: "hello" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("updates a post with valid id and valid required data", async () => {
    const res = await agent.patch(`/update-post/${firstPost}`).send({
      title: "notHerro",
      body: "updated body",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("updatedPost");
  });

  it("deletes a post", async () => {
    const res = await agent.delete(`/delete-post/${secondPost}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("postDeleted");
    expect(res.body.postDeleted).toBe(true);
  });
});

let firstComment;

describe("comment CRUD", () => {
  it("makes a comment with valid post id", async () => {
    const res = await agent.post(`/make-comment-API`).send({
      pID: firstPost,
      body: "numunumu",
    });
    firstComment = res.body.comment.id;
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("comment");
  });

  it("does not make a comment with inalid post id", async () => {
    const res = await agent.post(`/make-comment-API`).send({
      pID: 394838,
      body: "numunumu",
    });
    expect(res.status).not.toBe(201);
    expect(res.body).not.toHaveProperty("comment");
  });

  it("updates a comment with valid id and valid required data", async () => {
    const res = await agent.patch(`/update-comment/${firstComment}`).send({
      body: "huminahumina",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("updatedComment");
  });

  it("does not update a comment with valid id and invalid required data", async () => {
    const res = await agent.patch(`/update-comment/${firstComment}`).send({
      body: "",
    });
    expect(res.status).toBe(400);
    expect(res.body).not.toHaveProperty("updatedComment");
  });

  it("deletes a comment", async () => {
    const res = await agent.delete(`/delete-comment/${firstComment}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("commentDeleted");
    expect(res.body.commentDeleted).toBe(true);
  });
});

// likes

describe("likes CRUD", () => {
  it("gets post by valid id", async () => {
    const res = await agent.get(`/get-this-post/${firstPost}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toBe(firstPost);
  });

  it("does not get post by invalid id", async () => {
    const res = await agent.get(`/get-this-post/999999`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  it("gets comment by valid id", async () => {
    const res = await agent.get(`/get-this-comment/${firstComment}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toBe(firstComment);
  });

  it("does not get comment by invalid id", async () => {
    const res = await agent.get(`/get-this-comment/999999`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  it("it likes a post with a valid id", async () => {
    const res = await agent.patch(`/like-post/${secondPost}`);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("liked");
    expect(res.body.liked).toBe(true);
  });

  it("unlikes a post", async () => {
    const res = await agent.patch(`/like-post/${secondPost}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("liked");
    expect(res.body.liked).toBe(false);
  });

  it("it does not like a post with a invalid id", async () => {
    const res = await agent.patch(`/like-post/999999`);
    expect(res.status).toBe(500);
  });

  it("likes a comment with valid id", async () => {
    const res = await agent.patch(`/like-comment/${firstComment}`);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("liked");
    expect(res.body.liked).toBe(true);
  });

  it("unlikes a comment", async () => {
    const res = await agent.patch(`/like-comment/${firstComment}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("liked");
    expect(res.body.liked).toBe(false);
  });

  it("does not like a comment with invalid id", async () => {
    const res = await agent.patch(`/like-comment/999999`);
    expect(res.status).toBe(500);
  });
});
