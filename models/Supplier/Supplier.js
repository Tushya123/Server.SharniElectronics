const mongoose = require("mongoose");

const SupplierDetailSchema = new mongoose.Schema(
  {
    SupplierName: {
      type: String,

    },
    CompanyName: {
        type: String,

      },
     
    Country: {
      type: String,
    //   required: true,
    },

    ContactNo_Office: {
      type: Number,
      required: true,
    },
    EmailID_Office: {
      type: String,
      required: true,
    },
    IsActive: {
      type: Boolean,
      default: true,
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupplierDetail", SupplierDetailSchema);
