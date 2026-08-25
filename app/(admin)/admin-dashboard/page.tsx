import { StatuscardProps } from "@/types/statuscardProps";
import { StatusCard } from "../_components/statusCard/card";
import { BookOpen, ChartColumn, Notebook, ScrollText, Users } from "lucide-react";
import { Suspense } from "react";
import { Loading } from "@/components/table/loading";
import { examAttempts } from "@/utils/examAttempts";
import RecentExamTable from "@/components/table/RecentExamTable";
import { getExamStats, getUsers } from "@/lib/api/exam";
import { userTableColumns } from "@/components/table/tableColumn ";

export default async function AdminDashboard() {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const stats = await getExamStats();
    const userData = await getUsers();
    const statusData: StatuscardProps[] = [
        {
            title: "Total Students",
            value: stats.totalStudents,
            icon: Users,
        },
        {
            title: "Active Exams",
            value: stats.activeExams,
            icon: ScrollText,
        },
        {
            title: "Questions",
            value: 50,
            icon: BookOpen,
        },
        {
            title: "Pass Rate",
            value: `${stats.overallPassPercentage}%`,
            icon: ChartColumn,
        },
    ];
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-lg font-semibold ">Dashboard</h1>
                <p className="text-sm text-gray-400">{formattedDate}</p>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {
                    statusData?.map((value, index) => (
                        <div key={index}>
                            <StatusCard
                                icon={value.icon}
                                title={value?.title}
                                value={value?.value}
                            />
                        </div>
                    ))
                }
            </div>
            <Suspense fallback={<Loading />}>
                <RecentExamTable
                    title="Total Users"
                    data={userData}
                    columns={userTableColumns}
                    isFilter={false}
                />
            </Suspense>
        </div>
    )
}