// Requiring our Mongoose and model
const mongoose = require("mongoose");
const cities = require("./cities")

// ../models/campground to back off because we are running from seeds/index.js
const Campground = require("../models/campground")

// We imported the "seedhelpers" arrays into this fileLoader, by destructuring
const { places, descriptors } = require("./seedHelpers");

// Connecting To our Mongoose database with different options embedded
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Displaying Errors just like try and catch
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "))
db.once("open", () => {
    console.log("Database Connected")
})

// This is used to get a random item from the array based on the length of the array
const sample = array => array[Math.floor(Math.random() * array.length)];

// This is used to delete everything in our database - The first thing to do !
const seedDB = async () => {
    await Campground.deleteMany({});
    // // Adding a fresh test data into the database
    // const c = new Campground({ title: "purple field" })
    // await c.save();

    // Looping over 50 times to produce 50 random campgrounds
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        // Creating a random price for each campground
        const price = Math.floor(Math.random() * 20) + 10;
        // The creation of the campground
        const camp = new Campground({
            // Your User ID
            author: "63c94d2334625054a5857826",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            // check line 24-25 for the loop of the places and descriptors
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "consectetur esse sunt neque in cum dicta sint? Et aperiam animi rerum dolorem officia, earum saepe nihil laudantium, quo doloremque, voluptatum voluptatem iusto vero non eos autem ratione? Provident, odio eius? Modi minus, est amet, quo nihil nam doloribus totam eos distinctio corporis eum! Accusantium reiciendis ut veniam dolores quae tenetur. Iusto facere corrupti placeat illum at reprehenderit nulla iste, voluptatem cum reiciendis totam fugiat officiis quaerat. Deserunt voluptate quis, nemo quia similique dolore adipisci quas quo, quaerat veritatis asperiores! Enim, assumenda?",
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/drgd17o91/image/upload/v1674656160/YelpCamp/Camoground_Image_qx8w8n.png',
                    filename: 'YelpCamp/iubymyzvel4cueo90iwl'
                },
                {
                    url: 'https://res.cloudinary.com/drgd17o91/image/upload/v1674656728/YelpCamp/Campground_2_yzwszk.jpg',
                    filename: 'YelpCamp/gecm11qheugioxlzc6sr'
                },
            ]
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})