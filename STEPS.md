# Weather App with Login — Build Steps

> Each step below is a self-contained prompt. Follow them in order from Step 1 to Step 23.
> Tech Stack: React, React Router, TailwindCSS, Node.js, Express, MongoDB, Mongoose, JWT, Axios, OpenWeatherMap API.
> **Note:** Steps 1–20 use local MongoDB for development. Cloud services (MongoDB Atlas, Render, Netlify) are configured in Steps 21–23 at the very end.

### Security Notice — Public GitHub Repository
> This project will be published as a **public** repository. Follow these rules at ALL times:
> - **NEVER** commit `.env` files. They contain secrets (API keys, DB passwords, JWT secrets).
> - `.gitignore` files are created in **Step 1** before any code. Verify they exist before every commit.
> - Use `.env.example` files (with placeholder values) so others can set up the project.
> - Git operations (commit, push) are handled **manually via GitHub Desktop** — no git commands in these steps.
> - API keys must **only** exist in `.env` (local) or platform dashboards (Render/Netlify). Never hardcode them.
> - Before each commit via GitHub Desktop, visually check that no `.env` file appears in the staged changes.

---

## Step 1 — Project Scaffolding, Folder Structure & .gitignore (Security First)

**FIRST — Create `.gitignore` files before writing any code.**

Create root `.gitignore`:
```
node_modules/
.env
.env.*
!.env.example
.DS_Store
Thumbs.db
```

Create `server/.gitignore`:
```
node_modules/
.env
.env.*
!.env.example
```

Create `client/.gitignore`:
```
node_modules/
dist/
.env
.env.*
!.env.example
```

> **CRITICAL:** These `.gitignore` files MUST exist before any `.env` file is created. This prevents secrets from ever being tracked by git.

**Then create the monorepo folder structure** with `server/` and `client/` directories:

```
s4.4_Weather App With Login/
├── .gitignore                  ← root (created FIRST)
├── server/
│   ├── .gitignore              ← server-level
│   ├── .env                    ← secrets (NEVER committed)
│   ├── .env.example            ← safe template (committed)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── client/
│   ├── .gitignore              ← client-level
│   ├── .env.example            ← safe template (committed)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── STEPS.md
└── README.md
```

- Initialize `server/package.json` with: express, mongoose, dotenv, cors, bcryptjs, jsonwebtoken, axios, express-validator.
- Initialize `client/` with Vite + React template. Install: axios, react-router-dom, tailwindcss, @tailwindcss/vite.
- Configure TailwindCSS v4 with Vite plugin.
- Add dev scripts to both `package.json` files.

---

## Step 2 — Environment Variables & Configuration

Create `server/.env` with local development values (this file is **gitignored** — never committed):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/weatherapp
JWT_SECRET=change_this_to_a_random_secret_string
OPENWEATHER_API_KEY=your_actual_api_key_here
```

Create `server/.env.example` (this file **IS committed** — safe template for other developers):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/weatherapp
JWT_SECRET=
OPENWEATHER_API_KEY=
```

Create `client/.env.example` (committed — safe template):

```
VITE_API_URL=
```

> **Note:** Using local MongoDB during development. MongoDB Atlas connection string will be configured in Step 21.
> **Security:** `.env` contains real secrets and is gitignored. `.env.example` contains only empty placeholders and is safe to commit.

Create `server/config/db.js`:
- Export an async function `connectDB` that connects to MongoDB using `mongoose.connect(process.env.MONGODB_URI)`.
- Log success message on connection, exit process on failure.

Create `server/config/env.js`:
- Validate that all required env variables exist on startup.
- Export them as a clean config object: `{ port, mongoUri, jwtSecret, openWeatherApiKey }`.

---

## Step 3 — Express Server Entry Point

Create `server/server.js`:
- Import and call `dotenv.config()` at the very top.
- Import `connectDB` and call it.
- Set up Express app with `express.json()` middleware.
- Set up CORS middleware — allow `http://localhost:5173` in development.
- Mount route placeholders: `/api/auth`, `/api/weather`, `/api/favorites`.
- Add a global error handler middleware at the bottom.
- Listen on `process.env.PORT || 5000`.
- Make sure the server starts and logs "Server running on port XXXX".

---

## Step 4 — User Model (Mongoose)

Create `server/models/User.js`:
- Define schema with fields:
  - `name`: String, required, trim, minlength 2, maxlength 50.
  - `email`: String, required, unique, trim, lowercase, validate with regex.
  - `password`: String, required, minlength 6, select: false (hide by default from queries).
  - `favorites`: [String], default empty array — stores city names.
  - `timestamps`: true.
- Pre-save hook: hash password with bcryptjs (salt rounds 12) only if password is modified.
- Instance method `comparePassword(candidatePassword)`: compare using bcrypt.compare.
- Export the model.

---

## Step 5 — JWT Utility & Auth Middleware

Create `server/config/jwt.js`:
- `generateToken(userId)`: returns a signed JWT with payload `{ id: userId }`, expires in `7d`.
- `verifyToken(token)`: verifies and returns decoded payload.

Create `server/middleware/auth.js`:
- Export `protect` middleware:
  - Extract token from `Authorization: Bearer <token>` header.
  - If no token, return 401 `{ message: "Not authorized, no token" }`.
  - Verify token, find user by decoded id (exclude password).
  - If user not found, return 401 `{ message: "Not authorized, user not found" }`.
  - Attach user to `req.user` and call `next()`.
  - Wrap in try-catch: on error return 401 `{ message: "Not authorized, token invalid" }`.

---

## Step 6 — Auth Controller & Routes

Create `server/controllers/authController.js` with three handlers:

**register:**
- Validate input with express-validator: name required, email valid, password min 6 chars.
- Check if user already exists by email → 400 error if exists.
- Create user, generate token, return `{ user: { id, name, email, favorites }, token }`.

**login:**
- Validate input: email valid, password required.
- Find user by email with `.select("+password")`.
- If no user or password doesn't match → 401 `{ message: "Invalid email or password" }`.
- Generate token, return `{ user: { id, name, email, favorites }, token }`.

**getMe:**
- Protected route — return `req.user` (already attached by auth middleware).

Create `server/routes/authRoutes.js`:
- POST `/register` → register
- POST `/login` → login
- GET `/me` → protect middleware → getMe

Mount in `server.js` as `/api/auth`.

---

## Step 7 — Validation Middleware

Create `server/middleware/validate.js`:
- Export a `validate` function that takes an array of express-validator checks.
- Returns a middleware that runs all validations, then checks `validationResult(req)`.
- If errors exist, return 400 with `{ errors: [{ field, message }] }`.
- If no errors, call `next()`.

Refactor auth routes to use this validation middleware:
- Register: name not empty, email is email, password min 6.
- Login: email is email, password not empty.

---

## Step 8 — Weather Controller & Routes (Proxy Pattern)

Create `server/controllers/weatherController.js`:

**getWeather:**
- Extract `city` from `req.params.city`.
- Make GET request to `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=en`.
- On success, return the OpenWeather response data to the client.
- On error:
  - If OpenWeather returns `cod: "404"` → return 404 `{ message: "City not found" }`.
  - Otherwise → return 500 `{ message: "Failed to fetch weather data" }`.

**getForecast:**
- Extract `city` from `req.params.city`.
- Make GET request to `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=en`.
- On success, return the forecast data.
- Handle errors same as above.

Create `server/routes/weatherRoutes.js`:
- GET `/:city` → getWeather
- GET `/forecast/:city` → getForecast

Mount in `server.js` as `/api/weather`.

**Important:** API key NEVER leaves the backend. The frontend only calls `/api/weather/:city`.

---

## Step 9 — Favorites Controller & Routes

Create `server/controllers/favoritesController.js`:

**getFavorites:**
- Protected route. Return `req.user.favorites`.

**addFavorite:**
- Protected route. Extract `city` from `req.body.city`.
- Normalize city name: trim, capitalize first letter of each word.
- Check if city already exists in favorites → 400 `{ message: "City already in favorites" }`.
- Limit favorites to 10 max → 400 `{ message: "Maximum 10 favorites allowed" }`.
- Push city to user's favorites array, save, return updated favorites.

**removeFavorite:**
- Protected route. Extract `city` from `req.params.city`.
- Filter out the city from favorites array (case-insensitive).
- If city wasn't in favorites → 404 `{ message: "City not found in favorites" }`.
- Save user, return updated favorites.

Create `server/routes/favoritesRoutes.js`:
- GET `/` → protect → getFavorites
- POST `/add` → protect → addFavorite
- DELETE `/:city` → protect → removeFavorite

Mount in `server.js` as `/api/favorites`.

---

## Step 10 — Global Error Handler & API Response Helpers

Create `server/middleware/errorHandler.js`:
- Export a global error handler `(err, req, res, next)`.
- Log the error stack in development.
- Handle Mongoose validation errors → 400 with field-specific messages.
- Handle Mongoose duplicate key errors (code 11000) → 400 `{ message: "Email already exists" }`.
- Handle Mongoose cast errors → 400 `{ message: "Invalid ID format" }`.
- Handle JWT errors → 401.
- Default: 500 `{ message: "Internal server error" }`.

Update `server.js` to use this error handler as the last middleware.

---

## Step 11 — Test Backend with Manual Requests

Before building the frontend, verify all backend endpoints work:

1. Start MongoDB connection and Express server.
2. Test `POST /api/auth/register` — create a user.
3. Test `POST /api/auth/login` — login and get token.
4. Test `GET /api/auth/me` — with Bearer token.
5. Test `GET /api/weather/London` — should return weather data.
6. Test `GET /api/weather/forecast/London` — should return 5-day forecast.
7. Test `POST /api/favorites/add` — add a city with auth token.
8. Test `GET /api/favorites` — get favorites list.
9. Test `DELETE /api/favorites/London` — remove a city.
10. Test `GET /api/weather/invalidcityname123` — should return 404 "City not found".

Fix any issues before proceeding to frontend.

---

## Step 12 — Client Setup: Vite, TailwindCSS, Routing

Set up the React client:

- Configure `vite.config.js` with proxy: `/api` → `http://localhost:5000`.
- Set up TailwindCSS v4 with Vite plugin in `client/src/index.css` using `@import "tailwindcss"`.
- Create `client/src/App.jsx` with React Router v6:
  - `/` → HomePage
  - `/login` → LoginPage
  - `/register` → RegisterPage
- Create placeholder page components for each route.
- Verify the app runs with `npm run dev` and routing works.

---

## Step 13 — Auth Context & API Service Layer

Create `client/src/services/api.js`:
- Create an Axios instance with `baseURL: "/api"`.
- Add request interceptor: attach `Authorization: Bearer <token>` header if token exists in localStorage.
- Add response interceptor: on 401 error, clear localStorage and redirect to `/login`.
- Export specific functions:
  - `authAPI.register(data)`, `authAPI.login(data)`, `authAPI.getMe()`.
  - `weatherAPI.getWeather(city)`, `weatherAPI.getForecast(city)`.
  - `favoritesAPI.getFavorites()`, `favoritesAPI.addFavorite(city)`, `favoritesAPI.removeFavorite(city)`.

Create `client/src/context/AuthContext.jsx`:
- Provide: `user`, `token`, `isAuthenticated`, `isLoading`.
- Actions: `login(email, password)`, `register(name, email, password)`, `logout()`.
- On mount, check localStorage for token → call `authAPI.getMe()` to verify & hydrate user.
- Store token in localStorage on login/register, remove on logout.
- Export `useAuth` custom hook.

Wrap `<App />` with `<AuthProvider>` in `main.jsx`.

---

## Step 14 — Register & Login Pages

Create `client/src/pages/RegisterPage.jsx`:
- Form with fields: Name, Email, Password, Confirm Password.
- Client-side validation: all fields required, email format, password min 6 chars, passwords match.
- On submit, call `register()` from AuthContext.
- Show loading state on button during request.
- Show error messages from API (inline, styled in red).
- On success, redirect to `/`.
- Link to login page: "Already have an account? Login".

Create `client/src/pages/LoginPage.jsx`:
- Form with fields: Email, Password.
- Client-side validation: email format, password required.
- On submit, call `login()` from AuthContext.
- Show loading state and error messages.
- On success, redirect to `/`.
- Link to register page: "Don't have an account? Register".

**Styling:** Use TailwindCSS — centered card layout, clean form inputs with focus states, gradient or solid background.

---

## Step 15 — Layout & Navigation Components

Create `client/src/components/layout/Header.jsx`:
- App logo/title: "WeatherNow" or similar.
- Navigation links: Home.
- If authenticated: show user name and Logout button.
- If not authenticated: show Login and Register links.
- Responsive: hamburger menu on mobile.
- Sticky top, with subtle backdrop blur / shadow.

Create `client/src/components/layout/Layout.jsx`:
- Wraps pages with Header + main content area.
- Use in App.jsx Route structure.

Create `client/src/components/common/ProtectedRoute.jsx`:
- If not authenticated and not loading, redirect to `/login`.
- If loading, show a spinner.
- If authenticated, render children/outlet.

---

## Step 16 — Home Page: Search & Weather Display

Create `client/src/pages/HomePage.jsx`:
- **Search Section:**
  - Text input for city name with search icon.
  - Search button and/or submit on Enter key.
  - Loading spinner while fetching.
  - Error message display: "City not found" etc.

- **State Management:**
  - `searchCity` (input value), `weatherData` (current weather), `forecastData` (5-day), `isLoading`, `error`.

- **On Search:**
  - Call `weatherAPI.getWeather(city)`.
  - Call `weatherAPI.getForecast(city)`.
  - Update state with results.
  - Clear previous errors on new search.

- **Layout:** Search bar at top center, WeatherCard below, ForecastSection below that.

---

## Step 17 — WeatherCard Component

Create `client/src/components/weather/WeatherCard.jsx`:

Props: `data` (OpenWeather API response object), `onAddFavorite`, `isFavorite`, `isAuthenticated`.

Display:
- City name and country code (e.g., "London, GB").
- Weather icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`.
- Weather description (e.g., "scattered clouds") — capitalize first letter.
- Temperature: `data.main.temp` rounded to nearest integer, show °C.
- Feels like: `data.main.feels_like` °C.
- Humidity: `data.main.humidity` %.
- Wind speed: `data.wind.speed` m/s.
- Pressure: `data.main.pressure` hPa.
- Visibility: `data.visibility / 1000` km.

**"Add to Favorites" button:**
- Only visible if `isAuthenticated` is true.
- If `isFavorite` is true, show "Remove from Favorites" (different style).
- On click, call `onAddFavorite` or `onRemoveFavorite`.

**Styling:** Card with rounded corners, subtle shadow, weather-themed gradient background that changes based on weather condition (sunny → warm colors, rainy → cool colors, etc.).

---

## Step 18 — Forecast Section Component

Create `client/src/components/weather/ForecastSection.jsx`:

Props: `data` (OpenWeather forecast API response).

**Data Processing:**
- OpenWeather `/forecast` returns data every 3 hours for 5 days (40 items).
- Group by day: extract one entry per day (use the 12:00:00 entry or the first entry of each day).
- Result: array of 5 day-summaries.

**Display each day as a mini card:**
- Day name (Mon, Tue, Wed...).
- Weather icon (small).
- High/Low temperature for that day.
- Weather description.

**Layout:** Horizontal scrollable row of cards, or a responsive grid.

**Styling:** Smaller cards than WeatherCard, consistent design language.

---

## Step 19 — Favorites Sidebar / Panel

Create `client/src/components/favorites/FavoritesSidebar.jsx`:

**Behavior:**
- Only visible when user is authenticated.
- Fetch favorites on mount using `favoritesAPI.getFavorites()`.
- Display as a list of city name buttons/chips.
- Clicking a city triggers weather search for that city (same as typing in search).
- Each city has a small "X" / remove button.
- Remove button calls `favoritesAPI.removeFavorite(city)` and updates local state.

**Integration with HomePage:**
- Pass a callback `onCitySelect(cityName)` that triggers the weather search.
- Pass `favorites` state to WeatherCard to determine if current city is a favorite.

**Layout Options:**
- Desktop: sidebar on the right side of the page.
- Mobile: collapsible panel or horizontal scrollable chips above the search bar.

**Empty State:** Show a message like "No favorites yet. Search for a city and add it!"

---

## Step 20 — Final Polish, Error Handling & README

**Error Handling:**
- Network errors: show "Unable to connect. Please check your internet connection."
- API errors: parse and display meaningful messages.
- 404 from weather: "City not found. Please check the spelling."
- Loading states: skeleton loaders or spinners for all async operations.

**UX Polish:**
- Add page transitions (subtle fade-in).
- Add toast notifications for: "City added to favorites", "City removed from favorites", "Login successful".
- Responsive design: test on mobile, tablet, desktop.
- Add keyboard accessibility: Enter to search, focus management.
- Dark/light theme based on system preference (optional).

**README.md:**
- Project title and description.
- Screenshots / GIF demo.
- Tech stack list with icons.
- Features list.
- Prerequisites: Node.js, MongoDB, OpenWeather API key.
- Installation steps (clone, install deps, set env vars, run).
- How to get an OpenWeather API key (link to openweathermap.org/api).
- API endpoint documentation.
- Folder structure overview.
- License.

> **Note:** Deployment instructions will be added to README after completing Steps 21–23.

**Security Checklist (verify before every GitHub Desktop commit):**
- [ ] No `.env` file is staged — only `.env.example` files with empty values.
- [ ] No API key, JWT secret, or database password is hardcoded anywhere in the source code.
- [ ] `server/.gitignore`, `client/.gitignore`, and root `.gitignore` all exist and include `.env`.
- [ ] OpenWeather API key is only used in `server/controllers/weatherController.js` via `process.env`.
- [ ] JWT secret is only used in `server/config/jwt.js` via `process.env`.
- [ ] MongoDB URI is only used in `server/config/db.js` via `process.env`.

**Functional Checklist:**
- [ ] All CRUD operations for favorites work.
- [ ] Auth flow is complete (register, login, logout, persist session).
- [ ] Weather search works and displays current + forecast.
- [ ] Proxy pattern hides API key — key never appears in frontend code or network requests from client.
- [ ] Error states are handled gracefully.
- [ ] Responsive on all screen sizes.
- [ ] No console errors or warnings.
- [ ] Code is clean: no unused imports, no commented-out code, consistent formatting.

---

## Step 21 — MongoDB Atlas Setup & Connection

**Create MongoDB Atlas Cluster:**
- Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account (or log in).
- Create a new project named "WeatherApp".
- Create a free shared cluster (M0 Sandbox).
- Create a database user with username and a strong password.
- In Network Access, add `0.0.0.0/0` to allow connections from anywhere (required for Render deployment).
- In Database → Connect → "Connect your application", copy the connection string.

**Update server/.env:**
- Replace `MONGODB_URI=mongodb://localhost:27017/weatherapp` with the Atlas connection string.
- Replace `<password>` placeholder in the Atlas URI with your actual database user password.
- Add `/weatherapp` as the database name at the end of the URI (before query params).

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/weatherapp?retryWrites=true&w=majority
```

**Verify Connection:**
- Restart the server and confirm it connects to Atlas successfully.
- Test register/login and favorites endpoints to make sure data persists in Atlas.

---

## Step 22 — Backend Deployment to Render

**Prepare the server for production:**
- Update `server.js` CORS config to accept the Netlify frontend URL (will be updated after Netlify deploy).
- Temporarily set CORS to allow all origins or use an environment variable:
  ```js
  origin: process.env.CLIENT_URL || "http://localhost:5173"
  ```
- Make sure `server/package.json` has a `"start": "node server.js"` script.
- Verify `server/.gitignore` exists and includes `node_modules/`, `.env`, `.env.*`, `!.env.example`.

> **Security Check:** Before proceeding, make sure your repo on GitHub does NOT contain any `.env` file with real secrets. Only `.env.example` files (with empty values) should be visible.

**Deploy to Render:**
- Go to [render.com](https://render.com) and create a free account (or log in).
- Click "New" → "Web Service".
- Connect your GitHub repository (should already be pushed via GitHub Desktop).
- Set root directory to `server`.
- Set build command: `npm install`.
- Set start command: `node server.js`.
- Add environment variables in Render dashboard:
  - `PORT` → leave empty (Render assigns automatically).
  - `MONGODB_URI` → your Atlas connection string.
  - `JWT_SECRET` → a strong random secret.
  - `OPENWEATHER_API_KEY` → your OpenWeather API key.
  - `CLIENT_URL` → will be updated after Netlify deploy.
- Deploy and verify the backend is running by visiting `https://your-app.onrender.com/api/weather/London`.
- Copy the Render URL — you'll need it for the frontend.

---

## Step 23 — Frontend Deployment to Netlify

**Prepare the client for production:**
- Update `client/src/services/api.js`:
  - Change Axios `baseURL` to use an environment variable:
    ```js
    baseURL: import.meta.env.VITE_API_URL || "/api"
    ```
- Do **NOT** create a `client/.env.production` file with the real Render URL — that would expose your backend URL in the repo.
- Instead, set `VITE_API_URL` directly in the **Netlify dashboard** as an environment variable (see deploy steps below).
- Create `client/netlify.toml` for SPA routing:
  ```toml
  [build]
    command = "npm run build"
    publish = "dist"

  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```

**Deploy to Netlify:**
- Go to [netlify.com](https://www.netlify.com) and create a free account (or log in).
- Click "Add new site" → "Import an existing project".
- Connect your GitHub repository (should already be pushed via GitHub Desktop).
- Set base directory to `client`.
- Set build command: `npm run build`.
- Set publish directory: `client/dist`.
- In **Site settings → Environment variables**, add: `VITE_API_URL` → `https://your-app.onrender.com/api`.
  > **Security:** Set this in the Netlify dashboard ONLY, not in any committed file.
- Deploy and wait for the build to complete.
- Copy the Netlify URL (e.g., `https://your-app.netlify.app`).

**Update Render CORS:**
- Go back to Render dashboard → your web service → Environment.
- Set `CLIENT_URL` to your Netlify URL (e.g., `https://your-app.netlify.app`).
- Redeploy the backend on Render.

**Final Verification:**
- Open the Netlify URL in the browser.
- Test: register, login, search weather, add/remove favorites, logout.
- Verify no CORS errors in the browser console.
- Test on mobile device.

**Final Security Audit:**
- Go to your GitHub repository page and manually browse through all files.
- Confirm NO `.env` file with real values is visible anywhere in the repo.
- Confirm only `.env.example` files (with empty placeholder values) are present.
- Check the git commit history — if a `.env` with secrets was ever committed by mistake, the secret is exposed even if deleted later. In that case, rotate all affected keys/passwords immediately.

**Update README.md:**
- Add a "Live Demo" section with the Netlify URL.
- Add deployment instructions for both Render and Netlify.
- Add a "Security" or "Environment Variables" section explaining that users must create their own `.env` from `.env.example`.
- Add badges for live status if desired.

---

**End of Steps — Start building from Step 1!**
