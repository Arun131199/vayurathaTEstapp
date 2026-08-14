import { getAdminResultDetails } from "@/lib/actions/exam";

interface Props {
    params: Promise<{
        attemptId: string;
    }>;
}

export default async function ResultReviewPage({ params }: Props) {
    const { attemptId } = await params;

    const result = await getAdminResultDetails(
        Number(attemptId)
    );

    return (
        <div className="p-6 space-y-6">

            <div>
                <h1 className="text-xl font-bold text-white">
                    {result.studentName}
                </h1>

                <p className="text-gray-400">
                    {result.examTitle}
                </p>
            </div>

            <div className="space-y-4">

                {result.questions.map((question: any) => (
                    <div
                        key={question.questionId}
                        className="rounded-xl border border-white/10 bg-white/5 p-5"
                    >
                        <h2 className="font-semibold text-white">
                            {question.number}. {question.questionText}
                        </h2>

                        <div className="mt-4 space-y-2">
                            {Object.entries(question.options).map(
                                ([key, value]) => (
                                    <div
                                        key={key}
                                        className={`rounded-lg border p-3 ${key === question.correctOption
                                                ? "border-green-500 bg-green-500/10"
                                                : key === question.selectedOption
                                                    ? "border-red-500 bg-red-500/10"
                                                    : "border-white/10"
                                            }`}
                                    >
                                        <span className="font-semibold text-white">
                                            {key}.
                                        </span>{" "}
                                        <span className="text-gray-300">
                                            {String(value)}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="mt-4 space-y-1 text-sm">
                            <p className="text-gray-400">
                                Student Answer:{" "}
                                <span className="text-white">
                                    {question.selectedAnswer || "Not Answered"}
                                </span>
                            </p>

                            <p className="text-gray-400">
                                Correct Answer:{" "}
                                <span className="text-green-400">
                                    {question.correctAnswer}
                                </span>
                            </p>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}