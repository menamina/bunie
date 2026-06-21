// Tests for zod schemas
const {
  searchZod,
  makeOrUpdatePostZod,
  makeOrUpdateCommentZod,
  addOrUpdateInventoryZod,
  updateProfZod,
} = require("../zod.js");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("searchZod", () => {
  it("validates with valid query", () => {
    const req = {
      query: {
        q: "test",
      },
    };

    const res = mockRes();

    const next = jest.fn();
    searchZod(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("validates search query with minimum 1 string", () => {
    const req = {
      query: "h",
    };

    const res = mockRes();

    const next = jest.fn();
    searchZod(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("throws error when there is no query", () => {
    const req = {};

    const res = mockRes();

    const next = jest.fn();

    searchZod(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error,
    });
  });
});

it("validates makeOrUpdatePostZod with title and no body", () => {
  const req = {
    body: {
      title: "testing",
    },
  };

  const res = mockRes();

  const next = jest.fn();

  makeOrUpdatePostZod(req, res, next);

  expect(next).toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
});

it("does not validate makeOrUpdatePostZod no title", () => {
  const req = {
    body: {},
  };

  const res = mockRes();

  const next = jest.fn();

  makeOrUpdatePostZod(req, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);
});

it("makes a comment", () => {
  const req = {
    body: "testing",
    pID: 1,
  };

  const res = mockRes();

  const next = jest.fn();

  makeOrUpdateCommentZod(req, res, next);

  expect(next).toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
});

it("adds inventory item with valid data", () => {
  const req = {
    body: {
      brand: "Test Brand",
      product: "Test Product",
      category: "Test Category",
      price: 19.99,
      status: "Available",
      dateOpurchase: "2024-01-01",
      rating: 4,
      notes: "Test notes",
      wouldBuyAgain: "Yes",
    },
  };

  const res = mockRes();

  const next = jest.fn();

  addOrUpdateInventoryZod(req, res, next);

  expect(next).toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  c;
});

it("adds inventory item with optional data missing", () => {
  const req = {
    body: {
      brand: "Test Brand",
      product: "Test Product",
      category: "Test Category",
      price: 19.99,
      status: "Available",
    },
  };

  const res = mockRes();

  const next = jest.fn();

  addOrUpdateInventoryZod(req, res, next);

  expect(next).toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  c;
});

it("does not add item to inventory with non-optional data missing", () => {
  const req = {
    body: {
      brand: "Test Brand",
      product: "Test Product",
      category: "Test Category",
    },
  };

  const res = mockRes();

  const next = jest.fn();

  addOrUpdateInventoryZod(req, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error,
  });
});

it("updates profile with valid data", () => {
  const req = {
    body: {
      name: "Test Name",
      username: "testuser",
      email: "test@gmail.com",
      bio: "test bio",
    },
  };

  const res = mockRes();

  const next = jest.fn();

  updateProfZod(req, res, next);

  expect(next).toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
});
