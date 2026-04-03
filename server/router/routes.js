const express = require("express");
const router = express.Router();
const remote = require("../remote/control");
const { isAuth } = require("../utils/isAuth");
const validator = require("../utils/validator");
const passport = require("../utils/passport");

router.post("/sign-up-API", validator, remote.signUpUser);
router.post("login-API", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
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

// getting feed //

router.get("/main-feed-API", isAuth, remote.getMainFeed);

// getting user's profile //
router.get("/my-profile-API", isAuth, remote.getProfile);
router.get("/get-my-profile-settings", isAuth, remote.getMyProfileSettings);
router.get("/get-my-followers", isAuth, remote.getFollowers);
router.get("/get-my-followers", isAuth, remote.getFollowing);
router.get("/get-user-posts", isAuth, remote.getUserPosts);

// getting other ppl's profiles //
router.get("/my-profile/:id", isAuth, remote.getProfile);
