"use client";

import { Fragment, useState } from "react";
import {
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { TableColumn } from "@/types/tableType";
import { useRouter } from "next/navigation";

interface TableProps<T extends { id: number }> {
    columns: TableColumn<T>[];
    data: T[];
    expandable?: boolean;
    showReview?: boolean;
}

export default function Table<T extends { id: number }>({
    columns,
    data,
    expandable = false,
    showReview = false,
}: TableProps<T>) {

    const router = useRouter();

    const [expandedRow, setExpandedRow] =
        useState<number | null>(null);

    const handleRowClick = (id: number) => {
        if (!expandable) return;

        setExpandedRow((current) =>
            current === id ? null : id
        );
    };

    const handleReview = (id: number) => {
        console.log("REVIEW CLICKED");
        console.log("ATTEMPT ID:", id);

        router.push(
            `/admin-dashboard/results/${id}`
        );
    };

    return (
        <div className="w-full overflow-hidden rounded-[20px] border border-[#205746] bg-[#0e4938]">

            <div className="max-h-125 overflow-x-auto overflow-y-auto">

                <table className="w-full border-collapse">

                    <thead>
                        <tr className="border-b border-[#205746]">

                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    className="
                                        sticky top-0 z-10
                                        bg-[#0e4938]
                                        px-7 py-4
                                        text-left
                                        text-[11px]
                                        font-bold
                                        tracking-[1.5px]
                                        text-[#5f877b]
                                    "
                                >
                                    {column.title}
                                </th>
                            ))}

                            {showReview && (
                                <th
                                    className="
                                        sticky top-0 z-10
                                        w-24
                                        bg-[#0e4938]
                                        px-4 py-4
                                        text-right
                                        text-[11px]
                                        font-bold
                                        tracking-[1.5px]
                                        text-[#5f877b]
                                    "
                                >
                                    ACTION
                                </th>
                            )}

                            {expandable && (
                                <th className="w-12 px-4" />
                            )}

                        </tr>
                    </thead>

                    <tbody>

                        {data.length === 0 ? (

                            <tr>
                                <td
                                    colSpan={
                                        columns.length +
                                        (showReview ? 1 : 0) +
                                        (expandable ? 1 : 0)
                                    }
                                    className="
                                        px-7
                                        py-12
                                        text-center
                                        text-sm
                                        text-gray-400
                                    "
                                >
                                    No data found
                                </td>
                            </tr>

                        ) : (

                            data.map((row) => {

                                const isExpanded =
                                    expandedRow === row.id;

                                return (
                                    <Fragment key={row.id}>

                                        <tr
                                            onClick={() =>
                                                handleRowClick(row.id)
                                            }
                                            className={`
                                                border-b
                                                border-[#205746]
                                                transition-colors
                                                hover:bg-white/[0.025]
                                                ${expandable
                                                    ? "cursor-pointer"
                                                    : ""
                                                }
                                                ${isExpanded
                                                    ? "bg-white/[0.025]"
                                                    : ""
                                                }
                                            `}
                                        >

                                            {columns.map((column) => (
                                                <td
                                                    key={String(column.key)}
                                                    className="px-7 py-4 text-sm"
                                                >
                                                    {column.render
                                                        ? column.render(row)
                                                        : String(
                                                            row[
                                                            column.key as keyof T
                                                            ] ?? ""
                                                        )}
                                                </td>
                                            ))}

                                            {showReview && (
                                                <td
                                                    className="px-4 py-4 text-right"
                                                    onClick={(event) =>
                                                        event.stopPropagation()
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleReview(
                                                                row.id
                                                            )
                                                        }
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            rounded-md
                                                            bg-amber-400
                                                            px-3
                                                            py-2
                                                            text-xs
                                                            font-semibold
                                                            text-[#0a2e22]
                                                            transition
                                                            hover:bg-amber-500
                                                        "
                                                    >
                                                        Review
                                                    </button>
                                                </td>
                                            )}

                                            {expandable && (
                                                <td
                                                    className="px-4"
                                                    onClick={(event) =>
                                                        event.stopPropagation()
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRowClick(
                                                                row.id
                                                            )
                                                        }
                                                        className="
                                                            rounded-md
                                                            p-1
                                                            hover:bg-white/10
                                                        "
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp
                                                                size={17}
                                                                strokeWidth={1.8}
                                                                className="text-[#779d91]"
                                                            />
                                                        ) : (
                                                            <ChevronDown
                                                                size={17}
                                                                strokeWidth={1.8}
                                                                className="text-[#54796d]"
                                                            />
                                                        )}
                                                    </button>
                                                </td>
                                            )}

                                        </tr>

                                        {expandable && isExpanded && (
                                            <tr className="border-b border-[#205746]">
                                                <td
                                                    colSpan={
                                                        columns.length +
                                                        (showReview ? 1 : 0) +
                                                        1
                                                    }
                                                    className="p-0"
                                                >
                                                    <div className="grid grid-cols-1 gap-5 bg-[#0b3d2f] px-7 py-5 sm:grid-cols-2 lg:grid-cols-5">

                                                        <DetailCard
                                                            title="Questions"
                                                            value={`${(row as any).answeredCount}/${(row as any).totalQuestions}`}
                                                        />

                                                        <DetailCard
                                                            title="Correct"
                                                            value={`${(row as any).correctCount}/${(row as any).totalQuestions}`}
                                                        />

                                                        <DetailCard
                                                            title="Wrong"
                                                            value={`${(row as any).wrongCount}/${(row as any).totalQuestions}`}
                                                        />

                                                        <DetailCard
                                                            title="Time"
                                                            value={`${(row as any).timeTakenMinutes} min`}
                                                        />

                                                        <DetailCard
                                                            title="Violations"
                                                            value={`${(row as any).violationCount} / 3`}
                                                        />

                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                    </Fragment>
                                );
                            })

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

function DetailCard({
    title,
    value,
}: {
    title: string;
    value: string | number;
}) {
    return (
        <div className="rounded-[18px] bg-white/5 px-5 py-4">

            <p className="text-[11px] font-medium uppercase tracking-wide text-[#6d978a]">
                {title}
            </p>

            <p className="mt-2 text-sm font-bold text-white">
                {value}
            </p>

        </div>
    );
}