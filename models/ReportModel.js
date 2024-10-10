const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  filesArray: [String],
  location: { latitude: String, longitude: String },
});

const reportModel = mongoose.model("Report", reportSchema);

module.exports = reportModel;
