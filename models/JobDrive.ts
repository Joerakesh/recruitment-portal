import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJobDrive extends Document {
  companyName: string;
  jobRole: string;
  salary: string;
  deadline: string;
  eligibleCourses: string[];
  minCgpa: number;
  location: string;
  driveDate: string;
  description: string;
  registrationOpen: boolean; // New manual toggle
  jobType: "Full-time" | "Internship"; // More details
  selectionProcess: string; // Detail field
  createdAt: Date;
}

const JobDriveSchema: Schema = new Schema(
  {
    companyName: { type: String, required: true },
    jobRole: { type: String, required: true },
    salary: { type: String },
    deadline: { type: String, required: true },
    eligibleCourses: { type: [String], required: true },
    minCgpa: { type: Number, default: 0 },
    location: { type: String },
    driveDate: { type: String },
    description: { type: String },
    registrationOpen: { type: Boolean, default: true }, // Default to open
    jobType: {
      type: String,
      enum: ["Full-time", "Internship"],
      default: "Full-time",
    },
    selectionProcess: { type: String },
  },
  { timestamps: true }
);

const JobDrive: Model<IJobDrive> =
  mongoose.models.JobDrive ||
  mongoose.model<IJobDrive>("JobDrive", JobDriveSchema);

export default JobDrive;
