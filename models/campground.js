const mongoose = require("mongoose");
const Review = require("./review")
const { campgroundSchema } = require("../schema");

// Making moongoose.Schema in a variable because it will be used often
const Schema = mongoose.Schema;

// Extracting image into its own schema
const ImageSchema = new Schema({
    url: String,
    filename: String
});

// This is a virtual to edit the url fed to the edit page 
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_80');
});

const opts = { toJSON: { virtuals: true } };

// Creation of Campground Schema
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    // Associating the author/user model to the campground model using refernce id
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // Associating the review model to the campground model using refernce id
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts);

// Defining a virtual to be used on the map to display text on popup 
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

// Deletion Middleware to remove all reviews with a campground
CampgroundSchema.post("findOneAndDelete", async (campground) => {
    if (campground) {
        await Review.deleteMany({ _id: { $in: campground.reviews } })
    }
})

const Campground = mongoose.model("Campground", CampgroundSchema)
module.exports = Campground;