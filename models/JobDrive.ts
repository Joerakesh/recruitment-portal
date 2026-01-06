import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJobDrive extends Document {
  companyName: string;
  jobRole: string;
  salary: string; // e.g., "4.5 LPA"
  deadline: string;
  eligibleCourses: string[]; // e.g., ["B C A", "B Sc Computer Science"]
  minCgpa?: number;
  location: string;
  driveDate: string;
  description: string;
  status: "Open" | "Closed";
  createdAt: Date;
}

const JobDriveSchema: Schema = new Schema(
  {
    companyName: { type: String, required: true },
    jobRole: { type: String, required: true },
    salary: { type: String },
    deadline: { type: String, required: true },
    eligibleCourses: { type: [String], required: true }, // Links to 'course' in Student model
    minCgpa: { type: Number, default: 0 },
    location: { type: String },
    driveDate: { type: String },
    description: { type: String },
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  },
  { timestamps: true }
);

const JobDrive: Model<IJobDrive> =
  mongoose.models.JobDrive ||
  mongoose.model<IJobDrive>("JobDrive", JobDriveSchema);

export default JobDrive;
