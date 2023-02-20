const mongoose = require("mongoose")
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// This automatically adds a username and password to our userSchema
// This adds some methods too to our Schema - We used these methods on app.js
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema)