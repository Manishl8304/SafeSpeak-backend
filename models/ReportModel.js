const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    filesArray: [String],
    location: { latitude: String, longitude: String },
    description: String,
    category: String,
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refer to the User model
    },
  },
  { timestamps: true }
); // Enable timestamps

const reportModel = mongoose.model("Report", reportSchema);

module.exports = reportModel;
