const app = require("../../server");
const supertest = require("supertest");
request = supertest(app);
const prisma = require("../../prisma/client");

afterAll(async () => {
  await prisma.$disconnect();
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

// post||patch posts + comments

it("makes a post with required data that is valid - no images ", async () => {});

it("makes a post with required data that is valid - with 3 images ", async () => {});

it("does not make a post with more than 4 images even if required data is valid", async () => {});

it("does not make a post with missing required data", async () => {});

it("makes a comment with valid post id", async () => {});

it("does not make a comment with inalid post id", async () => {});

it("updates a post with valid id and valid required data", async () => {});

it("does not update a post with valid id and invalid required data", async () => {});

it("updates a comment with valid id and valid required data", async () => {});

it("does not update a comment with valid id and invalid required data", async () => {});

// deleting posts + comments

it("deletes a post");
it("deletes a comment");
