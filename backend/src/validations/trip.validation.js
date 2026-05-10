const Joi = require('joi');

const createTripSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  coverImage: Joi.string().uri().allow(null, ''),
  budget: Joi.number().min(0).allow(null),
  isPublic: Joi.boolean().optional(),
  destinations: Joi.array().items(Joi.any()).optional()
});

module.exports = { createTripSchema };
