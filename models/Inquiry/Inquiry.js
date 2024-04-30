const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema({
    ProductDetail: [
        {type:  mongoose.Schema.Types.ObjectId ,
        ref: "InquiryProduct"}
    ],
     
    ContactPerson: {
        type: String
    },
    CompanyName: {
        type: String
    },
    Reference: {
        type: String
    },
    Address: {
        type: String
    },
    Country: {
        type: String
    },
    Phone: {
        type: String
    },
    Fax: {
        type: String
    },
    Mobile: {
        type: String
    },
    Email: {
        type: String
    },
    Comments: {
        type: String
    },
    Status:{
        type: Boolean,
        default: false
    },
    RFQ_Status:{
        type: Boolean,
        default: false
    }, Quote:{
        type: Boolean,
        default: false
    },
    IsActive: {
        type: Boolean,
        default: true
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Inquiry", InquirySchema);
