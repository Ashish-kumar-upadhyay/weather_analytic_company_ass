const weatherService = require("../services/weatherService");
const cacheService = require("../services/cacheService");
const quotaService = require("../services/quotaService");
const { sendError, sendSuccess } = require("../utils/responseHandler");
const { STATUS_CODE } = require("../constants/application_constant");
const Joi = require("joi");

const citySchema = Joi.object({
  city: Joi.string().min(2).max(100).required(),
});

const forecastSchema = Joi.object({
  city: Joi.string().min(2).max(100).required(),
  days: Joi.number().integer().min(1).max(3).default(3),
});

const searchSchema = Joi.object({
  q: Joi.string().min(2).max(100).required(),
});

/**
 * GET /api/weather/current?city=Delhi
 */
const getCurrentWeather = async (req, res, next) => {
  try {
    const { error, value } = citySchema.validate(req.query);
    if (error) {
      return sendError(res, STATUS_CODE.BAD_REQUEST, "2000");
    }

    const { city } = value;

    // Check cache first
    const cacheKey = `current:${city.toLowerCase()}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return sendSuccess(res, STATUS_CODE.SUCCESS, 5056, {
        ...cached,
        cached: true,
      });
    }

    // Fetch from API
    const data = await weatherService.getCurrentWeather(city);

    // Record hit after successful API call
    await quotaService.recordHit(req.user.id, "current");

    // Cache the response
    cacheService.set(cacheKey, data);

    return sendSuccess(res, STATUS_CODE.SUCCESS, 5014, {
      ...data,
      cached: false,
    });
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return sendError(res, STATUS_CODE.NOT_FOUND, 2052);
    }
    next(err);
  }
};

/**
 * GET /api/weather/forecast?city=Delhi&days=3
 */
const getForecast = async (req, res, next) => {
  try {
    const { error, value } = forecastSchema.validate(req.query);
    if (error) {
      return sendError(res, STATUS_CODE.BAD_REQUEST, "2000");
    }

    const { city, days } = value;

    // Check cache
    const cacheKey = `forecast:${city.toLowerCase()}:${days}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return sendSuccess(res, STATUS_CODE.SUCCESS, 5057, {
        ...cached,
        cached: true,
      });
    }

    // Fetch from API
    const data = await weatherService.getForecast(city, days);

    // Record hit
    await quotaService.recordHit(req.user.id, "forecast");

    // Cache
    cacheService.set(cacheKey, data);

    return sendSuccess(res, STATUS_CODE.SUCCESS, 5015, {
      ...data,
      cached: false,
    });
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return sendError(res, STATUS_CODE.NOT_FOUND, 2052);
    }
    next(err);
  }
};

/**
 * GET /api/weather/search?q=Del
 */
const searchCity = async (req, res, next) => {
  try {
    const { error, value } = searchSchema.validate(req.query);
    if (error) {
      return sendError(res, STATUS_CODE.BAD_REQUEST, "2000");
    }

    const { q } = value;

    // Check cache (cache search results for a shorter time)
    const cacheKey = `search:${q.toLowerCase()}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return sendSuccess(res, STATUS_CODE.SUCCESS, 5058, {
        cities: cached,
        cached: true,
      });
    }

    const cities = await weatherService.searchCity(q);

    // Record hit
    await quotaService.recordHit(req.user.id, "search");

    // Cache for 5 minutes (search results don't change often)
    cacheService.set(cacheKey, cities, 300);

    return sendSuccess(res, STATUS_CODE.SUCCESS, 5016, {
      cities,
      cached: false,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/weather/quota — Get current user's quota status
 */
const getQuotaStatus = async (req, res, next) => {
  try {
    const stats = await quotaService.getUserUsageStats(req.user.id);
    return sendSuccess(res, STATUS_CODE.SUCCESS, 5017, stats);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCurrentWeather,
  getForecast,
  searchCity,
  getQuotaStatus,
};
