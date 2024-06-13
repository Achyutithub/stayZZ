const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },

    category: {
        type: String,
        enum: ["Trending", "Rooms", "cities", "Mountains", "Castles", "pools", "Farms", "Snow", "Hotel", "Beach"],
    }
});


listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({id: {$in: listing.reviews}});
    }
});
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;