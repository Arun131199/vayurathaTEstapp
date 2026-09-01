import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cookies } from "next/headers";

export async function Navbar() {
    const cookieStore = await cookies();

    const fullName = cookieStore.get("username")?.value?.trim() || "User";

    const profile = fullName
        .split(/\s+/)
        .map((name) => name.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <nav className="flex h-16 items-center justify-between border-b border-[#0a2e22]/10 bg-white/10 px-6">

            {/* Profile */}
            <div className="flex items-center gap-3">
                <div
                    className="
                        flex h-10 w-10 items-center justify-center
                        rounded-full
                        bg-white
                        text-sm font-bold
                        text-[#0a2e22]
                        shadow-sm
                    "
                    title={fullName}
                >
                    {profile}
                </div>

                <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-white">
                        {fullName}
                    </p>
                    <p className="text-sm font-semibold text-gray-400">User</p>
                </div>
            </div>

            {/* Logout */}
            <form action={logout}>
                <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    aria-label="Logout"
                    title="Logout"
                    className="
                        h-10 w-10
                        rounded-full
                        bg-white
                        text-[#0a2e22]
                        shadow-sm
                        transition-all
                        duration-200
                        hover:bg-[#0a2e22]
                        hover:text-white
                        hover:scale-105
                        cursor-pointer
                    "
                >
                    <LogOut size={19} />
                </Button>
            </form>
        </nav>
    );
}