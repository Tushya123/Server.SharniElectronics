const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const GetInTouch = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    subject: {
      type: String,
    },
    message: {
        type: String,
    },
    phoneno:{
        type:String,
    } ,IsActive:{
        type:Boolean,
        default:true
    }
   
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("GetInTouch", GetInTouch);
