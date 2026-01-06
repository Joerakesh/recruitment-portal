"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateDrivePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        companyName: "",
        jobRole: "",
        salary: "",
        deadline: "",
        eligibleCourses: "", // We will split this string into an array
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const coursesArray = formData.eligibleCourses.split(",").map(c => c.trim());

        const response = await fetch("/api/drives", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, eligibleCourses: coursesArray }),
        });

        if (response.ok) {
            alert("Job Drive Created Successfully!");
            router.push("/admin/drives");
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md text-black">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Recruitment Drive</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Job Role</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Salary (LPA)</label>
                            <input
                                type="text"
                                placeholder="e.g. 5.0"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Deadline</label>
                            <input
                                type="date"
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Eligible Courses (Comma separated)</label>
                        <input
                            type="text"
                            placeholder="B C A, B Sc Computer Science"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            onChange={(e) => setFormData({ ...formData, eligibleCourses: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Job Description</label>
                        <textarea
                            rows={4}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-bold"
                    >
                        Launch Drive
                    </button>
                </form>
            </div>
        </div>
    );
}