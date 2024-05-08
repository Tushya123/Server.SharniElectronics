const mongoose = require("mongoose");
const ProductGroupSchema = new mongoose.Schema(
  {
    ProductGroup: {
      type: String,
    },
    ImageUrl:{
      type:String
    },
    IsActive: {
        type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("productgroup", ProductGroupSchema);