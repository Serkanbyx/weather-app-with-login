const User = require("../models/User");

const MAX_FAVORITES = 10;

const capitalizeWords = (str) =>
  str
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getFavorites = async (req, res) => {
  try {
    res.json({ favorites: req.user.favorites });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city || !city.trim()) {
      return res.status(400).json({ message: "City name is required" });
    }

    const normalizedCity = capitalizeWords(city);
    const user = await User.findById(req.user._id);

    const alreadyExists = user.favorites.some(
      (fav) => fav.toLowerCase() === normalizedCity.toLowerCase()
    );

    if (alreadyExists) {
      return res.status(400).json({ message: "City already in favorites" });
    }

    if (user.favorites.length >= MAX_FAVORITES) {
      return res
        .status(400)
        .json({ message: "Maximum 10 favorites allowed" });
    }

    user.favorites.push(normalizedCity);
    await user.save();

    res.json({ favorites: user.favorites });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { city } = req.params;
    const user = await User.findById(req.user._id);

    const originalLength = user.favorites.length;

    user.favorites = user.favorites.filter(
      (fav) => fav.toLowerCase() !== city.toLowerCase()
    );

    if (user.favorites.length === originalLength) {
      return res.status(404).json({ message: "City not found in favorites" });
    }

    await user.save();

    res.json({ favorites: user.favorites });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
