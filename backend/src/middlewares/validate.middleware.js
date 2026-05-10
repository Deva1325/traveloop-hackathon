const { ApiError } = require('./error.middleware');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(err => err.message);
    return next(new ApiError(400, 'Validation Error: ' + errors.join(', ')));
  }
  next();
};

module.exports = { validate };
