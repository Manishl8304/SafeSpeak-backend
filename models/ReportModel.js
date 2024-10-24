const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    filesArray: [String],
    location: { latitude: String, longitude: String },
    description: String,
    category: String,
  },
  { timestamps: true }
); // Enable timestamps

const reportModel = mongoose.model("Report", reportSchema);

module.exports = reportModel;
