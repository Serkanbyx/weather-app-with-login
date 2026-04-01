const WEATHER_GRADIENTS = {
  clear: "from-amber-400 via-orange-300 to-yellow-200",
  clouds: "from-slate-400 via-gray-300 to-blue-200",
  rain: "from-blue-600 via-blue-400 to-slate-300",
  drizzle: "from-blue-400 via-sky-300 to-gray-200",
  thunderstorm: "from-purple-700 via-indigo-500 to-slate-400",
  snow: "from-blue-100 via-white to-gray-200",
  mist: "from-gray-400 via-gray-300 to-gray-200",
  fog: "from-gray-500 via-gray-300 to-gray-200",
  haze: "from-yellow-300 via-amber-200 to-gray-200",
  default: "from-blue-500 via-sky-400 to-cyan-300",
};

const getGradient = (weatherMain) => {
  const key = weatherMain?.toLowerCase() || "default";
  return WEATHER_GRADIENTS[key] || WEATHER_GRADIENTS.default;
};

const capitalizeFirst = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

function WeatherCard({
  data,
  onAddFavorite,
  onRemoveFavorite,
  isFavorite,
  isAuthenticated,
}) {
  const weatherMain = data.weather[0]?.main;
  const gradient = getGradient(weatherMain);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-lg bg-linear-to-br ${gradient} p-6 sm:p-8 text-white`}
    >
      {/* Background decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

      <div className="relative z-10">
        {/* City & Country */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold drop-shadow-sm">
              {data.name}, {data.sys?.country}
            </h2>
            <p className="text-sm text-white/80 mt-1">
              {capitalizeFirst(data.weather[0]?.description)}
            </p>
          </div>
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0]?.icon}@2x.png`}
            alt={data.weather[0]?.description || "Weather icon"}
            className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg -mt-2"
          />
        </div>

        {/* Temperature */}
        <div className="mb-6">
          <span className="text-5xl sm:text-6xl font-extrabold tracking-tight drop-shadow-sm">
            {Math.round(data.main.temp)}°C
          </span>
          <p className="text-sm text-white/80 mt-1">
            Feels like {Math.round(data.main.feels_like)}°C
          </p>
        </div>

        {/* Detail Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <DetailItem
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
            label="Humidity"
            value={`${data.main.humidity}%`}
          />
          <DetailItem
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            }
            label="Wind"
            value={`${data.wind.speed} m/s`}
          />
          <DetailItem
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            label="Pressure"
            value={`${data.main.pressure} hPa`}
          />
          <DetailItem
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
            label="Visibility"
            value={`${(data.visibility / 1000).toFixed(1)} km`}
          />
        </div>

        {/* Favorite Button */}
        {isAuthenticated && (
          <div className="mt-6">
            {isFavorite ? (
              <button
                onClick={onRemoveFavorite}
                aria-label={`Remove ${data.name} from favorites`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-red-500/80 border border-white/30 text-white font-medium text-sm transition-all duration-200 cursor-pointer backdrop-blur-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                Remove from Favorites
              </button>
            ) : (
              <button
                onClick={onAddFavorite}
                aria-label={`Add ${data.name} to favorites`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-medium text-sm transition-all duration-200 cursor-pointer backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Add to Favorites
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2.5">
      <span className="text-white/70 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-white/60 leading-tight">{label}</p>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}

export default WeatherCard;
