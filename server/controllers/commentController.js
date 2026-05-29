const prisma = require("../prisma/client");

async function getComment(req, res) {
  try {
    const commentID = Number(req.params.id);

    const comment = await prisma.comments.findUnique({
      where: { id: commentID },
      include: {
        commenter: {
          select: { id: true, name: true, username: true },
        },
        likes: true,
      },
    });

    if (!comment) {
      return res.status(404).json({ message: "no comment found" });
    }
    return res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function makeAComment(req, res) {
  try {
    const userID = Number(req.user.id);
    const { pID, body } = req.body;
    const postID = Number(pID);

    const comment = await prisma.comments.create({
      data: { userWhoCommented: userID, idOfPost: postID, body },
    });

    return res.status(201).json({ comment });
  } catch (error) {
    console.error(error);
    if (error.code === "P2003") {
      return res.status(404).json({ message: "post does not exist" });
    }
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function updateComment(req, res) {
  try {
    const userID = Number(req.user.id);
    const commentID = Number(req.params.commentToUpdate);
    const { body } = req.body;

    const updatedComment = await prisma.user.update({
      where: { id: userID },
      data: {
        comments: {
          update: {
            where: { userWhoCommented: userID, id: commentID },
            data: { body },
          },
        },
      },
      include: { comments: true },
    });

    return res.status(200).json({ updatedComment });
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Comment not found or not yours" });
    }
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function deleteComment(req, res) {
  try {
    const userID = Number(req.user.id);
    const commentID = Number(req.params.commentToDelete);

    await prisma.comments.deleteMany({
      where: { id: commentID, userWhoCommented: userID },
    });

    return res.status(200).json({ commentDeleted: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function toggleCommentLike(req, res) {
  try {
    const userID = Number(req.user.id);
    const commentIDNum = Number(req.params.commentID);

    const existingLike = await prisma.commentLikes.findUnique({
      where: {
        idOfComment_userWhoLiked: {
          idOfComment: commentIDNum,
          userWhoLiked: userID,
        },
      },
    });

    if (existingLike) {
      await prisma.commentLikes.delete({
        where: {
          idOfComment_userWhoLiked: {
            idOfComment: commentIDNum,
            userWhoLiked: userID,
          },
        },
      });
      return res.status(200).json({ liked: false });
    } else {
      await prisma.commentLikes.create({
        data: { idOfComment: commentIDNum, userWhoLiked: userID },
      });
      return res.status(201).json({ liked: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

module.exports = {
  getComment,
  makeAComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
};
