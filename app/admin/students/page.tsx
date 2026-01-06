"use client";

import { useEffect, useState } from "react";
import { IStudent } from "@/models/Student";

export default function AdminStudentList() {
    const [students, setStudents] = useState<IStudent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("/api/students")
            .then((res) => res.json())
            .then((data) => {
                setStudents(data);
                setLoading(false);
            });
    }, []);

    const filteredStudents = students.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center">Loading Student Records...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Centralized Student Records</h1>
                    <input
                        type="text"
                        placeholder="Search by name or roll no..."
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-80"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-blue-600 text-white text-left text-xs uppercase font-semibold">
                                <th className="px-5 py-3 border-b border-gray-200">Roll No</th>
                                <th className="px-5 py-3 border-b border-gray-200">Name</th>
                                <th className="px-5 py-3 border-b border-gray-200">Course</th>
                                <th className="px-5 py-3 border-b border-gray-200">Email</th>
                                <th className="px-5 py-3 border-b border-gray-200">Mobile</th>
                                <th className="px-5 py-3 border-b border-gray-200">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {filteredStudents.map((student) => (
                                <tr key={student.rollNo} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-4 border-b border-gray-200 font-medium">{student.rollNo}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 uppercase">{student.name}</td>
                                    <td className="px-5 py-4 border-b border-gray-200">{student.course}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{student.contact.email}</td>
                                    <td className="px-5 py-4 border-b border-gray-200">{student.contact.sMobile}</td>
                                    <td className="px-5 py-4 border-b border-gray-200">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {student.isVerified ? "Verified" : "Pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredStudents.length === 0 && (
                        <div className="p-10 text-center text-gray-500">No students found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}