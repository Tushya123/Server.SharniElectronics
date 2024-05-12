const mongoose = require("mongoose");
const BannerSchema = new mongoose.Schema(
  {
    Description: {
      type: String,
    },
    Title:{
        type:String
    },
    bannerImage:{
        type:String
    },
    IsActive: {
        type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", BannerSchema);