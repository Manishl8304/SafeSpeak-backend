const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    filesArray: [String],
    location: { latitude: String, longitude: String },
    address: String,
    description: String,
    category: String,
    name: String,
    state: String,
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
    status: { type: String, default: "Not Specified" },
  },
  { timestamps: true } // Enable automatic timestamping
);

const reportModel = mongoose.model("Report", reportSchema);

module.exports = reportModel;
