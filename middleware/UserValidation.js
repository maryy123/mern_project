const { validationResult, check } = require("express-validator");

exports.registerValidate = () => [
  check("name", "name is required").notEmpty(),
  check("email", "invalid email format").isEmail(),
  check("email", "email is required").notEmpty(),
  check("password", "password is required").notEmpty(),
  check("password", "password is too short").isLength({ min: 6 }),
];
exports.loginValidate = () => [
  check("email", "invalid email format").isEmail(),
  check("password", "min lengh is 6").isLength({ min: 6 }),
];

exports.validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
