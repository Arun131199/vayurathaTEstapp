"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
    getExamAssigneesAction,
    syncExamUsersAction,
} from "@/lib/actions/examManage";
import { ExamRow, UserRow } from "@/types/tableType";

interface ExamStudentsDialogProps {
    exam: ExamRow;
    students: UserRow[];
    onClose: () => void;
}

export default function ExamStudentsDialog({
    exam,
    students,
    onClose,
}: ExamStudentsDialogProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    // userId -> "Completed" | "Started" (intha students-a remove panna mudiyadhu)
    const [lockedLabels, setLockedLabels] = useState<Record<string, string>>({});
    const [search, setSearch] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            const result = await getExamAssigneesAction(exam.id);

            if (cancelled) return;

            if (!result.success) {
                setLoadError(result.message);
                setLoading(false);
                return;
            }

            const labels: Record<string, string> = {};
            result.data.forEach((assignee) => {
                if (assignee.completed) {
                    labels[assignee.userId] = "Completed";
                } else if (assignee.attemptId !== null && assignee.attemptId !== undefined) {
                    labels[assignee.userId] = "Started";
                }
            });

            setSelected(new Set(result.data.map((assignee) => assignee.userId)));
            setLockedLabels(labels);
            setLoading(false);
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [exam.id]);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return students;

        return students.filter((student) =>
            `${student.fullName} ${student.userId} ${student.email}`
                .toLowerCase()
                .includes(term)
        );
    }, [students, search]);

    const toggle = (userId: string) => {
        if (lockedLabels[userId]) return;

        setSelected((previous) => {
            const next = new Set(previous);
            if (next.has(userId)) {
                next.delete(userId);
            } else {
                next.add(userId);
            }
            return next;
        });
    };

    const selectAllVisible = () => {
        setSelected((previous) => {
            const next = new Set(previous);
            filtered.forEach((student) => next.add(student.userId));
            return next;
        });
    };

    const clearVisible = () => {
        setSelected((previous) => {
            const next = new Set(previous);
            filtered.forEach((student) => {
                if (!lockedLabels[student.userId]) next.delete(student.userId);
            });
            return next;
        });
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);

            const result = await syncExamUsersAction(exam.id, Array.from(selected));

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
                    <DialogTitle className="text-xl font-bold">Assign Students</DialogTitle>
                    <DialogDescription>
                        {exam.title} · {exam.category}
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <LoaderCircle className="animate-spin text-[#f9a825]" />
                    </div>
                ) : loadError ? (
                    <p className="py-8 text-center text-sm text-[#ff6254]">{loadError}</p>
                ) : (
                    <div className="space-y-3">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, student id, email..."
                            className="h-10 border-[#205746] bg-white/5 text-white"
                        />

                        <div className="flex items-center justify-between text-xs text-[#8db0a5]">
                            <span>
                                {selected.size} selected · {filtered.length} shown
                            </span>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={selectAllVisible}
                                    className="font-semibold text-[#f9a825] hover:underline"
                                >
                                    Select all
                                </button>
                                <button
                                    type="button"
                                    onClick={clearVisible}
                                    className="font-semibold text-[#8db0a5] hover:underline"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                            {filtered.length === 0 ? (
                                <p className="py-8 text-center text-sm text-gray-400">
                                    No students found
                                </p>
                            ) : (
                                filtered.map((student) => {
                                    const locked = lockedLabels[student.userId];

                                    return (
                                        <label
                                            key={student.userId}
                                            className={`flex items-center gap-3 rounded-xl border border-[#205746] bg-white/5 px-4 py-3 ${locked ? "opacity-70" : "cursor-pointer hover:bg-white/10"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selected.has(student.userId)}
                                                disabled={Boolean(locked)}
                                                onChange={() => toggle(student.userId)}
                                                className="h-4 w-4 accent-[#f9a825]"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-semibold text-white">
                                                    {student.fullName}
                                                </p>
                                                <p className="truncate text-xs text-[#8db0a5]">
                                                    {student.userId} · {student.email}
                                                </p>
                                            </div>

                                            {locked && (
                                                <span className="rounded-full border border-[#88701e] bg-[#f9a825]/10 px-3 py-1 text-[10px] font-bold text-[#f9a825]">
                                                    {locked.toUpperCase()}
                                                </span>
                                            )}
                                        </label>
                                    );
                                })
                            )}
                        </div>
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