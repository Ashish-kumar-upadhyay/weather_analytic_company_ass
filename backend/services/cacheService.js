const NodeCache = require("node-cache");

// Default TTL — will be overridden once appConfig loads from DB
let CACHE_TTL = 60;

const cache = new NodeCache({
  stdTTL: CACHE_TTL,
  checkperiod: CACHE_TTL * 2,
});

/**
 * Update TTL from DB config (called after appConfig seeds)
 */
const updateTTL = (ttl) => {
  CACHE_TTL = ttl;
};

const get = (key) => {
  return cache.get(key);
};

const set = (key, value, ttl) => {
  return cache.set(key, value, ttl || CACHE_TTL);
};

const del = (key) => {
  return cache.del(key);
};

const flush = () => {
  return cache.flushAll();
};

const getStats = () => {
  return cache.getStats();
};

module.exports = {
  get,
  set,
  del,
  flush,
  getStats,
  updateTTL,
};
