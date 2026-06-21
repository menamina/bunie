const prisma = require("../prisma/client");
const { passwordGenie, checkPassword } = require("../utils/password");
const { PAGINATION_LIMIT } = require("../utils/constants");

async function getProfile(req, res) {
  try {
    const { username } = req.params;

    const userProfile = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        joined: true,
        profile: { select: { pfp: true, header: true, bio: true } },
        followers: true,
        followings: true,
      },
    });

    if (!userProfile) {
      return res.status(404).json({ noUserFound: true });
    }
    return res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function getFollowers(req, res) {
  try {
    const { username } = req.params;

    const fullFollowerList = await prisma.user.findUnique({
      where: { username },
      select: {
        followers: {
          select: {
            followerAcc: {
              select: {
                id: true,
                name: true,
                username: true,
                profile: { select: { pfp: true } },
              },
            },
          },
        },
      },
    });

    if (fullFollowerList.followers.length === 0) {
      return res.status(404).json({ message: "no followers" });
    }
    return res.status(200).json(fullFollowerList);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function getFollowing(req, res) {
  try {
    const { username } = req.params;

    const fullFollowingList = await prisma.user.findUnique({
      where: { username },
      select: {
        followings: {
          select: {
            followingAcc: {
              select: {
                id: true,
                name: true,
                username: true,
                profile: { select: { pfp: true } },
              },
            },
          },
        },
      },
    });

    if (fullFollowingList.followings.length === 0) {
      return res.status(404).json({ message: "no followings" });
    }
    return res.status(200).json(fullFollowingList);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function getUserPosts(req, res) {
  try {
    const { username } = req.params;
    const cursor = parseInt(req.query.cursor) || 0;
    const thisMany = PAGINATION_LIMIT;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        profile: { select: { pfp: true } },
        posts: {
          ...(cursor > 0 && { skip: cursor }),
          take: thisMany + 1,
          include: { likes: true, comments: true },
          orderBy: { timestamp: "desc" },
        },
      },
    });

    if (!user || user.posts.length === 0) {
      return res.status(200).json({ feed: [], nextCursor: null });
    }

    const hasMore = user.posts.length > thisMany;
    const posts = hasMore ? user.posts.slice(0, thisMany) : user.posts;

    const feed = posts.map((post) => ({
      ...post,
      madeby: {
        id: user.id,
        name: user.name,
        username: user.username,
        profile: { pfp: user.profile.pfp },
      },
    }));

    const nextCursor = hasMore ? cursor + thisMany : null;

    return res.status(200).json({ feed, nextCursor });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getUserLikes(req, res) {
  try {
    const userID = parseInt(req.params.userID);
    const cursor = parseInt(req.query.cursor);
    const thisMany = PAGINATION_LIMIT;

    const postLikes = await prisma.postLikes.findMany({
      ...(cursor > 0 && { skip: cursor }),
      take: thisMany + 1,
      where: { userWhoLiked: userID },
      orderBy: { dateLiked: "desc" },
      include: {
        post: {
          include: {
            madeby: {
              select: {
                id: true,
                name: true,
                username: true,
                profile: { select: { pfp: true, header: true } },
              },
            },
            likes: true,
            comments: true,
          },
        },
      },
    });

    const commentLikes = await prisma.commentLikes.findMany({
      ...(cursor > 0 && { skip: cursor }),
      take: thisMany + 1,
      where: { userWhoLiked: userID },
      orderBy: { dateLiked: "desc" },
      include: {
        comment: {
          include: {
            commenter: {
              select: {
                id: true,
                name: true,
                username: true,
                profile: { select: { pfp: true, header: true } },
              },
            },
          },
        },
      },
    });

    if (postLikes.length === 0 && commentLikes.length === 0) {
      return res.status(200).json({ likesOrdered: [], nextCursor: null });
    }

    const postsFilter = postLikes.map((like) => ({
      type: "post",
      ...like.post,
    }));

    const commentsFiltered = commentLikes.map((like) => ({
      type: "comment",
      ...like.comment,
    }));

    const likesOrdered = [...postsFilter, ...commentsFiltered].sort(
      (a, b) => new Date(b.dateLiked) - new Date(a.dateLiked),
    );

    const hasMore = likesOrdered.length > thisMany;
    const results = hasMore ? likesOrdered.slice(0, thisMany) : likesOrdered;
    const nextCursor = hasMore ? cursor + thisMany : null;

    return res.status(200).json({ likesOrdered: results, nextCursor });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function getMyProfileSettings(req, res) {
  try {
    const userID = Number(req.user.id);

    const userProfSettings = await prisma.profile.findUnique({
      where: { userID },
    });

    if (!userProfSettings) {
      return res.status(204).json({ noProfile: true });
    }
    return res.status(200).json(userProfSettings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function updateUserIMGS(req, res) {
  try {
    const userID = Number(req.user.id);
    const pfp = req.files["pfp"] ? req.files["pfp"][0] : null;
    const header = req.files["header"] ? req.files["header"][0] : null;

    const updatedIMGS = await prisma.profile.update({
      where: { id: userID, userID },
      data: {
        ...(pfp && { pfp: pfp.filename }),
        ...(header && { header: header.filename }),
      },
    });

    return res.status(200).json({ updatedIMGS });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: "User not found or not your account" });
    }
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function updateUserProfile(req, res) {
  try {
    const userID = Number(req.user.id);
    const { name, username, email, bio } = req.body;

    if (req.user.username !== username || req.user.email !== email) {
      const alreadyTaken = await prisma.user.findMany({
        where: {
          OR: [{ username }, { email }],
          NOT: { id: userID },
        },
        select: { username: true, email: true },
      });

      const usernameTaken = alreadyTaken.some((u) => u.username === username);
      const emailTaken = alreadyTaken.some((u) => u.email === email);

      if (usernameTaken) {
        return res.status(200).json({ usernameTaken: true });
      } else if (emailTaken) {
        return res.status(200).json({ emailTaken: true });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userID },
      data: {
        ...(name && { name }),
        ...(username && { username }),
        ...(email && { email }),
        profile: { update: { ...(bio && { bio }) } },
      },
    });

    const returnUpdatedUser = {
      email: updatedUser.email,
      username: updatedUser.username,
      ...(updatedUser.profile.bio && { bio: updatedUser.profile.bio }),
    };

    return res.status(200).json(returnUpdatedUser);
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Account not found or not yours" });
    }
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function updateUserPassword(req, res) {
  try {
    const userID = Number(req.user.id);
    const { oldPassword, confirmNewPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userID },
      select: { saltedHash: true },
    });

    if (!user) {
      return res.status(404).json({ message: "No account found" });
    }

    const passwordMatch = await checkPassword(oldPassword, user.saltedHash);

    if (!passwordMatch) {
      return res.status(401).json({ passwordsDontMatch: true });
    }

    const updatedSaltedHash = await passwordGenie(confirmNewPassword);

    await prisma.user.update({
      where: { id: userID },
      data: { saltedHash: updatedSaltedHash },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function deleteUserAccount(req, res) {
  try {
    const userID = Number(req.user.id);

    await prisma.user.delete({ where: { id: userID } });

    return res.status(200).json({ userDeleted: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function toggleFollow(req, res) {
  try {
    const { userID } = req.params;
    const currentUserID = Number(req.user.id);
    const userToFollowID = Number(userID);

    if (currentUserID === userToFollowID) {
      return res.status(400).json({ success: false });
    }

    const existingFollow = await prisma.followRelation.findUnique({
      where: {
        follower_following: {
          follower: currentUserID,
          following: userToFollowID,
        },
      },
    });

    if (existingFollow) {
      await prisma.followRelation.delete({
        where: {
          follower_following: {
            follower: currentUserID,
            following: userToFollowID,
          },
        },
      });
      return res.status(200).json({ following: false });
    } else {
      await prisma.followRelation.create({
        data: { follower: currentUserID, following: userToFollowID },
      });
      return res.status(201).json({ following: true });
    }
  } catch (error) {
    console.error(error);
    if (error.code === "P2025" || error.code === "P2003") {
      return res.status(404).json({ message: "Account does not exist" });
    }
    return res.status(500).json({ errMsg: "server error" });
  }
}

module.exports = {
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
};
