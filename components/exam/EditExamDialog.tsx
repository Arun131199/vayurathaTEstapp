"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { updateExamAction } from "@/lib/actions/examManage";
import { ExamRow } from "@/types/tableType";
import { ExamStatus, UpdateExamPayload } from "@/types/examManage";

interface EditExamDialogProps {
    exam: ExamRow;
    onClose: () => void;
}

const STATUS_OPTIONS: ExamStatus[] = ["DRAFT", "LIVE", "CLOSED"];

// Backend Instant (UTC) -> datetime-local value in IST
function toIstInput(value?: string | null): string {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(date);

    const get = (type: string) =>
        parts.find((part) => part.type === type)?.value ?? "00";

    return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

const fieldClass = "h-11 border-[#205746] bg-white/5 text-white";

export default function EditExamDialog({ exam, onClose }: EditExamDialogProps) {
    const router = useRouter();

    const [initial] = useState(() => ({
        title: exam.title ?? "",
        category: exam.category ?? "",
        questionCount: String(exam.questionCount ?? ""),
        durationMinutes: String(exam.durationMinutes ?? ""),
        startTime: toIstInput(exam.startTime),
        endTime: toIstInput(exam.endTime),
        status: (exam.status ?? "DRAFT") as ExamStatus,
        isDefaultForNewUsers: exam.isDefaultForNewUsers ?? true,
    }));

    const [form, setForm] = useState(initial);
    const [isSaving, setIsSaving] = useState(false);

    const setField = <K extends keyof typeof initial>(
        key: K,
        value: (typeof initial)[K]
    ) => {
        setForm((previous) => ({ ...previous, [key]: value }));
    };

    const handleSave = async () => {
        const title = form.title.trim();
        const category = form.category.trim();
        const questionCount = Number(form.questionCount);
        const durationMinutes = Number(form.durationMinutes);

        if (!title) {
            toast.error("Title cannot be empty");
            return;
        }
        if (!category) {
            toast.error("Category cannot be empty");
            return;
        }
        if (!Number.isInteger(questionCount) || questionCount <= 0) {
            toast.error("Question count must be a positive number");
            return;
        }
        if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
            toast.error("Duration must be a positive number");
            return;
        }
        if (
            form.startTime &&
            form.endTime &&
            new Date(form.startTime) >= new Date(form.endTime)
        ) {
            toast.error("End time must be after start time");
            return;
        }

        const payload: UpdateExamPayload = {};

        if (title !== initial.title) payload.title = title;
        if (category !== initial.category) payload.category = category;
        if (questionCount !== Number(initial.questionCount)) {
            payload.questionCount = questionCount;
        }
        if (durationMinutes !== Number(initial.durationMinutes)) {
            payload.durationMinutes = durationMinutes;
        }
        if (form.startTime && form.startTime !== initial.startTime) {
            payload.startTime = `${form.startTime}:00`;
        }
        if (form.endTime && form.endTime !== initial.endTime) {
            payload.endTime = `${form.endTime}:00`;
        }
        if (form.status !== initial.status) payload.status = form.status;
        if (form.isDefaultForNewUsers !== initial.isDefaultForNewUsers) {
            payload.isDefaultForNewUsers = form.isDefaultForNewUsers;
        }

        if (Object.keys(payload).length === 0) {
            toast.info("No changes to save");
            return;
        }

        try {
            setIsSaving(true);

            const result = await updateExamAction(exam.id, payload);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success("Exam updated successfully");
            router.refresh();
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open && !isSaving) onClose();
            }}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Edit Exam</DialogTitle>
                    <DialogDescription>
                        Maathina fields mattum save aagum.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Title</label>
                        <Input
                            value={form.title}
                            onChange={(e) => setField("title", e.target.value)}
                            className={fieldClass}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Category</label>
                        <Input
                            value={form.category}
                            onChange={(e) => setField("category", e.target.value)}
                            className={fieldClass}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Question Count</label>
                            <Input
                                type="number"
                                min={1}
                                value={form.questionCount}
                                onChange={(e) => setField("questionCount", e.target.value)}
                                className={fieldClass}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Duration (min)</label>
                            <Input
                                type="number"
                                min={1}
                                value={form.durationMinutes}
                                onChange={(e) => setField("durationMinutes", e.target.value)}
                                className={fieldClass}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Start Time (IST)</label>
                            <Input
                                type="datetime-local"
                                value={form.startTime}
                                onChange={(e) => setField("startTime", e.target.value)}
                                className={fieldClass}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold">End Time (IST)</label>
                            <Input
                                type="datetime-local"
                                value={form.endTime}
                                onChange={(e) => setField("endTime", e.target.value)}
                                className={fieldClass}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => setField("status", e.target.value as ExamStatus)}
                            className="h-11 w-full rounded-lg border border-[#205746] bg-[#0a2e22] px-3 text-white outline-none"
                        >
                            {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#205746] bg-white/5 px-4 py-3">
                        <input
                            type="checkbox"
                            checked={form.isDefaultForNewUsers}
                            onChange={(e) =>
                                setField("isDefaultForNewUsers", e.target.checked)
                            }
                            className="h-4 w-4 accent-[#f9a825]"
                        />
                        <span className="text-sm">
                            Puthusa register aagura students-ku automatic-a assign pannu
                        </span>
                    </label>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSaving}
                        onClick={onClose}
                        className="border-[#205746] bg-transparent text-white hover:bg-white/10"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        disabled={isSaving}
                        onClick={handleSave}
                        className="bg-[#f9a825] font-semibold text-[#0a2e22] hover:bg-[#f9a825]/90"
                    >
                        {isSaving ? (
                            <>
                                <LoaderCircle size={16} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}