const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const PreferenceSchema = new mongoose.Schema({
    InquiryEmail: {
        type: String
    },
    QuoteEmail: {
        type: String
    },
    IsActive: {
        type: Boolean,
        default: true
    }
},
{ timestamps: true }
);

module.exports = model("Preferences", PreferenceSchema);
