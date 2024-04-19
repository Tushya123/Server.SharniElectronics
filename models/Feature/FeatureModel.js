const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const Feature = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description:{
        type:String,
    },
   
    bannerImage:{
      type:String,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feature", Feature);
