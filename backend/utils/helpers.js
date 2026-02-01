/**
 * Standard API response format
 */
const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message,
  };
  if (data !== null) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

/**
 * Always floor — never round up
 * 86.90 → 86, 76.01 → 76, 56.99 → 56
 */
const floorValue = (value) => {
  return Math.floor(value);
};

/**
 * Get date 24 hours ago from now
 */
const get24HoursAgo = () => {
  const now = new Date();
  return new Date(now.getTime() - 24 * 60 * 60 * 1000);
};

/**
 * Format date for response
 */
const formatDate = (date) => {
  return new Date(date).toISOString();
};

module.exports = {
  sendResponse,
  floorValue,
  get24HoursAgo,
  formatDate,
};
