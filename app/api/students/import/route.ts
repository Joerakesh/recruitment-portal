import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Student from "@/models/Student";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const rawData = await req.json();

    // Map CSV columns to MongoDB Schema fields
    const formattedData = rawData.map((row: any) => ({
      status: row["Status"] || "N",
      rollNo: row["Roll.No"],
      name: row["Name"],
      course: row["Course"],
      gender: row["Gender"],
      dob: row["DOB"],
      contact: {
        email: row["E.Mail"],
        sMobile: row["S.Mobile"],
        pMobile: row["P.Mobile"],
        address: row["Res. Address"],
        district: row["District"],
        state: row["State"],
        pincode: row["Pincode"],
      },
      academic: {
        lastStudied: row["Last Studied"],
        lastStudiedPlace: row["Last Studied Place"],
        passingYear: parseInt(row["Passing Year"]),
        boe: row["BOE"],
        hscRegNo: row["HSC Regno"],
      },
      personal: {
        fatherName: row["Father Name"],
        nationality: row["Nationality"] || "INDIAN",
        religion: row["Religion"],
        community: row["Community"],
        caste: row["Caste Name"],
      },
      ids: {
        aadhar: row["Aadhar"],
        emis: row["EMIS"],
        umis: row["UMIS"],
      },
      isVerified: false,
    }));

    // Insert many records at once.
    // ordered: false allows continuing even if one record fails (e.g. duplicate Roll No)
    const result = await Student.insertMany(formattedData, { ordered: false });

    return NextResponse.json(
      {
        success: true,
        count: result.length,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Import Error:", error);
    return NextResponse.json(
      {
        error: "Failed to import data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
