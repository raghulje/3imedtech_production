const { check } = require("express-validator");
const Type = require("../utils/userTypes");

const validation = {
  createUserSchema: [
    // Accept both camelCase and snake_case - check either format
    check("first_name")
      .optional()
      .notEmpty()
      .withMessage("First Name should not be empty"),
    check("firstName")
      .optional()
      .notEmpty()
      .withMessage("First Name should not be empty"),
    check("last_name")
      .optional()
      .notEmpty()
      .withMessage("Last Name should not be empty"),
    check("lastName")
      .optional()
      .notEmpty()
      .withMessage("Last Name should not be empty"),
    check("mobile_number").optional(),
    check("mobileNumber").optional(),
    check("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email")
      .normalizeEmail(),
    check("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must contain at least 6 characters"),
    check("user_type")
      .optional()
      .isIn([Type.SuperAdmin, Type.Admin, Type.User, "Admin", "CHRO", "HR"])
      .withMessage("Invalid Role type"),
    check("userType")
      .optional()
      .isIn([Type.SuperAdmin, Type.Admin, Type.User, "Admin", "CHRO", "HR"])
      .withMessage("Invalid Role type"),
    // Custom validation to ensure at least one format is provided
    check().custom((value, { req }) => {
      if (!req.body.first_name && !req.body.firstName) {
        throw new Error("First Name is required");
      }
      if (!req.body.last_name && !req.body.lastName) {
        throw new Error("Last Name is required");
      }
      return true;
    }),
  ],
  validateLogin: [
    check("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email")
      .normalizeEmail(),
    check("password")
      .exists()
      .withMessage("Password is required")
      .notEmpty()
      .withMessage("Password must be filled"),
  ],
};

module.exports = validation;

