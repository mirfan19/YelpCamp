const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    //  useNewUrlParser : true, //<--no longer use
    //  useCreateIndex : true, // <--no longer use
    //  useUnifiedTopology : true //<--no longer use
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connectiion error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6722ce23cbeb0eeb19926c76',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/djlqdf7lj/image/upload/v1734613975/YelpCamp/rllwnvu9fgdgkkif6jsx.png',
                  filename: 'YelpCamp/rllwnvu9fgdgkkif6jsx',
                },
                {
                  url: 'https://res.cloudinary.com/djlqdf7lj/image/upload/v1734613977/YelpCamp/ubwcchmmqcc47rjt1cnz.png',
                  filename: 'YelpCamp/ubwcchmmqcc47rjt1cnz',
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})