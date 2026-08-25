import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT || 5000,
  mongo_username: process.env.MONGO_USERNAME,
  mongo_password: process.env.MONGO_PASSWORD,
};
