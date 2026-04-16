import * as z from "zod";

function searchZod(req, res, next) {
  try {
    z.string().min(1).max(100).parse(req.query);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.issues });
  }
}

router.post("/make-comment-API", isAuth, remote.makeAComment);

function makeCommentZod(req, res, next) {
  try {
    z.string().parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.issues });
  }
}

function makePostZod(req, res, next) {
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

function addToInvenZod(req, res, next) {
  const schema = z.object({
    brand: z.string(),
    product: z.string(),
    category: z.string(),
    price: z.number(),
    status: z.string(),
    dateOpurchase: z.iso.datetime().optional(),
    rating: z.string(),
    notes: z.string().optional(),
    wouldBuyAgain: z.string().or(z.null()),
  });
  try {
    schema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.issues });
  }
}

function updateProfZod(req, res, next) {
  const schema = z.object({
    name: z.string().or(z.number()),
    username: z.string().or(z.number()),
    email: z.email(),
    bio: z.string().or(z.number()).or(z.url()),
  });
  try {
    schema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.issues });
  }
}
