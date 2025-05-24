// validators/productValidator.js
const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  price: Joi.number().positive().precision(2).required(),
  description: Joi.string().max(500).optional(),
  stock: Joi.number().integer().min(0).default(1)
});

exports.validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};