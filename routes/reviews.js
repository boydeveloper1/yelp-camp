const express = require("express")
const router = express.Router({ mergeParams: true })

// Requiring Review Model
const Review = require("../models/review");

// Requiring Our Campground Model
const Campground = require("../models/campground")

// Requiring our Custom express error class for throwing errors
const ExpressError = require("../utilities/ExpressError")

// Requiring // Error handling function - For unforseen issues - try and catch
const wrapAsync = require("../utilities/wrapAsync")

// Requiring the Joi Validation Schema
const { reviewSchema } = require("../schema")

// Requiring reviews controllers 
const reviews = require("../controllers/reviews")

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware")

// Review routes
// This is the route which a new review from the form is passed through
router.post("/", isLoggedIn, validateReview, wrapAsync(reviews.createReview))

// Deleting a review from a camopground
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview))

module.exports = router;