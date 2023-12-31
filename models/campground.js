const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({ url: String, filename: String });

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_150");
});

const CampgroundSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String,
  images: [ImageSchema],
  price: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

CampgroundSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
