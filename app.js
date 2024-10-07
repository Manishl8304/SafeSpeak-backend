const express = require("express");
const http = require("http");
const locationRoutes = require("./routes/locationRoutes");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: [process.env.ADMIN_URL],
  })
);
app.use(express.json());
app.use("/api/location", locationRoutes);

app.use("*", (req, res) => {
  res.status(404).json({
    Message: "Page not found",
  });
});
module.exports = server;
