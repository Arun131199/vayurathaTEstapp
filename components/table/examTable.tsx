"use client";

import { useState } from "react";
import { Send, UserRoundArrowLeft } from "lucide-react";
import { toast } from "sonner";

import RecentExamTable from "@/components/table/RecentExamTable";
import { ExamRow } from "@/types/tableType";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { examTableColums } from "./tableColumn ";
import {
    publishExam,
    assignExamToAll,
} from "@/lib/actions/exam";

interface ExamTableProps {
    exams: ExamRow[];
}

export default function ExamTable({ exams }: ExamTableProps) {
    const [selectedExam, setSelectedExam] = useState<ExamRow | null>(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [isPublishing, setIsPublishing] = useState(false);

    // NEW - track which exam is currently being assigned
    const [assigningExamId, setAssigningExamId] = useState<number | null>(null);

    const handlePublishClick = (exam: ExamRow) => {
        setSelectedExam(exam);
        setStartTime("");
        setEndTime("");
    };

    const handleClose = () => {
        if (isPublishing) return;
        setSelectedExam(null);
        setStartTime("");
        setEndTime("");
    };

    const handlePublish = async () => {
        if (!selectedExam) return;
        if (!startTime) {
            toast.error("Please select start time");
            return;
        }
        if (!endTime) {
            toast.error("Please select end time");
            return;
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start >= end) {
            toast.error("End time must be after start time");
            return;
        }

        try {
            setIsPublishing(true);
            const payload = {
                startTime: `${startTime}:00`,
                endTime: `${endTime}:00`,
            };

            await publishExam(selectedExam.id, payload);
            toast.success("Exam scheduled successfully");
            handleClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to schedule exam");
        } finally {
            setIsPublishing(false);
        }
    };

    // NEW - assign exam to all students
    const handleAssignAll = async (exam: ExamRow) => {
        if (assigningExamId) return;   // prevent double-click while one is in progress

        try {
            setAssigningExamId(exam.id);
            const result = await assignExamToAll(exam.id);
            toast.success(result || "Exam assigned to all students");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to assign exam");
        } finally {
            setAssigningExamId(null);
        }
    };

    return (
        <>
            <RecentExamTable
                title="CURRENT EXAMS"
                columns={examTableColums}
                data={exams}
                isFilter={false}
                actions={(row: ExamRow) => (
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            title="Schedule Exam"
                            onClick={(event) => {
                                event.stopPropagation();
                                handlePublishClick(row);
                            }}
                            className="flex h-9 w-9 items-center justify-center
            rounded-full text-[#8db0a5] transition hover:bg-[#f9a825]/10 hover:text-[#f9a825]"
                        >
                            <Send size={17} strokeWidth={1.8} />
                        </button>

                        <button
                            type="button"
                            title="Assign to All Students"
                            disabled={assigningExamId === row.id}
                            onClick={(event) => {
                                event.stopPropagation();
                                handleAssignAll(row);
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-[#8db0a5] transition
            hover:bg-[#f9a825]/10 hover:text-[#f9a825] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <UserRoundArrowLeft size={17} strokeWidth={1.8} />
                        </button>
                    </div>
                )}
            />

            <Dialog
                open={!!selectedExam}
                onOpenChange={(open) => {
                    if (!open) handleClose();
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Schedule Exam</DialogTitle>
                        <DialogDescription>
                            Set the start and end time for this exam.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedExam && (
                        <div className="space-y-5 py-4">
                            <div className="rounded-xl border border-[#205746] bg-white/5 px-4 py-4">
                                <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-[#6d978a]">
                                    EXAM
                                </p>
                                <p className="mt-1 font-semibold text-white">{selectedExam.title}</p>
                                <p className="mt-1 text-xs text-[#8db0a5]">{selectedExam.category}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Start Time</label>
                                <Input
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(event) => setStartTime(event.target.value)}
                                    className="h-11 border-[#205746] bg-white/5 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">End Time</label>
                                <Input
                                    type="datetime-local"
                                    value={endTime}
                                    onChange={(event) => setEndTime(event.target.value)}
                                    className="h-11 border-[#205746] bg-white/5 text-white"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isPublishing}
                            onClick={handleClose}
                            className="border-[#205746] bg-transparent text-white hover:bg-white/10"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            disabled={isPublishing}
                            onClick={handlePublish}
                            className="bg-[#f9a825] text-[#0a2e22] font-semibold hover:bg-[#f9a825]/90"
                        >
                            {isPublishing ? "Scheduling..." : "Schedule Exam"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}