import Image from "next/image";
import Link from "next/link";
import {
    BarChart3,
    BookOpen,
    FileText,
    LayoutDashboard,
    LogOut,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";

const navItems = [
    {
        name: "Dashboard",
        href: "/admin-dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Users",
        href: "/admin-dashboard/users",
        icon: Users,
    },
    {
        name: "Question Bank",
        href: "/admin-dashboard/question-bank",
        icon: BookOpen,
    },
    {
        name: "Exams",
        href: "/admin-dashboard/exams",
        icon: FileText,
    },
    {
        name: "Results",
        href: "/admin-dashboard/results",
        icon: BarChart3,
    },
];

export default function Sidebar() {
    return (
        <aside className="flex h-screen w-full flex-col border-r border-[#174d3d] bg-[#0a2e22]">

            {/* Logo */}
            <div className="flex h-[88px] items-center border-b border-[#174d3d] px-6">
                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#f9a825]">
                        <Image
                            src="/rpto1-logo.png"
                            alt="Vayuratha"
                            width={40}
                            height={40}
                            className="h-full w-full object-contain p-1"
                        />
                    </div>

                    <div>
                        <h1 className="text-[17px] font-bold leading-5 text-white">
                            Vayuratha
                        </h1>

                        <p className="mt-1 text-[12px] text-[#77988d]">
                            Test Portal · Admin
                        </p>
                    </div>

                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 py-5">

                <p className="mb-4 px-3 text-[11px] font-bold tracking-[2px] text-[#54796d]">
                    NAVIGATION
                </p>

                <nav className="space-y-1.5">

                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="
                                    group
                                    flex
                                    h-[44px]
                                    items-center
                                    gap-4
                                    rounded-full
                                    px-4
                                    text-[14px]
                                    font-semibold
                                    text-[#8ba79e]
                                    transition-all
                                    duration-200
                                    hover:bg-[#124737]
                                    hover:text-white
                                "
                            >
                                <Icon
                                    size={19}
                                    strokeWidth={1.8}
                                    className="text-[#78968d] group-hover:text-white"
                                />

                                <span>{item.name}</span>
                            </Link>
                        );
                    })}

                </nav>
            </div>

            {/* Admin Console */}
            <div className="flex items-center justify-between border-t border-[#174d3d] px-7 py-7">

                <div>
                    <h3 className="text-[14px] font-bold text-white">
                        Admin Console
                    </h3>

                    <p className="mt-1 text-[12px] text-[#6f9187]">
                        admin@vayuratha.in
                    </p>
                </div>

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

        </aside>
    );
}