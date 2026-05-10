const sendSuccess = (res, message, data = {}, meta = {}, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: Object.keys(meta).length ? meta : undefined
  });
};

const sendError = (res, message, errors = [], statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

module.exports = { sendSuccess, sendError };
