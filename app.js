const express = require("express");
const http = require("http");
const locationRoutes = require("./routes/locationRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: ["http://localhost:5173", "https://safe-speak-xp7j.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Deployed Successfully");
});
app.use("/api/location", locationRoutes);
app.use("/api/user", userRoutes);

app.use("*", (req, res) => {
  res.status(404).json({
    Message: "Page not found",
  });
});
module.exports = server;
