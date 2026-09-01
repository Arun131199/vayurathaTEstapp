"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, X, XCircle } from "lucide-react";
import Link from "next/link";
import { ExamResult } from "@/types/result";

const ADMIN_WHATSAPP_NUMBER = "919384806205";

export default function ResultScoreCard({ latest }: { latest: ExamResult }) {
    const [showSharePopup, setShowSharePopup] = useState(false);

    const handleOpenWhatsApp = () => {
        const message = `Hi, I scored ${latest.score}/${latest.totalMarks} (${latest.percentage}%) in ${latest.examTitle}. Sharing my result screenshot.`;
        const waUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, "_blank");
    };

    return (
        <>
            <div className="w-full max-w-md rounded-[24px] border border-[#205746] bg-[#0d4939] p-8 text-center">

                {/* Score Circle */}
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-8 border-[#f9a825]">
                    <div>
                        <p className="text-3xl font-bold text-white">
                            {latest.score}/{latest.totalMarks}
                        </p>
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

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={() => setShowSharePopup(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366] bg-[#25D366]/10 px-4 py-2.5 text-sm font-bold text-[#25D366] transition hover:bg-[#25D366]/20"
                    >
                        Share result on WhatsApp
                    </button>
                </div>

                <Link
                    href="/user-dashboard"
                    className="mt-4 inline-block h-11 w-full rounded-full bg-[#f9a825] px-6 py-3 text-sm font-bold text-[#07372a] transition hover:bg-[#ffb52e]"
                >
                    Back to Dashboard
                </Link>
            </div>

            {showSharePopup && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
                    onClick={() => setShowSharePopup(false)}
                >
                    <div
                        className="w-full max-w-sm rounded-2xl border border-[#205746] bg-[#0d4939] p-6 text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-end">
                            <button
                                type="button"
                                onClick={() => setShowSharePopup(false)}
                                className="text-[#9ab7af] hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <h3 className="text-lg font-bold text-white">
                            Share your result
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[#9ab7af]">
                            1. Take a screenshot of your score card
                            <br />
                            2. Tap the button below to open WhatsApp
                            <br />
                            3. Attach the screenshot and send it
                        </p>

                        <button
                            type="button"
                            onClick={handleOpenWhatsApp}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-[#07372a] transition hover:bg-[#20bd5a]"
                        >
                            Open WhatsApp
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}