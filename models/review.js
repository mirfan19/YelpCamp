const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref : 'User'
    }
});

reviewSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        const Campground = mongoose.model('Campground'); // Pastikan model Campground sudah terdaftar
        await Campground.updateMany(
            { reviews: doc._id },
            { $pull: { reviews: doc._id } }
        );
    }
});

module.exports = mongoose.model("Review", reviewSchema);