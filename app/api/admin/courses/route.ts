import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Student from "@/models/Student";

export async function GET() {
  try {
    await dbConnect();

    // This returns an array of unique course names like ["B C A", "B B A", ...]
    const courses = await Student.distinct("course");

    // Sort them alphabetically for a better UI experience
    const sortedCourses = courses.filter(Boolean).sort();

    return NextResponse.json(sortedCourses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
