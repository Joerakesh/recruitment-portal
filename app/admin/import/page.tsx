"use client";

import { useState } from "react";
import Papa from "papaparse";
import { useRouter } from "next/navigation";

export default function CSVImportPage() {
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMessage("Parsing CSV...");

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const response = await fetch("/api/students/import", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(results.data),
                    });

                    const resData = await response.json();

                    if (response.ok) {
                        setMessage(`Successfully imported ${resData.count} students!`);
                        setTimeout(() => router.push("/admin/students"), 2000);
                    } else {
                        setMessage(`Error: ${resData.details || "Upload failed"}`);
                    }
                } catch (err) {
                    setMessage("Network error occurred.");
                } finally {
                    setUploading(false);
                }
            },
        });
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Import Student Data</h1>
                <p className="text-gray-500 mb-6 text-sm">Upload the CSV file containing the student records.</p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:border-blue-500 transition-colors relative">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-blue-600 font-medium">{uploading ? "Processing..." : "Click to upload or drag and drop"}</p>
                        <p className="text-xs text-gray-400">Only CSV files are supported</p>
                    </div>
                </div>

                {message && (
                    <div className={`mt-4 p-3 rounded text-sm font-medium ${message.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                        {message}
                    </div>
                )}

                <div className="mt-6">
                    <button
                        onClick={() => router.push("/admin/students")}
                        className="text-sm text-gray-600 hover:text-blue-600 font-medium"
                    >
                        ← Back to Student List
                    </button>
                </div>
            </div>
        </div>
    );
}