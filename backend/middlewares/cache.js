const cacheService = require("../services/cacheService");
const { sendSuccess } = require("../utils/responseHandler");

/**
 * Cache middleware — checks cache before proceeding to controller
 * Caches based on the full query string (e.g., city=Delhi&days=7)
 */
const cache = (prefix) => {
  return (req, res, next) => {
    try {
      const key = `${prefix}:${JSON.stringify(req.query)}`;
      const cached = cacheService.get(key);

      if (cached) {
        return sendSuccess(res, "5061", {
          ...cached,
          cached: true,
        });
      }

      // Store cache key on request for controller to use after fetching
      req.cacheKey = key;
      next();
    } catch (error) {
      // If cache fails, just proceed without cache
      next();
    }
  };
};

module.exports = cache;
