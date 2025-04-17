const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listings.js");
const{isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
// index route
.get(wrapAsync(listingController.index))
//Create Route
// using wrap_async function, we handle error.
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));
//.post(upload.single('listing[image]'),(req,res)=>{
//    res.send(req.file);
//})



//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm );




router.route("/:id")
//Show route
.get(wrapAsync( listingController.showListing))
//Update Route
.put(isLoggedIn,upload.single('listing[image]'), isOwner,validateListing, wrapAsync(listingController.updateListing))
//Delete Route
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));





module.exports = router;
