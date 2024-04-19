const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const Subscribe = new mongoose.Schema(
  {
    
    email: {
      type: String,
    },
    IsActive:{
      type:Boolean,
      default:true
    }
   
   
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscribe", Subscribe);
