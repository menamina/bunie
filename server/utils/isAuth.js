function isAuth() {
  if (!req.user) {
    return res.status(404).json({ notAuthenticated: true });
  }
  return next();
}

module.exports = isAuth;
