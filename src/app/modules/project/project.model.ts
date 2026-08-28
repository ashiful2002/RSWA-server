import { Schema, model } from "mongoose";
import { IProject } from "./project.interface";

const impactMetricsSchema = new Schema(
  {
    beneficiaries: { type: String },
    volunteersCount: { type: Number, default: 0 },
    location: { type: String },
  },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: [true, "Project slug is required"],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["Education", "Health", "Environment", "Relief", "Cultural"],
      required: [true, "Project category is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Upcoming", "Completed"],
      default: "Active",
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail image URL is required"],
    },
    summary: {
      type: String,
      required: [true, "Project summary is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    impactMetrics: {
      type: impactMetricsSchema,
      default: {},
    },
    startDate: { type: String },
    endDate: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Project = model<IProject>("Project", projectSchema);

export default Project;
