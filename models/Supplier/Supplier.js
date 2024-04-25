const mongoose = require("mongoose");

const SupplierDetailSchema = new mongoose.Schema(
  {
    SupplierName: {
      type: String,

    },
    Address1: {
        type: String,

      },
      Address2: {
        type: String,

      },
    // ContactPersonName: {
    //   type: String,
    //   required: true,
    // },
    // CountryID: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Country",
    //   required: true,
    // },
    // StateID: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "State",
    //   required: true,
    // },
    City: {
      type: String,
    //   required: true,
    }, State: {
      type: String,
    //   required: true,
    }, Country: {
      type: String,
    //   required: true,
    },
   
    Pincode: {
      type: Number,
      required: true,
    },
    ContactNo_Sales: {
      type: Number,
      // required: true,
    },
    ContactNo_Support: {
      type: Number,
      // required: true,
    },
    ContactNo_Office: {
      type: Number,
      required: true,
    },
    EmailID_Office: {
      type: String,
      required: true,
    },
    EmailID_Support: {
      type: String,
      // required: true,
    },
    EmailID_Sales: {
      type: String,
      // required: true,
    },
    Website1: {
      type: String,
      required: true,
    },
    // Website2: {
    //   type: String,
    // },
    // Favicon: {
    //   type: String,
    // },
    // Icon: {
    //   type: String,
    // },
    // Logo: {
    //   type: String,
    // },
    // DigitalSignature: {
    //   type: String,
    // },
    // GSTNo: {
    //   type: String,
    //   // required: true,
    // },
    IsActive: {
      type: Boolean,
      default: true,
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupplierDetail", SupplierDetailSchema);
