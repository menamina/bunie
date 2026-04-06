const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { checkPassword } = require("../utils/password");
const prisma = require("../prisma/client");

async function verify(email, password, done) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      done(null, false, { message: "no user found with that email" });
      return;
    }

    if (user) {
      const match = await checkPassword(password, user.saltedHash);
      if (!match) {
        done(null, false, { message: "incorrect password" });
        return;
      }
      done(null, user);
      return;
    }
  } catch (error) {
    return done(error);
  }
}

const strategy = new LocalStrategy({ usernameField: "email" }, verify);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        profile: {
          select: {
            pfp: true,
            header: true,
            bio: true,
          },
        },
      },
    });
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

passport.use(strategy);

module.exports = passport;
