const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/catchAsync");
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

/* GET - campground/index route */
router
  .route("/")
  .get(wrapAsync(index))
  .post(isLoggedIn, validateCampgroundSchema, wrapAsync(createNewCampground));

router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(showOneCampground)
  .put(
    isLoggedIn,
    isAuthor,
    validateCampgroundSchema,
    wrapAsync(editCampground)
  )
  .delete(isLoggedIn, isAuthor, wrapAsync(deleteCampground));

/* GET - edit a campground route */
router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(renderEditForm));



module.exports = router;
