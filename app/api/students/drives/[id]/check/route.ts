import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Student from "@/models/Student";
import JobDrive from "@/models/JobDrive";
import Application from "@/models/Application";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Notice 'params' is now wrapped in a Promise
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Fix 1: Await params
    const { id } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("student_token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Fix 2: Better error handling if drive isn't found
    const drive = await JobDrive.findById(id);
    if (!drive) {
      return NextResponse.json({ error: "Drive not found" }, { status: 404 });
    }

    const student = await Student.findById(decoded.id);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const existingApp = await Application.findOne({
      studentId: student._id,
      driveId: drive._id,
    });

    const courseMatch = drive.eligibleCourses.includes(student.course);
    const studentCgpa = student.academic?.cgpa || 0;
    const cgpaMatch = studentCgpa >= (drive.minCgpa || 0);

    return NextResponse.json({
      drive,
      isEligible: courseMatch && cgpaMatch,
      alreadyApplied: !!existingApp,
      status: existingApp?.status || null,
      reason: !courseMatch
        ? "Course not eligible"
        : !cgpaMatch
        ? "CGPA too low"
        : null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
