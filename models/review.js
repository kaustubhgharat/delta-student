const { object } = require("joi");
const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"],
    required: [true, "Rating is required"]
  },
  comment: {
    type: String,
    required: [true, "Comment is required"]
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  author:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);