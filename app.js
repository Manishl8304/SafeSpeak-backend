const express = require("express");
const http = require("http");
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes");
const errorFunctions = require("./utils/errorHandler");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);

// Configure CORS for specific origins and allow cookies
app.use(
  cors({
    origin: ["http://localhost:5173", "https://safe-speak-xp7j.vercel.app"], // Specific allowed origins
    credentials: true, // Allow cookies
    methods: "GET, POST, OPTIONS, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Deployed Successfully");
});

app.use("/api/location", reportRoutes);
app.use("/api/user", userRoutes);

// Handle all unmatched routes
app.use("*", (req, res) => {
  res.status(404).json({
    statusCode: 404,
    statusMessage: "Not Found",
    Message: "Page Not Found",
  });
});

app.use(errorFunctions.errorHandler); // Error handling middleware

module.exports = server;
