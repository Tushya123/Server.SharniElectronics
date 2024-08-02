const mongoose = require("mongoose");
const ServiceGroupSchema= new mongoose.Schema(
  {
    ServiceGroup: {
      type: String,
    },
    ImageUrl:{
      type:String
    },
    IsActive: {
        type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("servicegroup", ServiceGroupSchema);