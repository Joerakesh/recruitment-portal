import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Application from "@/models/Application";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { driveId } = await req.json();

    // 1. Get token from cookies (AWAITED for Next.js 15)
    const cookieStore = await cookies();
    const token = cookieStore.get("student_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Please login again" },
        { status: 401 }
      );
    }

    // 2. Verify student
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 3. Check if already applied to prevent double entries
    const existingApp = await Application.findOne({
      studentId: decoded.id,
      driveId: driveId,
    });

    if (existingApp) {
      return NextResponse.json(
        { error: "You have already applied for this job." },
        { status: 400 }
      );
    }

    // 4. Create the application
    await Application.create({
      studentId: decoded.id,
      driveId: driveId,
      status: "Applied",
    });

    return NextResponse.json({
      success: true,
      message: "Applied successfully!",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
