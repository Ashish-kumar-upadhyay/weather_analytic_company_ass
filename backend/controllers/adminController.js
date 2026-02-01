const Joi = require("joi");
const { User, UserLimit } = require("../models");
const quotaService = require("../services/quotaService");
const appConfigService = require("../services/appConfigService");
const { sendError, sendSuccess } = require("../utils/responseHandler");
const { STATUS_CODE } = require("../constants/application_constant");

const updateLimitSchema = Joi.object({
  daily_limit: Joi.number().integer().min(0).required(),
});

const updateConfigSchema = Joi.object({
  key: Joi.string()
    .valid(
      "PROJECT_FREE_LIMIT",
      "PROJECT_CAP_PERCENT",
      "ASSIGNABLE_PERCENT",
      "DEFAULT_USER_LIMIT",
      "CACHE_TTL_SECONDS"
    )
    .required(),
  value: Joi.number().integer().min(0).required(),
});

/**
 * GET /api/admin/users — List all users with limits and usage
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: UserLimit,
          as: "userLimit",
          attributes: ["daily_limit", "updated_at"],
        },
      ],
      attributes: ["id", "email", "name", "role", "is_active", "created_at"],
      order: [["created_at", "ASC"]],
    });

    // Get usage stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const usage = await quotaService.getUserUsageStats(user.id);
        return {
          ...user.toJSON(),
          usage,
        };
      })
    );

    return sendSuccess(res, "5001", { users: usersWithStats });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/users/:id/quota — Detailed quota for one user
 */
const getUserQuota = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [{ model: UserLimit, as: "userLimit" }],
      attributes: ["id", "email", "name", "role"],
    });

    if (!user) {
      return sendError(res, STATUS_CODE.NOT_FOUND, "2001");
    }

    const usage = await quotaService.getUserUsageStats(id);
    const maxAssignable = await quotaService.getMaxAssignable(id);

    return sendSuccess(res, "5051", {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      quota: {
        current_limit: user.userLimit ? user.userLimit.daily_limit : 0,
        max_assignable: maxAssignable,
        ...usage,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/users/:id/limit — Set user's daily limit
 */
const updateUserLimit = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error, value } = updateLimitSchema.validate(req.body);
    if (error) {
      return sendError(res, STATUS_CODE.BAD_REQUEST, "2000");
    }

    const { daily_limit } = value;

    // Check user exists
    const user = await User.findByPk(id);
    if (!user) {
      return sendError(res, STATUS_CODE.NOT_FOUND, "2001");
    }

    // Check if new limit is within assignable pool
    const maxAssignable = await quotaService.getMaxAssignable(id);
    if (daily_limit > maxAssignable) {
      return sendError(
        res,
        STATUS_CODE.BAD_REQUEST,
        "2063",
        {
          daily_limit,
          maxAssignable,
        }
      );
    }

    // Update or create user limit
    let userLimit = await UserLimit.findOne({ where: { user_id: id } });

    if (userLimit) {
      userLimit.daily_limit = daily_limit;
      userLimit.updated_by = req.user.id;
      await userLimit.save();
    } else {
      userLimit = await UserLimit.create({
        user_id: id,
        daily_limit,
        updated_by: req.user.id,
      });
    }

    return sendSuccess(res, "5018", {
      user_id: id,
      daily_limit: userLimit.daily_limit,
      updated_by: req.user.id,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/quota-stats — Project-wide quota overview
 */
const getQuotaStats = async (req, res, next) => {
  try {
    const stats = await quotaService.getProjectUsageStats();
    return sendSuccess(res, "5052", stats);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/quota-pool — Remaining assignable pool
 */
const getQuotaPool = async (req, res, next) => {
  try {
    const pool = await quotaService.getAssignableRemaining();
    return sendSuccess(res, "5053", pool);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/config — Get all app config values
 */
const getConfig = async (req, res, next) => {
  try {
    const config = await appConfigService.getAll();
    return sendSuccess(res, "5054", config);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/config — Update a config value
 */
const updateConfig = async (req, res, next) => {
  try {
    const { error, value } = updateConfigSchema.validate(req.body);
    if (error) {
      return sendError(res, STATUS_CODE.BAD_REQUEST, "2000");
    }

    const { key, value: configValue } = value;

    // Validation: percentages should be 1-100
    if (
      (key === "PROJECT_CAP_PERCENT" || key === "ASSIGNABLE_PERCENT") &&
      (configValue < 1 || configValue > 100)
    ) {
      return sendError(res, STATUS_CODE.BAD_REQUEST, "2062");
    }

    // Validation: check if reducing assignable pool would break existing user limits
    if (key === "PROJECT_FREE_LIMIT" || key === "PROJECT_CAP_PERCENT" || key === "ASSIGNABLE_PERCENT") {
      const currentConfig = appConfigService.getQuotaConfig();
      let newFreeLimit = currentConfig.PROJECT_FREE_LIMIT;
      let newCapPercent = currentConfig.PROJECT_CAP_PERCENT;
      let newAssignablePercent = currentConfig.ASSIGNABLE_PERCENT;

      if (key === "PROJECT_FREE_LIMIT") newFreeLimit = configValue;
      if (key === "PROJECT_CAP_PERCENT") newCapPercent = configValue;
      if (key === "ASSIGNABLE_PERCENT") newAssignablePercent = configValue;

      const newCap = Math.floor((newFreeLimit * newCapPercent) / 100);
      const newAssignablePool = Math.floor((newCap * newAssignablePercent) / 100);

      const totalAssigned = (await UserLimit.sum("daily_limit")) || 0;

      if (newAssignablePool < totalAssigned) {
        return sendError(
          res,
          STATUS_CODE.BAD_REQUEST,
          "2064",
          {
            totalAssigned,
            newAssignablePool,
          }
        );
      }
    }

    const updated = await appConfigService.update(key, configValue, req.user.id);
    const quota = appConfigService.getQuotaConfig();

    return sendSuccess(res, "5055", {
      updated: { key: updated.key, value: updated.value },
      computed: quota,
    }, null, { key, value: configValue });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUserQuota,
  updateUserLimit,
  getQuotaStats,
  getQuotaPool,
  getConfig,
  updateConfig,
};
