import { ReactNode } from "react";
import "../globals.css";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "../actions/auth";


export default function UserDashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <main className="min-h-screen bg-[#0a2e22]">
            <div>
                <div className="flex h-15 items-center justify-end bg-white/10 px-6">
                    <form action={logout}>
                        <Button
                            type="submit"
                            variant="ghost"
                            size="icon-lg"
                            aria-label="Logout"
                        >
                            <LogOut size={20} />
                        </Button>
                    </form>
                </div>

                <div>
                    {children}
                </div>
            </div>
        </main>
    );
}