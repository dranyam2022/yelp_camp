const Joi = require("joi");
const ExpressError = require("../utils/ExpressError");

const validateSchema = (req, res, next) => {
  const reviewSchema = Joi.object({
    review: Joi.object({
      rating: Joi.number().required(),
      body: Joi.string().required(),
    }),
  });

  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports = validateSchema;
