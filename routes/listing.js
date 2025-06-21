const express = require('express');
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose"); // <-- must be there
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js"); // ✅
const listingControl = require("../controllers/listing.js")


const multer = require('multer');
const { storage } = require('../cloudConfig'); // your multer-storage-cloudinary setup
const upload = multer({ storage });

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};


router.route("/")
  .get(listingControl.index)
  .post(isLoggedIn, upload.single('image'), listingControl.createListing);


router.route("/:id")
  .get(wrapAsync(listingControl.showListing))
  .put(isLoggedIn, isOwner, upload.single('image'),validateListing, wrapAsync(listingControl.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingControl.deleteListing));


module.exports = router;