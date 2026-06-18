const express = require("express");
const router = express.Router();
const isAuth = require("../utils/isAuth");
const validator = require("../utils/validator");
const passwordValidation = require("../utils/passwordValOnly");
const passport = require("../utils/passport");
const multer = require("../utils/multer");
const zoddie = require("../utils/zod");
const prisma = require("../prisma/client");

const { signUpUser } = require("../controllers/authController");
const { IMGS, getMainFeed, getFollowingFeed } = require("../controllers/feedController");
const { query } = require("../controllers/searchController");
const {
  getProfile,
  getFollowers,
  getFollowing,
  getUserPosts,
  getUserLikes,
  getMyProfileSettings,
  updateUserIMGS,
  updateUserProfile,
  updateUserPassword,
  deleteUserAccount,
  toggleFollow,
} = require("../controllers/userController");
const {
  getUserInventory,
  getUserInProgress,
  getUserLimbo,
  getUserDecluttered,
  getUserFinished,
  addProduct,
  updateInventory,
  deleteProduct,
} = require("../controllers/inventoryController");
const {
  getPost,
  makeAPost,
  updatePost,
  deletePost,
  togglePostLike,
} = require("../controllers/postController");
const {
  getComment,
  makeAComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
} = require("../controllers/commentController");

router.post("/sign-up-API", validator, signUpUser);

router.get("/session-check-API", isAuth, (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user.id,
      name: req.user.name,
      username: req.user.username,
      email: req.user.email,
      joined: req.user.joined,
      profile: {
        pfp: req.user.profile.pfp,
        header: req.user.profile.header,
        bio: req.user.profile.bio,
      },
    },
  });
});

router.post("/login-API", (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json({ message: info.message });
    }

    req.login(user, async (err) => {
      if (err) return next(err);

      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          profile: {
            select: {
              pfp: true,
              header: true,
              bio: true,
            },
          },
        },
      });

      return res.json({
        user: {
          id: fullUser.id,
          name: fullUser.name,
          username: fullUser.username,
          email: fullUser.email,
          profile: {
            pfp: fullUser.profile.pfp,
            header: fullUser.profile.header,
            bio: fullUser.profile.bio,
          },
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

// feed //
router.get("/IMGS-API/:IMG", isAuth, zoddie.imgSearch, IMGS);
router.get("/main-feed-API", isAuth, getMainFeed);
router.get("/following-feed-API", isAuth, getFollowingFeed);

// profile settings //
router.get("/get-my-profile-settings/", isAuth, getMyProfileSettings);

router.patch(
  "/update-my-IMGS-API/",
  isAuth,
  multer.fields([
    { name: "pfp", maxCount: 1 },
    { name: "header", maxCount: 1 },
  ]),
  updateUserIMGS,
);
router.patch("/update-my-profile-API/", isAuth, zoddie.updateProfZod, updateUserProfile);
router.post("/update-my-password-API/", isAuth, passwordValidation, updateUserPassword);
router.delete("/delete-my-account-API/", isAuth, deleteUserAccount);

// inventory //
router.post(
  "/add-to-inventory-API",
  isAuth,
  multer.single("image"),
  zoddie.addOrUpdateInventoryZod,
  addProduct,
);
router.patch(
  "/update-inventory-status/:productID",
  isAuth,
  zoddie.addOrUpdateInventoryZod,
  updateInventory,
);
router.delete("/delete-from-where/:productID", isAuth, deleteProduct);

// posts + comments + likes //
router.get("/get-this-post/:id", isAuth, getPost);
router.get("/get-this-comment/:id", isAuth, getComment);

router.patch("/like-post/:postID", isAuth, togglePostLike);
router.patch("/like-comment/:commentID", isAuth, toggleCommentLike);

router.post("/make-post-API", isAuth, multer.array("image", 4), zoddie.makeOrUpdatePostZod, makeAPost);
router.post("/make-comment-API", isAuth, zoddie.makeOrUpdateCommentZod, makeAComment);

router.patch("/update-post/:postToUpdate", isAuth, multer.array("image", 4), zoddie.makeOrUpdatePostZod, updatePost);
router.patch("/update-comment/:commentToUpdate", isAuth, zoddie.makeOrUpdateCommentZod, updateComment);

router.delete("/delete-post/:postToDelete", isAuth, deletePost);
router.delete("/delete-comment/:commentToDelete", isAuth, deleteComment);

// other users' profiles //
router.get("/profile-API/:username", isAuth, getProfile);
router.get("/get-user-followers/:username", isAuth, getFollowers);
router.get("/get-user-following/:username", isAuth, getFollowing);
router.get("/get-user-posts/:username", isAuth, getUserPosts);

router.get("/get-user-inventory/:username", isAuth, getUserInventory);
router.get("/get-user-in-progress/:username", isAuth, getUserInProgress);
router.get("/get-user-limbo/:username", isAuth, getUserLimbo);
router.get("/get-user-decluttered/:username", isAuth, getUserDecluttered);
router.get("/get-user-finished/:username", isAuth, getUserFinished);

router.get("/get-user-likes/:userID", isAuth, getUserLikes);

// follow //
router.post("/follow/:userID", isAuth, toggleFollow);

// search //
router.get("/search-API", isAuth, zoddie.searchZod, query);

module.exports = router;
