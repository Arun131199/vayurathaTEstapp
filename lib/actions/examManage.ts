"use server";

import { revalidatePath } from "next/cache";

import {
    getExamAssigneesApi,
    getUserExamAssignmentsApi,
    syncExamUsersApi,
    syncUserExamsApi,
    updateExamApi,
} from "@/lib/api/examManage";
import {
    ActionResult,
    ExamAssignee,
    SyncResult,
    UpdateExamPayload,
    UserExamAssignment,
} from "@/types/examManage";
import { ExamRow } from "@/types/tableType";

function toMessage(error: unknown): string {
    const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
    };

    return err?.response?.data?.message ?? err?.message ?? "Something went wrong";
}

export async function updateExamAction(
    examId: number,
    payload: UpdateExamPayload
): Promise<ActionResult<ExamRow>> {
    try {
        const data = await updateExamApi(examId, payload);
        revalidatePath("/admin-dashboard/exams");
        return { success: true, data };
    } catch (error) {
        console.error("updateExamAction failed:", toMessage(error));
        return { success: false, message: toMessage(error) };
    }
}

export async function getExamAssigneesAction(
    examId: number
): Promise<ActionResult<ExamAssignee[]>> {
    try {
        const data = await getExamAssigneesApi(examId);
        return { success: true, data };
    } catch (error) {
        console.error("getExamAssigneesAction failed:", toMessage(error));
        return { success: false, message: toMessage(error) };
    }
}

export async function syncExamUsersAction(
    examId: number,
    userIds: string[]
): Promise<ActionResult<SyncResult>> {
    try {
        const data = await syncExamUsersApi(examId, userIds);
        revalidatePath("/admin-dashboard/exams");
        revalidatePath("/admin-dashboard/assignments");
        return { success: true, data };
    } catch (error) {
        console.error("syncExamUsersAction failed:", toMessage(error));
        return { success: false, message: toMessage(error) };
    }
}

export async function getUserExamAssignmentsAction(
    userId: string
): Promise<ActionResult<UserExamAssignment[]>> {
    try {
        const data = await getUserExamAssignmentsApi(userId);
        return { success: true, data };
    } catch (error) {
        console.error("getUserExamAssignmentsAction failed:", toMessage(error));
        return { success: false, message: toMessage(error) };
    }
}

export async function syncUserExamsAction(
    userId: string,
    examIds: number[]
): Promise<ActionResult<SyncResult>> {
    try {
        const data = await syncUserExamsApi(userId, examIds);
        revalidatePath("/admin-dashboard/exams");
        revalidatePath("/admin-dashboard/assignments");
        return { success: true, data };
    } catch (error) {
        console.error("syncUserExamsAction failed:", toMessage(error));
        return { success: false, message: toMessage(error) };
    }
}