const { AppConfig } = require("../models");
const { floorValue } = require("../utils/helpers");

// In-memory cache of config values (refreshed from DB)
let configCache = {};

// Default values — used ONLY for initial seed if DB is empty
const DEFAULTS = {
  PROJECT_FREE_LIMIT: { value: "1000", description: "Total free API hits per day from WeatherAPI" },
  PROJECT_CAP_PERCENT: { value: "80", description: "Percentage of free limit we actually use (safety margin)" },
  ASSIGNABLE_PERCENT: { value: "95", description: "Percentage of project cap assignable to users" },
  DEFAULT_USER_LIMIT: { value: "10", description: "Default daily API limit for new users" },
  CACHE_TTL_SECONDS: { value: "60", description: "Cache time-to-live in seconds" },
};

/**
 * Seed default config values into DB if they don't exist
 * Called once on server startup
 */
const seedDefaults = async () => {
  for (const [key, config] of Object.entries(DEFAULTS)) {
    const existing = await AppConfig.findOne({ where: { key } });
    if (!existing) {
      await AppConfig.create({
        key,
        value: config.value,
        description: config.description,
      });
    }
  }
  // Load into memory after seeding
  await refreshCache();
};

/**
 * Load all config from DB into memory cache
 */
const refreshCache = async () => {
  const configs = await AppConfig.findAll();
  configCache = {};
  configs.forEach((c) => {
    configCache[c.key] = c.value;
  });
  return configCache;
};

/**
 * Get a config value (from memory cache)
 * Falls back to default if not in cache
 */
const get = (key) => {
  if (configCache[key] !== undefined) {
    return configCache[key];
  }
  if (DEFAULTS[key]) {
    return DEFAULTS[key].value;
  }
  return null;
};

/**
 * Get config as integer
 */
const getInt = (key) => {
  const val = get(key);
  return val ? parseInt(val, 10) : 0;
};

/**
 * Get computed quota values (always FLOOR)
 */
const getQuotaConfig = () => {
  const freeLimit = getInt("PROJECT_FREE_LIMIT");
  const capPercent = getInt("PROJECT_CAP_PERCENT");
  const assignablePercent = getInt("ASSIGNABLE_PERCENT");

  const projectCap = floorValue((freeLimit * capPercent) / 100);
  const assignablePool = floorValue((projectCap * assignablePercent) / 100);
  const reservedBuffer = projectCap - assignablePool;

  return {
    PROJECT_FREE_LIMIT: freeLimit,
    PROJECT_CAP_PERCENT: capPercent,
    ASSIGNABLE_PERCENT: assignablePercent,
    PROJECT_CAP: projectCap,
    ASSIGNABLE_POOL: assignablePool,
    RESERVED_BUFFER: reservedBuffer,
  };
};

/**
 * Update a config value in DB + refresh cache
 */
const update = async (key, value, updatedBy = null) => {
  let config = await AppConfig.findOne({ where: { key } });

  if (!config) {
    config = await AppConfig.create({
      key,
      value: String(value),
      updated_by: updatedBy,
    });
  } else {
    config.value = String(value);
    config.updated_by = updatedBy;
    await config.save();
  }

  // Refresh in-memory cache
  await refreshCache();
  return config;
};

/**
 * Get all config values for admin dashboard
 */
const getAll = async () => {
  const configs = await AppConfig.findAll({
    attributes: ["key", "value", "description", "updated_at"],
    order: [["key", "ASC"]],
  });

  const quota = getQuotaConfig();

  return {
    configs,
    computed: quota,
  };
};

module.exports = {
  seedDefaults,
  refreshCache,
  get,
  getInt,
  getQuotaConfig,
  update,
  getAll,
};
