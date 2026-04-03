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

router.get("/get-my-posts", isAuth, remote.getUserPosts);

router.get("/get-my-inventory", isAuth, remote.getUserInventory);
router.get("/get-my-in-progress", isAuth, remote.getUserInProgress);
router.get("/get-my-limbo", isAuth, remote.getMy);
router.get("/get-my-decluttered", isAuth, remote.getUserDecluttered);
router.get("/get-my-finished", isAuth, remote.getUserFinished);
router.get("/get-my-likes", isAuth, remote.getUserLikes);

// editing user profile //
remote.patch("/update-my-profile-API", isAuth, remote.updateUserProfile);
remote.delete("/delete-my-account-API", isAuth, remote.deleteUserAccount);

// user options //

remote.post("/add-to-inventory-API", isAuth, remote.addProduct);
// ^^ is it just a regular add to inven, WIP, or limbo //
remote.post("/add-to-finished-API", isAuth, remote.addFinishedProduct);
remote.post("/add-to-decluttered-API", isAuth, remote.addDeclutteredProduct);

// user posts + comments //

remote.post("/make-post-API", isAuth, remote.makeAPost);
remote.post("/make-comment-API", isAuth, remote.makeAComment);

remote.patch("/update-post/:postToUpdate", isAuth, remote.updatePost);
remote.patch("/update-comment/:commentToUpdate", isAuth, remote.updateComment);

remote.delete("/delete-post/:postToDelete", isAuth, remote.deletePost);
remote.delete("/delete-comment/:commentToDelete", isAuth, remote.deleteComment);

// getting other ppl's profiles //
router.get("/profile-API/:id", isAuth, remote.getProfile);
