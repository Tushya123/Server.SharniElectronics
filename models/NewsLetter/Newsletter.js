const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const NewsletterSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      // required: true,
    },
    Description: {
      type: String,
     // required: true,
    },
 
    NewsletterImage: {
      type: String,
    },

    NewsDate:{
      type:String
    },
    
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("newsletter", NewsletterSchema);
