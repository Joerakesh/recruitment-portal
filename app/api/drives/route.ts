import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import JobDrive from "@/models/JobDrive";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newDrive = await JobDrive.create(body);
    return NextResponse.json(
      { success: true, data: newDrive },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const drives = await JobDrive.find({}).sort({ createdAt: -1 });
    return NextResponse.json(drives);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
