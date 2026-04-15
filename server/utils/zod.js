import * as z from "zod";

router.get("/my-profile-API/:username", isAuth, remote.getProfile);
router.get("/profile-API/:username", isAuth, remote.getProfile);
export const uNameParamVali = () => (req, res, next) => {
    const schema = z.string();
    const {username} = req.params
    const valid = schema.parse(username);
    if (!valid){
        return res.status(204).json({message: "not a valid username"})
    }
    next();
}


router.get("/get-my-posts/:username", isAuth, remote.getUserPosts);



router.get("/get-my-inventory/:username", isAuth, remote.getUserInventory);
router.get("/get-my-in-progress/:username", isAuth, remote.getUserInProgress);
router.get("/get-my-limbo/:username", isAuth, remote.getUserLimbo);
router.get("/get-my-decluttered/:username", isAuth, remote.getUserDecluttered);
router.get("/get-my-finished/:username", isAuth, remote.getUserFinished);
router.get("/get-my-likes/:username", isAuth, remote.getUserLikes);

router.patch(
  "/update-inventory-status/:productID",
  isAuth,
  remote.updateInventory,
);

router.delete("/delete-from-where/:productID", isAuth, remote.deleteProduct);

router.get("/get-this-post/:id", isAuth, remote.getPost);
router.get("/get-this-comment/:id", isAuth, remote.getComment);

router.post("/like-post/:postID", isAuth, remote.togglePostLike);
router.post("/like-comment/:commentID", isAuth, remote.toggleCommentLike);

router.patch("/update-post/:postToUpdate", isAuth, remote.updatePost);
router.patch("/update-comment/:commentToUpdate", isAuth, remote.updateComment);

 + other ppls profiles 


 