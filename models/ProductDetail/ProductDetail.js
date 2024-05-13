const mongoose = require("mongoose");
const ProductDetailSchema = new mongoose.Schema(
  {
    ProductDetail: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"productgroup"
    },
    Description: {
        type: String,
    },
    Detail:{
      type:String
    },
    ImageUrl:{
      type:String
    },
    ProductDetailDescription:[
      {type:String}
    ],

    
 
    IsActive: {
        type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("productdetail", ProductDetailSchema);