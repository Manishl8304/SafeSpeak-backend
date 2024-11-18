const express = require("express");
const http = require("http");
const locationRoutes = require("./routes/locationRoutes");
const userRoutes = require("./routes/userRoutes");
const errorFunctions = require("./utils/errorHandler");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://safe-speak-smoky.vercel.app"
  ); // Frontend URL
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow cookies
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(
  cors({
    origin: ["http://localhost:5173", "https://safe-speak-smoky.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Deployed Successfully");
});

app.use("/api/location", locationRoutes);

app.use("/api/user", userRoutes);

app.use("*", (req, res) => {
  res.status(404).json({
    statusCode: 404,
    statusMessage: "Not Found",
    Message: "Page Not Found",
  });
});

app.use(errorFunctions.errorHandler);
module.exports = server;
