import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Student from "@/models/Student";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { rollNo } = await req.json();

    // 1. Find student by Roll Number (Case-insensitive)
    const student = await Student.findOne({
      rollNo: { $regex: new RegExp(`^${rollNo}$`, "i") },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Roll Number not found" },
        { status: 404 }
      );
    }

    // 2. Create a Token
    const token = jwt.sign(
      { id: student._id, rollNo: student.rollNo, course: student.course },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // 3. Set token in a cookie
    const response = NextResponse.json({
      success: true,
      message: `Welcome ${student.name}`,
    });

    response.cookies.set("student_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
