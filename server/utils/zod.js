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

function makeOrUpdateCommentZod(req, res, next) {
  try {
    z.string().parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.issues });
  }
}

function makeOrUpdatePostZod(req, res, next) {
  const schema = z.object({
    title: z.string().or(z.number()),
    body: z.string().optional(),
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
    price: z.number().optional(),
    status: z.string().optional(),
    dateOpurchase: z.string().datetime().optional(),
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
    name: z.string().or(z.number()),
    username: z.string().or(z.number()),
    email: z.string().email(),
    bio: z.string().or(z.number()).or(z.url()),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.issues });
  }
}

export default {
  searchZod,
  makeOrUpdateCommentZod,
  makeOrUpdatePostZod,
  addOrUpdateInventoryZod,
  updateProfZod,
};
