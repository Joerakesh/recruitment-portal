import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Define the Interface for the Student document
export interface IStudent extends Document {
  rollNo: string;
  name: string;
  course: string;
  gender: "Male" | "Female" | "Other";
  dob: string;
  contact: {
    email: string;
    sMobile: string;
    pMobile?: string;
    address: string;
    district: string;
    state: string;
    pincode: string;
  };
  academic: {
    lastStudied: string;
    lastStudiedPlace: string;
    passingYear: number;
    boe: string;
    hscRegNo: string;
    cgpa: number;
  };
  personal: {
    fatherName: string;
    nationality: string;
    religion: string;
    community: string;
    caste: string;
  };
  ids: {
    aadhar: string;
    emis: string;
    umis: string;
  };
  status: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define the Schema
const StudentSchema: Schema = new Schema(
  {
    rollNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    course: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dob: { type: String },
    contact: {
      email: { type: String, required: true },
      sMobile: { type: String, required: true },
      pMobile: { type: String },
      address: String,
      district: String,
      state: String,
      pincode: String,
    },
    academic: {
      lastStudied: String,
      lastStudiedPlace: String,
      passingYear: Number,
      boe: String,
      hscRegNo: String,
      cgpa: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
    },
    personal: {
      fatherName: String,
      nationality: { type: String, default: "INDIAN" },
      religion: String,
      community: String,
      caste: String,
    },
    ids: {
      aadhar: String,
      emis: String,
      umis: String,
    },
    status: { type: String, default: "N" },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 3. Export the Model
const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);

export default Student;
