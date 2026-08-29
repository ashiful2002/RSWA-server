import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT || 5005,
  mongo_username:
    process.env.MONGO_USERNAME ||
    process.env.mongdbUserName ||
    "ashifulislam2002",
  mongo_password:
    process.env.MONGO_PASSWORD || process.env.mongodbPass || "4wTd91BPeL5qXCiw",
};
