const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["donor", "moderator", "admin"],
      default: "donor",
    },
    status: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    created_at: {
      type: String,
      default: Date.now(),
    },
    updated_at: {
      type: String,
      default: Date.now(),
    },
    last_log_in: {
      type: String,
    },
  },
  {
    strict: false, // allows extra fields to be preserved
    timestamps: true,
  }
);

// Mongoose model mapped to 'users' collection
const User = mongoose.model("User", userSchema, "users");

module.exports = User;
