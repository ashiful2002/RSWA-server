import { Schema, model } from "mongoose";
import { IBloodGroup } from "./bloodGroup.interface";

const bloodGroupSchema = new Schema<IBloodGroup>(
  {
    Name: {
      type: String,
    },
    Blood_Group: {
      type: String,
    },
    Phone: {
      type: String,
    },
    District: {
      type: String,
    },
    Upazila: {
      type: String,
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
