"use client";

import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";

import {
    Check,
    Download,
    FileSpreadsheet,
    LoaderCircle,
    Upload,
    X,
} from "lucide-react";

import { toast } from "sonner";
import { importQuestion } from "@/lib/api/question";
import { getExamsClient } from "@/lib/api/exam-client";

const requiredColumns = [
    {
        id: 1,
        name: "A – Question text",
    },
    {
        id: 2,
        name: "B – Option A",
    },
    {
        id: 3,
        name: "C – Option B",
    },
    {
        id: 4,
        name: "D – Option C",
    },
    {
        id: 5,
        name: "E – Option D",
    },
    {
        id: 6,
        name: "F – Correct (A/B/C/D)",
    },
    {
        id: 7,
        name: "G – Category",
    },
    {
        id: 8,
        name: "H – Difficulty",
    },
];

interface Question {
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correct: string;
    category: string;
    difficulty: string;
}
interface Exam {
    id: number;
    title: string;
    category: string;
    questionCount: number;
    durationMinutes: number;
    status: string;
}
export default function QuestionBank() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [exams, setExams] = useState<Exam[]>([]);
    const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
    const [isLoadingExams, setIsLoadingExams] = useState(true);


    useEffect(() => {
        const loadExams = async () => {
            try {
                setIsLoadingExams(true);
                const data =await getExamsClient();
                setExams(data ?? []);
            } catch (error) {
                console.error("Failed to load exams:",error);
                toast.error("Failed to load exams");
            } finally {
                setIsLoadingExams(false);
            }
        };
        loadExams();
    }, []);


    const selectedExam = exams.find((exam) => exam.id === selectedExamId);


    const processFile = (file: File) => {

        const allowedTypes = [
            "xlsx",
            "xls",
            "csv",
        ];
        const extension =
            file.name
                .split(".")
                .pop()
                ?.toLowerCase();

        if (
            !extension ||
            !allowedTypes.includes(extension)
        ) {

            toast.error(
                "Please upload an Excel or CSV file."
            );

            return;
        }
        if (
            file.size >
            10 * 1024 * 1024
        ) {
            toast.error(
                "File size must be less than 10 MB."
            );

            return;
        }

        setSelectedFile(file);

        const reader =
            new FileReader();
        reader.onload = (event) => {

            try {

                const data =
                    event.target?.result;


                if (!data) return;


                const workbook =
                    XLSX.read(data, {
                        type: "array",
                    });


                const firstSheet =
                    workbook.Sheets[
                    workbook.SheetNames[0]
                    ];


                const rows =
                    XLSX.utils.sheet_to_json(
                        firstSheet,
                        {
                            header: 1,
                            defval: "",
                        }
                    ) as unknown[][];


                if (!rows.length) {

                    toast.error(
                        "The uploaded file is empty."
                    );

                    return;
                }


                const dataRows =
                    rows.slice(1);


                const parsedQuestions:
                    Question[] =
                    dataRows
                        .filter(
                            (row) =>
                                String(
                                    row[0] ?? ""
                                ).trim()
                        )
                        .map((row) => ({

                            question:
                                String(
                                    row[0] ?? ""
                                ),

                            optionA:
                                String(
                                    row[1] ?? ""
                                ),

                            optionB:
                                String(
                                    row[2] ?? ""
                                ),

                            optionC:
                                String(
                                    row[3] ?? ""
                                ),

                            optionD:
                                String(
                                    row[4] ?? ""
                                ),

                            correct:
                                String(
                                    row[5] ?? ""
                                )
                                    .trim()
                                    .toUpperCase(),

                            category:
                                String(
                                    row[6] ?? ""
                                )
                                    .trim()
                                    .toUpperCase(),

                            difficulty:
                                String(
                                    row[7] ?? ""
                                )
                                    .trim(),

                        }));


                setQuestions(
                    parsedQuestions
                );

            } catch (error) {

                console.error(
                    "Excel parsing error:",
                    error
                );

                toast.error(
                    "Unable to read this file. Please check the format."
                );

            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleFileChange = ( event: React.ChangeEvent<HTMLInputElement>) => {
        const file =event.target.files?.[0];
        if (!file) return;
        processFile(file);
    };
    const handleBrowse = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (
        event: React.DragEvent<HTMLDivElement>
    ) => {

        event.preventDefault();

        setIsDragging(true);

    };

    const handleDragLeave = () => {

        setIsDragging(false);

    };


    const handleDrop = (
        event: React.DragEvent<HTMLDivElement>
    ) => {

        event.preventDefault();

        setIsDragging(false);


        const file =
            event.dataTransfer.files?.[0];

        if (!file) return;

        processFile(file);
    };

    const handleRemoveFile = () => {

        setSelectedFile(null);

        setQuestions([]);


        if (fileInputRef.current) {

            fileInputRef.current.value = "";

        }
    };

    const handleImport = async () => {
        if (!selectedExamId) {
            toast.error("Please select an exam");
            return;
        }

        if (!selectedFile) {
            toast.error("Please select an Excel file");
            return;
        }

        try {
            setIsImporting(true);

            const result = await importQuestion(
                selectedFile,
                selectedExamId
            );

            toast.success(
                `${result.imported} questions imported successfully`
            );

            // optional: clear after successful import
            setSelectedFile(null);
            setQuestions([]);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        } catch (error: any) {
            console.error("Question import error:", error);

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Question import failed"
            );
        } finally {
            setIsImporting(false);
        }
    };

    const formatFileSize = (
        bytes: number
    ) => {

        if (
            bytes <
            1024 * 1024
        ) {

            return `${(
                bytes / 1024
            ).toFixed(1)} KB`;

        }


        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(1)} MB`;
    };

    const handleDownload = () => {

        const link = document.createElement("a");

        link.href = "/questiontemplate.xlsx";

        link.download = "Vayuratha-Question-Template.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Template downloaded successfully");
    };

    return (

        <div className="min-h-screen text-white">
            <div className="flex flex-col gap-1">

                <h1 className="text-[25px] font-bold tracking-tight">
                    Question Bank
                </h1>

                <p className="text-sm text-[#6d9689]">
                    Bulk import via Excel or CSV
                </p>

            </div>
            <div className="mt-8 flex items-end gap-5">

                <div className="flex items-end gap-5">
                    <div className="flex flex-col gap-2">

                        <label
                            className="text-[11px] font-bold tracking-[1.5px] text-[#6d9689]"
                        >
                            CATEGORY
                        </label>


                        <button
                            type="button"
                            className="flex h-13 w-62.5  items-center justify-between rounded-[18px] border border-[#356657] bg-white/[0.04] 
                            px-5 text-left text-[16px] text-white"
                        >
                            Regulatory
                            <span className="text-[#6d9689]">
                                ▾
                            </span>

                        </button>

                    </div>
                    <div className="flex flex-col gap-2">

                        <label
                            className="text-[11px] font-bold tracking-[1.5px] text-[#6d9689]"
                        >
                            EXAM
                        </label>
                        <select
                            value={selectedExamId ?? ""}
                            disabled={isLoadingExams || isImporting}
                            onChange={(e) =>
                                setSelectedExamId(
                                    e.target.value
                                        ? Number(
                                            e.target.value
                                        )
                                        : null
                                )
                            }
                            className="h-13 w-62.5 rounded-[18px] border border-[#356657] bg-[#0e4938] px-5 text-[16px] text-white outline-none
                                disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            <option value="">
                                {isLoadingExams
                                    ? "Loading exams..."
                                    : "Select Exam"}
                            </option>


                            {exams.map(
                                (exam) => (

                                    <option
                                        key={exam.id}
                                        value={exam.id}
                                    >
                                        {exam.title}
                                    </option>

                                )
                            )}

                        </select>

                        {selectedExam && (
                            <p className="text-xs text-[#6d9689]">
                                Selected:
                                {" "}
                                <span className="font-semibold text-[#f9a825]">
                                    {selectedExam.title}
                                </span>

                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-7 xl:grid-cols-[minmax(0,1fr)_493px]">
                <div className="flex flex-col gap-6">
                    {!selectedFile && (

                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`flex min-h-83.75 flex-col items-center justify-center rounded-[20px] border-2 border-dashed px-6 py-10 transition
                                ${isDragging
                                    ? "border-[#f9a825] bg-[#f9a825]/10"
                                    : "border-[#b77b13] bg-white/[0.015]"
                                }
                            `}
                        >

                            <div
                                className="flex h-17.5 w-17.5 items-center justify-center rounded-[20px] bg-[#f9a825]/15 text-[#f9a825]"
                            >
                                <Upload
                                    size={32}
                                    strokeWidth={1.8}
                                />
                            </div>
                            <div className="mt-5 text-center">
                                <h2 className="text-[18px] font-semibold">
                                    Drop your Excel or CSV file here
                                </h2>

                                <p className="mt-1 text-sm text-[#6b9386]">
                                    Supports .xlsx, .xls, .csv — max 10 MB
                                </p>
                            </div>


                            <Button
                                type="button"
                                onClick={handleBrowse}
                                className="mt-6 h-11.5 rounded-full bg-[#214f40] px-7 text-sm font-semibold hover:bg-[#285e4c]"
                            >
                                <FileSpreadsheet
                                    size={17}
                                />
                                Browse File
                            </Button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                    )}

                    {selectedFile && (
                        <>
                            <div
                                className="flex items-center justify-between rounded-[20px] border border-[#008f70] bg-[#087052]/20 px-6 py-4"
                            >
                                <div className="flex items-center gap-4">
                                    <Check
                                        size={23}
                                        className="text-[#00d6a4]"
                                    />
                                    <div>
                                        <h2 className="font-bold text-[#00d6a4]">
                                            {selectedFile.name}
                                        </h2>
                                        <p className="text-xs text-[#00a985]">
                                            {questions.length}
                                            {" "}
                                            questions detected
                                            {" · "}
                                            {formatFileSize(
                                                selectedFile.size
                                            )}
                                        </p>
                                    </div>
                                </div>


                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    disabled={isImporting}
                                    className="text-[#668e83] transition hover:text-white disabled:opacity-40"
                                >
                                    <X size={20} />
                                </button>

                            </div>
                            <div
                                className="overflow-hidden rounded-[20px] border border-[#205746] bg-[#0e4938]"
                            >
                                <div
                                    className="flex items-center justify-between border-b border-[#205746] px-6 py-4"
                                >
                                    <h2 className="font-bold">
                                        Preview (
                                        {
                                            Math.min(
                                                4,
                                                questions.length
                                            )
                                        }
                                        {" "}
                                        of{" "}
                                        {questions.length}
                                        )
                                    </h2>
                                    <span
                                        className="rounded-full border border-[#90701c] bg-[#f9a825]/10 px-4 py-1 text-[11px] font-bold text-[#f9a825]"
                                    >
                                        {questions.length}
                                        {" "}
                                        QUESTIONS
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b border-[#205746]">
                                                <th className="w-12 px-5 py-3 text-left text-[11px] font-bold tracking-wide text-[#60887b]">
                                                    #
                                                </th>
                                                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wide text-[#60887b]">
                                                    QUESTION
                                                </th>
                                                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wide text-[#60887b]">
                                                    OPTIONS (A/B/C/D)
                                                </th>
                                                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wide text-[#60887b]">
                                                    ANS
                                                </th>
                                                <th className="px-5 py-3 text-left text-[11px] font-bold tracking-wide text-[#60887b]">
                                                    CATEGORY
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {questions
                                                .slice(0, 4)
                                                .map(
                                                    (
                                                        question,
                                                        index
                                                    ) => (

                                                        <tr
                                                            key={`${question.question}-${index}`}
                                                            className="
                                                                border-b
                                                                border-[#205746]
                                                                last:border-b-0
                                                            "
                                                        >

                                                            <td className="px-5 py-4 text-xs text-[#628a7d]">
                                                                {index + 1}
                                                            </td>


                                                            <td className="min-w-[270px] px-4 py-4 text-sm text-white">
                                                                {
                                                                    question.question
                                                                }
                                                            </td>


                                                            <td className="min-w-[300px] px-4 py-4 text-sm text-[#82a99e]">

                                                                {
                                                                    question.optionA
                                                                }

                                                                {" / "}

                                                                {
                                                                    question.optionB
                                                                }

                                                                {" / "}

                                                                {
                                                                    question.optionC
                                                                }

                                                                {" / "}

                                                                {
                                                                    question.optionD
                                                                }

                                                            </td>


                                                            <td className="px-4 py-4">

                                                                <span
                                                                    className="
                                                                        flex
                                                                        h-8
                                                                        w-8
                                                                        items-center
                                                                        justify-center
                                                                        rounded-full
                                                                        bg-[#536c29]
                                                                        text-xs
                                                                        font-bold
                                                                        text-[#f9a825]
                                                                    "
                                                                >

                                                                    {
                                                                        question.correct
                                                                    }

                                                                </span>

                                                            </td>


                                                            <td className="px-5 py-4">

                                                                <span
                                                                    className="
                                                                        inline-flex
                                                                        rounded-full
                                                                        border
                                                                        border-[#88701e]
                                                                        bg-[#f9a825]/10
                                                                        px-3
                                                                        py-1
                                                                        text-[10px]
                                                                        font-bold
                                                                        text-[#f9a825]
                                                                    "
                                                                >

                                                                    {
                                                                        question.category
                                                                    }

                                                                </span>

                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>
                            <Button
                                type="button"
                                onClick={handleImport}
                                disabled={!questions.length || !selectedExamId || isImporting}
                                className="h-16 w-full rounded-[20px] bg-[#f9a825] text-[18px] font-semibold text-[#063b2d] 
                                shadow-[0_12px_30px_rgba(249,168,37,0.18)] hover:bg-[#ffb52f] disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {isImporting ? (
                                    <>
                                        <LoaderCircle size={20} className="animate-spin" />
                                        Importing...
                                    </>

                                ) : (
                                    <>
                                        <Upload
                                            size={20}
                                        />
                                        Import{" "}
                                        {questions.length}
                                        {" "}
                                        Questions

                                    </>
                                )}
                            </Button>
                            {!selectedExamId &&
                                questions.length > 0 && (
                                    <p className="text-center text-sm font-medium text-[#f9a825]">
                                        Please select an exam before importing questions.
                                    </p>
                                )}
                        </>
                    )}
                </div>
                <div className="flex flex-col gap-5">
                    <div
                        className="rounded-[20px] border border-[#245746] bg-white/[0.025] px-6 py-6"
                    >
                        <h2 className="text-[16px] font-bold">
                            Required Columns
                        </h2>
                        <div className="mt-4 flex flex-col gap-3">
                            {requiredColumns.map(
                                (column) => (
                                    <div
                                        key={column.id}
                                        className="flex items-center gap-3"
                                    >
                                        <Check
                                            size={15}
                                            className="shrink-0 text-[#f9a825]"
                                        />
                                        <span className="text-sm text-[#7fa499]">
                                            {column.name}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    <div
                        className="rounded-[20px] border border-[#82621c] bg-[#f9a825]/[0.06] px-6 py-6"
                    >
                        <div className="flex items-center gap-3">
                            <Download
                                size={19}
                                className="text-[#f9a825]"
                            />
                            <h2 className="font-bold text-[#f9a825]">
                                Template
                            </h2>
                        </div>
                        <p className="mt-3 text-sm text-[#779b90]">
                            Download Excel template for quick question entry
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleDownload}
                            className="mt-4 h-11 w-full rounded-full border-2 border-[#87681f] bg-transparent font-semibold text-[#f9a825] 
                            hover:bg-[#f9a825]/10 hover:text-[#f9a825]"
                        >
                            <Download
                                size={17}
                            />
                            Download Template
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    );
}