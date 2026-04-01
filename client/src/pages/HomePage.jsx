import { useState } from "react";
import { weatherAPI } from "../services/api";

function HomePage() {
  const [searchCity, setSearchCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e?.preventDefault();

    const trimmedCity = searchCity.trim();
    if (!trimmedCity) return;

    setIsLoading(true);
    setError("");

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        weatherAPI.getWeather(trimmedCity),
        weatherAPI.getForecast(trimmedCity),
      ]);

      setWeatherData(weatherRes.data);
      setForecastData(forecastRes.data);
    } catch (err) {
      const message =
        err.response?.data?.message || "An error occurred while fetching data.";
      setError(message);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getDailyForecast = (data) => {
    if (!data?.list) return [];

    const dailyMap = {};
    data.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      const hour = item.dt_txt.split(" ")[1];

      if (!dailyMap[date] || hour === "12:00:00") {
        dailyMap[date] = item;
      }
    });

    return Object.values(dailyMap).slice(0, 5);
  };

  const formatDay = (dtTxt) => {
    const date = new Date(dtTxt);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const capitalizeFirst = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="flex-1 bg-gray-100 py-8 px-4">
      {/* Search Section */}
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
          Weather App
        </h1>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Enter city name..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-white shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !searchCity.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
            {error}
          </div>
        )}
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Weather Card (inline — will be replaced by WeatherCard component) */}
      {weatherData && !isLoading && (
        <div className="max-w-2xl mx-auto mb-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {weatherData.name}, {weatherData.sys?.country}
                </h2>
                <p className="text-gray-500 mt-1">
                  {capitalizeFirst(weatherData.weather[0].description)}
                </p>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
                className="w-20 h-20"
              />
            </div>

            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-bold text-gray-800">
                {Math.round(weatherData.main.temp)}°C
              </span>
              <span className="text-gray-500 mb-1">
                Feels like {Math.round(weatherData.main.feels_like)}°C
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Humidity</p>
                <p className="text-lg font-semibold text-gray-700">
                  {weatherData.main.humidity}%
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Wind</p>
                <p className="text-lg font-semibold text-gray-700">
                  {weatherData.wind.speed} m/s
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Pressure</p>
                <p className="text-lg font-semibold text-gray-700">
                  {weatherData.main.pressure} hPa
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Visibility</p>
                <p className="text-lg font-semibold text-gray-700">
                  {(weatherData.visibility / 1000).toFixed(1)} km
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forecast Section (inline — will be replaced by ForecastSection component) */}
      {forecastData && !isLoading && (
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            5-Day Forecast
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {getDailyForecast(forecastData).map((day) => (
              <div
                key={day.dt}
                className="bg-white rounded-xl shadow-sm p-4 text-center"
              >
                <p className="text-sm font-medium text-gray-600">
                  {formatDay(day.dt_txt)}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                  className="w-12 h-12 mx-auto"
                />
                <p className="text-lg font-bold text-gray-800">
                  {Math.round(day.main.temp)}°C
                </p>
                <p className="text-xs text-gray-500">
                  {capitalizeFirst(day.weather[0].description)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
