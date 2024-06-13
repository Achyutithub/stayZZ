const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing : joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.string().allow("", null),
        country: joi.string().required(),
        category: joi.string().valid("Trending", "Rooms", "cities", "Mountains", "Castles", "pools", "Farms", "Snow", "Hotel", "Beach").required()
    }).required()
})

module.exports.reviewSchema = joi.object({
    review : joi.object({
        rating: joi.number().required(),
        comment: joi.string().required(),
    }).required()
})