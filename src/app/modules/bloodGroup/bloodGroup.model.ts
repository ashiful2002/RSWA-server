import { Schema, model } from "mongoose";
import { IBloodGroup } from "./bloodGroup.interface";

const bloodGroupSchema = new Schema<IBloodGroup>(
  {
    Timestamp: {
      type: String,
    },
    Name: {
      type: String,
      required: true,
    },
    Blood_Group: {
      type: String,
      required: true,
    },
    Phone_Number: {
      type: String,
      required: true,
      unique: true,
    },
    SSC_Batch: {
      type: String,
    },
    Permanent_Address: {
      type: String,
    },
    Present_Address: {
      type: String,
    },
    agree: {
      type: Boolean,
      default: false,
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

const BloodGroup = model<IBloodGroup>(
  "BloodGroup",
  bloodGroupSchema,
  "BloodGroupCollection"
);

export default BloodGroup;
