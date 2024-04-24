const mongoose = require("mongoose");
const ProductDetailSchema = new mongoose.Schema(
  {
    ProductDetail: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"productgroup"
    },
    Description: {
        type: String,
    },
    // Detail: {
    //     type: String,
    // },
    // imageURL: {
    //     type: String,
    // },
    IsActive: {
        type: Boolean,
    },BP: {
        type: Boolean,
    },USP: {
        type: Boolean,
    },EP: {
        type: Boolean,
    },Other: {
        type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("productdetail", ProductDetailSchema);