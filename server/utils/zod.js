import * as z from "zod";

function searchZod(req, res, next) {
  const schema = z.string();
  const { query } = req.query;
  try {
    schema.parse(query);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.issues });
  }
}

router.post("/make-comment-API", isAuth, remote.makeAComment);

function makeCommentZod(req, res, next) {
  const schema = z.string();
  const { body } = req.body;
  try {
    schema.parse(body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.issues });
  }
}

function makePostZod(req, res, next) {
  const schema = z.object({
    title: z.string().or(z.number()),
    body: z.string().optional(),
  });
  const { body } = req.body;
  try {
    schema.parse(body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.issues });
  }
}

function addToInvenZod(req, res, next) {
  const schema = z.object({
    brand,
    product,
    category,
    price,
    status,
    dateOpurchase,
    rating,
    notes,
    wouldBuyAgain,
  });
  try {
    const {
      brand,
      product,
      category,
      price,
      status,
      dateOpurchase,
      rating,
      notes,
      wouldBuyAgain,
    } = req.body;
  } catch (error) {
    return res.status(400).json({ error: error.issues });
  }
}

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
