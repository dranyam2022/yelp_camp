const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  validateReviewSchema,
  isReviewAuthor,
} = require("../middleware");

const { postReview, deleteReview } = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReviewSchema, wrapAsync(postReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(deleteReview)
);

module.exports = router;
