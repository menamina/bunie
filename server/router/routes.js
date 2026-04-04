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
router.get("/my-profile-API/:id", isAuth, remote.getProfile);
router.get("/get-my-profile-settings", isAuth, remote.getMyProfileSettings);

router.get("/get-my-followers/:id", isAuth, remote.getFollowers);
router.get("/get-my-followers/:id", isAuth, remote.getFollowing);

router.get("/get-my-posts/:id", isAuth, remote.getUserPosts);

router.get("/get-my-inventory/:id", isAuth, remote.getUserInventory);
router.get("/get-my-in-progress/:id", isAuth, remote.getUserInProgress);
router.get("/get-my-limbo/:id", isAuth, remote.getUserLimbo);
router.get("/get-my-decluttered/:id", isAuth, remote.getUserDecluttered);
router.get("/get-my-finished/:id", isAuth, remote.getUserFinished);
router.get("/get-my-likes/:id", isAuth, remote.getUserLikes);

// editing user profile //
remote.patch("/update-my-profile-API", isAuth, remote.updateUserProfile);
remote.delete("/delete-my-account-API", isAuth, remote.deleteUserAccount);

// user options //

remote.post("/add-to-inventory-API", isAuth, remote.addProduct);
// ^^ is it just a regular add to inven, WIP, or limbo //
remote.post("/add-to-finished-API", isAuth, remote.addFinishedProduct);
remote.post("/add-to-decluttered-API", isAuth, remote.addDeclutteredProduct);

remote.patch(
  "/update-inventory-status/:productID",
  isAuth,
  remote.updateInventoryStatus,
);

remote.delete(
  "/delete-from-where/:productID",
  isAuth,
  remote.deleteProductFromHere,
);

// user posts + comments + likes //

remote.post("/make-post-API", isAuth, remote.makeAPost);
remote.post("/make-comment-API", isAuth, remote.makeAComment);

remote.patch("/update-post/:postToUpdate", isAuth, remote.updatePost);
remote.patch("/update-comment/:commentToUpdate", isAuth, remote.updateComment);

remote.delete("/delete-post/:postToDelete", isAuth, remote.deletePost);
remote.delete("/delete-comment/:commentToDelete", isAuth, remote.deleteComment);

remote.post("/like-post/:postID", isAuth, remote.togglePostLike);
remote.post("/like-post/:postID", isAuth, remote.toggleCommentLike);

// getting other ppl's profiles //
router.get("/profile-API/:id", isAuth, remote.getProfile);

router.get("/get-user-followers/:id", isAuth, remote.getFollowers);
router.get("/get-user-followers/:id", isAuth, remote.getFollowing);

router.get("/get-user-posts/:id", isAuth, remote.getUserPosts);

router.get("/get-user-inventory/:id", isAuth, remote.getUserInventory);
router.get("/get-user-in-progress/:id", isAuth, remote.getUserInProgress);
router.get("/get-user-limbo/:id", isAuth, remote.getUserLimbo);
router.get("/get-user-decluttered/:id", isAuth, remote.getUserDecluttered);
router.get("/get-user-finished/:id", isAuth, remote.getUserFinished);
router.get("/get-user-likes/:id", isAuth, remote.getUserLikes);
