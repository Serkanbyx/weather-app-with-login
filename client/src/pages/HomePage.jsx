import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { weatherAPI } from "../services/api";
import WeatherCard from "../components/weather/WeatherCard";
import ForecastSection from "../components/weather/ForecastSection";
import FavoritesSidebar, {
  useFavorites,
} from "../components/favorites/FavoritesSidebar";

function HomePage() {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchCity, setSearchCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  const {
    favorites,
    isLoading: favLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useFavorites();

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
      const message = err.userMessage || "An error occurred while fetching data.";
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
    if (!isAuthenticated) {
      addToast("Please register to add favorites", "info");
      navigate("/register");
      return;
    }
    if (weatherData?.name) {
      await addFavorite(weatherData.name);
      addToast("City added to favorites", "success");
    }
  };

  const handleRemoveFavorite = async () => {
    if (weatherData?.name) {
      await removeFavorite(weatherData.name);
      addToast("City removed from favorites", "info");
    }
  };

  const currentCityIsFavorite = weatherData?.name
    ? isFavorite(weatherData.name)
    : false;

  return (
    <div className="flex-1 bg-gray-100 py-8 px-4 animate-fade-in">
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
                onRemove={(city) => {
                  removeFavorite(city);
                  addToast("City removed from favorites", "info");
                }}
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
                  ref={inputRef}
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Enter city name..."
                  aria-label="City name"
                  autoFocus
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
              <div
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center flex items-center justify-center gap-2"
                role="alert"
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                {error}
              </div>
            )}
          </div>

          {/* Skeleton Loader */}
          {isLoading && <WeatherSkeleton />}

          {/* Weather Card */}
          {weatherData && !isLoading && (
            <div className="max-w-2xl mx-auto mb-6 animate-fade-in">
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
            <div className="max-w-2xl mx-auto animate-fade-in">
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
            onRemove={(city) => {
              removeFavorite(city);
              addToast("City removed from favorites", "info");
            }}
            variant="sidebar"
          />
        )}
      </div>
    </div>
  );
}

/* ─── Skeleton loader for weather card + forecast ─── */

function WeatherSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Weather card skeleton */}
      <div className="rounded-2xl bg-gray-200 p-6 sm:p-8 animate-skeleton">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <div className="h-7 w-40 bg-gray-300 rounded-lg" />
            <div className="h-4 w-24 bg-gray-300 rounded" />
          </div>
          <div className="w-20 h-20 bg-gray-300 rounded-full" />
        </div>
        <div className="mb-6">
          <div className="h-14 w-32 bg-gray-300 rounded-lg" />
          <div className="h-4 w-28 bg-gray-300 rounded mt-2" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-300 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Forecast skeleton */}
      <div>
        <div className="h-6 w-36 bg-gray-200 rounded mb-4 animate-skeleton" />
        <div className="flex gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[140px] flex-1 h-40 bg-gray-200 rounded-xl animate-skeleton"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
