"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import Table from "@/components/table/table";
import { userTableColumns } from "@/components/table/tableColumn ";
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
import {
    getUserExamAssignmentsAction,
    syncUserExamsAction,
} from "@/lib/actions/examManage";
import { UserRow } from "@/types/tableType";
import { UserExamAssignment } from "@/types/examManage";

interface UserExamAssignmentsProps {
    students: UserRow[];
}

export default function UserExamAssignments({ students }: UserExamAssignmentsProps) {
    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<UserRow | null>(null);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return students;

        return students.filter((student) =>
            `${student.fullName} ${student.userId} ${student.email}`
                .toLowerCase()
                .includes(term)
        );
    }, [students, search]);

    return (
        <div className="flex flex-col gap-4">
            <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student..."
                className="h-10 w-100 border-gray-600 text-white placeholder:text-gray-500"
            />

            <Table
                columns={userTableColumns}
                data={filtered}
                actions={(row: UserRow) => (
                    <button
                        type="button"
                        title="Manage Exams"
                        onClick={() => setSelectedStudent(row)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#8db0a5] transition hover:bg-[#f9a825]/10 hover:text-[#f9a825]"
                    >
                        <ClipboardList size={17} strokeWidth={1.8} />
                    </button>
                )}
            />

            {selectedStudent && (
                <UserExamsDialog
                    key={selectedStudent.userId}
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                />
            )}
        </div>
    );
}

function statusClass(status: string) {
    if (status === "LIVE") return "border-[#087b63] bg-[#087b63]/20 text-[#00d6a4]";
    if (status === "CLOSED") return "border-[#a14a3b] bg-[#a14a3b]/20 text-[#ff6254]";
    return "border-[#5f877b] bg-white/5 text-[#8db0a5]";
}

function UserExamsDialog({
    student,
    onClose,
}: {
    student: UserRow;
    onClose: () => void;
}) {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [exams, setExams] = useState<UserExamAssignment[]>([]);
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            const result = await getUserExamAssignmentsAction(student.userId);

            if (cancelled) return;

            if (!result.success) {
                setLoadError(result.message);
                setLoading(false);
                return;
            }

            setExams(result.data);
            setSelected(
                new Set(result.data.filter((exam) => exam.assigned).map((exam) => exam.examId))
            );
            setLoading(false);
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [student.userId]);

    const lockedLabel = (exam: UserExamAssignment): string | null => {
        if (!exam.assigned) return null;
        if (exam.completed) return "Completed";
        if (exam.attemptId !== null && exam.attemptId !== undefined) return "Started";
        return null;
    };

    const toggle = (exam: UserExamAssignment) => {
        if (lockedLabel(exam)) return;

        setSelected((previous) => {
            const next = new Set(previous);
            if (next.has(exam.examId)) {
                next.delete(exam.examId);
            } else {
                next.add(exam.examId);
            }
            return next;
        });
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);

            const result = await syncUserExamsAction(student.userId, Array.from(selected));

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            const { added, removed, totalAssigned } = result.data;
            toast.success(
                `Added ${added}, removed ${removed}. Total assigned: ${totalAssigned}`
            );
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
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{student.fullName}</DialogTitle>
                    <DialogDescription>
                        {student.userId} · {student.email}
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <LoaderCircle className="animate-spin text-[#f9a825]" />
                    </div>
                ) : loadError ? (
                    <p className="py-8 text-center text-sm text-[#ff6254]">{loadError}</p>
                ) : exams.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-400">
                        No exams created yet
                    </p>
                ) : (
                    <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                        {exams.map((exam) => {
                            const locked = lockedLabel(exam);

                            return (
                                <label
                                    key={exam.examId}
                                    className={`flex items-center gap-3 rounded-xl border border-[#205746] bg-white/5 px-4 py-3 ${locked ? "opacity-70" : "cursor-pointer hover:bg-white/10"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected.has(exam.examId)}
                                        disabled={Boolean(locked)}
                                        onChange={() => toggle(exam)}
                                        className="h-4 w-4 accent-[#f9a825]"
                                    />

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-white">
                                            {exam.title}
                                        </p>
                                        <p className="truncate text-xs text-[#8db0a5]">
                                            {exam.category} · {exam.questionCount} questions ·{" "}
                                            {exam.durationMinutes} min
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        <span
                                            className={`rounded-full border px-3 py-0.5 text-[10px] font-bold ${statusClass(
                                                exam.status
                                            )}`}
                                        >
                                            {exam.status}
                                        </span>

                                        {locked && (
                                            <span className="rounded-full border border-[#88701e] bg-[#f9a825]/10 px-3 py-0.5 text-[10px] font-bold text-[#f9a825]">
                                                {locked.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                )}

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
                        disabled={isSaving || loading || Boolean(loadError)}
                        onClick={handleSave}
                        className="bg-[#f9a825] font-semibold text-[#0a2e22] hover:bg-[#f9a825]/90"
                    >
                        {isSaving ? (
                            <>
                                <LoaderCircle size={16} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Assignment"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}