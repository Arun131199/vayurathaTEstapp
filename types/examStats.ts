export interface CategoryStats {
    category: string;
    totalAttempts: number;
    passPercentage: number;
}

export interface ExamStats {
    totalStudents: number;
    activeExams: number;
    overallPassPercentage: number;
    categoryStats: CategoryStats[];
}