export type ActionResult<T> =
    | { success: true; data: T }
    | { success: false; message: string };

export type ExamStatus = "DRAFT" | "LIVE" | "CLOSED";

export interface UpdateExamPayload {
    title?: string;
    category?: string;
    questionCount?: number;
    durationMinutes?: number;
    // IST, format: yyyy-MM-ddTHH:mm:ss
    startTime?: string;
    endTime?: string;
    status?: ExamStatus;
    isDefaultForNewUsers?: boolean;
}

export interface ExamAssignee {
    userId: string;
    fullName: string;
    email: string;
    mobile: string;
    completed: boolean;
    attemptId: number | null;
    assignedAt: string | null;
}

export interface UserExamAssignment {
    examId: number;
    title: string;
    category: string;
    status: ExamStatus;
    questionCount: number;
    durationMinutes: number;
    assigned: boolean;
    completed: boolean;
    attemptId: number | null;
    assignedAt: string | null;
}

export interface SyncResult {
    added: number;
    removed: number;
    skippedAlreadyStarted: number;
    totalAssigned: number;
}