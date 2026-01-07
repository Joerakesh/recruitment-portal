import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Student from "@/models/Student";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { cgpa } = await req.json();

    const parsedCgpa = parseFloat(cgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
      return NextResponse.json(
        { error: "Invalid CGPA. Must be between 0 and 10" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("student_token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const updatedStudent = await Student.findByIdAndUpdate(
      decoded.id,
      { "academic.cgpa": parsedCgpa },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "CGPA updated successfully",
      cgpa: updatedStudent?.academic?.cgpa,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
