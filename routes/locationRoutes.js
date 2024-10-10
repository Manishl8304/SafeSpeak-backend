const express = require("express");
const locationFunctions = require("./../controllers/locationControllers");

const Router = express.Router();

Router.post("/reportAnonymous", locationFunctions.reportAnonymous);
module.exports = Router;
