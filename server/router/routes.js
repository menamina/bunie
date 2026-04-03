const express = require("express");
const router = express.Router();
const remote = require("../remote/control");
const validator = require("../utils/validator");
const passport = require("../utils/passport");

router.post("/sign-up-API", validator, remote.signUpUser);
router.post("login-API", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (!user) {
      return res.status(404).json({ message: info.message });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          username: user.name,
          email: user.email,
          pfp: user.profile.pfp,
          header: user.profile.header,
          bio: user.profile.bio,
        },
      });
    });
  })(req, res, next);
});
