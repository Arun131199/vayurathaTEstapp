"use client";

import { AdminResultRow, ExamRow, TableColumn, UserRow } from "@/types/tableType";
import { Button } from "@base-ui/react";


export const userTableColumns: TableColumn<UserRow>[] = [
    {
        key: "fullName",
        title: "NAME",
        render: (row) => {
            const initials = row.fullName
                .split(" ")
                .map((name: string) => name[0])
                .join("");

            return (
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex h-9 w-9 shrink-0 items-center justify-center
                            rounded-full bg-[#536c29] text-[11px] font-bold text-[#f9a825]
                        "
                    >
                        {initials}
                    </div>
                    <span className="font-semibold text-white">{row.fullName}</span>
                </div>
            );
        },
    },
    {
        key: "userId",
        title: "STUDENT ID",
        render: (row) => <span className="text-[#8db0a5]">{row.userId}</span>,
    },
    {
        key: "email",
        title: "EMAIL",
        render: (row) => <span className="text-[#70988c]">{row.email}</span>,
    },
    {
        key: "role",
        title: "ROLE",
        render: (row) => (
            <span
                className="
                    inline-flex rounded-full border border-[#087b63]
                    bg-[#087b63]/20 px-3 py-1 text-[11px] font-bold text-[#00d6a4]
                "
            >
                {row.role}
            </span>
        ),
    },
];

export const examTableColums: TableColumn<ExamRow>[] = [
    {
        key: "title",
        title: "TITLE",
        render: (row) => (
            <span className="font-semibold text-white">
                {row.title}
            </span>
        ),
    },

    {
        key: "category",
        title: "CATEGORY",
        render: (row) => (
            <span className="text-[#8db0a5]">
                {row.category}
            </span>
        ),
    },

    {
        key: "questionCount",
        title: "QUESTION COUNT",
        render: (row) => (
            <span className="text-[#70988c]">
                {row.questionCount}
            </span>
        ),
    },

    {
        key: "durationMinutes",
        title: "DURATION",
        render: (row) => (
            <span className="text-[#70988c]">
                {row.durationMinutes} min
            </span>
        ),
    },
    {
        key: "status",
        title: "STATUS",
        render: (row) => (
            <span className="text-[#8db0a5]">
                {row.status}
            </span>
        ),
    },
]

export const resultTableColumns: TableColumn<AdminResultRow>[] = [
    {
        key: "studentName",
        title: "STUDENT",
        render: (row) => {
            const studentName = row.studentName ?? "Unknown Student";

            const initials = studentName
                .split(" ")
                .filter(Boolean)
                .map((name) => name[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

            return (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#536c29] text-[11px] font-bold text-[#f9a825]">
                        {initials || "U"}
                    </div>

                    <span className="font-semibold text-white">
                        {studentName}
                    </span>
                </div>
            );
        },
    },

    {
        key: "examTitle",
        title: "EXAM",
        render: (row) => (
            <span className="text-[#8db0a5]">
                {row.examTitle ?? "-"}
            </span>
        ),
    },

    {
        key: "score",
        title: "SCORE",
        render: (row) => (
            <span className="font-bold text-white">
                {row.score ?? 0}/{row.totalMarks ?? 0}
            </span>
        ),
    },

    {
        key: "percentage",
        title: "%",
        render: (row) => {
            const percentage = Number(row.percentage ?? 0);

            return (
                <div className="flex items-center gap-3">
                    <div className="h-1.25 w-20 overflow-hidden rounded-full bg-[#315f50]">
                        <div
                            className="h-full rounded-full bg-[#00c99a]"
                            style={{
                                width: `${percentage}%`,
                            }}
                        />
                    </div>

                    <span className="font-bold text-white">
                        {percentage}%
                    </span>
                </div>
            );
        },
    },

    {
        key: "submittedAt",
        title: "DATE",
        render: (row) => (
            <span className="text-[#70988c]">
                {row.submittedAt
                    ? new Date(row.submittedAt).toLocaleDateString(
                        "en-IN",
                        {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                        }
                    )
                    : "-"}
            </span>
        ),
    },

    {
        key: "status",
        title: "STATUS",
        render: (row) => (
            <span
                className={`
                    inline-flex rounded-full border px-3 py-1
                    text-[11px] font-bold
                    ${row.passed
                        ? "border-[#087b63] bg-[#087b63]/20 text-[#00d6a4]"
                        : "border-[#a14a3b] bg-[#a14a3b]/20 text-[#ff6254]"
                    }
                `}
            >
                {row.passed ? "PASS" : "FAIL"}
            </span>
        ),
    },
];