const User = require("../models/userModel");
const reportModel = require("./../models/ReportModel");
const axios = require("axios");
const catchAsync = require("./../utils/catchAsync");

// Function to handle anonymous reporting
exports.reportAnonymous = async (req, res) => {
  const {
    filesArray,
    latitude,
    longitude,
    description,
    category,
    recaptchaToken,
    userInfo,
  } = req.body;

  const secretKey = "6LfSs2sqAAAAAA88QJJYZZNehF02FpuOrspAtuNu";

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      `secret=${secretKey}&response=${recaptchaToken}`
    );
    if (response.data.success) {
      let user;
      if (userInfo != null) {
        user = await User.findOne({ userEmail: userInfo.userEmail });
      }
      const newReport = await reportModel.create({
        filesArray,
        location: {
          latitude,
          longitude,
        },
        description,
        category,
        reportedBy: userInfo,
      });
      return res.status(201).json({
        Status: "Success",
        Message: "Reported Successfully",
        newReport,
      });
    } else {
      return res
        .status(400)
        .json({ Status: "Failed", Message: "reCAPTCHA verification failed." });
    }
  } catch (err) {
    return res.status(500).json({
      Status: "Failed",
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
        Status: "Failed",
        Message: "No reports found",
      });
    }
    return res.status(200).json({
      Status: "Success",
      Message: "Reports retrieved successfully",
      reports,
    });
  } catch (err) {
    return res.status(500).json({
      Status: "Failed",
      Message: "Failed to fetch reports. Please try again.",
      error: err.message,
    });
  }
};

exports.getAllReportsByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ userEmail: req.params.email });
    const reports = await reportModel.find({ reportedBy: user._id });
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

exports.getAllReportsById = catchAsync(async (req, res, next) => {
  const currentUserId = req.params.id;
  const reports = await reportModel.find({ reportedBy: currentUserId });

  if (!reports.length) {
    return res.status(200).json({
      Status: "Failed",
      Message: "No reports found",
    });
  }

  res.status(200).json({
    Status: "Success",
    Message: "Reports retrieved successfully",
    reports,
  });
});
