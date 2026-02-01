const rateLimit = require("express-rate-limit");
const { sendError } = require("../utils/responseHandler");
const { STATUS_CODE } = require("../constants/application_constant");

// General API rate limiter — per IP
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute per IP
  handler: (req, res) => {
    return sendError(res, STATUS_CODE.TOO_MANY_REQUESTS, 2030);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limiter — stricter for login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 min
  handler: (req, res) => {
    return sendError(res, STATUS_CODE.TOO_MANY_REQUESTS, 2061);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { generalLimiter, authLimiter };
