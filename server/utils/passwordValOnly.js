const { body, validationResult } = require("express-validator");

const passwordValidation = [
  body("newPassword").isEmpty(),
  body("confirmNewPassword").custom((value, { req }) => {
    if (value !== req.newPassword) {
      throw new Error("passwords must match");
    }
    return true;
  }),
];

module.exports = passwordValidation;
