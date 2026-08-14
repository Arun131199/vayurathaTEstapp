export interface ExamAttempt {
    id: number;

    student: string;
    exam: string;

    score: number;
    date: string;

    status: "PASS" | "FAIL";

    answered: number;
    totalQuestions: number;

    correct: number;

    timeTaken: number;

    violations: number;
}