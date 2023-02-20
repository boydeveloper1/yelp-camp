// Requiring User Model
const User = require("../models/user")

// Serving a register form
module.exports.renderRegister = (req, res) => {
    res.render("users/register")
}

// The registered form passes through this route
module.exports.register = async (req, res, next) => {
    try {
        // Destructuring the information gotten from req.body
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        // User.register from pasport uses the pw adds salts and hashes it
        const registerdUser = await User.register(user, password);
        req.login(registerdUser, err => {
            if (err) return next(err)
            req.flash("success", "Welcome to YelpCamp")
            res.redirect("/campgrounds")
        })
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("register")
    }
}

// Serving a login form
module.exports.renderLogin = (req, res) => {
    res.render("users/login")
}

// The login form passes through this route
// "local" is for basic local login, there can be google, twitter, e.t.c
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!")
    // I added req.session.returnTo to the session a user is at or the default login route
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

// Route to Logout 
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
    })
    req.flash("success", "Successfully Logged Out!")
    res.redirect("/campgrounds")
}