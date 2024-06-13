const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//search route
router.get('/search/:country',isLoggedIn, wrapAsync(listingController.searchListings));

router.get('/category/:category', isLoggedIn, wrapAsync(listingController.listingsByCategory));

//index route
router.get("/", wrapAsync(listingController.index));

// new route
router.get("/new", isLoggedIn,  wrapAsync(listingController.renderNewForm));
router.post("/", isLoggedIn, upload.single("listing[image]") ,wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync (listingController.editForm));
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync (listingController.editListing));

//delete route
router.delete("/:id/delete", isLoggedIn, wrapAsync (listingController.deleteListing));

//show route
router.get("/:id",wrapAsync(listingController.showListing));




module.exports = router;
