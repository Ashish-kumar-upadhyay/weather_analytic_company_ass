require("dotenv").config();

/**
 * HTTP Status Codes
 */
const STATUS_CODE = {
  // Success responses (2xx)
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client errors (4xx)
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  CONFLICT: 409,
  GONE: 410,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server errors (5xx)
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

/**
 * User Roles
 */
const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

/**
 * Weather API Configuration
 */
const WEATHER_API = {
  BASE_URL: process.env.WEATHER_API_BASE || "https://api.weatherapi.com/v1",
  API_KEY: process.env.WEATHER_API_KEY,
  MAX_FORECAST_DAYS: 7,
  MIN_FORECAST_DAYS: 1,
  DEFAULT_FORECAST_DAYS: 3,
};

/**
 * Quota and Rate Limiting
 */
const QUOTA = {
  SLIDING_WINDOW_HOURS: 24,
  DEFAULT_USER_LIMIT: 10,
  MIN_USER_LIMIT: 0,
  MAX_USER_LIMIT: 1000,
};

/**
 * JWT Configuration
 */
const JWT = {
  SECRET: process.env.JWT_SECRET,
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  REFRESH_EXPIRES_IN: "30d",
};

/**
 * Email Configuration
 */
const EMAIL = {
  FROM: process.env.FROM_EMAIL || "noreply@weatherdashboard.com",
  RESET_TOKEN_EXPIRY: 3600000, // 1 hour in milliseconds
};

/**
 * Cache Configuration
 */
const CACHE = {
  DEFAULT_TTL: 60, // seconds
  WEATHER_TTL: 300, // 5 minutes
  FORECAST_TTL: 600, // 10 minutes
  QUOTA_TTL: 30, // 30 seconds
};

/**
 * Pagination
 */
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

/**
 * API Endpoints (for quota tracking)
 */
const API_ENDPOINTS = {
  CURRENT_WEATHER: "current",
  FORECAST: "forecast",
  SEARCH: "search",
  HISTORY: "history",
};

/**
 * Database Table Names
 */
const TABLES = {
  USERS: "users",
  FAVORITES: "favorites",
  API_HITS: "api_hits",
  USER_LIMITS: "user_limits",
  APP_CONFIG: "app_config",
};

/**
 * Validation Constraints
 */
const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 255,
  CITY_NAME_MAX_LENGTH: 255,
};

/**
 * Environment
 */
const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5001,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5002",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
};

/**
 * Error Types (for quota service)
 */
const ERROR_TYPES = {
  USER_QUOTA_EXCEEDED: "USER_QUOTA_EXCEEDED",
  PROJECT_QUOTA_EXCEEDED: "PROJECT_QUOTA_EXCEEDED",
  NO_QUOTA_ASSIGNED: "NO_QUOTA_ASSIGNED",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR",
};

module.exports = {
  STATUS_CODE,
  ROLES,
  WEATHER_API,
  QUOTA,
  JWT,
  EMAIL,
  CACHE,
  PAGINATION,
  API_ENDPOINTS,
  TABLES,
  VALIDATION,
  ENV,
  ERROR_TYPES,
};
