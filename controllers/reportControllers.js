const User = require("../models/userModel");
const reportModel = require("../models/ReportModel");
const axios = require("axios");
const catchAsync = require("../utils/catchAsync");

// Handle anonymous reporting
exports.reportAnonymous = async (req, res) => {
  const {
    filesArray,
    latitude,
    longitude,
    description,
    category,
    recaptchaToken,
    userInfo,
    address,
  } = req.body;
  console.log("rfed");
  const secretKey = "6LfSs2sqAAAAAA88QJJYZZNehF02FpuOrspAtuNu"; // reCAPTCHA secret key

  try {
    // Verify reCAPTCHA token
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      `secret=${secretKey}&response=${recaptchaToken}`
    );

    console.log("rfed");
    if (response.data.success) {
      let user = null;

      if (userInfo != null) {
        user = await User.findOne({ _id: userInfo });
      }

      // Create new report
      const newReport = await reportModel.create({
        filesArray,
        location: { latitude, longitude },
        description,
        category,
        name: user != null ? user.userName : "Anonymous User",
        reportedBy: userInfo || null,
        address,
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
      error: err.message,
    });
  }
};

// Get all reports
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

// Get reports by email
exports.getAllReportsByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ userEmail: req.params.email });
    const reports = await reportModel.find({ reportedBy: user._id });

    if (!reports.length) {
      return res.status(404).json({ Message: "No reports found" });
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

// Get reports by user ID
exports.getAllReportsById = catchAsync(async (req, res) => {
  const currentUserId = req.params.id;
  const reports = await reportModel.find({ reportedBy: currentUserId });

  if (!reports.length) {
    return res.status(404).json({
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

// Set report status
exports.setReportStatus = catchAsync(async (req, res) => {
  const currentReportId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      Status: "Error",
      Message: "Status is required.",
    });
  }

  const updatedReport = await reportModel.findByIdAndUpdate(
    currentReportId,
    { status },
    { new: true, runValidators: true }
  );

  if (!updatedReport) {
    return res.status(404).json({
      Status: "Error",
      Message: "Report not found.",
    });
  }

  res.status(200).json({
    Status: "Success",
    Message: "Report status changed successfully",
    updatedReport,
  });
});
