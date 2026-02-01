const errorMessages = require("../constants/error_msg_list.json");
const successMessages = require("../constants/success_msg_list.json");
const { STATUS_CODE } = require("../constants/application_constant");

/**
 * Check if the provided code is valid (4 digits)
 * @param {string} code - Code to validate
 * @returns {boolean} - True if valid, otherwise false
 */
const isCodeValid = (code) => {
  return /^\d{4}/.test(String(code));
};

/**
 * Get message template based on code and replace placeholders
 * @param {boolean} isError - Indicates whether it's an error message
 * @param {string} code - The message code
 * @param {object} options - Placeholder replacements for the message
 * @returns {string} - The formatted message
 */
const getMessageUsingCode = (isError, code, options = {}) => {
  const messages = isError ? errorMessages : successMessages;
  let messageTemplate = messages[String(code)] || "";

  if (options && typeof options === "object") {
    for (const key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        const placeholder = `$${key}$`;
        messageTemplate = messageTemplate.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), options[key]);
      }
    }
  }

  return messageTemplate;
};

/**
 * Build the response object
 * @param {object} res - Express response object
 * @param {number} status - HTTP status code
 * @param {string} message - Response message
 * @param {string|null} code - Message code
 * @param {string|null} fieldName - Field name causing error (optional)
 * @param {object|null} data - Response data (optional)
 * @param {boolean} success - Success flag
 * @returns {object} - Response sent
 */
const buildResponse = (res, status, message, code = null, fieldName = null, data = null, success = true) => {
  const response = {
    success,
    message,
  };

  if (code) {
    response.code = code;
  }

  if (data !== null) {
    response.data = data;
  }

  if (fieldName) {
    response.fieldName = fieldName;
  }

  return res.status(status).json(response);
};

/**
 * Send a structured response with message code support
 *
 * Usage Examples:
 *
 * // With message code and placeholders
 * sendResponse(res, {
 *   status: 422,
 *   code: '2015',
 *   options: { used: 10, nextAvailableMessage: 'Next available in 2h 30m' }
 * });
 *
 * // With custom message (no code)
 * sendResponse(res, {
 *   status: 400,
 *   message: 'Custom error message'
 * });
 *
 * // Success with data
 * sendResponse(res, {
 *   status: 200,
 *   code: '5001',
 *   data: { user: {...} }
 * });
 *
 * // With field name for validation errors
 * sendResponse(res, {
 *   status: 422,
 *   code: '2022',
 *   options: { fieldName: 'email' },
 *   fieldName: 'email'
 * });
 *
 * @param {object} res - Express response object
 * @param {object} options - Response options
 * @param {number} options.status - HTTP status code
 * @param {string} [options.code] - Message code (4 digits)
 * @param {string} [options.message] - Custom message (used if code not provided)
 * @param {object} [options.options] - Placeholder replacements
 * @param {string} [options.fieldName] - Field name causing error
 * @param {object} [options.data] - Response data
 * @returns {object} - Express response
 */
const sendResponse = (res, { status, code, message, options = {}, fieldName = null, data = null }) => {
  const isErrorResponse = status >= 400 && status <= 599;
  const isSuccessResponse = status >= 200 && status < 300;

  let finalMessage = message;

  // If code is provided and valid, get message from constants
  if (code && isCodeValid(code)) {
    finalMessage = getMessageUsingCode(isErrorResponse, code, options);
  }

  // If no message found, use custom message or default
  if (!finalMessage) {
    finalMessage = message || (isErrorResponse ? "An error occurred" : "Operation successful");
  }

  const success = isSuccessResponse;

  return buildResponse(res, status, finalMessage, code, fieldName, data, success);
};

/**
 * Send success response (backward compatible helper)
 * @param {object} res - Express response object
 * @param {string} code - Success message code
 * @param {object} data - Response data
 * @param {object} options - Placeholder replacements
 * @returns {object} - Express response
 */
const sendSuccess = (res, code, data = null, options = {}) => {
  return sendResponse(res, {
    status: STATUS_CODE.SUCCESS,
    code,
    data,
    options,
  });
};

/**
 * Send error response (backward compatible helper)
 * @param {object} res - Express response object
 * @param {number} status - HTTP status code
 * @param {string} code - Error message code
 * @param {object} options - Placeholder replacements
 * @param {string} fieldName - Field name causing error
 * @returns {object} - Express response
 */
const sendError = (res, status, code, options = {}, fieldName = null) => {
  return sendResponse(res, {
    status,
    code,
    options,
    fieldName,
  });
};

/**
 * Send validation error response
 * @param {object} res - Express response object
 * @param {string} message - Validation error message
 * @param {string} fieldName - Field name that failed validation
 * @returns {object} - Express response
 */
const sendValidationError = (res, message, fieldName = null) => {
  return sendResponse(res, {
    status: STATUS_CODE.UNPROCESSABLE_ENTITY,
    message,
    fieldName,
  });
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendError,
  sendValidationError,
  getMessageUsingCode,
  isCodeValid,
};
