import RecentExamTable from "@/components/table/RecentExamTable"
import ExamCreation from "./_compoents/examcreation"
import { Suspense } from "react"
import { getExams } from "@/lib/api/exam";
import { examTableColums } from "@/components/table/tableColumn ";
import ExamTable from "@/components/table/examTable";

export default async function Exams() {
    const exams = await getExams();
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
                />
            </div>
        </div>
    )
}