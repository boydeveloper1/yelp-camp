// Requiring Our Campground Model
const Campground = require("../models/campground")

// Requiring Review Model
const Review = require("../models/review");

// This is the route which a new review from the form is passed through
module.exports.createReview = async (req, res, next) => {
    // Finding the campground with the ID and associating (pushing) it onto the campground, then saving
    const { id } = req.params;
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    // Associating a review to a user - Equating things 
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created New Review")
    // Redirecting to that campground show page
    res.redirect(`/campgrounds/${campground._id}`)
}

// Deleting a review from a camopground
module.exports.deleteReview = async (req, res, next) => {
    // We find the review and camogroundID
    const { id, reviewId } = req.params;
    // We remove the review from the reviews array of reviews in CG Model
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    // We delete the entire review
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted your review")
    res.redirect(`/campgrounds/${id}`);
}