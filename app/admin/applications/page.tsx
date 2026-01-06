"use client";

import { useEffect, useState } from "react";

export default function AdminApplicationsPage() {
    const [drives, setDrives] = useState<any[]>([]);
    const [selectedDrive, setSelectedDrive] = useState<string>("");
    const [applicants, setApplicants] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // 1. Fetch all job drives for the dropdown
    useEffect(() => {
        fetch("/api/drives")
            .then((res) => res.json())
            .then((data) => setDrives(data));
    }, []);

    // 2. Fetch applicants when a drive is selected
    useEffect(() => {
        if (!selectedDrive) return;
        setLoading(true);
        fetch(`/api/admin/applicants?driveId=${selectedDrive}`)
            .then((res) => res.json())
            .then((data) => {
                setApplicants(data);
                setLoading(false);
            });
    }, [selectedDrive]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Recruitment Applications</h1>

            {/* Selector */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Job Drive</label>
                <select
                    className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedDrive}
                    onChange={(e) => setSelectedDrive(e.target.value)}
                >
                    <option value="">-- Select a Company Drive --</option>
                    {drives.map((drive) => (
                        <option key={drive._id} value={drive._id}>
                            {drive.companyName} - {drive.jobRole}
                        </option>
                    ))}
                </select>
            </div>

            {/* Applicant Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="font-bold text-gray-700">Applicants ({applicants.length})</h2>
                    <button
                        disabled={applicants.length === 0}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 disabled:bg-gray-300"
                    >
                        📊 Export to Excel
                    </button>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-gray-500">Loading applicants...</div>
                ) : (
                    <table className="min-w-full">
                        <thead>
                            <tr className="text-left text-xs uppercase font-semibold text-gray-500 border-b">
                                <th className="px-6 py-3">Roll No</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Course</th>
                                <th className="px-6 py-3">Mobile</th>
                                <th className="px-6 py-3">Applied On</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {applicants.map((app: any) => (
                                <tr key={app._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-blue-600">{app.studentId.rollNo}</td>
                                    <td className="px-6 py-4 uppercase">{app.studentId.name}</td>
                                    <td className="px-6 py-4">{app.studentId.course}</td>
                                    <td className="px-6 py-4">{app.studentId.contact.sMobile}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(app.appliedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {!selectedDrive && (
                    <div className="p-20 text-center text-gray-400">
                        Select a drive from the dropdown to see who has applied.
                    </div>
                )}
            </div>
        </div>
    );
}