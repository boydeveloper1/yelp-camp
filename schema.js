const BaseJoi = require('joi');
// Escape Html Tags In inputs 
const sanitizeHtml = require('sanitize-html');

// Our Joi Campground Validation Schema
// const campgroundSchema = Joi.object({
//     campground: Joi.object({
//         title: Joi.string().required(),
//         price: Joi.number().required().min(0),
//         image: Joi.string().required(),
//         location: Joi.string().required(),
//         description: Joi.string().required()
//     }).required()
// })

// Adding Joi Extension to help us escape html - Using sanitize html pacakage as a helper 
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

// The extended joi with the escapeHTML ability 
const Joi = BaseJoi.extend(extension)

// Exporting The Joi Campground Validation Schema
// module.exports = campgroundSchema;

// or Our Joi Campground Validation Schema
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
})

// Our Joi Review Validation Schema
// const reviewSchema = Joi.object({
//     review: Joi.object({
//         rating: Joi.number().required().min(1).max(5),
//         body: Joi.string().required()
//     }).required()
// })

// // Exporting The Joi Review Validation Schema
// module.exports = reviewSchema;

// or Our Joi Review Validation Schema
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})