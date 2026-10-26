import { Schema, model } from "mongoose";
import { IStudentAward } from "./studentAward.interface";

const studentAwardSchema = new Schema<IStudentAward>(
  {
    nameEnglish: {
      type: String,
      required: [true, "English name is required"],
      trim: true,
    },
    nameBangla: {
      type: String,
      required: [true, "Bangla name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      message: "This email is already used",
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
      message: "This phone number is already used",
    },
    session: {
      type: String,
      trim: true,
      default: "",
    },
    hscPassingYear: {
      type: String,
      trim: true,
      default: "",
    },
    sscPassingYear: {
      type: String,
      trim: true,
      default: "",
    },
    university: {
      type: String,
      trim: true,
      default: "",
    },
    instituteName: {
      type: String,
      trim: true,
      default: "",
    },
    presentCollege: {
      type: String,
      trim: true,
      default: "",
    },
    sscBatch: {
      type: String,
      trim: true,
      default: "",
    },
    awardType: {
      type: String,
      enum: ["admission", "hsc", "ssc"],
      default: "admission",
      trim: true,
    },
    sscSchool: {
      type: String,
      trim: true,
      default: "",
    },
    hscCollege: {
      type: String,
      trim: true,
      default: "",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const StudentAward = model<IStudentAward>("StudentAward", studentAwardSchema);

export default StudentAward;
