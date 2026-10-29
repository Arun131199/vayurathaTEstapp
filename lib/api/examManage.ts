import { cookies } from "next/headers";
import api from "../axios";
import {
    ExamAssignee,
    SyncResult,
    UpdateExamPayload,
    UserExamAssignment,
} from "@/types/examManage";
import { ExamRow, UserRow } from "@/types/tableType";

async function authHeaders() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        throw new Error("Authentication token not found");
    }

    return { Authorization: `Bearer ${accessToken}` };
}

export async function getStudents(): Promise<UserRow[]> {
    const response = await api.get<UserRow[]>("/admin/users", {
        headers: await authHeaders(),
    });

    return (response.data ?? []).filter((user) => user.role === "USER");
}

export async function updateExamApi(
    examId: number,
    payload: UpdateExamPayload
): Promise<ExamRow> {
    const response = await api.put<ExamRow>(
        `/admin/exams/${examId}`,
        payload,
        { headers: await authHeaders() }
    );

    return response.data;
}

export async function getExamAssigneesApi(
    examId: number
): Promise<ExamAssignee[]> {
    const response = await api.get<ExamAssignee[]>(
        `/admin/exams/${examId}/assignments`,
        { headers: await authHeaders() }
    );

    return response.data;
}

export async function syncExamUsersApi(
    examId: number,
    userIds: string[]
): Promise<SyncResult> {
    const response = await api.put<SyncResult>(
        `/admin/exams/${examId}/assignments`,
        { userIds },
        { headers: await authHeaders() }
    );

    return response.data;
}

export async function getUserExamAssignmentsApi(
    userId: string
): Promise<UserExamAssignment[]> {
    const response = await api.get<UserExamAssignment[]>(
        `/admin/users/${userId}/exam-assignments`,
        { headers: await authHeaders() }
    );

    return response.data;
}

export async function syncUserExamsApi(
    userId: string,
    examIds: number[]
): Promise<SyncResult> {
    const response = await api.put<SyncResult>(
        `/admin/users/${userId}/exam-assignments`,
        { examIds },
        { headers: await authHeaders() }
    );

    return response.data;
}