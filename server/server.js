const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { port, clientUrl } = require("./config/env");
const connectDB = require("./config/db");

connectDB();

const app = express();
const PORT = port || 5000;

app.use(helmet());
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts, please try again later." },
});

app.use("/api/weather", apiLimiter);
app.use("/api/auth", authLimiter);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/weather", require("./routes/weatherRoutes"));
app.use("/api/favorites", require("./routes/favoriteRoutes"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
