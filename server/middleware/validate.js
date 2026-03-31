const { validationResult } = require("express-validator");

const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((v) => v.run(req)));

  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map(({ path, msg }) => ({
    field: path,
    message: msg,
  }));

  return res.status(400).json({ errors });
};

module.exports = { validate };
