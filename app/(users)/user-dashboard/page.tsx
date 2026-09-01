import { cookies } from "next/headers";
import { ExamCard } from "./_component/examCard";
import { Hero } from "./_component/hero";
import { ResultCard } from "./_component/resultCard";
import { getExamPerUser } from "@/lib/api/userApis";
import { ExamResult } from "@/types/result";
import { getMyResults } from "@/lib/actions/exam";


export default async function UserDashboard() {

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
        throw new Error("User ID not found");
    }
    const exams = await getExamPerUser();
    const results: ExamResult[] = await getMyResults();
    const sortedResults = [...(results ?? [])].sort(
        (a, b) => new Date(b.submittedAt ?? 0).getTime() - new Date(a.submittedAt ?? 0).getTime()
    );

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-4">
            <Hero />

            <div className="space-y-4">

                {exams?.length > 0 ? (
                    exams.map((exam: any) => (
                        <ExamCard key={exam.id} exam={exam} />
                    ))
                ) : (
                    <div className="rounded-lg border border-amber-400/20 bg-white/10 p-6 text-center text-gray-400">
                        No exams available
                    </div>
                )}

                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedResults.length > 0 ? (
                        sortedResults.map((result, index) => (
                            <div key={index}>
                                <ResultCard
                                    key={result.attemptId}
                                    examName={result.category}
                                    status={result.passed ? "PASS" : "FAIL"}
                                    score={result.percentage}
                                    date={
                                        result.submittedAt
                                            ? new Date(result.submittedAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })
                                            : "In Progress"
                                    }
                                />
                            </div>
                        ))
                    ) : (
                        <div className="rounded-lg border border-amber-400/20 bg-white/10 p-6 text-center text-gray-400">
                            No results yet
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}