const { sendError } = require("../utils/responseHandler");
const { STATUS_CODE, ERROR_TYPES } = require("../constants/application_constant");
const quotaService = require("../services/quotaService");

/**
 * Middleware to check user + project quota before allowing weather API calls
 * Uses 24-hour sliding window
 */
const apiQuota = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Check project-wide limit first
    const projectCheck = await quotaService.checkProjectQuota();
    if (!projectCheck.allowed) {
      return sendError(
        res,
        STATUS_CODE.TOO_MANY_REQUESTS,
        "2016", // Project quota exceeded error code
        {},
        null
      );
    }

    // 2. Check user's individual limit
    const userCheck = await quotaService.checkUserQuota(userId);
    if (!userCheck.allowed) {
      // Check if user has no quota assigned
      if (userCheck.limit === 0) {
        return sendError(
          res,
          STATUS_CODE.TOO_MANY_REQUESTS,
          "2014", // No API quota assigned error code
          {},
          null
        );
      }

      // User quota exceeded
      return sendError(
        res,
        STATUS_CODE.TOO_MANY_REQUESTS,
        "2015", // User quota exceeded error code
        {
          used: userCheck.used,
          nextAvailableMessage: userCheck.next_available_message,
        },
        null
      );
    }

    // Store endpoint info for recording hit after successful API call
    req.quotaEndpoint = req.route ? req.route.path : req.originalUrl;
    next();
  } catch (error) {
    console.error("Quota check error:", error.message);
    // Don't block requests if quota check fails — fail open
    next();
  }
};

module.exports = apiQuota;
