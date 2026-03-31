const User = require("../models/User");
const { generateToken } = require("../config/jwt");

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  favorites: user.favorites,
});

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({ user: formatUser(user), token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user._id);

  res.json({ user: formatUser(user), token });
};

const getMe = async (req, res) => {
  res.json({ user: formatUser(req.user) });
};

module.exports = { register, login, getMe };
