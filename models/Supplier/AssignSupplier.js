const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const AssignProductSchema = new mongoose.Schema(
  {
    SupplierName: {
        type: mongoose.Schema.Types.ObjectId ,
        ref: "SupplierDetail",
    },
    ProductDetail: [
      {type:  mongoose.Schema.Types.ObjectId ,
        ref: "productdetail",}
     
    ],
 
    isActive: {
      type: Boolean,
      default: true,
      
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssignProduct", AssignProductSchema);
