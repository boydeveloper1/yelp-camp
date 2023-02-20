const express = require("express")
const router = express.Router();
// Requiring User Model
const User = require("../models/user")
// Requiring passport for user authentication
const passport = require("passport");

// Requiring // Error handling function - For unforseen issues - try and catch
const wrapAsync = require("../utilities/wrapAsync")

const users = require("../controllers/users")

// All users routes 

router.route("/register")
    // Serving a register form
    .get(users.renderRegister)
    // The registered form passes through this route
    .post(wrapAsync(users.register));

// // Serving a register form
// router.get("/register", users.renderRegister);

// // The registered form passes through this route
// router.post("/register", wrapAsync(users.register));

router.route("/login")
    .get(users.renderLogin)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login", keepSessionInfo: true }), users.login);

// // Serving a login form
// router.get("/login", users.renderLogin);

// // The login form passes through this route
// // "local" is for basic local login, there can be google, twitter, e.t.c
// router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login", keepSessionInfo: true }), users.login);

// Route to Logout 
router.get("/logout", users.logout)

module.exports = router;