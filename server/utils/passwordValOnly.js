const { body, validationResult } = require("express-validator");

const passwordValidation = [
  body("newPassword")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Length must be at least 8 characters"),
  body("confirmNewPassword").custom((value, { req }) => {
    if (value !== req.newPassword) {
      throw new Error("passwords must match");
    }
    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(400).json({ validationErrors: errors.array() });
  },
];

module.exports = passwordValidation;
