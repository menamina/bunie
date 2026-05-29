const prisma = require("../prisma/client");
const { PAGINATION_LIMIT } = require("../utils/constants");
const path = require("path");

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
            profile: { select: { pfp: true, header: true, bio: true } },
          },
        },
      },
      orderBy: { timestamp: "desc" },
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
      where: { id: userID },
      select: {
        followings: {
          select: { followingAcc: { select: { id: true } } },
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
      where: { madeBy: { in: followingIds } },
      include: {
        likes: true,
        comments: true,
        madeby: {
          select: {
            id: true,
            name: true,
            username: true,
            profile: { select: { pfp: true, header: true, bio: true } },
          },
        },
      },
      orderBy: { timestamp: "desc" },
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

module.exports = { IMGS, getMainFeed, getFollowingFeed };
