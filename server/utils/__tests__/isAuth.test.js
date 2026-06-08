import isAuth from "../isAuth.js";

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

it("returns 401 if user is not authenticated", () => {
  const req = {
    user: null,
  };

  const res = mockRes();

  const next = jest.fn();

  isAuth(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ message: "not authenticated" });
  expect(next).not.toHaveBeenCalled();
});

it("calls next if user is authenticated", () => {
  const req = {
    user: { id: 1, name: "Test User" },
  };

  const res = mockRes();

  const next = jest.fn();

  isAuth(req, res, next);

  expect(next).toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
});
