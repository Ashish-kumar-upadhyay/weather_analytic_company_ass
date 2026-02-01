const { sendError } = require("../utils/responseHandler");
const { STATUS_CODE } = require("../constants/application_constant");
const { ROLES } = require("../config/constants");

const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, STATUS_CODE.UNAUTHORIZED, 2060);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, STATUS_CODE.FORBIDDEN, 2011);
    }

    next();
  };
};

// Shorthand for admin-only routes
const adminOnly = roleCheck(ROLES.ADMIN);

module.exports = { roleCheck, adminOnly };
