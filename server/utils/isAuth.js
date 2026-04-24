function isAuth(req, res, next) {
  if (!req.user) {
    res.status(403).json({ message: "not authenticated" });
    console.log("HERE");
    return;
  }
  return next();
}

module.exports = isAuth;
