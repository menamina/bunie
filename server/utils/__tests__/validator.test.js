import validation from "../validator";

function mocRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

it("validates full signup data that is correct", () => {
  const req = {
    body: {
      name: "tester",
      username: "tester123",
      email: "tester@example.com",
      password: "password123",
      confirmPassword: "password123",
    },
  };

  const res = mocRes();

  const next = jest.fn();
});
