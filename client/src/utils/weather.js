export const WEATHER_GRADIENTS = {
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

export const FORECAST_GRADIENTS = {
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

export const getGradient = (weatherMain, gradientMap = WEATHER_GRADIENTS) => {
  const key = weatherMain?.toLowerCase() || "default";
  return gradientMap[key] || gradientMap.default;
};

export const capitalizeFirst = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
