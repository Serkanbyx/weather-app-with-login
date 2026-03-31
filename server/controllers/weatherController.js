const axios = require("axios");

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const getWeather = async (req, res) => {
  const { city } = req.params;

  try {
    const { data } = await axios.get(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=en`
    );

    res.json(data);
  } catch (error) {
    if (error.response?.data?.cod === "404") {
      return res.status(404).json({ message: "City not found" });
    }

    res.status(500).json({ message: "Failed to fetch weather data" });
  }
};

const getForecast = async (req, res) => {
  const { city } = req.params;

  try {
    const { data } = await axios.get(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=en`
    );

    res.json(data);
  } catch (error) {
    if (error.response?.data?.cod === "404") {
      return res.status(404).json({ message: "City not found" });
    }

    res.status(500).json({ message: "Failed to fetch weather data" });
  }
};

module.exports = { getWeather, getForecast };
