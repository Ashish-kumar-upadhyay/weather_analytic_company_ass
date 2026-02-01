const Joi = require("joi");
const { sendError, sendSuccess } = require("../utils/responseHandler");
const { STATUS_CODE } = require("../constants/application_constant");

const updateSettingsSchema = Joi.object({
  unit_pref: Joi.string().valid("celsius", "fahrenheit").optional(),
  name: Joi.string().min(2).max(100).optional(),
}).min(1);

/**
 * GET /api/settings — Get user preferences
 */
const getSettings = async (req, res, next) => {
  try {
    const settings = {
      unit_pref: req.user.unit_pref,
      name: req.user.name,
      email: req.user.email,
      avatar_url: req.user.avatar_url,
    };

    return sendSuccess(res, STATUS_CODE.SUCCESS, 5001, { settings });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/settings — Update user preferences
 */
const updateSettings = async (req, res, next) => {
  try {
    const { error, value } = updateSettingsSchema.validate(req.body);
    if (error) {
      return sendError(res, STATUS_CODE.BAD_REQUEST, "2000");
    }

    const user = req.user;

    if (value.unit_pref) user.unit_pref = value.unit_pref;
    if (value.name) user.name = value.name;

    await user.save();

    const settings = {
      unit_pref: user.unit_pref,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
    };

    return sendSuccess(res, STATUS_CODE.SUCCESS, 5011, { settings });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
