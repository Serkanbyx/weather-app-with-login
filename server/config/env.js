const dotenv = require("dotenv");

dotenv.config();

const requiredVars = ["PORT", "MONGODB_URI", "JWT_SECRET", "OPENWEATHER_API_KEY", "CLIENT_URL"];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

module.exports = {
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
  clientUrl: process.env.CLIENT_URL,
  nodeEnv: process.env.NODE_ENV || "development",
};
