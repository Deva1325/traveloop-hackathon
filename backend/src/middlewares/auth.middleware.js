const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { ApiError } = require('./error.middleware');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return next(new ApiError(401, 'Authentication required'));

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next(new ApiError(401, 'Invalid token'));
  }
};

module.exports = { authenticate };
