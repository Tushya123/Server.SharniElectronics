const mongoose = require("mongoose");
const GalleryPhotoSchema = new mongoose.Schema(
  {
    Category: {
      type: String,
      ref:"Category"
    },
    imageURL: {
        type: String,
    },
    IsActive: {
        type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GalleryPhoto", GalleryPhotoSchema);