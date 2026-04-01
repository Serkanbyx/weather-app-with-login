import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally & enrich error messages for better UX
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.userMessage =
        "Unable to connect. Please check your internet connection.";
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    if (error.response.status === 404) {
      error.userMessage =
        error.response.data?.message || "City not found. Please check the spelling.";
    } else {
      error.userMessage =
        error.response.data?.message ||
        error.response.data?.errors?.[0]?.msg ||
        "Something went wrong. Please try again.";
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

export const weatherAPI = {
  getWeather: (city) => api.get(`/weather/${city}`),
  getForecast: (city) => api.get(`/weather/forecast/${city}`),
};

export const favoritesAPI = {
  getFavorites: () => api.get("/favorites"),
  addFavorite: (city) => api.post("/favorites/add", { city }),
  removeFavorite: (city) => api.delete(`/favorites/${city}`),
};

export default api;
