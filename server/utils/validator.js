const { body, validationResult } = require("express-validator");

const validation = [
  body("name").notEmpty().withMessage("Name required"),
  body("username").trim().notEmpty().withMessage("Username required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("An email is required")
    .isEmail()
    .withMessage("Valid email required"),
  body("password").trim().notEmpty().withMessage("Password required"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords must match");
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

module.exports = validation;
