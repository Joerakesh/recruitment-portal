import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplication extends Document {
  studentId: mongoose.Types.ObjectId;
  driveId: mongoose.Types.ObjectId;
  status: "Applied" | "Shortlisted" | "Rejected" | "Selected";
  appliedAt: Date;
}

const ApplicationSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  driveId: { type: Schema.Types.ObjectId, ref: "JobDrive", required: true },
  status: {
    type: String,
    enum: ["Applied", "Shortlisted", "Rejected", "Selected"],
    default: "Applied",
  },
  appliedAt: { type: Date, default: Date.now },
});

// Prevent duplicate applications: One student can apply to one drive only once
ApplicationSchema.index({ studentId: 1, driveId: 1 }, { unique: true });

const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;
