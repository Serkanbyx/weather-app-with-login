import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { weatherAPI } from "../services/api";
import WeatherCard from "../components/weather/WeatherCard";
import ForecastSection from "../components/weather/ForecastSection";
import FavoritesSidebar, {
  useFavorites,
} from "../components/favorites/FavoritesSidebar";

function HomePage() {
  const { isAuthenticated } = useAuth();

  const [searchCity, setSearchCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { favorites, isLoading: favLoading, addFavorite, removeFavorite, isFavorite } =
    useFavorites();

  const fetchWeather = useCallback(async (city) => {
    const trimmed = city.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError("");

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        weatherAPI.getWeather(trimmed),
        weatherAPI.getForecast(trimmed),
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
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    fetchWeather(searchCity);
  };

  const handleCitySelect = (city) => {
    setSearchCity(city);
    fetchWeather(city);
  };

  const handleAddFavorite = async () => {
    if (weatherData?.name) {
      await addFavorite(weatherData.name);
    }
  };

  const handleRemoveFavorite = async () => {
    if (weatherData?.name) {
      await removeFavorite(weatherData.name);
    }
  };

  const currentCityIsFavorite = weatherData?.name
    ? isFavorite(weatherData.name)
    : false;

  return (
    <div className="flex-1 bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto flex gap-6">
        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0">
          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
              Weather App
            </h1>

            {/* Mobile favorites panel */}
            {isAuthenticated && (
              <FavoritesSidebar
                favorites={favorites}
                isLoading={favLoading}
                onCitySelect={handleCitySelect}
                onRemove={removeFavorite}
                variant="mobile"
              />
            )}

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

          {/* Weather Card */}
          {weatherData && !isLoading && (
            <div className="max-w-2xl mx-auto mb-6">
              <WeatherCard
                data={weatherData}
                onAddFavorite={handleAddFavorite}
                onRemoveFavorite={handleRemoveFavorite}
                isFavorite={currentCityIsFavorite}
                isAuthenticated={isAuthenticated}
              />
            </div>
          )}

          {/* Forecast Section */}
          {forecastData && !isLoading && (
            <div className="max-w-2xl mx-auto">
              <ForecastSection data={forecastData} />
            </div>
          )}
        </div>

        {/* ── Desktop Sidebar ── */}
        {isAuthenticated && (
          <FavoritesSidebar
            favorites={favorites}
            isLoading={favLoading}
            onCitySelect={handleCitySelect}
            onRemove={removeFavorite}
            variant="sidebar"
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;
