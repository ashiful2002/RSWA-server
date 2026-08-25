const mongoose = require("mongoose");
const config = require("../config");

const uri = `mongodb+srv://${config.mongo_username}:${config.mongo_password}@cluster0.eitqwxe.mongodb.net/bloodGroup?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB using mongoose!"
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = {
  connectDB,
};
