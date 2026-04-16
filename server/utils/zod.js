import * as z from "zod";

export const searchZod = (req, res, next) => {
  const schema = z.string();
  const { query } = req.query;
  try {
    schema.parse(query);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.issues });
  }
};

router.post("/make-comment-API", isAuth, remote.makeAComment);

router.post(
  "/make-post-API",
  isAuth,
  multer.array("image", 5),
  remote.makeAPost,
);

router.post(
  "/add-to-inventory-API",
  isAuth,
  multer.single("image"),
  remote.addProduct,
);

router.patch("/update-my-profile-API/", isAuth, remote.updateUserProfile);
router.post(
  "/update-my-password-API/",
  isAuth,
  passwordValidation,
  remote.updateUserPassword,
);
router.delete("/delete-my-account-API/", isAuth, remote.deleteUserAccount);

router.patch(
  "/update-my-IMGS-API/",
  isAuth,
  multer.fields([
    { name: "pfp", maxCount: 1 },
    { name: "header", maxCount: 1 },
  ]),
  remote.updateUserIMGS,
);
