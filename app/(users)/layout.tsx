import { ReactNode } from "react";
import "../globals.css";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "../actions/auth";
import { Navbar } from "./user-dashboard/_component/navbar";


export default function UserDashboardLayout({
    children,
}: {
    children: ReactNode;
}) {

    return (
        <main className="min-h-screen bg-[#0a2e22]">
            <div>
                <Navbar />

                <div>
                    {children}
                </div>
            </div>
        </main>
    );
}