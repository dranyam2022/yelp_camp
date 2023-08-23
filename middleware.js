const Campground = require("./models/campground");
const Review = require("./models/review");
const Joi = require("joi");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Please login first!");
    res.redirect("/login");
  }
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReviewSchema = (req, res, next) => {
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

module.exports.validateCampgroundSchema = (req, res, next) => {
  const imageSchema = Joi.object({
    url: Joi.string().required(),
    filename: Joi.string().required(),
  });

  const campgroundSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required().min(0),
      image: Joi.array().items(imageSchema),
      location: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array(),
  });

  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
