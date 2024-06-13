const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/review.js");

//Reviews
//Post review
router.post("/", isLoggedIn, wrapAsync(reviewController.createReview));

//delete review
router.delete("/:reviewId", isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;