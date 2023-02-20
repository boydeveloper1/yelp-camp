// Setting up dotenv environmental variables in development mode
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Basic Express setup
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path")
const port = 3000

// Requiring our Custom express error class for throwing errors
const ExpressError = require("./utilities/ExpressError")

// Templating used for ejs to render generic boilerplate across view temp.
const engine = require("ejs-mate")

// Requiring joi - data validator - This is mainly required in the Schema folder
const Joi = require("joi");

// \Beng able to use PUT, PATCH AND DELETE instead of POST 
const methodOverride = require("method-override")

// Requiring Campgrounds routes
const campgroundsRoutes = require("./routes/campgrounds")

// Requiring Reviews routes
const reviewsRoutes = require("./routes/reviews");

// Requiring User routes
const usersRoutes = require("./routes/users");

// Mongo Injection prehibitor 
const mongoSanitize = require('express-mongo-sanitize');

// Protecting our http headers using helmet 
const helmet = require("helmet");

// Requiring Our User Model - Passport uses this
const User = require("./models/user")

// Requiring express-session
const session = require("express-session");

// Requiring - Storing our session in Mongo and not memory store again - for production 
const MongoStore = require('connect-mongo')

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp"
// process.env.DB_URL
// Connecting To our Mongoose database with different options embedded
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// Displaying Errors just like try and catch
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "))
db.once("open", () => {
    console.log("Database Connected")
})

// Requiring passport for user authentication
const passport = require("passport");
const LocalStrategy = require("passport-local")

// Requiring flash for flash messages- dependent on session
const flash = require("connect-flash");

const secret = process.env.SECRET || "thisshouldbeabettersecret";

// This creates a session store in Mongo 
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    // session autosave every 24 hours 
    touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
    console.log("Session Store Error!!", e)
})

// Session Middleware - Need to use flash and Auth
const sessionConfig = {
    store,
    name: "configur",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true, 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

// Executing Flash
app.use(flash());

// Executing passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// Other Methods
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Making sure that express connects to "views" directory and file can be accessible from any folder
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));

// // Telling Ejs to use ejsMate as the default engine for layouts
app.engine("ejs", engine)

// This will help extract req.body from the url to express
app.use(express.urlencoded({ extended: true }));

// This is used to activate a PUT DELETE AND PATCH REQUEST USING AN OVERRIDE
// INSTALLED USING NPM I METHOD - OVERRIDE
app.use(methodOverride('_method'))

// Telling Express to serve static assets from the public directory
app.use(express.static(path.join(__dirname, "public")))

// Executing Mongo santize - Mongo injection prehibitor 
app.use(mongoSanitize());

// Executing helmet which enables 11 of its middlewares 
app.use(helmet());

// Accepted urls and resources for our app. Helemet contentSecurityPolicy 
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    }),
);

// Universal Middleware that every request passes through
app.use((req, res, next) => {
    // Added currentUser globally toolbar, this well help show and hide login/register/logout
    // Depending on current User Status
    res.locals.currentUser = req.user; //storing currentUser for all temp.
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// Our Routes Usage
app.use("/campgrounds", campgroundsRoutes)
app.use("/campgrounds/:id/reviews", reviewsRoutes)
app.use("/", usersRoutes)

// Home Page Route 
app.get("/", (req, res) => {
    res.render("home")
})

// Every Wrong or Undefined path passes this route and moves to the next err handler
app.use((req, res, next) => {
    next(new ExpressError("Page Not Found, 404"))
})

// Main Custom Error Handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Error Encountered" } = err;
    res.status(status).render("error", { err })
});

const workingPort = process.env.PORT || port

// Confirmation of Express Listening to Server. End of Exporess connection
app.listen(workingPort, () => {
    console.log(`Serving at https://localhost:${workingPort}`)
})