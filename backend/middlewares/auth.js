const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/constants");
const { User } = require("../models");
const { sendError } = require("../utils/responseHandler");
const { STATUS_CODE } = require("../constants/application_constant");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, STATUS_CODE.UNAUTHORIZED, 2054);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return sendError(res, STATUS_CODE.UNAUTHORIZED, 2055);
    }

    if (!user.is_active) {
      return sendError(res, STATUS_CODE.FORBIDDEN, 2056);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, STATUS_CODE.UNAUTHORIZED, 2013);
    }
    if (error.name === "JsonWebTokenError") {
      return sendError(res, STATUS_CODE.UNAUTHORIZED, 2012);
    }
    return sendError(res, STATUS_CODE.INTERNAL_SERVER_ERROR, 2057);
  }
};

module.exports = auth;
