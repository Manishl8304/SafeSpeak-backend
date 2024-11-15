const express = require("express");
const userFunctions = require("./../controllers/userController");

const Router = express.Router();

Router.post("/signup", userFunctions.signup);
Router.post("/login", userFunctions.login);
Router.get("/logout", userFunctions.logout);

module.exports = Router;
