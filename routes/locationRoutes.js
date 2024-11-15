const express = require("express");
const locationFunctions = require("./../controllers/locationControllers");

const Router = express.Router();

Router.post("/reportAnonymous", locationFunctions.reportAnonymous);
Router.get("/getAllReports", locationFunctions.getAllReports);
Router.get("/getAllReportsByEmail/:email", locationFunctions.getAllReportsByEmail);

module.exports = Router;
