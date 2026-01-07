import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Student from "@/models/Student";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const rawData = await req.json();

    const formattedData = rawData.map((row: any) => {
      // CLEANING LOGIC: Extract only the year number (e.g., "APRIL 2023" -> 2023)
      const rawYear = row["Passing Year"] || "";
      const yearMatch = rawYear.toString().match(/\d{4}/);
      const cleanedYear = yearMatch ? parseInt(yearMatch[0]) : 0;

      return {
        status: row["Status"] || "N",
        rollNo: row["Roll.No"]?.trim(),
        name: row["Name"]?.trim(),
        course: row["Course"]?.trim(),
        gender: row["Gender"],
        dob: row["DOB"],
        contact: {
          email: row["E.Mail"]?.trim(),
          sMobile: row["P.Mobile"]?.trim(),
          pMobile: row["S.Mobile"]?.trim(),
          address: row["Res. Address"],
          district: row["District"],
          state: row["State"],
          pincode: row["Pincode"],
        },
        academic: {
          lastStudied: row["Last Studied"],
          lastStudiedPlace: row["Last Studied Place"],
          passingYear: cleanedYear, // Now safe from "APRIL 2023" strings
          boe: row["BOE"],
          hscRegNo: row["HSC Regno"],
          cgpa: 0, // Default for new imports
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
      };
    });

    // Safter Bulk Write (Upsert) to handle duplicates and updates
    const bulkOps = formattedData.map((student: any) => ({
      updateOne: {
        filter: { rollNo: student.rollNo },
        update: { $set: student },
        upsert: true,
      },
    }));

    const result = await Student.bulkWrite(bulkOps);

    return NextResponse.json(
      {
        success: true,
        count:
          result.upsertedCount + result.modifiedCount + result.matchedCount,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Import Error:", error);
    return NextResponse.json(
      { error: "Import failed", details: error.message },
      { status: 500 }
    );
  }
}
