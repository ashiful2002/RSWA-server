import mongoose from "mongoose";
import config from "../config";

const uri = `mongodb+srv://${config.mongo_username}:${config.mongo_password}@cluster0.eitqwxe.mongodb.net/bloodGroup?retryWrites=true&w=majority&appName=Cluster0`;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
