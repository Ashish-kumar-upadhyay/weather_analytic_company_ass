const { Op } = require("sequelize");
const { ApiHit, UserLimit } = require("../models");
const appConfigService = require("./appConfigService");
const { SLIDING_WINDOW_HOURS } = require("../config/constants");
const { get24HoursAgo, floorValue } = require("../utils/helpers");

/**
 * Check if the project-wide quota is within limits
 */
const checkProjectQuota = async () => {
  const since = get24HoursAgo();
  const { PROJECT_CAP } = appConfigService.getQuotaConfig();

  const used = await ApiHit.count({
    where: {
      hit_at: { [Op.gte]: since },
    },
  });

  return {
    allowed: used < PROJECT_CAP,
    used,
    limit: PROJECT_CAP,
  };
};

/**
 * Check if a specific user's quota is within limits (24hr sliding window)
 */
const checkUserQuota = async (userId) => {
  const since = get24HoursAgo();

  // Get user's limit
  const userLimit = await UserLimit.findOne({ where: { user_id: userId } });
  const limit = userLimit ? userLimit.daily_limit : 0;

  // If limit is 0, user has no quota assigned
  if (limit === 0) {
    return {
      allowed: false,
      used: 0,
      limit: 0,
      next_available_at: null,
      next_available_message: null,
      hits_expiring_soon: 0,
    };
  }

  // Count hits in last 24 hours
  const used = await ApiHit.count({
    where: {
      user_id: userId,
      hit_at: { [Op.gte]: since },
    },
  });

  if (used < limit) {
    return {
      allowed: true,
      used,
      limit,
      remaining: limit - used,
    };
  }

  // User is over limit — find when next hit expires
  const oldestHit = await ApiHit.findOne({
    where: {
      user_id: userId,
      hit_at: { [Op.gte]: since },
    },
    order: [["hit_at", "ASC"]],
  });

  const nextAvailable = oldestHit
    ? new Date(oldestHit.hit_at.getTime() + SLIDING_WINDOW_HOURS * 60 * 60 * 1000)
    : null;

  // Count hits expiring in next 1 hour
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
  const expiringWindow = new Date(oneHourFromNow.getTime() - SLIDING_WINDOW_HOURS * 60 * 60 * 1000);
  const hitsExpiringSoon = await ApiHit.count({
    where: {
      user_id: userId,
      hit_at: {
        [Op.gte]: since,
        [Op.lte]: expiringWindow,
      },
    },
  });

  // Calculate time remaining - dynamic message based on actual time
  let nextAvailableMessage = "";
  if (nextAvailable) {
    const diffMs = nextAvailable.getTime() - Date.now();
    const totalSeconds = Math.ceil(diffMs / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Build dynamic time message
    if (hours > 0) {
      nextAvailableMessage = `Next available in ${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      nextAvailableMessage = `Next available in ${minutes}m ${seconds}s`;
    } else {
      nextAvailableMessage = `Next available in ${seconds}s`;
    }
  }

  return {
    allowed: false,
    used,
    limit,
    next_available_at: nextAvailable ? nextAvailable.toISOString() : null,
    next_available_message: nextAvailableMessage,
    hits_expiring_soon: hitsExpiringSoon,
  };
};

/**
 * Record a hit after successful weather API call
 */
const recordHit = async (userId, endpoint) => {
  return await ApiHit.create({
    user_id: userId,
    endpoint,
    hit_at: new Date(),
  });
};

/**
 * Get assignable pool remaining
 * Reads ASSIGNABLE_POOL from DB config
 */
const getAssignableRemaining = async () => {
  const { ASSIGNABLE_POOL } = appConfigService.getQuotaConfig();
  const totalAssigned = await UserLimit.sum("daily_limit");
  const remaining = ASSIGNABLE_POOL - (totalAssigned || 0);

  return {
    assignable_pool: ASSIGNABLE_POOL,
    total_assigned: totalAssigned || 0,
    remaining: Math.max(0, remaining),
  };
};

/**
 * Calculate max limit that can be assigned to a user
 */
const getMaxAssignable = async (userId) => {
  const pool = await getAssignableRemaining();

  // If editing existing user, add back their current limit
  const currentLimit = await UserLimit.findOne({ where: { user_id: userId } });
  const currentValue = currentLimit ? currentLimit.daily_limit : 0;

  return pool.remaining + currentValue;
};

/**
 * Get user's usage stats for the current sliding window
 */
const getUserUsageStats = async (userId) => {
  const since = get24HoursAgo();

  const userLimit = await UserLimit.findOne({ where: { user_id: userId } });
  const limit = userLimit ? userLimit.daily_limit : 0;

  const used = await ApiHit.count({
    where: {
      user_id: userId,
      hit_at: { [Op.gte]: since },
    },
  });

  return {
    used,
    limit,
    remaining: Math.max(0, limit - used),
    percentage_used: limit > 0 ? floorValue((used / limit) * 100) : 0,
  };
};

/**
 * Get project-wide usage stats
 */
const getProjectUsageStats = async () => {
  const since = get24HoursAgo();
  const { PROJECT_CAP, ASSIGNABLE_POOL } = appConfigService.getQuotaConfig();

  const totalHits = await ApiHit.count({
    where: { hit_at: { [Op.gte]: since } },
  });

  const pool = await getAssignableRemaining();

  return {
    project_cap: PROJECT_CAP,
    assignable_pool: ASSIGNABLE_POOL,
    total_assigned: pool.total_assigned,
    remaining_assignable: pool.remaining,
    total_hits_24hr: totalHits,
    remaining_hits: PROJECT_CAP - totalHits,
    percentage_used: PROJECT_CAP > 0 ? floorValue((totalHits / PROJECT_CAP) * 100) : 0,
  };
};

/**
 * Cleanup hits older than 24 hours
 */
const cleanupOldHits = async () => {
  const since = get24HoursAgo();
  const deleted = await ApiHit.destroy({
    where: {
      hit_at: { [Op.lt]: since },
    },
  });
  return deleted;
};

module.exports = {
  checkProjectQuota,
  checkUserQuota,
  recordHit,
  getAssignableRemaining,
  getMaxAssignable,
  getUserUsageStats,
  getProjectUsageStats,
  cleanupOldHits,
};
