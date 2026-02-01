const { sendError } = require("../utils/responseHandler");
const { STATUS_CODE } = require("../constants/application_constant");

const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  // Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    const messages = err.errors.map((e) => e.message).join(", ");
    return sendError(res, STATUS_CODE.BAD_REQUEST, 2001, { error: messages });
  }

  // Sequelize unique constraint error
  if (err.name === "SequelizeUniqueConstraintError") {
    return sendError(res, STATUS_CODE.CONFLICT, 2058);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return sendError(res, STATUS_CODE.UNAUTHORIZED, 2012);
  }

  if (err.name === "TokenExpiredError") {
    return sendError(res, STATUS_CODE.UNAUTHORIZED, 2013);
  }

  // Default
  return sendError(
    res,
    err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR,
    2059,
    { error: err.message }
  );
};

module.exports = errorHandler;
