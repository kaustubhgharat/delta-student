const Listing = require("../models/listing");
const mongoose = require("mongoose"); // <-- must be there


module.exports.index =  async (req, res) => {
  const alllistings = await Listing.find();
  res.json(alllistings);
}

module.exports.showListing =async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new ExpressError(400, "Invalid listing ID");
  }

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
        select: "username"
      }
    })
    .populate("owner");

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  res.json(listing);
}

module.exports.createListing = async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;

    // ✅ Save image if uploaded
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await newListing.save();
    res.status(201).json({
      message: "New Listing Created!!",
      listing: newListing
    });
  } catch (err) {
    console.error("Create listing error:", err);
    res.status(500).json({ error: "Failed to create listing" });
  }
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  // Update main fields
  const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  // Handle image upload
  if (req.file) {
    updatedListing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
    await updatedListing.save(); // ✅ Save changes to image
  }

  res.json(updatedListing);
};


module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  res.json({ message: 'Listing deleted' });
};
