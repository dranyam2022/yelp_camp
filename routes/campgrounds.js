const express = require("express");
const Campground = require("../models/campground");
const router = express.Router();
const wrapAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const validateCampground = require("../validators/validateCampground");
const { isLoggedIn } = require("../middleware");

/* GET - campground/index route */
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

/* POST - creating a new campground route */
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  wrapAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Created new campground successfully!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

/* PUT - editing a campground route */
router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

/* GET - creating a campground */
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

/* GET - showing one campground route */
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

/* GET - edit a campground route */
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      return res.status(404).send("Campground not found");
    }
    res.render("campgrounds/edit", { campground });
  })
);

/* DELETE - deleting a campground route */
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
