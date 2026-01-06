import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb"; // Path fixed to utils
import Student from "@/models/Student";
import JobDrive from "@/models/JobDrive";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await dbConnect();

    // 1. Get token from cookies (AWAITED for Next.js 15)
    const cookieStore = await cookies();
    const token = cookieStore.get("student_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Verify student identity
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 3. Fetch Student profile
    const student = await Student.findById(decoded.id);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // 4. Fetch Matching Jobs
    // IMPORTANT: Make sure the course string in your DB exactly matches
    // the strings you put in the JobDrive eligibleCourses array
    const matchingDrives = await JobDrive.find({
      status: "Open",
      eligibleCourses: student.course,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ student, drives: matchingDrives });
  } catch (error: any) {
    console.error("Dashboard Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
