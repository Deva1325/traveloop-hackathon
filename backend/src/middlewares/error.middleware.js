const { sendError } = require('../helpers/response.helper');

class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

const notFound = (req, res, next) => {
  next(new ApiError(404, 'Not Found'));
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (!err.isOperational) {
    statusCode = 500;
    message = 'Internal Server Error';
  }
  
  res.locals.errorMessage = err.message;
  
  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  sendError(res, message, response, statusCode);
};

module.exports = {
  ApiError,
  errorHandler,
  notFound,
};
