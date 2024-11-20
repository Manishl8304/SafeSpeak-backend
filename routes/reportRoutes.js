const express = require("express");
const reportFunctions = require("../controllers/reportControllers");
const userFunctions = require("../controllers/userController");

const Router = express.Router();

Router.post("/reportAnonymous", reportFunctions.reportAnonymous);
Router.post("/setReportStatus/:id", reportFunctions.setReportStatus);
Router.get("/getAllReports", reportFunctions.getAllReports);

Router.get("/getAllReportsById/:id", reportFunctions.getAllReportsById);

module.exports = Router;
