const express = require("express");
const locationFunctions = require("./../controllers/locationControllers");
const Router = express.Router();

Router.post("/getLocation", locationFunctions.getLocation);
module.exports = Router;
