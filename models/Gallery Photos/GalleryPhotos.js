const mongoose = require("mongoose");
const GalleryPhotoSchema = new mongoose.Schema(
  {
    Category: {
      type: mongoose.Schema.Types.ObjectId,
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