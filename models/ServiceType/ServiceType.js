const mongoose = require("mongoose");
const ServiceTypeSchema = new mongoose.Schema(
  {
    ServiceName: {
      type: String,
    },
    IsActive: {
        type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceTypeSchema", ServiceTypeSchema);