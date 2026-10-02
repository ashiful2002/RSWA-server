import { Schema, model } from "mongoose";
import { ICommitteeMember, ICommitteeSocial } from "./committee.interface";

const committeeSocialSchema = new Schema<ICommitteeSocial>(
  {
    phone: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    facebook: { type: String, trim: true },
    email: { type: String, trim: true },
  },
  { _id: false }
);

const committeeMemberSchema = new Schema<ICommitteeMember>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title / Designation is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    session: {
      type: String,
      trim: true,
      default: "2026-2027",
    },
    says: {
      type: String,
      trim: true,
      default: "",
    },
    social: {
      type: committeeSocialSchema,
      default: {},
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CommitteeMember = model<ICommitteeMember>(
  "CommitteeMember",
  committeeMemberSchema
);

export default CommitteeMember;
