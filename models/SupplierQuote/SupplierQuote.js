const mongoose = require("mongoose");

const SupplierQuoteSchema = new mongoose.Schema(
  {
   ProductDetail:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"productdetail"
   },

   Quantity:{
    type:Number
   },
   SupplierName:[
    { type: mongoose.Schema.Types.ObjectId, ref: 'SupplierDetail' }
]
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupplierQuote", SupplierQuoteSchema);
