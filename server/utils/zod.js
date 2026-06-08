const z = require("zod");

function searchZod(req, res, next) {
  const schema = z.object({
    querySearch: z.string().min(1),
  });
  try {
    schema.parse(req.query);
    next();
  } catch (error) {
    console.log("here in zod:", error.message);
    return res.status(400).json({ error: error.message });
  }
}

function makeOrUpdatePostZod(req, res, next) {
  const schema = z.object({
    title: z.coerce.string(),
    body: z.string().optional(),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    console.error("Validation error:", error);
    return res.status(400).json({ error: error.message });
  }
}

function makeOrUpdateCommentZod(req, res, next) {
  const schema = z.object({
    body: z.string(),
    pID: z.coerce.number().optional(),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

function addOrUpdateInventoryZod(req, res, next) {
  const schema = z.object({
    brand: z.string(),
    product: z.string(),
    category: z.string(),
    price: z.coerce.number(),
    status: z.string(),
    dateOpurchase: z.coerce.date().optional(),
    rating: z.string().or(z.number()).optional(),
    notes: z.string().optional(),
    wouldBuyAgain: z.string().or(z.null()).optional(),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.issues });
  }
}

function updateProfZod(req, res, next) {
  const schema = z.object({
    name: z.coerce.string().optional(),
    username: z.coerce.string().optional(),
    email: z.string().email().optional(),
    bio: z.coerce.string().optional(),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

function imgSearch(req, res, next) {
  const { IMG } = req.params;

  if (IMG.includes("..") || IMG.includes("/") || IMG.includes("\\")) {
    return res.status(400).json({ error: "Invalid file name" });
  }

  if (!/^[a-zA-Z0-9_\-\.]+$/.test(IMG)) {
    return res.status(400).json({ error: "Invalid file name" });
  }

  next();
}

module.exports = {
  searchZod,
  makeOrUpdatePostZod,
  makeOrUpdateCommentZod,
  addOrUpdateInventoryZod,
  updateProfZod,
  imgSearch,
};
