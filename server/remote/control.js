const prisma = require("../prisma/client");
const { passwordGenie } = require("../utils/passwords");

async function signUpUser(req, res) {
  const { name, username, email, password } = req.body;
  const usernameInUse = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  const emailInUse = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (usernameInUse) {
    return res.status(403).json({ emailInUse: true });
  }

  if (emailInUse) {
    return res.status(403).json({ emailInUse: true });
  }

  const passHash = await passwordGenie(password);
  await prisma.user.create({
    data: {
      name,
      username,
      email,
      saltedHash: passHash,
      profile: {
        create: {
          pfp: "default-icon.png",
          header: null,
          bio: null,
        },
      },
    },
  });
}

module.exports = {
  signUpUser,
};
