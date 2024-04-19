const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const CmsSchema = new mongoose.Schema(
  {
    cmsname: {
      type: String,
      // required: true,
    },
    cmsDesc: {
      type: String,
     // required: true,
    },
    cmsThumnailDesc: {
      type: String,
   
      //required: true,
    },
    cmsImage: {
      type: String,
    },
    
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CmsSchema", CmsSchema);
