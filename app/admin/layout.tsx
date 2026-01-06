import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 text-xl font-bold border-b border-slate-800">
                    Placement Admin
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin/students" className="block p-3 rounded hover:bg-slate-800 transition">
                        🎓 Students List
                    </Link>
                    <Link href="/admin/import" className="block p-3 rounded hover:bg-slate-800 transition">
                        📥 Import Students
                    </Link>
                    <Link href="/admin/drives/new" className="block p-3 rounded hover:bg-slate-800 transition">
                        📢 Post Job Drive
                    </Link>
                    <Link href="/admin/applications" className="block p-3 rounded hover:bg-slate-800 transition">
                        📝 View Applications
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button className="w-full bg-red-600 p-2 rounded hover:bg-red-700">Logout</button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}