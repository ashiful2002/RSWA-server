const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(process.cwd(), ".env") });

module.exports = {
  port: process.env.PORT || 5000,
  mongo_username: process.env.MONGO_USERNAME,
  mongo_password: process.env.MONGO_PASSWORD,
};
