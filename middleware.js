

module.exports.isLoggedIn = (req, res, next) => {
  console.log("Session:", req.session);
  console.log("User:", req.user);
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  next();
};

const Listing = require('./models/listing'); // make sure Listing model is imported
const Review = require('./models/review');
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
      return res.status(403).json({ error: "You don't have permission to modify this listing" });
    }

    next();
  } catch (err) {
    console.error("Owner check error:", err);
    return res.status(500).json({ error: "Server error during ownership check" });
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "review not found" });
    }

    if (!res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
      return res.status(403).json({ error: "You don't have permission to modify this review" });
    }

    next();
  } catch (err) {
    console.error("review author check error:", err);
    return res.status(500).json({ error: "Server error during review ownership check" });
  }
};


