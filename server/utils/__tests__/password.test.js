
import { passwordGenie, checkPassword } from "../password";

it("generates a salted hash and checks it correctly", async () => {
  const password = "mySecretPassword";
  const saltedHash = await passwordGenie(password);

  expect(saltedHash).not.toBe(password);

  const isMatch = await checkPassword(password, saltedHash);
  expect(isMatch).toBe(true);

  const isNotMatch = await checkPassword("wrongPassword", saltedHash);
  expect(isNotMatch).toBe(false);
}

