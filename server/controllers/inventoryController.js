const prisma = require("../prisma/client");

async function getUserInventory(req, res) {
  try {
    const { username } = req.params;

    const thisUsersInventory = await prisma.user.findUnique({
      where: { username },
      select: {
        inventory: {
          where: { status: { notIn: ["decluttered", "fullpan"] } },
          orderBy: { id: "desc" },
        },
      },
    });
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
      where: { username },
      select: {
        inventory: {
          where: { status: "inProgress" },
          orderBy: { id: "desc" },
        },
      },
    });

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
      where: { username },
      select: {
        inventory: {
          where: { status: "limbo" },
          orderBy: { id: "desc" },
        },
      },
    });

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
      where: { username },
      select: {
        inventory: {
          where: { status: "decluttered" },
          orderBy: { id: "desc" },
        },
      },
    });

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
      where: { username },
      select: {
        inventory: {
          where: { status: "fullpan" },
          orderBy: { id: "desc" },
        },
      },
    });

    return res.status(200).json(thisUsersFinished);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

async function addProduct(req, res) {
  try {
    const userID = Number(req.user.id);
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
        wouldBuyAgain,
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
    const userID = Number(req.user.id);
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
    const userID = Number(req.user.id);
    const productIDNum = Number(productID);

    await prisma.inventory.delete({
      where: { belongsTo: userID, id: productIDNum },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "server error" });
  }
}

module.exports = {
  getUserInventory,
  getUserInProgress,
  getUserLimbo,
  getUserDecluttered,
  getUserFinished,
  addProduct,
  updateInventory,
  deleteProduct,
};
