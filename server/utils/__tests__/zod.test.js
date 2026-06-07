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
