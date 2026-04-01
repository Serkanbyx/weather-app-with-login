# WeatherNow - Full-Stack Weather Application

A modern full-stack weather application with user authentication, city favorites, and 5-day forecasts. Built with the MERN stack and styled with Tailwind CSS v4.

## Features

- **Weather Search** — Search any city worldwide for real-time weather data
- **5-Day Forecast** — View upcoming weather with daily temperature ranges
- **User Authentication** — Register, login, and persistent JWT-based sessions
- **Favorites System** — Save up to 10 favorite cities for quick access (requires login)
- **Responsive Design** — Optimized for mobile, tablet, and desktop
- **Proxy Pattern** — API keys are hidden server-side; never exposed to the client
- **Toast Notifications** — Real-time feedback for user actions
- **Skeleton Loaders** — Smooth loading states for all async operations
- **Error Handling** — User-friendly messages for network errors, invalid cities, and more

## Tech Stack

| Layer      | Technology                                                            |
| ---------- | --------------------------------------------------------------------- |
| Frontend   | React 19, Vite 8, Tailwind CSS v4, React Router v7                   |
| Backend    | Node.js, Express 5, Mongoose, JWT Authentication                     |
| Database   | MongoDB                                                              |
| API        | OpenWeatherMap (Current Weather + 5-Day Forecast)                    |
| Validation | express-validator (server), custom validation (client)                |
| HTTP       | Axios with interceptors                                              |

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local or Atlas cloud instance)
- **OpenWeather API Key** — [Get one free here](https://openweathermap.org/api)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd "s4.4_Weather App With Login"
```

### 2. Install dependencies

```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 3. Configure environment variables

**Server** (`server/.env`):

```bash
cp server/.env.example server/.env
```

Then edit `server/.env` with your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/weatherapp
JWT_SECRET=your_jwt_secret_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### 4. Run the application

Open two terminal windows:

**Terminal 1 — Server:**

```bash
cd server
npm run dev
```

**Terminal 2 — Client:**

```bash
cd client
npm run dev
```

The client runs at `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

## How to Get an OpenWeather API Key

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Create a free account
3. Navigate to **API Keys** in your profile
4. Copy your API key and paste it into `server/.env` as `OPENWEATHER_API_KEY`

> **Note:** Free tier keys may take a few hours to activate after creation.

## API Endpoints

### Authentication

| Method | Endpoint             | Description         | Auth Required |
| ------ | -------------------- | ------------------- | ------------- |
| POST   | `/api/auth/register` | Register new user   | No            |
| POST   | `/api/auth/login`    | Login user          | No            |
| GET    | `/api/auth/me`       | Get current user    | Yes           |

### Weather

| Method | Endpoint                    | Description             | Auth Required |
| ------ | --------------------------- | ----------------------- | ------------- |
| GET    | `/api/weather/:city`        | Get current weather     | No            |
| GET    | `/api/weather/forecast/:city` | Get 5-day forecast    | No            |

### Favorites

| Method | Endpoint               | Description            | Auth Required |
| ------ | ---------------------- | ---------------------- | ------------- |
| GET    | `/api/favorites`       | Get user favorites     | Yes           |
| POST   | `/api/favorites/add`   | Add city to favorites  | Yes           |
| DELETE | `/api/favorites/:city` | Remove from favorites  | Yes           |

### Health

| Method | Endpoint       | Description          | Auth Required |
| ------ | -------------- | -------------------- | ------------- |
| GET    | `/api/health`  | Server health check  | No            |

## Folder Structure

```
s4.4_Weather App With Login/
├── README.md
├── STEPS.md
├── client/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── ToastContext.jsx
│       ├── services/
│       │   └── api.js
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── LoginPage.jsx
│       │   └── RegisterPage.jsx
│       └── components/
│           ├── common/
│           │   └── ProtectedRoute.jsx
│           ├── layout/
│           │   ├── Header.jsx
│           │   └── Layout.jsx
│           ├── favorites/
│           │   └── FavoritesSidebar.jsx
│           └── weather/
│               ├── ForecastSection.jsx
│               └── WeatherCard.jsx
└── server/
    ├── .env.example
    ├── package.json
    ├── server.js
    ├── config/
    │   ├── db.js
    │   ├── env.js
    │   └── jwt.js
    ├── controllers/
    │   ├── authController.js
    │   ├── favoritesController.js
    │   └── weatherController.js
    ├── middleware/
    │   ├── auth.js
    │   ├── errorHandler.js
    │   └── validate.js
    ├── models/
    │   └── User.js
    └── routes/
        ├── authRoutes.js
        ├── favoriteRoutes.js
        └── weatherRoutes.js
```

## License

This project is licensed under the ISC License.
