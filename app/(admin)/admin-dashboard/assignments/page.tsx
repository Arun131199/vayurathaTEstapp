import { getStudents } from "@/lib/api/examManage";
import UserExamAssignments from "./_components/userExamAssignments";

export default async function Assignments() {
    const students = await getStudents();

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col items-start gap-2">
                <h1 className="text-2xl font-semibold">Exam Assignments</h1>
                <p className="text-md text-gray-400">
                    Student-wise exam assignment manage pannunga
                </p>
            </div>

            <UserExamAssignments students={students} />
        </div>
    );
}