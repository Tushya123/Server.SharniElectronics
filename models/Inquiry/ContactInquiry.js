const mongoose=require("mongoose");

const ContactInquirySchema=new mongoose.Schema({
    ContactPerson:{
        type:String
    },
    Mobile:{
        type:Number
    },
    Email:{
        type:String
    },
    Country:{
        type:String
    },
    Remark:{
        type:String
    },
    IsActive:{
        type:Boolean,
        default:true
    }
},{ timestamps: true }

);
module.exports=mongoose.model("ContactInquiry",ContactInquirySchema);