"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [newCgpa, setNewCgpa] = useState("");
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    const fetchDashboard = async () => {
        try {
            const res = await fetch("/api/students/dashboard");
            if (res.status === 401) {
                router.push("/student/login");
                return;
            }
            const json = await res.json();
            setData(json);
            setNewCgpa(json.student.academic?.cgpa?.toString() || "");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, [router]);

    const handleCgpaUpdate = async () => {
        setUpdating(true);
        const res = await fetch("/api/students/update-cgpa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cgpa: newCgpa }),
        });

        if (res.ok) {
            alert("CGPA Updated! Eligibility recalculated.");
            fetchDashboard(); // Refresh data to update the UI cards
        } else {
            const err = await res.json();
            alert(err.error);
        }
        setUpdating(false);
    };

    if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header with CGPA Update */}
                <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 uppercase">Welcome, {data.student.name}</h1>
                        <p className="text-gray-500">{data.student.rollNo} | {data.student.course}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                        <div className="flex gap-2 items-center bg-blue-50 p-2 rounded-xl border border-blue-100">
                            <label className="text-xs font-bold text-blue-700 ml-2">MY CGPA:</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="w-20 p-1 border rounded text-center font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                value={newCgpa}
                                onChange={(e) => setNewCgpa(e.target.value)}
                            />
                            <button
                                onClick={handleCgpaUpdate}
                                disabled={updating}
                                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-all"
                            >
                                {updating ? "..." : "UPDATE"}
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                document.cookie = "student_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                                router.push("/student/login");
                            }}
                            className="text-red-500 text-sm font-medium"
                        >Logout</button>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-4">Recruitment Drives</h2>

                {data.drives.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-200 p-10 rounded-2xl text-center text-blue-700">
                        No active job drives found.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {data.drives.map((drive: any) => {
                            const isCourseEligible = drive.eligibleCourses.includes(data.student.course);
                            const isCgpaEligible = (data.student.academic?.cgpa || 0) >= (drive.minCgpa || 0);
                            const isEligible = isCourseEligible && isCgpaEligible;

                            return (
                                <div key={drive._id} className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${!isEligible ? 'border-red-400 opacity-75' : 'border-blue-600'} flex justify-between items-center`}>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-bold text-gray-900">{drive.companyName}</h3>
                                            {!drive.registrationOpen && (
                                                <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded uppercase font-bold">Closed</span>
                                            )}
                                        </div>
                                        <p className="text-blue-600 font-medium">{drive.jobRole}</p>

                                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                            <span>💰 {drive.salary} LPA</span>
                                            <span className={!isCgpaEligible ? "text-red-500 font-bold" : ""}>
                                                🎯 Min CGPA: {drive.minCgpa}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        {!isEligible ? (
                                            <div className="text-red-500 text-sm font-bold bg-red-50 px-4 py-2 rounded-lg border border-red-100">
                                                {!isCourseEligible ? "Course Not Eligible" : "CGPA Below Criteria"}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => router.push(`/student/application/${drive._id}`)}
                                                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all"
                                            >
                                                Details & Apply
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}