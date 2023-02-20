// Requiring the Joi Validation Schema
const { campgroundSchema, reviewSchema } = require("./schema")

// Requiring our Custom express error class for throwing errors
const ExpressError = require("./utilities/ExpressError")

// Requiring Our Campground Model Use for New Camoground
const Campground = require("./models/campground")

// Requiring Our Review Model Use for New Camoground
const Review = require("./models/review")

// This is the authentication / isLoggedIn Middleware
module.exports.isLoggedIn = (req, res, next) => {
    // To know if logged in or not  
    if (!req.isAuthenticated()) {
        // I added to the session the original url to know the page the user wanted to be logged into  
        req.session.returnTo = req.originalUrl
        req.flash("error", "You must be Logged in first")
        return res.redirect("/login")
    }
    next();

}

// This is our campground authorization middleware - To prevent postman access / unauthorized
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // Making sure that only current logged in user can edit campg 
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

// This is our review authorization middleware - To prevent postman access / unauthorized
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    // Making sure that only current logged in user can edit campg 
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}


// Joi validation middleware for our campground forms - Check /Schema.js for main joi validation
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}

// Joi validation middleware for our review forms - Check /Schema.js for main joi validation
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}
