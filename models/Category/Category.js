const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema(
  {
    Category: {
      type: String,
    },
    IsActive: {
        type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);