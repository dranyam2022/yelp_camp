const express = require("express");
const Campground = require("../models/campground");
const Review = require("../models/review");
const router = express.Router();
const wrapAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const validateCampground = require("../validators/validateCampground");
const validateReview = require("../validators/validateReview");

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    if (!campgrounds) {
      throw new ExpressError((message = "Page not found"), 404);
    } else {
      res.render("campgrounds/index", { campgrounds });
    }
  })
);

router.post(
  "/",
  validateCampground,
  wrapAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.put(
  "/:id",
  validateCampground,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.get("/:id", async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    res.render("campgrounds/show", { campground });
  } catch (error) {
    next(new ExpressError("Something went wrong", 400));
  }
});

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      return res.status(404).send("Campground not found");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.post(
  "/:id/reviews",
  validateReview,
  wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
