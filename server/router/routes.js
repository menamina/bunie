const express = require("express");
const router = express.Router();
const remote = require("../remote/control");
const isAuth = require("../utils/isAuth");
const validator = require("../utils/validator");
const passwordValidation = require("../utils/passwordValOnly");
const passport = require("../utils/passport");
const multer = require("../utils/multer");
import zoddie from "../utils/zod";

router.post("/sign-up-API", validator, remote.signUpUser);

router.get("/session-check-API", isAuth, (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user.id,
      name: req.user.name,
      username: req.user.username,
      pfp: req.user.profile.pfp,
      header: req.user.profile.header,
      bio: req.user.profile.bio,
    },
  });
});

router.post("/login-API", (req, res, next) => {
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

router.post("/log-out", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ success: true });
  });
});

// getting feed //

router.get("/IMGS-API/:IMG", isAuth, remote.IMGS);
router.get("/main-feed-API", isAuth, remote.getMainFeed);
router.get("/following-feed-API", isAuth, remote.getFollowingFeed);

// getting user's profile //
router.get("/my-profile-API/:username", isAuth, remote.getProfile);
router.get("/get-my-profile-settings/", isAuth, remote.getMyProfileSettings);

router.get("/get-my-posts/:username", isAuth, remote.getUserPosts);

router.get("/get-my-inventory/:username", isAuth, remote.getUserInventory);
router.get("/get-my-in-progress/:username", isAuth, remote.getUserInProgress);
router.get("/get-my-limbo/:username", isAuth, remote.getUserLimbo);
router.get("/get-my-decluttered/:username", isAuth, remote.getUserDecluttered);
router.get("/get-my-finished/:username", isAuth, remote.getUserFinished);
router.get("/get-my-likes/:username", isAuth, remote.getUserLikes);

// edit + delete user profile //
router.patch(
  "/update-my-IMGS-API/",
  isAuth,
  multer.fields([
    { name: "pfp", maxCount: 1 },
    { name: "header", maxCount: 1 },
  ]),
  remote.updateUserIMGS,
);
router.patch("/update-my-profile-API/", isAuth, remote.updateUserProfile);
router.post(
  "/update-my-password-API/",
  isAuth,
  passwordValidation,
  remote.updateUserPassword,
);
router.delete("/delete-my-account-API/", isAuth, remote.deleteUserAccount);

// user product options //

router.post(
  "/add-to-inventory-API",
  isAuth,
  multer.single("image"),
  remote.addProduct,
);
router.patch(
  "/update-inventory-status/:productID",
  isAuth,
  remote.updateInventory,
);

router.delete("/delete-from-where/:productID", isAuth, remote.deleteProduct);

// user posts + comments + likes //

router.get("/get-this-post/:id", isAuth, remote.getPost);
router.get("/get-this-comment/:id", isAuth, remote.getComment);

router.post("/like-post/:postID", isAuth, remote.togglePostLike);
router.post("/like-comment/:commentID", isAuth, remote.toggleCommentLike);

router.post(
  "/make-post-API",
  isAuth,
  multer.array("image", 5),
  remote.makeAPost,
);
router.post("/make-comment-API", isAuth, remote.makeAComment);

router.patch("/update-post/:postToUpdate", isAuth, remote.updatePost);
router.patch("/update-comment/:commentToUpdate", isAuth, remote.updateComment);

router.delete("/delete-post/:postToDelete", isAuth, remote.deletePost);
router.delete("/delete-comment/:commentToDelete", isAuth, remote.deleteComment);

// getting other ppl's profiles //
router.get("/profile-API/:username", isAuth, remote.getProfile);

router.get("/get-user-followers/:username", isAuth, remote.getFollowers);
router.get("/get-user-following/:username", isAuth, remote.getFollowing);

router.get("/get-user-posts/:username", isAuth, remote.getUserPosts);

router.get("/get-user-inventory/:username", isAuth, remote.getUserInventory);
router.get("/get-user-in-progress/:username", isAuth, remote.getUserInProgress);
router.get("/get-user-limbo/:username", isAuth, remote.getUserLimbo);
router.get(
  "/get-user-decluttered/:username",
  isAuth,
  remote.getUserDecluttered,
);
router.get("/get-user-finished/:username", isAuth, remote.getUserFinished);

router.get("/get-user-likes/:username", isAuth, remote.getUserLikes);

// following //
router.post("/follow/:userID", isAuth, remote.toggleFollow);

// search //
router.get("/search-API", isAuth, zoddie.searchZod, remote.query);

module.exports = router;
