const Campground = require('./models/campground');
const Review = require('./models/review');

// Middleware to clean up references in campground when a review is deleted
Review.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Campground.updateMany(
            { reviews: doc._id },
            { $pull: { reviews: doc._id } }
        );
    }
});
