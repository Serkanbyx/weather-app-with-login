const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./env");

const TOKEN_EXPIRY = "7d";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, jwtSecret, { expiresIn: TOKEN_EXPIRY });
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

module.exports = { generateToken, verifyToken };
