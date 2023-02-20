// Requiring Our Campground Model Use for New Camoground
const Campground = require("../models/campground")

// Requiring cloudinary to be used fpr deleting images 
const { cloudinary } = require("../cloudinary");

// Requiring our mapbox and configuring with our token
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })



// Displaying all Campgrounds on a single page
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", { campgrounds })
}

// Creating a new Campground and rendering a form page
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

// When the form for creating a new campground is triggered, it passes through this route
module.exports.createCampground = async (req, res, next) => {
    // Inserting the location from the form field into maoBox 
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    // inputting the map / geometry data to our camoground 
    campground.geometry = geoData.body.features[0].geometry;
    // mapping over req.files to give us an array of objects (url and filename) of uploaded images 
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // Associating the current campground author with an id that will populate in show page
    // This sets the campground to a specific user 
    campground.author = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash("success", "Successfully Made a new Campground")
    res.redirect(`/campgrounds/${campground._id}`)
}

// Details page of a campground based on individual ID
module.exports.showCampgrounds = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            // populating the authors of all reviews 
            path: "author"
        }
    }).populate("author")
    if (!campground) {
        req.flash("error", "Cannot find that campground")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", { campground });
}

// Editing a Campground and rendering a form with prepoulated data of the campground
module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash("error", "Cannot find that campground")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { campground })
}

// The Edited form passes through this route and redirects to the show or details page
module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body)
    // The first argument will find the id and then the second will implement the form we filled
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true })
    //    This gives an array of object but we can't just push it onto our alreadu=y existing array of objects 
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    //    we need to spread the arran and push just the object 
    campground.images.push(...imgs);
    await campground.save();
    // Deleting images 
    if (req.body.deleteImages) {
        // Deleting from cloudinary 
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename)
        }
        // Deleting from mongo 
        // if there are images in the array, update the campg and pull from the images array the filename gotten in req.body.deleteImages 
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(campground)
    }
    req.flash("success", "Successfully Updated Campground")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted Campground")
    res.redirect("/campgrounds")
}