import { ReactNode } from "react";
import Sidebar from "./_components/sidebar/sidebar";

export default function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0e4132] text-white">

            {/* Fixed Sidebar */}
            <aside className="fixed left-0 top-0 z-50 h-screen w-[288px]">
                <Sidebar />
            </aside>

            {/* Main Content */}
            <main className="ml-72 min-h-screen p-6">
                {children}
            </main>

        </div>
    );
}