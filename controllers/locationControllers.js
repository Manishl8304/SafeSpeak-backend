const reportModel = require("./../models/ReportModel");
const axios = require("axios");
// Function to handle anonymous reporting
exports.reportAnonymous = async (req, res) => {
  const {
    filesArray,
    latitude,
    longitude,
    description,
    category,
    recaptchaToken,
  } = req.body;
  const secretKey = "6LfSs2sqAAAAAA88QJJYZZNehF02FpuOrspAtuNu";

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      `secret=${secretKey}&response=${recaptchaToken}`
    );
    // const data = await response.json();
    if (response.data.success) {
      const newReport = await reportModel.create({
        filesArray,
        location: {
          latitude,
          longitude,
        },
        description,
        category,
      });
      return res.status(201).json({
        Message: "Reported Successfully",
        newReport,
      });
    } else {
      return res
        .status(400)
        .json({ Message: "reCAPTCHA verification failed." });
    }
  } catch (err) {
    return res.status(500).json({
      Message: "Failed to report. Please try again.",
      error: err.message, // Optionally include error details for debugging
    });
  }
};

// Function to get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await reportModel.find({});
    if (!reports.length) {
      return res.status(404).json({
        Message: "No reports found",
      });
    }
    return res.status(200).json({
      Message: "Reports retrieved successfully",
      reports,
    });
  } catch (err) {
    return res.status(500).json({
      Message: "Failed to fetch reports. Please try again.",
      error: err.message,
    });
  }
};
