"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                // Note the path matches your route: /api/students/dashboard
                const res = await fetch("/api/students/dashboard");
                if (res.status === 401) {
                    router.push("/student/login");
                    return;
                }
                if (!res.ok) throw new Error("Failed to fetch");

                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [router]);

    const handleApply = async (driveId: string) => {
        if (!confirm("Are you sure you want to apply for this drive? Your profile data will be shared with the recruiter.")) return;

        const res = await fetch("/api/students/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ driveId }),
        });

        const result = await res.json();

        if (res.ok) {
            alert("Application submitted successfully!");
            // Refresh page or update state to change button text to "Applied"
            window.location.reload();
        } else {
            alert(result.error);
        }
    };
    if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Welcome, {data.student.name}</h1>
                        <p className="text-gray-500">{data.student.rollNo} | {data.student.course}</p>
                    </div>
                    <button
                        onClick={() => { /* Logic to clear cookie and logout */ }}
                        className="text-red-500 font-medium"
                    >Logout</button>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-4">Eligible Recruitment Drives</h2>

                {data.drives.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-200 p-10 rounded-2xl text-center text-blue-700">
                        No active drives match your course currently.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {data.drives.map((drive: any) => (
                            <div key={drive._id} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-600 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{drive.companyName}</h3>
                                    <p className="text-blue-600 font-medium">{drive.jobRole}</p>
                                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                        <span>💰 {drive.salary} LPA</span>
                                        <span>⏳ Deadline: {new Date(drive.deadline).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleApply(drive._id)}
                                    className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-all"
                                >
                                    Quick Apply
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}