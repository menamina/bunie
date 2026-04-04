const prisma = require("../prisma/client");
const { passwordGenie } = require("../utils/passwords");

async function signUpUser(req, res) {
  try {
    const { name, username, email, password } = req.body;
    const usernameInUse = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    const emailInUse = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (usernameInUse) {
      return res.status(403).json({ emailInUse: true });
    }

    if (emailInUse) {
      return res.status(403).json({ emailInUse: true });
    }

    const passHash = await passwordGenie(password);
    await prisma.user.create({
      data: {
        name,
        username,
        email,
        saltedHash: passHash,
        profile: {
          create: {
            header: null,
            bio: null,
          },
        },
      },
    });
    return res.status(200);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getMainFeed(req, res) {
  try {
    const { nextPosts } = req.body;
    const numberOfNextPost = Number(nextPosts);

    if (numberOfNextPost === 0) {
      const feed = await prisma.posts.findMany({
        take: 50,
        include: {
          likes: true,
          comments: true,
          madeBy: {
            select: {
              id: true,
              name: true,
              username: true,
              profile: {
                select: {
                  pfp: true,
                  header: true,
                  bio: true,
                },
              },
            },
          },
        },
      });

      if (!feed) {
        return res.status(204).json({ databaseEmpty: true });
      }

      return res.status(200).json({ feed });
    } else {
      const feed = await prisma.posts.findMany({
        skip: numberOfNextPost,
        take: 50,
        include: {
          likes: true,
          comments: true,
          madeBy: {
            select: {
              id: true,
              name: true,
              username: true,
              profile: {
                select: {
                  pfp: true,
                  header: true,
                  bio: true,
                },
              },
            },
          },
        },
      });

      if (!feed) {
        return res.status(204).json({ databaseEmpty: true });
      }
      return res.status(200).json({ feed });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getProfile(req, res) {
  try {
    const { id } = req.params;
    const userID = Number(id);

    const userProfile = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        profile: {
          select: {
            pfp: true,
            header: true,
            bio: true,
          },
        },
        inventory: true,
        declutttered: true,
        fullpan: true,
        followers: true,
        following: true,
        posts: true,
        postsThisUserLikes: true,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

module.exports = {
  signUpUser,
  getMainFeed,
  getProfile,
};
