const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema({
    Name:{
        type:String,

    },
    email:{
        type:String,
        // unique:true,
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ServiceTypeSchema"
    },
   
    mobile_no:{
        type:String,
        // unique:true
    },
    IsActive:{
        type:Boolean,
        default:true
    },
   
},
{timestamps:true}
);

module.exports = mongoose.model("Inquiry",InquirySchema);