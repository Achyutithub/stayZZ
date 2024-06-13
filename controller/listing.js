const Listing = require("../models/listing.js")
const flash = require("connect-flash");
const {listingSchema} = require("../schema.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const review = require("../models/review.js");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = (async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listing/index.ejs", {allListing});
})

module.exports.searchListings = async (req, res) => {
    const { country } = req.params;
    //const country = cont.toLowerCase();
    const allListing = await Listing.find({ country: new RegExp(country, 'i') });
    res.render("./listing/index.ejs", { allListing });
}
module.exports.listingsByCategory = async (req, res) => {
    const { category } = req.params;
    const allListing = await Listing.find({ category });
    res.render("./listing/index.ejs", { allListing });
}


module.exports.renderNewForm = (req, res) => {
    res.render("./listing/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({path: "reviews", populate: {
            path: "author",
        }})
        .populate("owner").populate();
    if(!listing) {
        req.flash("error", "Listing Does Not Exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listing/show.ejs", { listing });
}


module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()

    let urlN = req.file.path;
    let fileN = req.file.filename;

    let {listing} = req.body;
    console.log(listing.price);
    console.log(listing.category);
    let result = listingSchema.validate(req.body);
    console.log("hi")

    if(result.error) {
        throw new ExpressError(400, result.error);
    }

    const newListing = new Listing({
    title: listing.title,
    description: listing.description,
    image: {
        filename: fileN,
        url: urlN,
    },
    price: listing.price,
    country: listing.country,
    location: listing.location,
    owner: req.user._id,
    geometry: response.body.features[0].geometry,
    category: listing.category
});
console.log(newListing);
let save = await newListing.save();
console.log(save);
req.flash("success", "New Listing Created!");
res.redirect("/listings");
}

module.exports.editForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing Does Not Exist");
        res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/w_250");
    res.render("./listing/edit.ejs",  { listing, originalUrl });
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let {listing} = req.body;
    let l = await Listing.findById(id);
    console.log(l.image.url);
    let link = l.image.url;

    const updateData = {
        title: listing.title,
        description: listing.description,
        price: listing.price,
        country: listing.country,
        location: listing.location
    };

    if (typeof req.file !== "undefined") {
        let urlN = req.file.path;
        let fileN = req.file.filename;
        updateData.image = { filename: fileN, url: urlN };
    } else {
        updateData.image = {
            filename: "listingimage",
            url: link,
        };
    }
    await Listing.findByIdAndUpdate(id, updateData);
    req.flash("success", "Listing Updated");
    res.redirect("/listings/"+id);
}

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}