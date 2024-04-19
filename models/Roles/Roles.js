const mongoose = require("mongoose");
const roleschema = new mongoose.Schema(
  {
    Name: {
      type: String
    },
   
    Detail: {
        type: String,
    },
    imageURL: {
        type: String,
    },
    IsActive: {
        type: Boolean,
        default:true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("role", roleschema);