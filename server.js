const server = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./.env" });

const db = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASS
);
mongoose.connect(db).then(() => {
  console.log("Database connected");
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});
