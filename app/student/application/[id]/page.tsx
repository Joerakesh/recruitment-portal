"use client";

import { useEffect, useState, React } from "react";
import { useRouter } from "next/navigation";
import { use } from "react"; // Add this

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Fix 1: Unwrapping the params promise using 'use'
    const resolvedParams = use(params);
    const driveId = resolvedParams.id;

    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkEligibility = async () => {
            try {
                const res = await fetch(`/api/students/drives/${driveId}/check`);
                if (!res.ok) throw new Error("Failed to load");
                const data = await res.json();
                setStatus(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        checkEligibility();
    }, [driveId]); // Dependency is now driveId

    const handleApply = async () => {
        if (!confirm("Apply for this position?")) return;

        const res = await fetch("/api/students/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ driveId }),
        });

        if (res.ok) {
            alert("Applied!");
            window.location.reload();
        } else {
            const err = await res.json();
            alert(err.error);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Drive Details...</div>;
    if (!status?.drive) return <div className="p-10 text-center">Drive not found.</div>;

    const { drive, isEligible, alreadyApplied, reason } = status;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <button
                onClick={() => router.back()}
                className="mb-6 text-blue-600 font-medium flex items-center gap-2"
            >
                ← Back to Dashboard
            </button>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8 bg-gradient-to-r from-blue-700 to-blue-500 text-white">
                    <span className="bg-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {drive.jobType || "Full-Time"}
                    </span>
                    <h1 className="text-4xl font-extrabold mt-4">{drive.companyName}</h1>
                    <p className="text-xl opacity-90 mt-2">{drive.jobRole}</p>
                </div>

                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <p className="text-gray-500 text-xs uppercase font-bold">Salary</p>
                            <p className="text-lg font-bold text-gray-800">{drive.salary} LPA</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <p className="text-gray-500 text-xs uppercase font-bold">Min CGPA</p>
                            <p className="text-lg font-bold text-gray-800">{drive.minCgpa}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <p className="text-gray-500 text-xs uppercase font-bold">Location</p>
                            <p className="text-lg font-bold text-gray-800">{drive.location || "On-Campus"}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <p className="text-gray-500 text-xs uppercase font-bold">Deadline</p>
                            <p className="text-lg font-bold text-gray-800">{new Date(drive.deadline).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-3">Job Description</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{drive.description}</p>
                    </section>

                    <div className="pt-6 border-t">
                        {alreadyApplied ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 p-5 rounded-2xl text-center">
                                <p className="font-bold text-xl">✅ Application Submitted</p>
                                <p className="text-sm opacity-80">You will be notified via the app if you are shortlisted.</p>
                            </div>
                        ) : !drive.registrationOpen ? (
                            <div className="bg-gray-100 text-gray-500 p-5 rounded-2xl text-center font-bold">
                                🔒 Registration has been closed by the admin.
                            </div>
                        ) : !isEligible ? (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-5 rounded-2xl text-center">
                                <p className="font-bold text-xl">🚫 Not Eligible</p>
                                <p className="font-medium">{reason}</p>
                            </div>
                        ) : (
                            <button
                                onClick={handleApply}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-xl font-bold transition-all shadow-lg shadow-blue-200"
                            >
                                Apply Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}