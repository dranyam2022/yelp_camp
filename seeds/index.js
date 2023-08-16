const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 10; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30);
    const camp = new Campground({
      author: "64daf31be212f0e6add34b53",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam at voluptatum eveniet doloribus, voluptatem exercitationem ullam quae, officiis perspiciatis fuga, enim sequi! Excepturi dicta doloremque inventore alias deleniti, sint enim.
      Veritatis similique rerum minima assumenda mollitia repudiandae quos saepe laudantium, itaque voluptatum corrupti iure consequuntur veniam doloribus alias soluta fugit accusantium eveniet adipisci, at dicta recusandae, nisi reiciendis! Aut, sequi?`,
      price: `$${price}.00`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
