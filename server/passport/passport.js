const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { checkPassword } = require("../utils/password");
const prisma = require("../prisma/client");

const strategy = new LocalStrategy({usernameField: "email", verify})

async function verify(email, password, done){

}

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(asycn (id, done) => {

})

passport.use(strategy);

modules.export = passport