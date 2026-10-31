"use client";

import Table from "./table";
import { TableColumn } from "@/types/tableType";
import { Input } from "../ui/input";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface RecentExamTableProps<
    T extends {
        id: number;
        status?: string;
        passed?: boolean;
    }
> {
    data: T[];
    columns: TableColumn<T>[];
    title: string;
    isFilter?: boolean;
    expandable?: boolean;
    filterOptions?: string[];
    showReview?: boolean;

    actions?: (row: T) => React.ReactNode;
}

export default function RecentExamTable<
    T extends {
        id: number;
        status?: string;
        passed?: boolean;
    }
>({
    data,
    columns,
    title,
    isFilter = true,
    expandable = false,
    filterOptions = ["all", "PASS", "FAIL"],
    showReview = false,
    actions
}: RecentExamTableProps<T>) {

    const [search, setSearch] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");

    const filteredData = useMemo(() => {

        return data.filter((row) => {

            const matchesSearch = columns.some((column) => {

                const value =
                    row[column.key as keyof T];

                return String(value ?? "")
                    .toLowerCase()
                    .includes(search.toLowerCase());
            });

            let matchesFilter = true;

            if (selectedFilter === "PASS") {

                matchesFilter =
                    row.passed === true;

            } else if (selectedFilter === "FAIL") {

                matchesFilter =
                    row.passed === false;

            } else if (selectedFilter !== "all") {

                matchesFilter =
                    String(row.status ?? "")
                        .toLowerCase() ===
                    selectedFilter.toLowerCase();
            }

            return matchesSearch && matchesFilter;
        });

    }, [
        data,
        columns,
        search,
        selectedFilter,
    ]);

    const handleExport = async () => {
        try {
            const response = await fetch("/api/admin/results/export", {
                method: "GET",
                credentials: "same-origin",
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error("Failed to export results");
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "admin-results.xlsx";

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Export error:", error);
        }
    };

    return (
        <div className="w-full">

            {/* Header */}

            <div className="mb-4 flex items-center justify-between">

                <h2 className="text-[17px] font-bold text-white">
                    {title}
                </h2>

            </div>


            <div className="flex flex-col gap-4">

                {/* Search + Filter */}

                <div className="flex items-center gap-4">

                    <Input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search here..."
                        className="
                            h-10
                            w-100
                            border-gray-600
                            text-white
                            placeholder:text-gray-500
                        "
                    />


                    {isFilter &&
                        filterOptions.length > 0 && (

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    rounded-md
                                    border
                                    border-gray-600
                                    p-1
                                "
                            >

                                {filterOptions.map(
                                    (filter) => {

                                        const isActive =
                                            selectedFilter ===
                                            filter;

                                        return (
                                            <Button
                                                key={filter}
                                                type="button"
                                                variant="ghost"
                                                onClick={() =>
                                                    setSelectedFilter(
                                                        filter
                                                    )
                                                }
                                                className={`
                                                    rounded-md
                                                    px-4
                                                    font-semibold
                                                    capitalize
                                                    transition-colors
                                                    ${isActive
                                                        ? "bg-amber-300/20 text-white"
                                                        : "text-gray-500 hover:bg-white/5 hover:text-white"
                                                    }
                                                `}
                                            >
                                                {filter === "all"
                                                    ? "All"
                                                    : filter}
                                            </Button>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleExport}
                        className="
        h-10
        border-gray-600
        bg-transparent
        text-gray-300
        hover:bg-amber-400/10
        hover:text-amber-400
    "
                    >
                        Export
                    </Button>

                </div>


                {/* Table */}

                <Table
                    columns={columns}
                    data={filteredData}
                    expandable={expandable}
                    showReview={showReview}
                    actions={actions}
                />

            </div>

        </div>
    );
}