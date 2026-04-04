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
    return res.status(201);
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
        userID,
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
        followers: true,
        following: true,
        posts: true,
        postsThisUserLikes: true,
      },
    });

    if (!userProfile) {
      return res.status(404).json({ noUserFound: true });
    }
    return res.status(200).json({ userProfile });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getMyProfileSettings(req, res) {
  try {
    const id = req.user.id;
    const userID = Number(id);

    const userProfSettings = await prisma.profile.findUnique({
      where: {
        userID,
      },
    });
    if (!userProfSettings) {
      return res.status(204).json({ noProfile });
    }

    return res.statu(200).json({ userProfSettings });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getFollowers(req, res) {
  try {
    const getThisUsersFollowers = req.body.thisUser;
    const thisUser = Number(getThisUsersFollowers);
    const fullFollowerList = await prisma.user.findUnique({
      where: {
        id: thisUser,
      },
      select: {
        followers: {
          select: {
            followerAcc: {
              select: {
                id: true,
                name: true,
                username: true,
                profile: {
                  select: {
                    pfp: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (fullFollowerList.length === 0) {
      return res.status(204).json({ noFollowers: true });
    }
    return res.status(200).json({ fullFollowerList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getFollowing(req, res) {
  try {
    const getThisUsersFollowings = req.body.thisUser;
    const thisUser = Number(getThisUsersFollowings);
    const fullFollowingList = await prisma.user.findUnique({
      where: {
        id: thisUser,
      },
      select: {
        following: {
          select: {
            followingAcc: {
              select: {
                id: true,
                name: true,
                username: true,
                profile: {
                  select: {
                    pfp: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (fullFollowingList.length === 0) {
      return res.status(204).json({ noFollowing: true });
    }
    return res.status(200).json({ fullFollowingList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getUserPosts(req, res) {
  try {
    const getThisUsersPosts = req.body.thisUser;
    const thisUser = Number(getThisUsersPosts);
    const thisUsersPosts = await prisma.user.findUnique({
      where: {
        id: thisUser,
      },
      select: {
        id: true,
        name: true,
        username: true,
        posts: true,
      },
    });

    if (thisUsersPosts.length === 0) {
      return res.status(204).json({ noPosts: true });
    }
    return res.status(200).json({ thisUsersPosts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getUserInventory(req, res) {
  try {
    const getThisUsersInventory = req.body.thisUser;
    const thisUser = Number(getThisUsersInventory);

    const thisUsersInventory = await prisma.user.findUnique({
      where: {
        belongsTo: thisUser,
      },
      select: {
        inventory: {
            where: {
                status: {
                    notIn: ["decluttered", "fullpan"]
                }
            }
        }
      },
    });

    if (thisUsersInventory.length === 0) {
      return res.status(204).json({ noInventory: true });
    }
    return res.status(200).json({ thisUsersInventory });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getUserInProgress(req, res) {
  try {
    const getThisUsersInProgress = req.body.thisUser;
    const thisUser = Number(getThisUsersInProgress);

    const thisUsersInProgress = await prisma.user.findUnique({
      where: {
        id: thisUser,
      },
      select: {
        inventory: {
          where: {
            status: "inProgress",
          },
        },
      },
    });

    if (thisUsersInProgress.length === 0) {
      return res.status(204).json({ noInProgress: true });
    }
    return res.status(200).json({ thisUsersInProgress });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getUserLimbo(req, res) {
  try {
    const getThisUsersLimbo = req.body.thisUser;
    const thisUser = Number(getThisUsersLimbo);

    const thisUsersLimbo = await prisma.user.findUnique({
      where: {
        id: thisUser,
      },
      select: {
        inventory: {
          where: {
            status: "limbo",
          },
        },
      },
    });

    if (thisUsersLimbo.length === 0) {
      return res.status(204).json({ noInProgress: true });
    }
    return res.status(200).json({ thisUsersLimbo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getUserDecluttered(req, res) {
  try {
    const getUsersDecluttered = req.body.thisUser;
    const thisUser = Number(getUsersDecluttered);

    const thisUsersDecluttered = await prisma.user.findUnique({
      where: {
        id: thisUser,
      },
      select: {
        inventory: {
          where: {
            status: "decluttered",
          },
        },
      },
    });

    if (thisUsersDecluttered.inventory.length === 0) {
      return res.status(204).json({ noDecluttered: true });
    }
    return res.status(200).json({ thisUsersDecluttered });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getUserFinished(req, res) {
  try {
    const getUserFinished = req.body.thisUser;
    const thisUser = Number(getUserFinished);

    const thisUsersFinished = await prisma.user.findUnique({
      where: {
        id: thisUser,
      },
      select: {
        inventory: {
          where: {
            status: "fullpan",
          },
        },
      },
    });

    if (thisUsersFinished.inventory.length === 0) {
      return res.status(204).json({ noFinished: true });
    }
    return res.status(200).json({ thisUsersFinished });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getUserLikes(req, res) {
  try {
    const getUserLikes = req.body.thisUser;
    const thisUser = Number(getUserLikes);

    const thisUsersLikes = await prisma.user.findUnique({
      where: {
        id: thisUser,
      },
      select: {
        postsThisUserLikes: {
          include: {
            madeBy: true,
          },
        },
      },
    });

    if (thisUsersLikes.length === 0) {
      return res.status(204).json({ noInProgress: true });
    }
    return res.status(200).json({ thisUsersLikes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function addProduct(req, res) {
  try {
    const { id } = req.params;
    const userID = Number(id);

    await prisma.inventory.create({
        where: {
            id: userID
        }
        data: {

        }
    })


  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function addFinishedProduct(req, res) {
  try {
    const { id } = req.params;
    const userID = Number(id);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function addDeclutteredProduct(req, res) {
  try {
    const { id } = req.params;
    const userID = Number(id);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function updateInventoryStatus(req, res) {
  try {
    const { id } = req.params;
    const userID = Number(id);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

module.exports = {
  signUpUser,

  getMainFeed,

  getProfile,
  getFollowers,
  getFollowing,
  getUserPosts,
  getUserInventory,
  getUserInProgress,
  getUserLimbo,
  getUserDecluttered,
  getUserFinished,
  getUserLikes,

  addProduct,
  addFinishedProduct,
  addDeclutteredProduct,
  updateInventoryStatus,

  getMyProfileSettings,
  updateUserProfile,
  deleteUserAccount,
};
