import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — clear session and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
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
