import { getMyResults } from "@/lib/actions/exam";
import { ExamResult } from "@/types/result";
import ResultScoreCard from "./_resultCard/ResultScoreCard";


export default async function Result() {
    const results: ExamResult[] = await getMyResults();

    const latest = results.sort(
        (a, b) => new Date(b.submittedAt ?? 0).getTime() - new Date(a.submittedAt ?? 0).getTime()
    )[0];

    if (!latest) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#063528] text-white">
                No exam results found yet.
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#063528] px-6 text-white">
            <ResultScoreCard latest={latest} />
        </div>
    );
}