const server = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

server.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});
