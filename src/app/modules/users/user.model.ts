import { Schema, model } from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "moderator", "donor"],
      default: "donor",
    },
    displayName: {
      type: String,
    },
    name: {
      type: String,
    },
    photoURL: {
      type: String,
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
    },
    updated_at: {
      type: String,
    },
    last_log_in: {
      type: String,
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

const User = model<IUser>("User", userSchema, "users");

export default User;
