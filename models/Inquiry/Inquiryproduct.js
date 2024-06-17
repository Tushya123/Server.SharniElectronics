const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema({
    ProductDetail: 
        {type:  mongoose.Schema.Types.ObjectId ,
        ref: "productdetail"},
    ProductDetailLabel:{ 
    type:String}, 
    SupplierName: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SupplierDetail' }],
        default: []
    },
    // Grade:{
    //     type:String,
    // },
    Quantity:{
        type:String
    },  
    Group:{
        type:String,
    },
    BasePrice:{
        type:Number
    },
    RFQ_Status2:{
        type: Boolean,
        default: false
    }
    , RFQ_Date:{
        type:String,
    },
    IsActive: {
        type: Boolean,
        default: true
    } 
},
{ timestamps: true }
);

module.exports = mongoose.model("InquiryProduct", InquirySchema);
