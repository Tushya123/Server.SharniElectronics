const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const AssignProductSchema = new mongoose.Schema(
  {
    SupplierName: {
        type: mongoose.Schema.Types.ObjectId ,
        ref: "supplierdetails",
    },
    ProductDetail: {
      type:  [mongoose.Schema.Types.ObjectId] ,
      ref: "productdetails",
     
    },
 
    isActive: {
      type: Boolean,
      default: true,
      
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssignProduct", AssignProductSchema);
