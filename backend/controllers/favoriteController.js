const Joi = require("joi");
const { Favorite } = require("../models");
const { sendError, sendSuccess } = require("../utils/responseHandler");
const { STATUS_CODE } = require("../constants/application_constant");

const addFavoriteSchema = Joi.object({
  city_name: Joi.string().min(2).max(100).required(),
  country: Joi.string().max(100).optional(),
  lat: Joi.number().required(),
  lon: Joi.number().required(),
});

/**
 * GET /api/favorites — List user's favorites
 */
const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "ASC"]],
    });

    return sendSuccess(res, STATUS_CODE.SUCCESS, 5001, { favorites });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/favorites — Add a favorite city
 */
const addFavorite = async (req, res, next) => {
  try {
    const { error, value } = addFavoriteSchema.validate(req.body);
    if (error) {
      return sendError(res, STATUS_CODE.BAD_REQUEST, "2000");
    }

    const { city_name, country, lat, lon } = value;

    // Check duplicate
    const existing = await Favorite.findOne({
      where: { user_id: req.user.id, city_name },
    });

    if (existing) {
      return sendError(res, STATUS_CODE.CONFLICT, 2053);
    }

    const favorite = await Favorite.create({
      user_id: req.user.id,
      city_name,
      country: country || null,
      lat,
      lon,
    });

    return sendSuccess(res, STATUS_CODE.CREATED, 5012, { favorite });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/favorites/:id — Remove a favorite
 */
const removeFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;

    const favorite = await Favorite.findOne({
      where: { id, user_id: req.user.id },
    });

    if (!favorite) {
      return sendError(res, STATUS_CODE.NOT_FOUND, 2006);
    }

    await favorite.destroy();

    return sendSuccess(res, STATUS_CODE.SUCCESS, 5013);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
