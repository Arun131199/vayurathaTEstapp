export interface BackendQuestion {
    id: number;
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    category: string;
    marks: number;
    active: boolean;
}

export interface QuestionResponse {
    attemptId: number;
    index: number;
    totalQuestions: number;
    question: BackendQuestion;
    selectedOption: string | null;
    examEndTime: string | null;
}