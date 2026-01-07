import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Application from "@/models/Application";
import Student from "@/models/Student"; // Necessary for population

export async function GET(
  req: Request,
  { params }: { params: { driveId: string } }
) {
  try {
    await dbConnect();
    console.log("req came");
    // Use populate to join the Student data automatically
    const applicants = await Application.find({ driveId: params.driveId })
      .populate("studentId")
      .sort({ appliedAt: -1 });

    return NextResponse.json(applicants);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
