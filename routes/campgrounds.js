const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

/* requiring controllers */
const {
  index,
  renderNewForm,
  createNewCampground,
  editCampground,
  showOneCampground,
  renderEditForm,
  deleteCampground,
} = require("../controllers/campgrounds");

const {
  isLoggedIn,
  isAuthor,
  validateCampgroundSchema,
} = require("../middleware");

router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    upload.array("campground[image]"),
    validateCampgroundSchema,
    wrapAsync(createNewCampground)
  );

router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(showOneCampground)
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("campground[image]"),
    validateCampgroundSchema,
    wrapAsync(editCampground)
  )
  .delete(isLoggedIn, isAuthor, wrapAsync(deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(renderEditForm));

module.exports = router;
