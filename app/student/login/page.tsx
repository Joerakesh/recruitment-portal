"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentLoginPage() {
    const [rollNo, setRollNo] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await fetch("/api/auth/student-login", {
            method: "POST",
            body: JSON.stringify({ rollNo }),
            headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
            router.push("/student/dashboard");
        } else {
            const data = await res.json();
            setError(data.error || "Login failed");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-900">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Student Portal</h1>
                <p className="text-center text-gray-500 mb-8">Enter your Roll Number to continue</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Roll Number</label>
                        <input
                            type="text"
                            placeholder="e.g. 23UBC501"
                            className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-gray-400"
                    >
                        {loading ? "Verifying..." : "Login to Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}