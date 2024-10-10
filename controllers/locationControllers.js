const reportModel = require("./../models/ReportModel");

exports.reportAnonymous = async (req, res) => {
  const { filesArray, latitude, longitude } = req.body;

  try {
    const newReport = await reportModel.create({
      filesArray,
      location: {
        latitude,
        longitude,
      },
    });
    return res.status(201).json({
      Message: "Reported Successfully",
      newReport,
    });
  } catch (err) {
    return res.status(500).json({
      Message: "Failed to report. Please try again.",
      error: err.message, // Optionally include error details for debugging
    });
  }
};
