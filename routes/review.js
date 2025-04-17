const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const Review = require("../models/review.js"); 
const {validateReview, isLoggedIn, isReviewAuthor, saveRedirectUrl} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");



//Review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


//Delete Review Route
router.delete("/:reviewId", isLoggedIn, saveRedirectUrl, isReviewAuthor, wrapAsync(reviewController.destroyReview));



module.exports = router;