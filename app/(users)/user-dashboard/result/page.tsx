import { getMyResults } from "@/lib/actions/exam";
import { ExamResult } from "@/types/result";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";


const categoryData = [
    {
        name: "Regulatory",
        score: 92,
    },
    {
        name: "Technical",
        score: 83,
    },
    {
        name: "Operations",
        score: 80,
    },
    {
        name: "Navigation",
        score: 75,
    },
    {
        name: "Emergency",
        score: 67,
    },
];

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
            <div className="w-full max-w-md rounded-[24px] border border-[#205746] bg-[#0d4939] p-8 text-center">

                {/* Score Circle */}
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-8 border-[#f9a825]">
                    <div>
                        <p className="text-3xl font-bold text-white">
                            {latest.score}/{latest.totalMarks}
                        </p>
                        <p className="text-sm text-[#9ab7af]">{latest.percentage}%</p>
                    </div>
                </div>

                {/* Pass/Fail badge */}
                <div className="mt-6 flex items-center justify-center gap-2">
                    {latest.passed ? (
                        <>
                            <CheckCircle2 className="text-[#00d6a4]" size={22} />
                            <span className="text-lg font-bold text-[#00d6a4]">PASS</span>
                        </>
                    ) : (
                        <>
                            <XCircle className="text-[#ff6254]" size={22} />
                            <span className="text-lg font-bold text-[#ff6254]">FAIL</span>
                        </>
                    )}
                </div>

                <h2 className="mt-4 text-lg font-semibold text-white">{latest.examTitle}</h2>
                <p className="text-sm text-[#8db0a5]">{latest.category}</p>

                {/* Breakdown */}
                <div className="mt-6 grid grid-cols-2 gap-3 text-left">
                    <div className="rounded-[14px] bg-white/5 px-4 py-3">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-[#6d978a]">
                            Score
                        </p>
                        <p className="mt-1 text-sm font-bold text-white">
                            {latest.score}/{latest.totalMarks}
                        </p>
                    </div>

                    <div className="rounded-[14px] bg-white/5 px-4 py-3">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-[#6d978a]">
                            Percentage
                        </p>
                        <p className="mt-1 text-sm font-bold text-white">{latest.percentage}%</p>
                    </div>

                    <div className="rounded-[14px] bg-white/5 px-4 py-3">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-[#6d978a]">
                            Status
                        </p>
                        <p className="mt-1 text-sm font-bold text-white">
                            {latest.status.replace("_", " ")}
                        </p>
                    </div>

                    <div className="rounded-[14px] bg-white/5 px-4 py-3">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-[#6d978a]">
                            Violations
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-sm font-bold text-white">
                            {latest.violationCount > 0 && (
                                <AlertTriangle size={14} className="text-[#ff6254]" />
                            )}
                            {latest.violationCount}
                        </p>
                    </div>
                </div>

                <Link
                    href="/user-dashboard"
                    className="mt-8 inline-block h-11 w-full rounded-full bg-[#f9a825] px-6 py-3 text-sm font-bold text-[#07372a] transition hover:bg-[#ffb52e]"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}