const express = require('express');
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose"); // <-- must be there
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewControler = require("../controllers/review.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errmsg); // Consider using 400 for bad request
  } else {
    next();
  }
}

router.post('/', isLoggedIn, validateReview, reviewControler.createReview);

router.delete("/:reviewId", isReviewAuthor,reviewControler.deleteReview);


module.exports = router;