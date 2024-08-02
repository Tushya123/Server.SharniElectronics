const mongoose = require("mongoose");

const ServiceDetailSchema = new mongoose.Schema(
  {
    ServiceDetail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "servicegroup"
    },
    Description: {
      type: String,
    },
   
    ImageUrl: {
      type: String
    },
    ProductDetailDescription:[
      {
        ProductKey: {
          type: String,
        },
        ProductValue: {
          type: String,
        },
        
      },
        
      
    ],
    IsActive: {
      type: Boolean,
        default: ''
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("servicedetail", ServiceDetailSchema);
