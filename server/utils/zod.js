import * as z from "zod";

function searchZod(req, res, next) {
  const schema = z.object({
    q: z.string().min(1).max(100),
  });
  try {
    schema.parse(req.query);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.issues });
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
    return res.status(400).json({ error: error.issues });
  }
}

function makeOrUpdateCommentZod(req, res, next) {
  const schema = z.object({
    body: z.string(),
    pID: z.coerce.number(),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.issues });
  }
}

function addOrUpdateInventoryZod(req, res, next) {
  const schema = z.object({
    brand: z.string().optional(),
    product: z.string().optional(),
    category: z.string().optional(),
    price: z.coerce.number().optional(),
    status: z.string().optional(),
    dateOpurchase: z.coerce.date().optional(),
    rating: z.string().optional(),
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
    email: z.string().or(email()).optional(),
    bio: z.coerce.string().optional(),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.issues });
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

export default {
  searchZod,
  makeOrUpdatePostZod,
  makeOrUpdateCommentZod,
  addOrUpdateInventoryZod,
  updateProfZod,
  imgSearch,
};
