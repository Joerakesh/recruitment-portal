"use client";

import { useState, useEffect } from "react"; // Added useEffect
import { useRouter } from "next/navigation";

export default function CreateDrivePage() {
    const router = useRouter();
    const [courses, setCourses] = useState<string[]>([]); // Dynamic courses state
    const [loadingCourses, setLoadingCourses] = useState(true);

    const [formData, setFormData] = useState({
        companyName: "",
        jobRole: "",
        salary: "",
        deadline: "",
        eligibleCourses: [] as string[],
        description: "",
        minCgpa: 0, // Added minCgpa to form
    });

    // Fetch unique courses from the database
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch("/api/admin/courses");
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data);
                }
            } catch (err) {
                console.error("Failed to load courses", err);
            } finally {
                setLoadingCourses(false);
            }
        };
        fetchCourses();
    }, []);

    const toggleCourse = (course: string) => {
        setFormData(prev => ({
            ...prev,
            eligibleCourses: prev.eligibleCourses.includes(course)
                ? prev.eligibleCourses.filter(c => c !== course)
                : [...prev.eligibleCourses, course]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch("/api/drives", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData }),
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
                    {/* ... (Company Name, Role, Salary, Deadline fields remain same) ... */}
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

                    {/* Minimum CGPA Requirement */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Minimum CGPA Criteria</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="e.g. 7.5"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            onChange={(e) => setFormData({ ...formData, minCgpa: parseFloat(e.target.value) || 0 })}
                        />
                    </div>

                    {/* Dynamic Course Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Eligible Courses (fetched from DB)</label>
                        {loadingCourses ? (
                            <p className="text-gray-400 text-xs animate-pulse">Loading course list...</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md bg-gray-50">
                                {courses.map(course => (
                                    <label key={course} className="flex items-center space-x-2 p-2 border bg-white rounded hover:bg-blue-50 cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.eligibleCourses.includes(course)}
                                            onChange={() => toggleCourse(course)}
                                        />
                                        <span className="text-xs font-medium">{course}</span>
                                    </label>
                                ))}
                            </div>
                        )}
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