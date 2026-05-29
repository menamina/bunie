const prisma = require("../prisma/client");
const { PAGINATION_LIMIT } = require("../utils/constants");

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
        where: { username: { contains: querySearch, mode: "insensitive" } },
        select: {
          id: true,
          name: true,
          username: true,
          profile: { select: { pfp: true, bio: true } },
        },
      });

      postsWithQuery = await prisma.posts.findMany({
        take: 10,
        where: {
          OR: [
            { title: { contains: querySearch, mode: "insensitive" } },
            { body: { contains: querySearch, mode: "insensitive" } },
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
              profile: { select: { pfp: true } },
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
        where: { username: { contains: querySearch, mode: "insensitive" } },
        select: {
          id: true,
          name: true,
          username: true,
          profile: { select: { pfp: true, bio: true } },
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
            { title: { contains: querySearch, mode: "insensitive" } },
            { body: { contains: querySearch, mode: "insensitive" } },
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
              profile: { select: { pfp: true } },
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

module.exports = { query };
