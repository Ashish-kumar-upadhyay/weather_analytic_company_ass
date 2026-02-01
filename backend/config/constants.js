require("dotenv").config();

module.exports = {
  // Weather API (from env — these are secrets, not admin-editable)
  WEATHER_API_BASE: process.env.WEATHER_API_BASE || "https://api.weatherapi.com/v1",
  WEATHER_API_KEY: process.env.WEATHER_API_KEY,

  // Sliding window
  SLIDING_WINDOW_HOURS: 24,

  // Roles
  ROLES: {
    ADMIN: "admin",
    USER: "user",
  },

  // JWT (secrets — stay in env)
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};
