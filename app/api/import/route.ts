import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Student from "@/models/Student";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json(); // Array of students from your CSV

    // In a real scenario, we'd map the CSV headers to our schema here
    // For now, we use insertMany for speed
    const result = await Student.insertMany(data, { ordered: false });

    return NextResponse.json(
      {
        message: `Successfully imported ${result.length} students`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Import failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
