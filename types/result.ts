export interface ExamResult {
    attemptId: number;
    examTitle: string;
    category: string;
    score: number;
    totalMarks: number;
    percentage: number;
    passed: boolean;
    status: "IN_PROGRESS" | "SUBMITTED" | "AUTO_SUBMITTED";
    violationCount: number;
    startedAt: string;
    submittedAt: string | null;
}

export interface ExamQuestionReview {
    questionId: number;
    questionNumber: number;
    questionText: string;

    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;

    selectedOption: "A" | "B" | "C" | "D" | null;
    correctAnswer: "A" | "B" | "C" | "D";

    isCorrect: boolean;
    marks: number;
}

export interface ExamResultReview extends ExamResult {
    studentId: string;
    studentName: string;

    answeredCount: number;
    correctCount: number;
    wrongCount: number;
    totalQuestions: number;
    timeTakenMinutes: number;

    questions: ExamQuestionReview[];
}