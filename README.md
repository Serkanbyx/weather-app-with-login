# 🌦️ WeatherNow

A full-stack weather application built with the **MERN** stack (MongoDB, Express, React, Node.js). Features real-time weather data, 5-day forecasts, JWT authentication, city favorites system, toast notifications, skeleton loaders, and a responsive Tailwind CSS v4 interface.

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)

---

## Features

- **Weather Search** — Search any city worldwide for real-time weather data powered by OpenWeatherMap API
- **5-Day Forecast** — View upcoming weather with daily temperature ranges, humidity, and conditions
- **User Authentication** — Secure register and login system with JWT-based stateless authentication
- **Favorites System** — Save up to 10 favorite cities for quick access (requires login)
- **Protected Routes** — Unauthenticated users are automatically redirected; favorites require login
- **Proxy Pattern** — API keys are hidden server-side; never exposed to the client browser
- **Toast Notifications** — Real-time feedback for user actions (success, error, info)
- **Skeleton Loaders** — Smooth loading states for all async operations
- **Error Handling** — User-friendly messages for network errors, invalid cities, and validation failures
- **Responsive Design** — Optimized for mobile, tablet, and desktop with Tailwind CSS v4
- **Axios Interceptors** — Automatic token injection and global 401 session cleanup

---

## Live Demo

[🚀 View Live Demo](https://weather-mern.netlify.app/)

---

## Technologies

### Frontend

- **React 19**: Modern UI library with hooks and context for state management
- **Vite 8**: Lightning-fast build tool and dev server with HMR
- **Tailwind CSS 4**: Utility-first CSS framework with Vite plugin integration
- **React Router 7**: Client-side routing with layout routes and protected routes
- **Axios 1.14**: Promise-based HTTP client with request/response interceptors

### Backend

- **Node.js**: Server-side JavaScript runtime
- **Express 5**: Minimal and flexible web application framework
- **MongoDB (Mongoose 9)**: NoSQL database with elegant object modeling and timestamps
- **JWT (jsonwebtoken 9)**: Stateless authentication with token-based sessions
- **bcryptjs 3**: Password hashing with 12 salt rounds
- **express-validator 7**: Server-side input validation and sanitization
- **CORS**: Cross-Origin Resource Sharing configuration with credentials support
- **OpenWeatherMap API**: External weather data provider (current weather + 5-day forecast)

---

## Installation

### Prerequisites

- **Node.js** v18+ and **npm**
- **MongoDB** — MongoDB Atlas (free tier) or local instance
- **OpenWeather API Key** — [Get one free here](https://openweathermap.org/api)

### Local Development

**1. Clone the repository:**

```bash
git clone https://github.com/Serkanbyx/weather-mern.git
cd weather-mern
```

**2. Set up environment variables:**

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

**server/.env**

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENWEATHER_API_KEY=your_openweather_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

| Variable | Description |
| --- | --- |
| `PORT` | Server port number (default: 5000) |
| `MONGODB_URI` | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `OPENWEATHER_API_KEY` | API key from OpenWeatherMap |
| `CLIENT_URL` | Frontend URL for CORS origin (default: `http://localhost:5173`) |
| `NODE_ENV` | Environment mode (`development` or `production`) |

**client/.env**

```env
VITE_API_URL=http://localhost:5000/api
```

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Backend API base URL (falls back to `/api` proxy in development) |

**3. Install dependencies:**

```bash
cd server && npm install
cd ../client && npm install
```

**4. Run the application:**

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

The client runs at `http://localhost:5173` and proxies `/api` requests to `http://localhost:5000` via Vite's dev server proxy.

---

## Usage

1. **Search Weather** — Enter any city name in the search bar to view current temperature, humidity, wind speed, and weather conditions
2. **View Forecast** — Scroll down to see the 5-day weather forecast with daily temperature ranges
3. **Register** — Create an account with your name, email, and password (min 6 characters)
4. **Login** — Sign in with your email and password to unlock favorites
5. **Add Favorites** — Click the heart icon on any weather card to save the city (up to 10 favorites)
6. **Quick Access** — Use the favorites sidebar to instantly load weather for saved cities
7. **Remove Favorites** — Click the remove button on any favorite to delete it
8. **Logout** — Click the logout button to end your session

---

## How It Works?

### Authentication Flow

The application uses JWT-based stateless authentication. When a user registers or logs in, the server creates a JWT token containing the user's ID and returns it. The client stores this token in `localStorage` and attaches it to every subsequent request via an Axios request interceptor.

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

On mount, the `AuthContext` verifies the stored token by calling `GET /api/auth/me`. If the token is invalid or expired, it is automatically removed from storage and the user is logged out.

The response interceptor handles 401 errors globally — if any API call returns 401, the token and user data are cleared from `localStorage`, forcing re-authentication.

### Data Flow

```
Client (React) → Axios Instance → Vite Proxy / Direct URL → Express Server → OpenWeatherMap API
                                                            ↕
                                                        MongoDB (User data, Favorites)
```

1. **Weather requests** flow from the React frontend through the Express backend, which proxies them to OpenWeatherMap. API keys never leave the server.
2. **Auth requests** hit the Express server directly, which validates input with `express-validator`, hashes passwords with `bcryptjs` (12 rounds), and issues JWT tokens.
3. **Favorites requests** require a valid JWT. The `protect` middleware verifies the token, loads the user, and attaches it to `req.user` before the controller runs.

### Proxy Architecture

In development, Vite's proxy forwards `/api` requests to the backend. In production, the client uses the `VITE_API_URL` environment variable to call the deployed backend directly.

```javascript
// vite.config.js — Development proxy
server: {
  port: 5173,
  proxy: {
    "/api": {
      target: "http://localhost:5000",
      changeOrigin: true,
    },
  },
}
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create a new user account |
| POST | `/api/auth/login` | No | Login and receive JWT token |
| GET | `/api/auth/me` | Yes | Get current authenticated user |
| GET | `/api/weather/:city` | No | Get current weather for a city |
| GET | `/api/weather/forecast/:city` | No | Get 5-day forecast for a city |
| GET | `/api/favorites` | Yes | Get user's favorite cities |
| POST | `/api/favorites/add` | Yes | Add a city to favorites (max 10) |
| DELETE | `/api/favorites/:city` | Yes | Remove a city from favorites |
| GET | `/api/health` | No | Server health check |

> Auth endpoints require `Authorization: Bearer <token>` header.

---

## Project Structure

```
weather-mern/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── ProtectedRoute.jsx    # Auth guard for routes
│   │   │   ├── favorites/
│   │   │   │   └── FavoritesSidebar.jsx   # Favorites panel
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx             # Navigation bar
│   │   │   │   └── Layout.jsx             # Root layout wrapper
│   │   │   └── weather/
│   │   │       ├── ForecastSection.jsx    # 5-day forecast display
│   │   │       └── WeatherCard.jsx        # Current weather card
│   │   ├── context/
│   │   │   ├── AuthContext.jsx            # Auth state management
│   │   │   └── ToastContext.jsx           # Toast notification system
│   │   ├── pages/
│   │   │   ├── HomePage.jsx               # Main weather search page
│   │   │   ├── LoginPage.jsx              # User login form
│   │   │   └── RegisterPage.jsx           # User registration form
│   │   ├── services/
│   │   │   └── api.js                     # Axios instance & API methods
│   │   ├── App.jsx                        # Route definitions
│   │   ├── main.jsx                       # App entry point
│   │   └── index.css                      # Global styles
│   ├── netlify.toml                       # Netlify deployment config
│   ├── vite.config.js                     # Vite configuration
│   └── package.json
├── server/                          # Express backend
│   ├── config/
│   │   ├── db.js                          # MongoDB connection
│   │   ├── env.js                         # Environment validation
│   │   └── jwt.js                         # JWT sign & verify helpers
│   ├── controllers/
│   │   ├── authController.js              # Auth logic (register, login, me)
│   │   ├── favoritesController.js         # Favorites CRUD logic
│   │   └── weatherController.js           # OpenWeatherMap proxy logic
│   ├── middleware/
│   │   ├── auth.js                        # JWT verification middleware
│   │   ├── errorHandler.js                # Global error handler
│   │   └── validate.js                    # express-validator runner
│   ├── models/
│   │   └── User.js                        # User schema with favorites
│   ├── routes/
│   │   ├── authRoutes.js                  # /api/auth routes
│   │   ├── favoriteRoutes.js              # /api/favorites routes
│   │   └── weatherRoutes.js               # /api/weather routes
│   ├── server.js                          # Express app entry point
│   └── package.json
└── README.md
```

---

## Security

- **Password Hashing** — User passwords are hashed with bcryptjs using 12 salt rounds before storage
- **JWT Authentication** — Stateless token-based auth; tokens are verified on every protected request
- **Password Field Exclusion** — Password field uses `select: false` in Mongoose schema, never returned in API responses
- **CORS Configuration** — Strict origin whitelist with credentials support; only the configured client URL is allowed
- **Input Validation** — Server-side validation with express-validator for all auth endpoints (email format, password length, required fields)
- **Environment Validation** — Required environment variables are checked on startup; server exits if any are missing
- **API Key Proxy** — OpenWeatherMap API key is stored server-side only; client never sees or sends the key
- **Global Error Handler** — Catches Mongoose validation errors, duplicate key errors, invalid ID formats, and JWT failures with safe user-facing messages
- **Auto Session Cleanup** — Client-side interceptor clears token and user data on 401 responses

---

## Deployment

### Frontend (Netlify)

The frontend is deployed on **Netlify** with SPA redirect support.

**1.** Connect your GitHub repository to Netlify

**2.** Configure build settings:

| Setting | Value |
| --- | --- |
| Base directory | `client` |
| Build command | `npm run build` |
| Publish directory | `client/dist` |

**3.** Set environment variables in Netlify dashboard:

| Variable | Value |
| --- | --- |
| `VITE_API_URL` | `https://your-backend-url.com/api` |

> The `netlify.toml` file in the `client/` directory handles SPA routing with a `/* → /index.html` redirect rule.

### Backend (Render)

The backend can be deployed on **Render** (free tier available).

**1.** Create a new Web Service on Render and connect your GitHub repository

**2.** Configure service settings:

| Setting | Value |
| --- | --- |
| Root directory | `server` |
| Build command | `npm install` |
| Start command | `npm start` |
| Environment | `Node` |

**3.** Set environment variables in Render dashboard:

| Variable | Value |
| --- | --- |
| `PORT` | `5000` |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A strong random secret key |
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap API key |
| `CLIENT_URL` | `https://weather-mern.netlify.app` |
| `NODE_ENV` | `production` |

> Make sure `CLIENT_URL` matches your Netlify domain exactly to avoid CORS errors.

---

## How to Get an OpenWeather API Key

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Create a free account
3. Navigate to **API Keys** in your profile
4. Copy your API key and paste it into `server/.env` as `OPENWEATHER_API_KEY`

> **Note:** Free tier keys may take a few hours to activate after creation.

---

## Features in Detail

✅ Real-time weather search with OpenWeatherMap API

✅ 5-day weather forecast with daily breakdown

✅ JWT-based user authentication (register, login, logout)

✅ Favorites system with max 10 cities per user

✅ Axios interceptors for automatic token management

✅ Toast notification system for user feedback

✅ Skeleton loaders for async loading states

✅ Responsive design with Tailwind CSS v4

✅ Vite proxy for seamless local development

✅ Global error handling with user-friendly messages

🔮 Future Features:

- [ ] Hourly forecast breakdown
- [ ] Weather map integration
- [ ] Multiple language support
- [ ] Dark mode toggle
- [ ] Weather alerts and notifications
- [ ] PWA support for offline access

---

## Contributing

Contributions are welcome! Follow the steps below:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/amazing-feature`
3. **Commit** your changes: `git commit -m "feat: add amazing feature"`
4. **Push** to the branch: `git push origin feat/amazing-feature`
5. **Open** a Pull Request

### Commit Message Format

| Prefix | Description |
| --- | --- |
| `feat:` | New feature |
| `fix:` | Bug fix |
| `refactor:` | Code refactoring |
| `docs:` | Documentation changes |
| `chore:` | Maintenance and dependency updates |

---

## License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for details.

---

## Developer

**Serkan Bayraktar**

- 🌐 [serkanbayraktar.com](https://serkanbayraktar.com/)
- 🐙 [@Serkanbyx](https://github.com/Serkanbyx)
- 📧 [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

---

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) — Free weather data API
- [React](https://react.dev/) — UI library
- [Vite](https://vite.dev/) — Build tool
- [Tailwind CSS](https://tailwindcss.com/) — CSS framework
- [Express](https://expressjs.com/) — Node.js framework
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Cloud database
- [Netlify](https://www.netlify.com/) — Frontend hosting

---

## Contact

- 🐛 [Report a Bug](https://github.com/Serkanbyx/weather-mern/issues)
- 📧 [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- 🌐 [serkanbayraktar.com](https://serkanbayraktar.com/)

---

⭐ If you like this project, don't forget to give it a star!
