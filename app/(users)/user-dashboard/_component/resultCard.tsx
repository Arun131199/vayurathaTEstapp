interface ResultCardProps {
    examName: string;
    status: "PASS" | "FAIL";
    score: number;
    date: string;
    totalMarks?: number;
}

export function ResultCard({ examName, status, score, date, totalMarks }: ResultCardProps) {
    return (
        <div
            className="
                w-full
                max-w-107.5
                rounded-[20px]
                border
                border-[#205746]
                bg-[#0d4939]
                px-5
                py-4
            "
        >
            {/* Top */}
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-[15px] font-bold text-white">{examName}</h2>

                <span
                    className={`
                        rounded-full
                        border
                        px-4
                        py-1
                        text-[11px]
                        font-bold
                        ${status === "PASS"
                            ? "border-[#087b63] bg-[#087b63]/20 text-[#00d6a4]"
                            : "border-red-500/40 bg-red-500/10 text-red-400"
                        }
                    `}
                >
                    {status}
                </span>
            </div>

            {/* Progress */}
            <div className="mt-5 flex items-center gap-3">
                <div className="h-1.25 flex-1 overflow-hidden rounded-full bg-[#315f50]">
                    <div
                        className="h-full rounded-full bg-[#00c99a]"
                        style={{ width: `${score}%` }}
                    />
                </div>
                <span className="text-xs font-bold text-white">{score}/{totalMarks}</span>
            </div>

            {/* Date */}
            <p className="mt-4 text-xs text-[#71968c]">{date}</p>
        </div>
    );
}