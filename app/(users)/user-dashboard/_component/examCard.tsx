"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { LoaderCircle, Play } from "lucide-react";
import { startExam } from "@/lib/actions/exam";

interface ExamCardProps {
    exam: {
        id: number;
        title: string;
        category: string;
        questionCount: number;
        durationMinutes: number;
        status: string;
    };
}


export function ExamCard({
    exam,
}: ExamCardProps) {
    const router = useRouter();
    const [isStarting, setIsStarting] = useState(false);

    const handleStartExam = async () => {
        try {

            setIsStarting(true);
            const response = await startExam(exam.id);
            console.log(
                "START EXAM RESPONSE:",
                response
            );
            toast.success("Exam started successfully");
            router.push("/user-dashboard/exam");

        } catch (error: any) {

            console.error(
                "START EXAM ERROR:",
                error
            );

            toast.error(
                error?.message ||
                "Unable to start exam"
            );

        } finally {

            setIsStarting(false);

        }
    };

    return (
        <div className="space-y-4">

            <h1 className="text-md font-semibold text-white">
                Available Exams
            </h1>

            <div className="max-w-xl space-y-4 rounded-md border border-amber-400/20 bg-white/10 p-5 shadow-xl">

                <div className="flex items-center justify-between">

                    <h1 className="rounded-md border border-amber-400 bg-amber-400/30 px-6 py-1 text-sm font-semibold text-amber-300">
                        {exam.category}
                    </h1>

                    <p className="text-xs text-gray-200">
                        1 attempt
                    </p>

                </div>

                <div className="flex flex-col gap-4">

                    <h1 className="text-lg font-semibold text-white">
                        {exam.title}
                    </h1>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">
                            {exam.questionCount} questions
                        </span>

                        <span className="text-sm text-gray-400">
                            {exam.durationMinutes} min
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleStartExam}
                        disabled={isStarting}
                        className="flex h-9 items-center justify-center gap-2 rounded-md bg-amber-400 font-semibold text-[#0a2e22] hover:bg-amber-500 disabled:opacity-50"
                    >
                        {isStarting ? (
                            <>
                                <LoaderCircle
                                    size={16}
                                    className="animate-spin"
                                />
                                Starting...
                            </>
                        ) : (
                            <>
                                <Play size={16} />
                                Start Exam
                            </>
                        )}
                    </button>

                </div>

            </div>
        </div>
    );
}