const express = require("express")
const router = express.Router()

// Requiring Our Campground Model Use for New Camoground
const Campground = require("../models/campground")

// Requiring // Error handling function - For unforseen issues - try and catch
const wrapAsync = require("../utilities/wrapAsync")


// Requiring Authentication, authorization & Joi Middleware for my routes
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware")

// Requiring campgrounds controllers 
const campgrounds = require("../controllers/campgrounds")

// Requiring and executing multer used for image uploads 
const multer = require("multer")

// Requiring our cloudinary storage - where we will store uploads from form
const { storage } = require("../cloudinary")

const upload = multer({ storage })

//  Campground routes 
router.route("/")
    // Displaying all Campgrounds on a single oage
    .get(wrapAsync(campgrounds.index))
    // When the form for creating a new campground is triggered, it passes through this route
    .post(isLoggedIn, upload.array("image"), validateCampground, wrapAsync(campgrounds.createCampground))

// Creating a new Campground and rendering a form page
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route("/:id")
    // Details page of a campground based on individual ID
    .get(wrapAsync(campgrounds.showCampgrounds))
    // The Edited form passes through this route and redirects to the show or details page
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, wrapAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground))

// // Displaying all Campgrounds on a single oage
// router.get("/", wrapAsync(campgrounds.index));

// // When the form for creating a new campground is triggered, it passes through this route
// router.post("/", validateCampground, isLoggedIn, wrapAsync(campgrounds.createCampground));

// // Details page of a campground based on individual ID
// router.get("/:id", wrapAsync(campgrounds.showCampgrounds));

// Editing a Campground and rendering a form with prepoulated data of the campground
router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));

// // The Edited form passes through this route and redirects to the show or details page
// router.put("/:id", validateCampground, isLoggedIn, isAuthor, wrapAsync(campgrounds.updateCampground));

// // This is the route to delete a Campground
// router.delete("/:id", isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground));

module.exports = router;

