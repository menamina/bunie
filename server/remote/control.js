const prisma = require("../prisma/client");
const { passwordGenie, checkPassword } = require("../utils/password");
const { PAGINATION_LIMIT } = require("../utils/constants");
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
            bio: null,
          },
        },
      },
    });
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function IMGS(req, res) {
  try {
    const { IMG } = req.params;
    const img = path.resolve(__dirname, "..", "uploads", IMG);
    return res.sendFile(img);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function getMainFeed(req, res) {
  try {
    const cursor = parseInt(req.query.cursor);
    const thisMany = PAGINATION_LIMIT;

    const feed = await prisma.posts.findMany({
      ...(cursor > 0 && { skip: cursor }),
      take: thisMany + 1,
      include: {
        likes: true,
        comments: true,
        madeby: {
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
      orderBy: {
        timestamp: "desc",
      },
    });

    if (!feed || feed.length === 0) {
      return res.status(200).json({ feed: [], nextCursor: null });
    }

    const hasMore = feed.length > thisMany;
    const results = hasMore ? feed.slice(0, thisMany) : feed;
    const nextCursor = hasMore ? cursor + thisMany : null;

    return res.status(200).json({ feed: results, nextCursor });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function getFollowingFeed(req, res) {
  try {
    const cursor = parseInt(req.query.cursor);
    const { id } = req.user;

    const userID = Number(id);
    const thisMany = PAGINATION_LIMIT;

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

    if (thisUsersFollowing.followings.length === 0) {
      return res.status(200).json({ feed: [], nextCursor: null });
    }

    const followingIds = thisUsersFollowing.followings.map(
      (f) => f.followingAcc.id,
    );

    const feed = await prisma.posts.findMany({
      ...(cursor > 0 && { skip: cursor }),
      take: thisMany + 1,
      where: {
        madeBy: {
          in: followingIds,
        },
      },
      include: {
        likes: true,
        comments: true,
        madeby: {
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
      orderBy: {
        timestamp: "desc",
      },
    });

    if (!feed || feed.length === 0) {
      return res.status(200).json({ feed: [], nextCursor: null });
    }

    const hasMore = feed.length > thisMany;
    const results = hasMore ? feed.slice(0, thisMany) : feed;
    const nextCursor = hasMore ? cursor + thisMany : null;

    return res.status(200).json({ feed: results, nextCursor });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function query(req, res) {
  try {
    const { querySearch, tabView } = req.query;
    const cursor = parseInt(req.query.cursor);
    const thisMany = PAGINATION_LIMIT;

    let usersWithQuery = [];
    let postsWithQuery = [];

    if (tabView === "top") {
      usersWithQuery = await prisma.user.findMany({
        take: 10,
        where: {
          username: {
            contains: querySearch,
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

      postsWithQuery = await prisma.posts.findMany({
        take: 10,
        where: {
          OR: [
            {
              title: {
                contains: querySearch,
                mode: "insensitive",
              },
            },
            {
              body: {
                contains: querySearch,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          likes: true,
          comments: true,
          madeby: {
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
      });

      return res
        .status(200)
        .json({ usersWithQuery, postsWithQuery, nextCursor: null });
    }

    if (tabView === "users") {
      const users = await prisma.user.findMany({
        ...(cursor > 0 && { skip: cursor }),
        take: thisMany + 1,
        where: {
          username: {
            contains: querySearch,
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

      const hasMore = users.length > thisMany;
      usersWithQuery = hasMore ? users.slice(0, thisMany) : users;
      const nextCursor = hasMore ? cursor + thisMany : null;

      return res
        .status(200)
        .json({ usersWithQuery, postsWithQuery: [], nextCursor });
    }

    if (tabView === "posts") {
      const posts = await prisma.posts.findMany({
        ...(cursor > 0 && { skip: cursor }),
        take: thisMany + 1,
        where: {
          OR: [
            {
              title: {
                contains: querySearch,
                mode: "insensitive",
              },
            },
            {
              body: {
                contains: querySearch,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          likes: true,
          comments: true,
          madeby: {
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
      });

      const hasMore = posts.length > thisMany;
      postsWithQuery = hasMore ? posts.slice(0, thisMany) : posts;
      const nextCursor = hasMore ? cursor + thisMany : null;

      return res
        .status(200)
        .json({ usersWithQuery: [], postsWithQuery, nextCursor });
    }

    return res
      .status(200)
      .json({ usersWithQuery, postsWithQuery, nextCursor: null });
  } catch (error) {
    console.error("Query function error:", error);
    return res.status(500).json({ errMsg: "server error" });
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
        joined: true,
        profile: {
          select: {
            pfp: true,
            header: true,
            bio: true,
          },
        },
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

    if (!fullFollowerList) {
      return res.status(403).json({ message: "no user found" });
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

    if (!fullFollowingList) {
      return res.status(403).json({ message: "no user found" });
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
          },
        },
        posts: {
          ...(cursor > 0 && { skip: cursor }),
          take: thisMany + 1,
          include: {
            likes: true,
            comments: true,
          },
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
        profile: {
          pfp: user.profile.pfp,
        },
      },
    }));

    const nextCursor = hasMore ? cursor + thisMany : null;

    return res.status(200).json({ feed, nextCursor });
  } catch (error) {
    console.error(error);
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

    if (!thisUsersInventory) {
      return res.status(204).json({ noInventory: true });
    }
    return res.status(200).json(thisUsersInventory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
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

    if (!thisUsersInProgress) {
      return res.status(204).json({ noInProgress: true });
    }
    return res.status(200).json(thisUsersInProgress);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
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

    if (!thisUsersLimbo) {
      return res.status(204).json({ noLimbo: true });
    }
    return res.status(200).json(thisUsersLimbo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
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

    if (!thisUsersDecluttered) {
      return res.status(204).json({ noDecluttered: true });
    }
    return res.status(200).json(thisUsersDecluttered);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
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

    if (!thisUsersFinished) {
      return res.status(204).json({ noFinished: true });
    }
    return res.status(200).json(thisUsersFinished);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
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
                profile: {
                  select: {
                    pfp: true,
                    header: true,
                  },
                },
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
                profile: {
                  select: {
                    pfp: true,
                    header: true,
                  },
                },
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
            profile: {
              select: {
                pfp: true,
                header: true,
                bio: true,
              },
            },
          },
        },
        comments: {
          include: {
            commenter: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
            likes: true,
          },
        },
        likes: true,
      },
    });

    if (post) {
      const formattedPost = {
        ...post,
        madeby: post.madeby,
      };
      return res.status(200).json(formattedPost);
    }
    return res.status(404).json({ message: "no post found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function getComment(req, res) {
  try {
    const { id } = req.params;
    const commentID = Number(id);

    const comment = await prisma.comments.findUnique({
      where: {
        id: commentID,
      },
      include: {
        commenter: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        likes: true,
      },
    });

    if (comment) {
      return res.status(200).json(comment);
    }
    return res.status(404).json({ message: "no comment found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
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
    const imgFileName = image ? image.filename : null;
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
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
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
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(500).json({ errMsg: "Server error" });
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

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
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
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
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
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
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
    console.error(error);
    if (error.code === "P2025" || error.code === "P2003") {
      return res.status(404).json({ message: "Account does not exist" });
    }
    return res.status(500).json({ errMsg: "server error" });
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
        title: title,
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
    const { id } = req.user;
    const { postToUpdate } = req.params;
    const { title, body } = req.body;
    const userID = Number(id);
    const postID = Number(postToUpdate);

    const imgs = req.files;

    const fileNames = imgs?.length > 0 ? imgs.map((img) => img.filename) : null;

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
              img: fileNames ? fileNames : null,
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

async function makeAComment(req, res) {
  try {
    const { id } = req.user;
    const { pID, body } = req.body;
    const postID = Number(pID);
    const userID = Number(id);

    const comment = await prisma.comments.create({
      data: {
        userWhoCommented: userID,
        idOfPost: postID,
        body,
      },
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
    const { commentToUpdate } = req.params;
    const { body } = req.body;
    const { id } = req.user;
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
    console.error(error);
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Comment not found or not yours" });
    }
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function deletePost(req, res) {
  try {
    const { postToDelete } = req.params;
    const { id } = req.user;
    const userID = Number(id);
    const postID = Number(postToDelete);

    await prisma.posts.deleteMany({
      where: {
        id: postID,
        madeBy: userID,
      },
    });

    return res.status(200).json({ postDeleted: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function deleteComment(req, res) {
  try {
    const { commentToDelete } = req.params;
    const { id } = req.user;
    const userID = Number(id);
    const commentID = Number(commentToDelete);

    await prisma.comments.deleteMany({
      where: {
        id: commentID,
        userWhoCommented: userID,
      },
    });

    return res.status(200).json({ commentDeleted: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
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

    return res.status(200).json(userProfSettings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
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
    const id = req.user.id;
    const userID = Number(id);
    const { name, username, email, bio } = req.body;

    if (req.user.username !== username || req.user.email !== email) {
      const alreadyTaken = await prisma.user.findMany({
        where: {
          OR: [{ username: username }, { email: email }],
          NOT: { id: userID },
        },
        select: {
          username: true,
          email: true,
        },
      });

      const usernameTaken = alreadyTaken.some(
        (user) => user.username === username,
      );
      const emailTaken = alreadyTaken.some((user) => user.email === email);

      if (usernameTaken) {
        return res.status(200).json({ usernameTaken: true });
      } else if (emailTaken) {
        return res.status(200).json({ emailTaken: true });
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userID,
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

    return res.status(200).json(updatedUser);
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

    if (!user) {
      return res.status(404).json({ message: "No account found" });
    }

    const passwordMatch = await checkPassword(oldPassword, user.saltedHash);

    if (!passwordMatch) {
      return res.status(401).json({ passwordsDontMatch: true });
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
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function deleteUserAccount(req, res) {
  try {
    const id = req.user.id;
    const userID = Number(id);

    await prisma.user.delete({
      where: {
        id: userID,
      },
    });

    return res.status(200).json({ userDeleted: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
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
