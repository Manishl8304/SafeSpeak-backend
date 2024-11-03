const express = require("express");
const userFunctions = require("./../controllers/userController");

const Router = express.Router();

Router.post("/signup", userFunctions.signup);
Router.post("/login", userFunctions.login);

module.exports = Router;
