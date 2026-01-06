import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Application from "@/models/Application";
import Student from "@/models/Student"; // Crucial to import this so .populate() works

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const driveId = searchParams.get("driveId");

    if (!driveId)
      return NextResponse.json({ error: "Missing Drive ID" }, { status: 400 });

    // Populate brings in the full Student details linked to the application
    const applicants = await Application.find({ driveId })
      .populate("studentId", "name rollNo course contact")
      .sort({ appliedAt: -1 });

    return NextResponse.json(applicants);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
