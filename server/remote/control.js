const prisma = require("../prisma/client");
const { passwordGenie, checkPassword } = require("../utils/password");
const path = require("path");

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
      return res.status(403).json({ message: "Username in use" });
    }

    if (emailInUse) {
      return res.status(403).json({ message: "Email in use" });
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
    return res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function IMGS(req, res) {
  try {
    const { IMG } = req.params;
    const img = path.resolve(__dirname, "..", "uploads", IMG);
    return res.sendFile(img);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getMainFeed(req, res) {
  try {
    const { nextPosts } = req.body;
    const numberOfNextPost = Number(nextPosts);

    const feed = await prisma.posts.findMany({
      ...(numberOfNextPost > 0 && { skip: numberOfNextPost }),
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

    if (!feed || feed.length === 0) {
      return res.status(204).json({ databaseEmpty: true });
    }

    return res.status(200).json({ feed });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getFollowingFeed(req, res) {
  try {
    const { nextPosts } = req.body;
    const { id } = req.user;

    const userID = Number(id);
    const numberOfNextPost = Number(nextPosts);

    const thisUsersFollowing = await prisma.user.findUnique({
      where: {
        id: userID,
      },
      select: {
        followings: {
          select: {
            followingAcc: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const feed = await prisma.posts.findMany({
      ...(numberOfNextPost > 0 && { skip: numberOfNextPost }),
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

    if (!feed || feed.length === 0) {
      return res.status(204).json({ databaseEmpty: true });
    }

    return res.status(200).json({ feed });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function query(req, res) {
  try {
    const { query } = req.query;

    const usersWithQuery = await prisma.user.findMany({
      where: {
        username: {
          contains: [query],
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        profile: {
          select: {
            pfp: true,
            bio: true,
          },
        },
      },
    });

    const postsWithQuery = await prisma.posts.findMany({
      where: {
        OR: [
          {
            title: {
              contains: [query],
              mode: "insensitive",
            },
          },
          {
            body: {
              contains: [query],
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        likes: true,
        comments: true,
        madeBy: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return res.status(200).json({ usersWithQuery, postsWithQuery });
  } catch (error) {
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getProfile(req, res) {
  try {
    const { username } = req.params;

    const userProfile = await prisma.user.findUnique({
      where: {
        username,
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
        followers: true,
        following: true,
        posts: true,
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

async function getFollowers(req, res) {
  try {
    const { username } = req.params;
    const fullFollowerList = await prisma.user.findUnique({
      where: {
        username,
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
    if (fullFollowerList.followers.length === 0) {
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
    const { username } = req.params;
    const fullFollowingList = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        followings: {
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
    if (fullFollowingList.followings.length === 0) {
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
    const { username } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        name: true,
        username: true,
        posts: {
          include: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (user.posts.length === 0) {
      return res.status(204).json({ noPosts: true });
    }

    const feed = user.posts.map((post) => ({
      ...post,
      madeBy: {
        id: user.id,
        name: user.name,
        username: user.username,
      },
    }));

    return res.status(200).json({ feed });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getUserInventory(req, res) {
  try {
    const { username } = req.params;

    const thisUsersInventory = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        inventory: {
          where: {
            status: {
              notIn: ["decluttered", "fullpan"],
            },
          },
        },
      },
    });

    if (thisUsersInventory.inventory.length === 0) {
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
    const { username } = req.params;

    const thisUsersInProgress = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        inventory: {
          where: {
            status: "inProgress",
          },
        },
      },
    });

    if (thisUsersInProgress.inventory.length === 0) {
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
    const { username } = req.params;

    const thisUsersLimbo = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        inventory: {
          where: {
            status: "limbo",
          },
        },
      },
    });

    if (thisUsersLimbo.inventory.length === 0) {
      return res.status(204).json({ noLimbo: true });
    }
    return res.status(200).json({ thisUsersLimbo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getUserDecluttered(req, res) {
  try {
    const { username } = req.params;

    const thisUsersDecluttered = await prisma.user.findUnique({
      where: {
        username,
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
    const { username } = req.params;

    const thisUsersFinished = await prisma.user.findUnique({
      where: {
        username,
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
    const { username } = req.params;

    const thisUsersLikes = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        postsThisUserLikes: {
          include: {
            post: {
              include: {
                madeBy: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                  },
                },
              },
            },
          },
          orderBy: {
            dateLiked: "desc",
          },
        },
        commentLikesByThisUser: {
          include: {
            comment: {
              include: {
                post: true,
                commentedBy: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                  },
                },
              },
            },
          },
          orderBy: {
            dateLiked: "desc",
          },
        },
      },
    });

    const postsFilter = thisUsersLikes.postsThisUserLikes.map((like) => ({
      type: "post",
      ...like,
    }));
    const commentsFiltered = thisUsersLikes.commentLikesByThisUser.map(
      (like) => ({ type: "comment", ...like }),
    );

    const likesOrdered = [...postsFilter, ...commentsFiltered].sort(
      (a, b) => new Date(b.dateLiked) - new Date(a.dateLiked),
    );

    if (likesOrdered.length === 0) {
      return res.status(204).json({ noLikes: true });
    }

    return res.status(200).json({ likesOrdered });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getPost(req, res) {
  try {
    const { id } = req.params;
    const postID = Number(id);

    const post = await prisma.posts.findUnique({
      where: {
        id: postID,
      },
      include: {
        madeby: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        comments: {
          include: {
            commentedBy: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (post) {
      return res.status(200).json({ post });
    }
    return res.status(204).json({ success: false });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function getComment(req, res) {
  try {
    const { id } = req.params;
    const commentID = Number(id);

    const comment = await prisma.posts.findUnique({
      where: {
        id: commentID,
      },
      include: {
        post: {
          include: {
            madeby: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
        commenter: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    if (comment) {
      return res.status(200).json({ comment });
    }
    return res.status(204).json({ success: false });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function addProduct(req, res) {
  try {
    const { id } = req.user;
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
    const image = req.file;
    const imgFileName = image.filename;
    const userID = Number(id);

    const addedProduct = await prisma.inventory.create({
      data: {
        belongsTo: userID,
        brand,
        product,
        category,
        price,
        img: imgFileName,
        status: status ? status : "noStatus",
        purchaseDate: dateOpurchase ? dateOpurchase : null,
        rating: rating ? rating : null,
        notes: notes ? notes : null,
        wouldBuyAgain: wouldBuyAgain,
      },
    });

    return res.status(201).json({ addedProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function updateInventory(req, res) {
  try {
    const { productID } = req.params;
    const { id } = req.user;
    const userID = Number(id);
    const productIDNum = Number(productID);
    const {
      brand,
      product,
      category,
      price,
      status,
      rating,
      notes,
      wouldBuyAgain,
      purchaseDate,
    } = req.body;

    const updatedProduct = await prisma.inventory.update({
      where: { belongsTo: userID, id: productIDNum },
      data: {
        ...(brand && { brand }),
        ...(product && { product }),
        ...(category && { category }),
        ...(price && { price }),
        ...(status && { status }),
        ...(rating && { rating }),
        ...(notes && { notes }),
        ...(wouldBuyAgain && { wouldBuyAgain }),
        ...(purchaseDate && { purchaseDate }),
      },
    });

    return res.status(201).json({ updatedProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function deleteProduct(req, res) {
  try {
    const { productID } = req.params;
    const { id } = req.user;
    const userID = Number(id);
    const productIDNum = Number(productID);

    await prisma.inventory.delete({
      where: {
        belongsTo: userID,
        id: productIDNum,
      },
    });

    return res.status(200).json({ succes: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function togglePostLike(req, res) {
  try {
    const { postID } = req.params;
    const { id } = req.user;
    const userID = Number(id);
    const postIDNum = Number(postID);

    const existingLike = await prisma.postLikes.findUnique({
      where: {
        idOfPost_userWhoLiked: {
          idOfPost: postIDNum,
          userWhoLiked: userID,
        },
      },
    });

    if (existingLike) {
      await prisma.postLikes.delete({
        where: {
          idOfPost_userWhoLiked: {
            idOfPost: postIDNum,
            userWhoLiked: userID,
          },
        },
      });
      return res.status(200).json({ liked: false });
    } else {
      await prisma.postLikes.create({
        data: {
          idOfPost: postIDNum,
          userWhoLiked: userID,
        },
      });
      return res.status(201).json({ liked: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function toggleCommentLike(req, res) {
  try {
    const { commentID } = req.params;
    const { id } = req.user;
    const userID = Number(id);
    const commentIDNum = Number(commentID);

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
        data: {
          idOfComment: commentIDNum,
          userWhoLiked: userID,
        },
      });
      return res.status(201).json({ liked: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function toggleFollow(req, res) {
  try {
    const { userID } = req.params;
    const { id } = req.user;

    const currentUserID = Number(id);
    const userToFollowID = Number(userID);

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
        data: {
          follower: currentUserID,
          following: userToFollowID,
        },
      });
      return res.status(201).json({ following: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function makeAPost(req, res) {
  try {
    const { id } = req.user;
    const userID = Number(id);

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
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function updatePost(req, res) {
  try {
    const { id } = req.user;
    const { postToUpdate } = req.params;
    const { title, body } = req.body;
    const userID = Number(id);
    const postID = Number(postToUpdate);

    const imgs = req.files;

    const fileNames = imgs.length > 0 ? imgs.map((img) => img.filename) : null;

    const updatedPost = await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        posts: {
          update: {
            where: {
              id: postID,
            },
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
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function makeAComment(req, res) {
  try {
    const { id } = req.user;
    const { pID } = req.body;
    const postID = Number(pID);
    const userID = Number(id);

    const { body } = req.body;

    const comment = await prisma.comments.create({
      data: {
        userWhoCommented: userID,
        idOfPost: postID,
        body,
      },
    });

    return res.status(201).json({ comment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function updateComment(req, res) {
  try {
    const { id } = req.user;
    const { commentToUpdate } = req.params;
    const { body } = req.body;
    const userID = Number(id);
    const commentID = Number(commentToUpdate);

    const updatedComment = await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        comments: {
          update: {
            where: {
              userWhoCommented: userID,
              id: commentID,
            },
            data: {
              body,
            },
          },
        },
      },
      include: { comments: true },
    });

    return res.status(200).json({ updatedComment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function deletePost(req, res) {
  try {
    const { postToDelete } = req.params;
    const { id } = req.user;
    const userID = Number(id);
    const postID = Number(postToDelete);

    await prisma.posts.delete({
      where: {
        id: postID,
        madeBy: userID,
      },
    });

    return res.status(200).json({ postDeleted: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function deleteComment(req, res) {
  try {
    const { commentToDelete } = req.params;
    const { id } = req.user;
    const userID = Number(id);
    const commentID = Number(commentToDelete);

    await prisma.comments.delete({
      where: {
        id: commentID,
        userWhoCommented: userID,
      },
    });

    return res.status(200).json({ commentDeleted: true });
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
      return res.status(204).json({ noProfile: true });
    }

    return res.status(200).json({ userProfSettings });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function updateUserIMGS(req, res) {
  try {
    const id = req.user.id;
    const userID = Number(id);
    const pfp = req.files["pfp"] ? req.files["pfp"][0] : null;
    const header = req.files["header"] ? req.files["header"][0] : null;

    const updatedIMGS = await prisma.profile.update({
      where: {
        id: userID,
        userID,
      },
      data: {
        ...(pfp && { pfp: pfp.filename }),
        ...(header && { header: header.filename }),
      },
    });

    return res.status(200).json({ updatedIMGS });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function updateUserProfile(req, res) {
  try {
    const id = req.user.id;
    const userID = Number(id);
    const { name, username, email, bio } = req.body;

    if (email) {
      const isEmailInUse = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (isEmailInUse) {
        return res.status(403).json({ emailInUse: true });
      }
      return;
    }

    if (username) {
      const isUsernameInUse = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (isUsernameInUse) {
        return res.status(403).json({ usernameInUse: true });
      }
      return;
    }

    const updatedUser = await prisma.user.update({
      where: {
        userID,
      },
      data: {
        ...(name && { name }),
        ...(username && { username }),
        ...(email && { email }),
        profile: {
          update: {
            ...(bio && { bio }),
          },
        },
      },
    });

    return res.status(200).json({ updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function updateUserPassword(req, res) {
  try {
    const id = req.user.id;
    const userID = Number(id);
    const { oldPassword, confirmNewPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: userID,
      },
      select: {
        saltedHash: true,
      },
    });

    const passwordMatch = await checkPassword(oldPassword, user.saltedHash);

    if (!passwordMatch) {
      return res.status(204).json({ passwordsDontMatch: true });
    }

    const updatedSaltedHash = await passwordGenie(confirmNewPassword);

    await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        saltedHash: updatedSaltedHash,
      },
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

async function deleteUserAccount(req, res) {
  try {
    const id = req.user.id;
    const userID = Number(id);

    await prisma.user.delete({
      where: {
        userID,
      },
    });

    return res.status(200).json({ userDeleted: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errMsg: "server error", error });
  }
}

module.exports = {
  signUpUser,

  IMGS,
  getMainFeed,
  getFollowingFeed,

  query,

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

  getPost,
  getComment,

  addProduct,
  updateInventory,
  deleteProduct,

  togglePostLike,
  toggleCommentLike,
  toggleFollow,

  makeAPost,
  updatePost,

  makeAComment,
  updateComment,

  deletePost,
  deleteComment,

  getMyProfileSettings,
  updateUserIMGS,
  updateUserProfile,
  updateUserPassword,
  deleteUserAccount,
};
