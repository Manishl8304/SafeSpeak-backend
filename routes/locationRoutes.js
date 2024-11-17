const express = require("express");
const locationFunctions = require("./../controllers/locationControllers");
const userFunctions = require("./../controllers/userController");

const Router = express.Router();

Router.post("/reportAnonymous", locationFunctions.reportAnonymous);
Router.get("/getAllReports", locationFunctions.getAllReports);

Router.get("/getAllReportsById/:id", locationFunctions.getAllReportsById);

module.exports = Router;
