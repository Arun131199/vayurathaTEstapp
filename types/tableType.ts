import { ReactNode } from "react";

export interface TableColumn<T> {
    key: keyof T | string;
    title: string;
    className?: string;
    render?: (row: T) => ReactNode;
}

export interface UserRow {
    id: number;
    userId: string;
    fullName: string;
    email: string;
    role: "ADMIN" | "USER";
    createdAt: string;
}

export interface ExamRow {
    id: number;
    title: string;
    category: string;
    questionCount: number;
    durationMinutes: number;
    startTime: string | null;
    endTime?: string | null;
    status?: string;
}

export interface AdminResultRow {
    id: number;
    studentName: string;
    studentId: string;
    examTitle: string;
    category: string;
    score: number;
    totalMarks: number;
    percentage: number;
    passed: boolean;
    status: "IN_PROGRESS" | "SUBMITTED" | "AUTO_SUBMITTED";
    violationCount: number;
    totalQuestions: number;
    answeredCount: number;
    correctCount: number;
    wrongCount: number;
    timeTakenMinutes: number;
    startedAt: string;
    submittedAt: string | null;
}