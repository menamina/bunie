// Tests for zod schemas

import {
  searchZod,
  makeOrUpdatePostZod,
  makeOrUpdateCommentZod,
  addOrUpdateInventoryZod,
  updateProfZod,
} from "../zod.js";

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

it("validates searchZod with valid query", () => {
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

}


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
    body: {}
    },
  };

  const res = mockRes();

  const next = jest.fn();

  makeOrUpdatePostZod(req, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);
});
