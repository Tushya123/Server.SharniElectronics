const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const CmsSchema = new mongoose.Schema(
  {
    // Title: {
    //   type: String,
    //   // required: true,
    // },
    // Description: {
    //   type: String,
    //  // required: true,
    // },
 
    CommitmentImage: {
      type: String,
    },
    
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Commitment", CmsSchema);
