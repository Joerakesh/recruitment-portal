import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Student from "@/models/Student";

export async function GET() {
  try {
    await dbConnect();
    const students = await Student.find({}).sort({ rollNo: 1 });
    return NextResponse.json(students);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
