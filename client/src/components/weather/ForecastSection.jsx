const WEATHER_GRADIENTS = {
  clear: "from-amber-400 to-orange-300",
  clouds: "from-slate-400 to-blue-200",
  rain: "from-blue-600 to-slate-300",
  drizzle: "from-blue-400 to-gray-200",
  thunderstorm: "from-purple-700 to-indigo-400",
  snow: "from-blue-200 to-gray-100",
  mist: "from-gray-400 to-gray-200",
  fog: "from-gray-500 to-gray-200",
  haze: "from-yellow-300 to-gray-200",
  default: "from-blue-500 to-cyan-300",
};

const getGradient = (weatherMain) => {
  const key = weatherMain?.toLowerCase() || "default";
  return WEATHER_GRADIENTS[key] || WEATHER_GRADIENTS.default;
};

const capitalizeFirst = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const getDailyForecast = (data) => {
  if (!data?.list) return [];

  const dailyMap = {};

  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    const hour = item.dt_txt.split(" ")[1];

    if (!dailyMap[date]) {
      dailyMap[date] = {
        representative: item,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
      };
    } else {
      dailyMap[date].tempMin = Math.min(dailyMap[date].tempMin, item.main.temp_min);
      dailyMap[date].tempMax = Math.max(dailyMap[date].tempMax, item.main.temp_max);

      if (hour === "12:00:00") {
        dailyMap[date].representative = item;
      }
    }
  });

  return Object.values(dailyMap).slice(0, 5);
};

const formatDay = (dtTxt) => {
  const date = new Date(dtTxt);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

const formatFullDate = (dtTxt) => {
  const date = new Date(dtTxt);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

function ForecastSection({ data }) {
  const dailyForecast = getDailyForecast(data);

  if (dailyForecast.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        5-Day Forecast
      </h3>

      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
        {dailyForecast.map(({ representative, tempMin, tempMax }) => {
          const weatherMain = representative.weather[0]?.main;
          const gradient = getGradient(weatherMain);

          return (
            <div
              key={representative.dt}
              className={`relative min-w-[140px] flex-1 snap-center overflow-hidden rounded-xl shadow-md bg-linear-to-br ${gradient} p-4 text-white transition-transform duration-200 hover:scale-105`}
            >
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-xl" />

              <div className="relative z-10 flex flex-col items-center text-center gap-1">
                <p className="text-sm font-bold tracking-wide">
                  {formatDay(representative.dt_txt)}
                </p>
                <p className="text-xs text-white/70">
                  {formatFullDate(representative.dt_txt)}
                </p>

                <img
                  src={`https://openweathermap.org/img/wn/${representative.weather[0]?.icon}@2x.png`}
                  alt={representative.weather[0]?.description || "Weather icon"}
                  className="w-14 h-14 drop-shadow-md -my-1"
                />

                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  <span>{Math.round(tempMax)}°</span>
                  <span className="text-white/50">/</span>
                  <span className="text-white/70">{Math.round(tempMin)}°</span>
                </div>

                <p className="text-xs text-white/80 leading-tight mt-0.5">
                  {capitalizeFirst(representative.weather[0]?.description)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ForecastSection;
