import RecentExamTable from "@/components/table/RecentExamTable"
import ExamCreation from "./_compoents/examcreation"
import { Suspense } from "react"
import { getExams } from "@/lib/api/exam";
import { getStudents } from "@/lib/api/examManage";
import { examTableColums } from "@/components/table/tableColumn ";
import ExamTable from "@/components/table/examTable";

export default async function Exams() {
    const [exams, students] = await Promise.all([getExams(), getStudents()]);
    return (
        <div className="space-y-8">
            <h1 className="text-xl ">EXAM</h1>
            <div>
                <ExamCreation
                    exams={exams}
                />
            </div>
            <div>
                <ExamTable
                    exams={exams}
                    students={students}
                />
            </div>
        </div>
    )
}