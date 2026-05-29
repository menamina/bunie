const prisma = require("../prisma/client");

async function getPost(req, res) {
  try {
    const postID = Number(req.params.id);

    const post = await prisma.posts.findUnique({
      where: { id: postID },
      include: {
        madeby: {
          select: {
            id: true,
            name: true,
            username: true,
            profile: { select: { pfp: true, header: true, bio: true } },
          },
        },
        comments: {
          include: {
            commenter: {
              select: { id: true, name: true, username: true },
            },
            likes: true,
          },
        },
        likes: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "no post found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function makeAPost(req, res) {
  try {
    const userID = Number(req.user.id);
    const { title, body } = req.body;
    const imgs = req.files;
    const fileNames = imgs?.length > 0 ? imgs.map((img) => img.filename) : null;

    const post = await prisma.posts.create({
      data: {
        madeBy: userID,
        title,
        ...(body && { body }),
        ...(fileNames && { img: fileNames }),
      },
    });

    return res.status(201).json({ post });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function updatePost(req, res) {
  try {
    const userID = Number(req.user.id);
    const postID = Number(req.params.postToUpdate);
    const { title, body } = req.body;
    const imgs = req.files;
    const fileNames = imgs?.length > 0 ? imgs.map((img) => img.filename) : null;

    const updatedPost = await prisma.user.update({
      where: { id: userID },
      data: {
        posts: {
          update: {
            where: { id: postID },
            data: {
              title,
              ...(fileNames && { img: fileNames }),
              ...(body && { body }),
            },
          },
        },
      },
      include: { posts: true },
    });

    return res.status(200).json({ updatedPost });
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Post not found or not yours" });
    }
    return res.status(500).json({ errMsg: "Server error" });
  }
}

async function deletePost(req, res) {
  try {
    const userID = Number(req.user.id);
    const postID = Number(req.params.postToDelete);

    await prisma.posts.deleteMany({
      where: { id: postID, madeBy: userID },
    });

    return res.status(200).json({ postDeleted: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function togglePostLike(req, res) {
  try {
    const userID = Number(req.user.id);
    const postIDNum = Number(req.params.postID);

    const existingLike = await prisma.postLikes.findUnique({
      where: {
        idOfPost_userWhoLiked: { idOfPost: postIDNum, userWhoLiked: userID },
      },
    });

    if (existingLike) {
      await prisma.postLikes.delete({
        where: {
          idOfPost_userWhoLiked: { idOfPost: postIDNum, userWhoLiked: userID },
        },
      });
      return res.status(200).json({ liked: false });
    } else {
      await prisma.postLikes.create({
        data: { idOfPost: postIDNum, userWhoLiked: userID },
      });
      return res.status(201).json({ liked: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

module.exports = { getPost, makeAPost, updatePost, deletePost, togglePostLike };
