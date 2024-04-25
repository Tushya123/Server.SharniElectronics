const mongoose = require("mongoose");
const OtherProductSchema = new mongoose.Schema(
  {
    ProductName: {
      type: String
    },
   
    Detail: {
        type: String,
    },
   
    IsActive: {
        type: Boolean,
        default:true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("otherproduct", OtherProductSchema);