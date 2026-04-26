const { body, validationResult } = require("express-validator");

const passwordValidation = [
  body("newPassword")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Length must be at least 8 characters"),

  body("confirmNewPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Passwords must match");
    }
    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(403).json({ validationErrors: errors.array() });
  },
];

module.exports = passwordValidation;
