const axios = require("axios");
const { openWeatherApiKey } = require("../config/env");

const BASE_URL = "https://api.openweathermap.org/data/2.5";

const fetchFromOpenWeather = async (endpoint, city) => {
  const encodedCity = encodeURIComponent(city.trim());
  const url = `${BASE_URL}/${endpoint}?q=${encodedCity}&appid=${openWeatherApiKey}&units=metric&lang=en`;
  const { data } = await axios.get(url);
  return data;
};

const getWeather = async (req, res) => {
  const { city } = req.params;

  try {
    const data = await fetchFromOpenWeather("weather", city);
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
    const data = await fetchFromOpenWeather("forecast", city);
    res.json(data);
  } catch (error) {
    if (error.response?.data?.cod === "404") {
      return res.status(404).json({ message: "City not found" });
    }
    res.status(500).json({ message: "Failed to fetch weather data" });
  }
};

module.exports = { getWeather, getForecast };
