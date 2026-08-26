import mongoose from "mongoose";
import config from "../config";

const uri = `mongodb+srv://${config.mongo_username}:${config.mongo_password}@cluster0.eitqwxe.mongodb.net/bloodGroup?retryWrites=true&w=majority&appName=Cluster0`;

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise || mongoose.connection.readyState === 0) {
    connectionPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
