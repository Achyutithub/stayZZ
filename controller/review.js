const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req, res) => {
    let {id} = req.params;
    let result = reviewSchema.validate(req.body);
        //console.log(result);
        if(result.error) {
            throw new ExpressError(400, result.error);
        }
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("new Review saved");
    listing.reviews.push(newReview);
    req.flash("success", "New Review Added");
    res.redirect("/listings/"+id);
}

module.exports.deleteReview = async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect("/listings/"+id);
}