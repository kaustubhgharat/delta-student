const Joi = require('joi');


module.exports.listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  location: Joi.string().required(),
  country: Joi.string().required()
});

module.exports.reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().min(1).required()
});