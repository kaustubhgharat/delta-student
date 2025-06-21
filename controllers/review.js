const Review = require("../models/review")
const Listing = require("../models/listing");


module.exports.createReview =async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const review = new Review({ rating, comment });

    review.author = req.user._id;
    await review.save();

    listing.reviews.push(review._id);
    await listing.save();

    res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    console.error("Review add error:", err);
    res.status(500).json({ error: "Failed to add review" });
  }
}

module.exports.deleteReview = async (req, res) => {

  const { id: listingId, reviewId } = req.params;
  try {
    // Remove the review reference from the listing
    await Listing.findByIdAndUpdate(listingId, {
      $pull: { reviews: reviewId },
    });

    // Delete the review document itself
    await Review.findByIdAndDelete(reviewId);

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ error: "Failed to delete review" });
  }
}