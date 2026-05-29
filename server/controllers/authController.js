const prisma = require("../prisma/client");
const { passwordGenie } = require("../utils/password");

async function signUpUser(req, res) {
  try {
    const { name, username, email, password } = req.body;
    const usernameInUse = await prisma.user.findUnique({ where: { username } });
    const emailInUse = await prisma.user.findUnique({ where: { email } });

    if (usernameInUse) {
      return res.status(409).json({ message: "Username in use" });
    }
    if (emailInUse) {
      return res.status(409).json({ message: "Email in use" });
    }

    const passHash = await passwordGenie(password);
    await prisma.user.create({
      data: {
        name,
        username,
        email,
        saltedHash: passHash,
        profile: { create: { bio: null } },
      },
    });
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

module.exports = { signUpUser };
